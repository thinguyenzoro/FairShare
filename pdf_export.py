import os

from fpdf import FPDF

_LINE_KWARGS = {"new_x": "LMARGIN", "new_y": "NEXT"}

FONT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "fonts", "roboto.ttf")

STRINGS = {
    "en": {
        "appTitle": "FairShare",
        "sectionExpenseList": "Expense list",
        "sectionBreakdown": "Breakdown per person (why you owe this)",
        "sectionBalances": "Balances",
        "sectionSettlements": "Settlement",
        "paidBy": "Paid by",
        "balanceGets": "gets back",
        "balanceOwes": "owes",
        "balanceSettled": "settled up",
        "settlementPays": "pays",
        "noSettlements": "No transfers needed - everyone is settled up.",
        "noExpenses": "No expenses yet.",
        "noDescription": "(no description)",
        "noParticipation": "hasn't joined any expense yet",
        "shareUnit": "share(s)",
    },
    "vi": {
        "appTitle": "Chia Tiá»n",
        "sectionExpenseList": "Danh sách chi tiêu",
        "sectionBreakdown": "Chi tiáº¿t theo ngÆ°á»i (vÃ¬ sao phải trả sá» tiá»n nÃ y)",
        "sectionBalances": "Sá» dÆ°",
        "sectionSettlements": "Cấn trừ nợ",
        "paidBy": "Tráº£ bá»i",
        "balanceGets": "ÄÆ°á»£c nháº­n",
        "balanceOwes": "phải trả",
        "balanceSettled": "ÄÃ£ cÃ¢n báº±ng",
        "settlementPays": "trả",
        "noSettlements": "KhÃ´ng cáº§n chuyá»n tiá»n - má»i ngÆ°á»i ÄÃ£ cÃ¢n báº±ng.",
        "noExpenses": "Chưa có chi tiêu nào.",
        "noDescription": "(không mô tả)",
        "noParticipation": "chưa tham gia chi tiêu nào",
        "shareUnit": "phần",
    },
}

CURRENCIES = {
    "VND": {"symbol": "Ä", "decimals": 0, "position": "suffix", "euro_style": True},
    "USD": {"symbol": "$", "decimals": 2, "position": "prefix", "euro_style": False},
    "EUR": {"symbol": "â¬", "decimals": 2, "position": "suffix", "euro_style": True},
    "JPY": {"symbol": "¥", "decimals": 0, "position": "prefix", "euro_style": False},
    "KRW": {"symbol": "â©", "decimals": 0, "position": "prefix", "euro_style": False},
    "GBP": {"symbol": "£", "decimals": 2, "position": "prefix", "euro_style": False},
}


def _fmt_shares(n):
    return str(int(n)) if n == int(n) else str(n)


def _fmt(amount, currency="VND"):
    cfg = CURRENCIES.get(currency, CURRENCIES["VND"])
    if cfg["decimals"] > 0:
        num = f"{amount:,.{cfg['decimals']}f}"
    else:
        num = f"{round(amount):,}"
    if cfg["euro_style"]:
        num = num.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"{cfg['symbol']}{num}" if cfg["position"] == "prefix" else f"{num} {cfg['symbol']}"


def build_summary_pdf(room_slug, state, lang="en", currency="VND"):
    s = STRINGS.get(lang, STRINGS["en"])
    fmt = lambda amount: _fmt(amount, currency)
    name_by_id = {p["id"]: p["name"] for p in state["people"]}

    pdf = FPDF()
    pdf.add_page()
    pdf.add_font("Segoe", "", FONT_PATH)

    def line(height, text):
        pdf.multi_cell(0, height, text, **_LINE_KWARGS)

    def section_title(text):
        pdf.set_font("Segoe", "", 13)
        line(8, text)
        pdf.set_font("Segoe", "", 11)

    pdf.set_font("Segoe", "", 16)
    line(10, f"{room_slug} - {s['appTitle']}")
    pdf.ln(2)

    section_title(s["sectionExpenseList"])
    if not state["expenses"]:
        line(6, s["noExpenses"])
    else:
        for e in state["expenses"]:
            payer = name_by_id.get(e["paid_by"], "?")
            desc = e["description"] or s["noDescription"]
            line(6, f"- {desc}: {fmt(e['amount'])} ({s['paidBy']} {payer})")
    pdf.ln(3)

    section_title(s["sectionBreakdown"])
    for b in state["breakdown"]:
        if not b["items"]:
            line(6, f"- {b['name']}: {s['noParticipation']}")
            continue
        parts = " + ".join(
            f"{i['description'] or s['noDescription']} {fmt(i['owed'])} ({_fmt_shares(i['shares'])} {s['shareUnit']})"
            for i in b["items"]
        )
        line(6, f"- {b['name']}: {parts} = {fmt(b['total'])}")
    pdf.ln(3)

    section_title(s["sectionBalances"])
    for b in state["balances"]:
        if b["balance"] > 0:
            text = f"{s['balanceGets']} {fmt(b['balance'])}"
        elif b["balance"] < 0:
            text = f"{s['balanceOwes']} {fmt(-b['balance'])}"
        else:
            text = s["balanceSettled"]
        line(6, f"- {b['name']}: {text}")
    pdf.ln(3)

    section_title(s["sectionSettlements"])
    if not state["settlements"]:
        line(6, s["noSettlements"])
    else:
        for st in state["settlements"]:
            line(6, f"- {st['from_name']} {s['settlementPays']} {st['to_name']}: {fmt(st['amount'])}")

    return bytes(pdf.output())

