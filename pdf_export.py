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
        "appTitle": "FairShare",
        "sectionExpenseList": "Danh sách chi tiêu",
        "sectionBreakdown": "Chi tiết theo người (vì sao phải trả số tiền này)",
        "sectionBalances": "Số dư",
        "sectionSettlements": "Cấn trừ nợ",
        "paidBy": "Trả bởi",
        "balanceGets": "được nhận",
        "balanceOwes": "phải trả",
        "balanceSettled": "đã cân bằng",
        "settlementPays": "trả",
        "noSettlements": "Không cần chuyển tiền - mọi người đã cân bằng.",
        "noExpenses": "Chưa có chi tiêu nào.",
        "noDescription": "(không mô tả)",
        "noParticipation": "chưa tham gia chi tiêu nào",
        "shareUnit": "phần",
    },
}

CURRENCIES = {
    "VND": {"symbol": "đ", "decimals": 0, "position": "suffix", "euro_style": True},
    "USD": {"symbol": "$", "decimals": 2, "position": "prefix", "euro_style": False},
    "EUR": {"symbol": "€", "decimals": 2, "position": "suffix", "euro_style": True},
    "JPY": {"symbol": "¥", "decimals": 0, "position": "prefix", "euro_style": False},
    "KRW": {"symbol": "₩", "decimals": 0, "position": "prefix", "euro_style": False},
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
    pdf.add_font("Roboto", "", FONT_PATH)

    def line(height, text):
        pdf.multi_cell(0, height, text, **_LINE_KWARGS)

    def section_title(text):
        pdf.set_font("Roboto", "", 13)
        line(8, text)
        pdf.set_font("Roboto", "", 11)

    pdf.set_font("Roboto", "", 16)
    line(10, f"{room_slug} - {s['appTitle']}")
    pdf.ln(2)

    section_title(s["sectionExpenseList"])
    if not state["expenses"]:
        line(6, s["noExpenses"])
    else:
        for e in state["expenses"]:
            payer = name_by_id.get(e["paid_by"], "?")
            desc = e["description"] or s["noDescription"]
            paid_text = s["paidBy"]
            amount_text = fmt(e["amount"])
            line(6, f"- {desc}: {amount_text} ({paid_text} {payer})")
    pdf.ln(3)

    section_title(s["sectionBreakdown"])
    for b in state["breakdown"]:
        if not b["items"]:
            b_name = b["name"]
            no_part = s["noParticipation"]
            line(6, f"- {b_name}: {no_part}")
            continue
        parts = " + ".join(
            f"{i['description'] or s['noDescription']} {fmt(i['owed'])} ({_fmt_shares(i['shares'])} {s['shareUnit']})"
            for i in b["items"]
        )
        b_name = b["name"]
        total_text = fmt(b["total"])
        line(6, f"- {b_name}: {parts} = {total_text}")
    pdf.ln(3)

    section_title(s["sectionBalances"])
    for b in state["balances"]:
        if b["balance"] > 0:
            text = f"{s['balanceGets']} {fmt(b['balance'])}"
        elif b["balance"] < 0:
            text = f"{s['balanceOwes']} {fmt(-b['balance'])}"
        else:
            text = s["balanceSettled"]
        b_name = b["name"]
        line(6, f"- {b_name}: {text}")
    pdf.ln(3)

    section_title(s["sectionSettlements"])
    if not state["settlements"]:
        line(6, s["noSettlements"])
    else:
        for st in state["settlements"]:
            from_name = st["from_name"]
            to_name = st["to_name"]
            pays_text = s["settlementPays"]
            amount_text = fmt(st["amount"])
            line(6, f"- {from_name} {pays_text} {to_name}: {amount_text}")

    return bytes(pdf.output())
