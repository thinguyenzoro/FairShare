import os
import re
import secrets

from flask import Flask, Response, jsonify, render_template, request, session
from werkzeug.security import check_password_hash, generate_password_hash

import db
import pdf_export
import split_logic

app = Flask(__name__)

SLUG_RE = re.compile(r"^[a-zA-Z0-9\-_]{1,64}$")
PIN_RE = re.compile(r"^\d{4,6}$")

SECRET_KEY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "secret_key.txt")


def _load_secret_key():
    os.makedirs(os.path.dirname(SECRET_KEY_PATH), exist_ok=True)
    if not os.path.exists(SECRET_KEY_PATH):
        with open(SECRET_KEY_PATH, "w") as f:
            f.write(secrets.token_hex(32))
    with open(SECRET_KEY_PATH) as f:
        return f.read().strip()


app.secret_key = _load_secret_key()


@app.before_request
def _ensure_db():
    db.init_db()


@app.after_request
def _no_index(response):
    response.headers["X-Robots-Tag"] = "noindex, nofollow"
    return response


def _valid_slug(slug):
    return bool(SLUG_RE.match(slug))


def _has_access(room):
    if not room["pin_hash"]:
        return True
    return room["id"] in session.get("unlocked_rooms", [])


def _grant_access(room_id):
    unlocked = session.get("unlocked_rooms", [])
    if room_id not in unlocked:
        unlocked.append(room_id)
    session["unlocked_rooms"] = unlocked


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/robots.txt")
def robots():
    return Response("User-agent: *\nDisallow: /\n", mimetype="text/plain")


@app.post("/api/feedback")
def api_feedback():
    data = request.get_json(force=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "MESSAGE_REQUIRED"}), 400

    room_slug = data.get("room_slug")
    if room_slug and not _valid_slug(room_slug):
        room_slug = None

    db.add_feedback(room_slug, message[:2000])
    return jsonify({"ok": True})


@app.get("/<room_slug>")
def room_page(room_slug):
    if not _valid_slug(room_slug):
        return "Invalid room name (letters, numbers, - and _ only). / TÃªn phÃ²ng khÃ´ng há»£p lá» (chá» chá»¯, sá», - vÃ  _).", 400
    room = db.get_or_create_room(room_slug)
    if not _has_access(room):
        return render_template("room_locked.html", room_slug=room_slug)
    return render_template("room.html", room_slug=room_slug)


def _room_or_404(room_slug):
    if not _valid_slug(room_slug):
        return None
    return db.get_or_create_room(room_slug)


def _parse_expense_payload(data):
    description = (data.get("description") or "").strip()
    try:
        amount = float(data.get("amount"))
    except (TypeError, ValueError):
        return None, ("AMOUNT_INVALID", 400)
    if amount <= 0:
        return None, ("AMOUNT_MUST_BE_POSITIVE", 400)

    paid_by = data.get("paid_by")
    participants = data.get("participants") or []
    if not paid_by or not participants:
        return None, ("NEED_PAYER_AND_PARTICIPANTS", 400)

    clean_participants = []
    for p in participants:
        try:
            shares = float(p.get("shares"))
        except (TypeError, ValueError):
            return None, ("SHARES_INVALID", 400)
        if shares <= 0:
            return None, ("SHARES_MUST_BE_POSITIVE", 400)
        clean_participants.append({"person_id": p.get("person_id"), "shares": shares})

    if data.get("split_mode") == "amount":
        total_allocated = sum(p["shares"] for p in clean_participants)
        if abs(total_allocated - amount) > 0.005:
            return None, ("AMOUNTS_MUST_SUM_TO_TOTAL", 400)

    return {
        "description": description,
        "amount": amount,
        "paid_by": paid_by,
        "participants": clean_participants,
    }, None


