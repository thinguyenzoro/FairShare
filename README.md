# 💰 Splitbill - Group Expense Splitter

**Splitbill** is a lightweight, privacy-friendly, and modern web application to split expenses with friends and groups without requiring any login or registration.

## ✨ Features
- 🚀 **No Login Required**: Simply create or type any room name and share the link with your group.
- 🧮 **Flexible Expense Splitting**: Split equally or by exact custom amounts/shares.
- ⚖️ **Smart Debt Settlement**: Automatically calculates the minimum number of transactions needed to settle up debts.
- 📄 **Export Summary to PDF**: Export a complete breakdown report in PDF format (supports Vietnamese & English with full Unicode font).
- 🔒 **Optional Room Lock**: Set a 4-6 digit PIN to protect group room access.
- 🌓 **Dark / Light Mode**: Auto-detects system preferences and allows quick toggle.
- 🌐 **Multilingual & Multi-currency**: Supports English and Vietnamese out-of-the-box (VND, USD, EUR, JPY, KRW, GBP).

---

## 🛠️ Tech Stack
- **Backend**: Python 3, Flask, SQLite, Gunicorn, fpdf2
- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+), i18n
- **Deployment**: Docker & Docker Compose

---

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/thinguyenzoro/Splitbill.git
cd Splitbill

# Start the application
docker compose up --build -d
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

### Option 2: Running Locally with Python

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## ☁️ Deployment on VPS

To deploy Splitbill on an Ubuntu / Debian VPS with Docker:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## ☕ Support / Donate

If you find **Splitbill** helpful, buy the author a coffee!

<p align="center">
  <img src="static/qr-placeholder.jpg" alt="Donate QR Code" width="220">
</p>

---

## 📄 License

Distributed under the [MIT License](LICENSE).
