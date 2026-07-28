import os

from fpdf import FPDF

_LINE_KWARGS = {"new_x": "LMARGIN", "new_y": "NEXT"}

FONT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "fonts", "roboto.ttf")

STRINGS = {
    "en": {
        "appTitle": "Splitbill",
        "sectionExpenseList": "Expense list",
        "sectionBreakdown": "Breakdown per person (why you owe this)",
        "sectionBalances": "Balances",
        "sectionSettlements": "Settlement",
        "sectionPaymentHistory": "Payment History",
        "paidBy": "Paid by",
        "balanceGets": "gets back",
        "balanceOwes": "owes",
        "balanceSettled": "settled up",
        "settlementPays": "pays",
        "paymentPaidTo": "paid",
        "noSettlements": "No transfers needed - everyone is settled up.",
        "noExpenses": "No expenses yet.",
        "noDescription": "(no description)",
        "noParticipation": "hasn't joined any expense yet",
        "shareUnit": "share(s)",
        "catGeneral": "[General] ",
        "catEntGames": "[Games] ",
        "catEntMovies": "[Movies] ",
        "catEntMusic": "[Music] ",
        "catEntSports": "[Sports] ",
        "catEntOther": "[Ent.] ",
        "catFoodDining": "[Dining] ",
        "catFoodGroceries": "[Groceries] ",
        "catFoodLiquor": "[Liquor] ",
        "catFoodOther": "[Food] ",
        "catHomeSupplies": "[Supplies] ",
        "catHomeMaintenance": "[Maintenance] ",
        "catHomeRent": "[Rent] ",
        "catHomeOther": "[Home] ",
        "catLifeChildcare": "[Childcare] ",
        "catLifeClothing": "[Clothing] ",
        "catLifeEducation": "[Education] ",
        "catLifeGifts": "[Gifts] ",
        "catLifeMedical": "[Medical] ",
        "catLifeOther": "[Life] ",
        "catTransBicycle": "[Bicycle] ",
        "catTransBus": "[Bus] ",
        "catTransCar": "[Car] ",
        "catTransGas": "[Gas] ",
        "catTransHotel": "[Hotel] ",
        "catTransParking": "[Parking] ",
        "catTransPlane": "[Plane] ",
        "catTransTaxi": "[Taxi] ",
        "catTransOther": "[Transport] ",
        "catUtilCleaning": "[Cleaning] ",
        "catUtilElectricity": "[Electricity] ",
        "catUtilHeat": "[Heat] ",
        "catUtilTrash": "[Trash] ",
        "catUtilTv": "[TV/Internet] ",
        "catUtilWater": "[Water] ",
        "catUtilOther": "[Utility] ",
    },
    "vi": {
        "appTitle": "Splitbill",
        "sectionExpenseList": "Danh sách chi tiêu",
        "sectionBreakdown": "Chi tiết theo người (vì sao phải trả số tiền này)",
        "sectionBalances": "Số dư",
        "sectionSettlements": "Cấn trừ nợ",
        "sectionPaymentHistory": "Khoản đã thanh toán",
        "paidBy": "Trả bởi",
        "balanceGets": "được nhận",
        "balanceOwes": "phải trả",
        "balanceSettled": "đã cân bằng",
        "settlementPays": "trả",
        "paymentPaidTo": "đã thanh toán cho",
        "noSettlements": "Không cần chuyển tiền - mọi người đã cân bằng.",
        "noExpenses": "Chưa có chi tiêu nào.",
        "noDescription": "(không mô tả)",
        "noParticipation": "chưa tham gia chi tiêu nào",
        "shareUnit": "phần",
        "catGeneral": "[Chung] ",
        "catEntGames": "[Trò chơi] ",
        "catEntMovies": "[Phim ảnh] ",
        "catEntMusic": "[Âm nhạc] ",
        "catEntSports": "[Thể thao] ",
        "catEntOther": "[Giải trí] ",
        "catFoodDining": "[Ăn ngoài] ",
        "catFoodGroceries": "[Đi chợ] ",
        "catFoodLiquor": "[Rượu bia] ",
        "catFoodOther": "[Ăn uống] ",
        "catHomeSupplies": "[Gia dụng] ",
        "catHomeMaintenance": "[Sửa chữa] ",
        "catHomeRent": "[Thuê nhà] ",
        "catHomeOther": "[Nhà cửa] ",
        "catLifeChildcare": "[Trẻ em] ",
        "catLifeClothing": "[Quần áo] ",
        "catLifeEducation": "[Giáo dục] ",
        "catLifeGifts": "[Quà tặng] ",
        "catLifeMedical": "[Y tế] ",
        "catLifeOther": "[Đời sống] ",
        "catTransBicycle": "[Xe đạp] ",
        "catTransBus": "[Xe buýt/Tàu] ",
        "catTransCar": "[Ô tô] ",
        "catTransGas": "[Đổ xăng] ",
        "catTransHotel": "[Khách sạn] ",
        "catTransParking": "[Gửi xe] ",
        "catTransPlane": "[Máy bay] ",
        "catTransTaxi": "[Taxi] ",
        "catTransOther": "[Di chuyển] ",
        "catUtilCleaning": "[Dọn dẹp] ",
        "catUtilElectricity": "[Tiền điện] ",
        "catUtilHeat": "[Tiền gas] ",
        "catUtilTrash": "[Rác thải] ",
        "catUtilTv": "[TV/Internet] ",
        "catUtilWater": "[Tiền nước] ",
        "catUtilOther": "[Tiện ích] ",
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
    if currency == "VND":
        spaced = f"{round(amount):,}".replace(",", " ")
        return f"{spaced} đ"
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

    # Theme colors
    PRIMARY_COLOR = (37, 99, 235)       # Blue-600
    TEXT_COLOR = (15, 23, 42)           # Slate-900
    MUTED_COLOR = (100, 116, 139)       # Slate-500
    BORDER_COLOR = (226, 232, 240)      # Slate-200
    BG_LIGHT = (248, 250, 252)          # Slate-50

    # Header Banner
    pdf.set_fill_color(*PRIMARY_COLOR)
    pdf.rect(0, 0, 210, 35, style='F')
    
    pdf.set_y(12)
    pdf.set_font("Roboto", "", 24)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, f"{room_slug}", ln=1, align="C")
    
    pdf.set_font("Roboto", "", 12)
    pdf.set_text_color(200, 215, 255)
    pdf.cell(0, 6, f"Generated by {s['appTitle']}", ln=1, align="C")
    
    pdf.set_y(45)

    def section_title(text):
        pdf.set_font("Roboto", "", 14)
        pdf.set_text_color(*PRIMARY_COLOR)
        pdf.cell(0, 8, text, ln=1)
        # Draw underline
        pdf.set_draw_color(*PRIMARY_COLOR)
        pdf.set_line_width(0.5)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
        pdf.ln(4)

    def print_row(text, val=""):
        pdf.set_font("Roboto", "", 11)
        pdf.set_text_color(*TEXT_COLOR)
        
        # Calculate text width to put value on the right
        pdf.cell(140, 7, text, ln=0)
        
        pdf.set_text_color(*MUTED_COLOR)
        pdf.cell(50, 7, val, ln=1, align="R")

    # Filter out settlements from expenses
    real_expenses = [e for e in state["expenses"] if not e.get("is_settlement")]
    
    # 1. Expense List
    section_title(s["sectionExpenseList"])
    if not real_expenses:
        pdf.set_text_color(*MUTED_COLOR)
        pdf.cell(0, 8, s["noExpenses"], ln=1)
    else:
        for i, e in enumerate(real_expenses):
            # Zebra striping
            if i % 2 == 0:
                pdf.set_fill_color(*BG_LIGHT)
                pdf.rect(pdf.get_x(), pdf.get_y(), 190, 8, style='F')
            
            payer = name_by_id.get(e["paid_by"], "?")
            cat_val = e.get("category", "other")
            cat_key = "catGeneral"
            if cat_val == "general": cat_key = "catGeneral"
            elif cat_val == "ent_games": cat_key = "catEntGames"
            elif cat_val == "ent_movies": cat_key = "catEntMovies"
            elif cat_val == "ent_music": cat_key = "catEntMusic"
            elif cat_val == "ent_sports": cat_key = "catEntSports"
            elif cat_val == "ent_other": cat_key = "catEntOther"
            elif cat_val == "food_dining": cat_key = "catFoodDining"
            elif cat_val == "food_groceries": cat_key = "catFoodGroceries"
            elif cat_val == "food_liquor": cat_key = "catFoodLiquor"
            elif cat_val == "food_other": cat_key = "catFoodOther"
            elif cat_val == "home_supplies": cat_key = "catHomeSupplies"
            elif cat_val == "home_maintenance": cat_key = "catHomeMaintenance"
            elif cat_val == "home_rent": cat_key = "catHomeRent"
            elif cat_val == "home_other": cat_key = "catHomeOther"
            elif cat_val == "life_childcare": cat_key = "catLifeChildcare"
            elif cat_val == "life_clothing": cat_key = "catLifeClothing"
            elif cat_val == "life_education": cat_key = "catLifeEducation"
            elif cat_val == "life_gifts": cat_key = "catLifeGifts"
            elif cat_val == "life_medical": cat_key = "catLifeMedical"
            elif cat_val == "life_other": cat_key = "catLifeOther"
            elif cat_val == "trans_bicycle": cat_key = "catTransBicycle"
            elif cat_val == "trans_bus": cat_key = "catTransBus"
            elif cat_val == "trans_car": cat_key = "catTransCar"
            elif cat_val == "trans_gas": cat_key = "catTransGas"
            elif cat_val == "trans_hotel": cat_key = "catTransHotel"
            elif cat_val == "trans_parking": cat_key = "catTransParking"
            elif cat_val == "trans_plane": cat_key = "catTransPlane"
            elif cat_val == "trans_taxi": cat_key = "catTransTaxi"
            elif cat_val == "trans_other": cat_key = "catTransOther"
            elif cat_val == "util_cleaning": cat_key = "catUtilCleaning"
            elif cat_val == "util_electricity": cat_key = "catUtilElectricity"
            elif cat_val == "util_heat": cat_key = "catUtilHeat"
            elif cat_val == "util_trash": cat_key = "catUtilTrash"
            elif cat_val == "util_tv": cat_key = "catUtilTv"
            elif cat_val == "util_water": cat_key = "catUtilWater"
            elif cat_val == "util_other": cat_key = "catUtilOther"
            elif cat_val == "other": cat_key = "catGeneral"
            
            cat_str = s.get(cat_key, "")
            
            desc = e["description"] or s["noDescription"]
            desc_text = f"{cat_str}{desc}"
            amount_text = fmt(e["amount"])
            
            pdf.set_font("Roboto", "", 11)
            pdf.set_text_color(*TEXT_COLOR)
            pdf.cell(90, 8, f" {desc_text}", ln=0)
            
            pdf.set_text_color(*MUTED_COLOR)
            pdf.cell(60, 8, f"{s['paidBy']} {payer}", ln=0)
            
            pdf.set_text_color(*PRIMARY_COLOR)
            pdf.cell(40, 8, amount_text, ln=1, align="R")
    pdf.ln(8)

    # 2. Breakdown
    section_title(s["sectionBreakdown"])
    for b in state["breakdown"]:
        pdf.set_fill_color(*BG_LIGHT)
        pdf.rect(pdf.get_x(), pdf.get_y(), 190, 8, style='F')
        
        b_name = b["name"]
        pdf.set_font("Roboto", "", 11)
        pdf.set_text_color(*TEXT_COLOR)
        pdf.cell(140, 8, f" {b_name}", ln=0)
        
        # Filter breakdown items
        real_items = [item for item in b["items"] if not any(e["id"] == item["expense_id"] and e.get("is_settlement") for e in state["expenses"])]
        
        # Recalculate total for real items
        real_total = sum(item["owed"] for item in real_items)
        
        total_text = fmt(real_total)
        pdf.set_text_color(*PRIMARY_COLOR)
        pdf.cell(50, 8, total_text, ln=1, align="R")
        
        if not real_items:
            pdf.set_font("Roboto", "", 10)
            pdf.set_text_color(*MUTED_COLOR)
            pdf.cell(0, 6, f"   {s['noParticipation']}", ln=1)
        else:
            pdf.set_font("Roboto", "", 10)
            for item in real_items:
                desc = item['description'] or s['noDescription']
                if item['shares'] == item['owed']:
                    detail = f"   {desc}"
                else:
                    shares_str = _fmt_shares(item['shares'])
                    detail = f"   {desc} ({shares_str} {s['shareUnit']})"
                
                pdf.set_text_color(*MUTED_COLOR)
                pdf.cell(140, 6, detail, ln=0)
                pdf.cell(50, 6, fmt(item['owed']), ln=1, align="R")
        pdf.ln(2)
    pdf.ln(6)

    # 3. Balances
    section_title(s["sectionBalances"])
    for b in state["balances"]:
        b_name = b["name"]
        if b["balance"] > 0:
            text = f"{s['balanceGets']}"
            val = fmt(b['balance'])
            color = (16, 185, 129) # Emerald
        elif b["balance"] < 0:
            text = f"{s['balanceOwes']}"
            val = fmt(-b['balance'])
            color = (239, 68, 68) # Red
        else:
            text = s["balanceSettled"]
            val = ""
            color = MUTED_COLOR

        pdf.set_font("Roboto", "", 11)
        pdf.set_text_color(*TEXT_COLOR)
        pdf.cell(80, 8, f" {b_name}", ln=0)
        
        pdf.set_text_color(*MUTED_COLOR)
        pdf.cell(60, 8, text, ln=0)
        
        pdf.set_text_color(*color)
        pdf.cell(50, 8, val, ln=1, align="R")
    pdf.ln(8)

    # 4. Settlements
    section_title(s["sectionSettlements"])
    if not state["settlements"]:
        pdf.set_text_color(*MUTED_COLOR)
        pdf.cell(0, 8, s["noSettlements"], ln=1)
    else:
        for st in state["settlements"]:
            from_name = st["from_name"]
            to_name = st["to_name"]
            pays_text = s["settlementPays"]
            amount_text = fmt(st["amount"])
            
            pdf.set_font("Roboto", "", 11)
            pdf.set_text_color(*TEXT_COLOR)
            pdf.cell(140, 8, f" {from_name}  ->  {to_name}", ln=0)
            
            pdf.set_text_color(239, 68, 68) # Red for amount
            pdf.cell(50, 8, amount_text, ln=1, align="R")
    pdf.ln(8)

    # 5. Payment History (Khoản đã thanh toán)
    settlements = [e for e in state["expenses"] if e.get("is_settlement")]
    if settlements:
        section_title(s["sectionPaymentHistory"])
        for e in settlements:
            from_name = name_by_id.get(e["paid_by"], "?")
            to_id = e["participants"][0]["person_id"] if e["participants"] else None
            to_name = name_by_id.get(to_id, "?")
            amount_text = fmt(e["amount"])
            
            pdf.set_font("Roboto", "", 11)
            pdf.set_text_color(*TEXT_COLOR)
            pdf.cell(140, 8, f" {from_name}  {s['paymentPaidTo']}  {to_name}", ln=0)
            
            pdf.set_text_color(16, 185, 129) # Emerald (Success) for completed payment
            pdf.cell(50, 8, amount_text, ln=1, align="R")

    return bytes(pdf.output())