def _build_state(room):
    room_id = room["id"]
    people = db.list_people(room_id)
    expenses = db.list_expenses(room_id)
    balances = split_logic.compute_balances(people, expenses)
    settlements = split_logic.compute_settlements(balances)
    breakdown = split_logic.compute_breakdown(people, expenses)

    name_by_id = {p["id"]: p["name"] for p in people}
    balances_out = [
        {"person_id": pid, "name": name_by_id.get(pid, "?"), "balance": bal}
        for pid, bal in balances.items()
    ]
    settlements_out = [
        {
            "from": s["from"],
            "from_name": name_by_id.get(s["from"], "?"),
            "to": s["to"],
            "to_name": name_by_id.get(s["to"], "?"),
            "amount": s["amount"],
        }
        for s in settlements
    ]
    breakdown_out = [
        {
            "person_id": pid,
            "name": name_by_id.get(pid, "?"),
            "items": items,
            "total": sum(i["owed"] for i in items),
        }
        for pid, items in breakdown.items()
    ]

    return {
        "people": people,
        "expenses": expenses,
        "balances": balances_out,
        "settlements": settlements_out,
        "breakdown": breakdown_out,
        "locked": bool(room["pin_hash"]),
    }


@app.get("/<room_slug>/api/state")
def api_state(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403
    return jsonify(_build_state(room))


@app.get("/<room_slug>/api/export.pdf")
def api_export_pdf(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403

    lang = request.args.get("lang") if request.args.get("lang") in ("en", "vi") else "en"
    currency = request.args.get("currency")
    if currency not in pdf_export.CURRENCIES:
        currency = "VND"
    pdf_bytes = pdf_export.build_summary_pdf(room_slug, _build_state(room), lang=lang, currency=currency)
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{room_slug}-summary.pdf"'},
    )


@app.post("/<room_slug>/api/unlock")
def api_unlock(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not room["pin_hash"]:
        _grant_access(room["id"])
        return jsonify({"ok": True})

    data = request.get_json(force=True) or {}
    pin = (data.get("pin") or "").strip()
    if not check_password_hash(room["pin_hash"], pin):
        return jsonify({"error": "WRONG_PIN"}), 403

    _grant_access(room["id"])
    return jsonify({"ok": True})


@app.post("/<room_slug>/api/lock")
def api_lock(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403

    data = request.get_json(force=True) or {}
    pin = (data.get("pin") or "").strip()
    if not PIN_RE.match(pin):
        return jsonify({"error": "PIN_INVALID"}), 400

    db.set_room_pin(room["id"], generate_password_hash(pin))
    _grant_access(room["id"])
    return jsonify(_build_state(db.get_or_create_room(room_slug)))


@app.post("/<room_slug>/api/remove-lock")
def api_remove_lock(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not room["pin_hash"]:
        return jsonify({"error": "NOT_LOCKED"}), 400

    data = request.get_json(force=True) or {}
    pin = (data.get("pin") or "").strip()
    if not check_password_hash(room["pin_hash"], pin):
        return jsonify({"error": "WRONG_PIN"}), 403

    db.clear_room_pin(room["id"])
    return jsonify(_build_state(db.get_or_create_room(room_slug)))


@app.post("/<room_slug>/api/people")
def api_add_person(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403
    data = request.get_json(force=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"error": "NAME_REQUIRED"}), 400
    db.add_person(room["id"], name)
    return jsonify(_build_state(room))


@app.delete("/<room_slug>/api/people/<int:person_id>")
def api_delete_person(room_slug, person_id):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403
    if db.person_has_expenses(room["id"], person_id):
        return jsonify({"error": "PERSON_HAS_EXPENSES"}), 400
    db.delete_person(room["id"], person_id)
    return jsonify(_build_state(room))


@app.post("/<room_slug>/api/expenses")
def api_add_expense(room_slug):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403

    data = request.get_json(force=True) or {}
    payload, error = _parse_expense_payload(data)
    if error:
        code, status = error
        return jsonify({"error": code}), status

    db.add_expense(room["id"], **payload)
    return jsonify(_build_state(room))


@app.put("/<room_slug>/api/expenses/<int:expense_id>")
def api_update_expense(room_slug, expense_id):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403

    data = request.get_json(force=True) or {}
    payload, error = _parse_expense_payload(data)
    if error:
        code, status = error
        return jsonify({"error": code}), status

    db.update_expense(room["id"], expense_id, **payload)
    return jsonify(_build_state(room))


@app.delete("/<room_slug>/api/expenses/<int:expense_id>")
def api_delete_expense(room_slug, expense_id):
    room = _room_or_404(room_slug)
    if room is None:
        return jsonify({"error": "invalid room"}), 404
    if not _has_access(room):
        return jsonify({"error": "ROOM_LOCKED"}), 403
    db.delete_expense(room["id"], expense_id)
    return jsonify(_build_state(room))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

