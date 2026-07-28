import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "app.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    pin_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    description TEXT,
    amount REAL NOT NULL,
    paid_by INTEGER NOT NULL REFERENCES people(id),
    image_url TEXT,
    category TEXT DEFAULT 'other',
    is_settlement BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS expense_shares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_id INTEGER NOT NULL REFERENCES expenses(id),
    person_id INTEGER NOT NULL REFERENCES people(id),
    shares REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_slug TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""


def get_conn():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_conn()
    conn.executescript(SCHEMA)
    conn.commit()
    try:
        conn.execute("ALTER TABLE expenses ADD COLUMN category TEXT DEFAULT 'other'")
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Column already exists
    
    try:
        conn.execute("ALTER TABLE rooms ADD COLUMN pin_hash TEXT")
    except sqlite3.OperationalError:
        pass
    try:
        conn.execute("ALTER TABLE expenses ADD COLUMN is_settlement BOOLEAN DEFAULT 0")
    except sqlite3.OperationalError:
        pass
    try:
        conn.execute("ALTER TABLE expenses ADD COLUMN image_url TEXT")
    except sqlite3.OperationalError:
        pass
    conn.close()


def get_or_create_room(slug):
    conn = get_conn()
    row = conn.execute("SELECT id, slug, pin_hash FROM rooms WHERE slug = ?", (slug,)).fetchone()
    if row is None:
        conn.execute("INSERT INTO rooms (slug) VALUES (?)", (slug,))
        conn.commit()
        row = conn.execute("SELECT id, slug, pin_hash FROM rooms WHERE slug = ?", (slug,)).fetchone()
    conn.close()
    return dict(row)


def set_room_pin(room_id, pin_hash):
    conn = get_conn()
    conn.execute("UPDATE rooms SET pin_hash = ? WHERE id = ?", (pin_hash, room_id))
    conn.commit()
    conn.close()


def clear_room_pin(room_id):
    set_room_pin(room_id, None)


def list_people(room_id):
    conn = get_conn()
    rows = conn.execute(
        "SELECT id, name FROM people WHERE room_id = ? ORDER BY id", (room_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def add_person(room_id, name):
    conn = get_conn()
    cur = conn.execute("INSERT INTO people (room_id, name) VALUES (?, ?)", (room_id, name))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return new_id


def person_has_expenses(room_id, person_id):
    conn = get_conn()
    row = conn.execute(
        """SELECT 1 FROM expenses WHERE room_id = ? AND paid_by = ?
           UNION
           SELECT 1 FROM expense_shares es JOIN expenses e ON es.expense_id = e.id
           WHERE e.room_id = ? AND es.person_id = ?""",
        (room_id, person_id, room_id, person_id),
    ).fetchone()
    conn.close()
    return row is not None


def delete_person(room_id, person_id):
    conn = get_conn()
    conn.execute("DELETE FROM people WHERE room_id = ? AND id = ?", (room_id, person_id))
    conn.commit()
    conn.close()


def list_expenses(room_id):
    conn = get_conn()
    expenses = conn.execute(
        "SELECT id, description, amount, paid_by, image_url, category, is_settlement, created_at FROM expenses WHERE room_id = ? ORDER BY id",
        (room_id,),
    ).fetchall()
    result = []
    for e in expenses:
        shares = conn.execute(
            "SELECT person_id, shares FROM expense_shares WHERE expense_id = ?", (e["id"],)
        ).fetchall()
        item = dict(e)
        item["participants"] = [dict(s) for s in shares]
        result.append(item)
    conn.close()
    return result


def add_expense(room_id, description, amount, paid_by, participants, image_url=None, category='other', is_settlement=0):
    conn = get_conn()
    cur = conn.execute(
        "INSERT INTO expenses (room_id, description, amount, paid_by, image_url, category, is_settlement) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (room_id, description, amount, paid_by, image_url, category, is_settlement),
    )
    expense_id = cur.lastrowid
    for p in participants:
        conn.execute(
            "INSERT INTO expense_shares (expense_id, person_id, shares) VALUES (?, ?, ?)",
            (expense_id, p["person_id"], p["shares"]),
        )
    conn.commit()
    conn.close()
    return expense_id


def update_expense(room_id, expense_id, description, amount, paid_by, participants, image_url=None, category='other'):
    conn = get_conn()
    if image_url is not None:
        conn.execute(
            "UPDATE expenses SET description = ?, amount = ?, paid_by = ?, image_url = ?, category = ? WHERE id = ? AND room_id = ?",
            (description, amount, paid_by, image_url, category, expense_id, room_id),
        )
    else:
        conn.execute(
            "UPDATE expenses SET description = ?, amount = ?, paid_by = ?, category = ? WHERE id = ? AND room_id = ?",
            (description, amount, paid_by, category, expense_id, room_id),
        )
    conn.execute("DELETE FROM expense_shares WHERE expense_id = ?", (expense_id,))
    for p in participants:
        conn.execute(
            "INSERT INTO expense_shares (expense_id, person_id, shares) VALUES (?, ?, ?)",
            (expense_id, p["person_id"], p["shares"]),
        )
    conn.commit()
    conn.close()


def delete_expense(room_id, expense_id):
    conn = get_conn()
    conn.execute(
        "DELETE FROM expense_shares WHERE expense_id IN (SELECT id FROM expenses WHERE id = ? AND room_id = ?)",
        (expense_id, room_id),
    )
    conn.execute("DELETE FROM expenses WHERE id = ? AND room_id = ?", (expense_id, room_id))
    conn.commit()
    conn.close()


def add_feedback(room_slug, message):
    conn = get_conn()
    conn.execute("INSERT INTO feedback (room_slug, message) VALUES (?, ?)", (room_slug, message))
    conn.commit()
    conn.close()


def update_person(room_id, person_id, name):
    conn = get_conn()
    conn.execute("UPDATE people SET name = ? WHERE room_id = ? AND id = ?", (name, room_id, person_id))
    conn.commit()
    conn.close()
