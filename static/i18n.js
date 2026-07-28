const translations = {
  en: {
    appTitle: "Splitbill",
    tagline: "The simplest way to split group expenses",
    urlPrefix: "splitbill/",
    slugPlaceholder: "your-group-name",
    goButton: "Go",
    landingHint: "No login required. Type any room name and share the link with your group.",
    copyLink: "Copy room link",
    copied: "Copied!",
    sectionMembers: "1. Members",
    peopleCountLabel: "Number of people:",
    genFieldsBtn: "Generate name fields",
    saveBulkBtn: "Save all names",
    singleNamePlaceholder: "Add one person...",
    addBtn: "Add",
    sectionAddExpense: "2. Add expense",
    descLabel: "Description",
    descPlaceholder: "Dinner, gas, ...",
    amountLabel: "Amount",
    paidByLabel: "Paid by",
    paidBySelectDefault: "-- select person --",
    participantsLabel: "Split with (check participants, enter shares):",
    billImageLabel: "Bill receipt image (optional):",
    splitModeShares: "By shares",
    splitModeAmount: "By exact amount",
    evenSplitBtn: "Split evenly",
    splitExact: "✓ Fully allocated, matches the total",
    splitShortBy: "Short by",
    splitOverBy: "Over by",
    createGroupBtn: "+ New Group",
    addExpenseBtn: "Add expense",
    updateExpenseBtn: "Update expense",
    cancelEditBtn: "Cancel",
    editBtn: "Edit",
    sectionExpenseList: "3. Expense list",
    thDesc: "Description",
    thAmount: "Amount",
    thPaidBy: "Paid by",
    thSplitWith: "Split with",
    thBill: "Bill",
    viewBill: "View bill",
    uploadingBill: "Compressing & uploading image...",
    deleteBtn: "Delete",
    sectionBalances: "4. Balances",
    sectionBreakdown: "5. Breakdown per person",
    sectionSettlements: "6. Settlement",
    sectionExport: "7. Export summary",
    copySummaryBtn: "Copy summary",
    downloadPdfBtn: "Download PDF",
    noSettlements: "No transfers needed — everyone is settled up.",
    balanceSettled: "settled up",
    balanceGets: "gets back",
    balanceOwes: "owes",
    settlementPays: "pays",
    noExpensesYet: "hasn't joined any expense yet",
    noDescription: "(no description)",
    shareUnit: "share(s)",
    namePlaceholderPrefix: "Person",
    donateHeading: "Buy the author a coffee to maintain the domain, server, and update features",
    donateHint: "Scan the QR code to donate — thank you for the support!",
    lockedTitle: "This room is locked",
    lockedSubtitle: "Enter the PIN to view this room",
    pinPlaceholder: "PIN",
    unlockBtn: "Unlock",
    lockRoomBtn: "Lock room",
    removeLockBtn: "Remove lock",
    enterPinToUnlock: "Enter the PIN to remove the lock:",
    setPinToLock: "Set a 4-6 digit PIN to lock this room:",
    NAME_REQUIRED: "Name is required",
    PERSON_HAS_EXPENSES: "This person is part of expenses and cannot be deleted.",
    AMOUNT_INVALID: "Invalid amount",
    AMOUNT_MUST_BE_POSITIVE: "Amount must be greater than 0",
    NEED_PAYER_AND_PARTICIPANTS: "Select who paid and at least one participant",
    SHARES_INVALID: "Invalid shares value",
    SHARES_MUST_BE_POSITIVE: "Shares must be greater than 0",
    AMOUNTS_MUST_SUM_TO_TOTAL: "Allocated amounts must equal total expense amount",
    WRONG_PIN: "Incorrect PIN",
    PIN_INVALID: "PIN must be 4-6 digits",
    NOT_LOCKED: "Room is not locked",
    ROOM_LOCKED: "Room is locked",
    MESSAGE_REQUIRED: "Message cannot be empty",
    GENERIC_ERROR: "Something went wrong",
    btnPay: "Pay",
    btnUndo: "Undo",
    settledList: "Completed Settlements",
    settledText: "paid",
        feedbackBtn: "Feedback",
    githubFooterLink: "⭐ Open Source on GitHub — Want to contribute or create a PR? Click here!",
  },
  vi: {
    appTitle: "Splitbill",
    tagline: "Cách đơn giản nhất để chia tiền nhóm",
    urlPrefix: "splitbill/",
    slugPlaceholder: "ten-nhom-cua-ban",
    goButton: "Vào",
    landingHint: "Không cần đăng nhập. Gõ một tên phòng bất kỳ rồi chia sẻ link đó cho mọi người trong nhóm.",
    copyLink: "Copy link phòng",
    copied: "Đã copy!",
    sectionMembers: "1. Thành viên",
    peopleCountLabel: "Số người:",
    genFieldsBtn: "Tạo ô nhập tên",
    saveBulkBtn: "Lưu tất cả tên",
    singleNamePlaceholder: "Thêm 1 người...",
    addBtn: "Thêm",
    sectionAddExpense: "2. Thêm chi tiêu",
    descLabel: "Mô tả",
    descPlaceholder: "Ăn tối, xăng xe, ...",
    amountLabel: "Số tiền",
    paidByLabel: "Trả bởi",
    paidBySelectDefault: "-- chọn người --",
    participantsLabel: "Chia cho ai (tick người tham gia, nhập số phần):",
    billImageLabel: "Ảnh hóa đơn/bill (không bắt buộc):",
    splitModeShares: "Theo phần",
    splitModeAmount: "Theo số tiền",
    evenSplitBtn: "Chia đều",
    splitExact: "✓ Đã chia đủ, khớp tổng tiền",
    splitShortBy: "Còn thiếu",
    splitOverBy: "Dư",
    createGroupBtn: "+ Tạo nhóm mới",
    addExpenseBtn: "Thêm chi tiêu",
    updateExpenseBtn: "Cập nhật chi tiêu",
    cancelEditBtn: "Hủy",
    editBtn: "Sửa",
    sectionExpenseList: "3. Danh sách chi tiêu",
    thDesc: "Mô tả",
    thAmount: "Số tiền",
    thPaidBy: "Trả bởi",
    thSplitWith: "Chia cho",
    thBill: "Ảnh bill",
    viewBill: "Xem bill",
    uploadingBill: "Đang nén & tải ảnh lên...",
    deleteBtn: "Xoá",
    sectionBalances: "4. Số dư",
    sectionBreakdown: "5. Chi tiết theo người",
    sectionSettlements: "6. Cấn trừ nợ",
    sectionExport: "7. Xuất kết quả",
    copySummaryBtn: "Copy tổng kết",
    downloadPdfBtn: "Tải file PDF",
    noSettlements: "Không cần chuyển tiền — mọi người đã cân bằng.",
    balanceSettled: "đã cân bằng",
    balanceGets: "được nhận",
    balanceOwes: "phải trả",
    settlementPays: "trả",
    noExpensesYet: "chưa tham gia chi tiêu nào",
    noDescription: "(không mô tả)",
    shareUnit: "phần",
    namePlaceholderPrefix: "Người",
    donateHeading: "Ủng hộ tác giả ly cafe để duy trì tên miền, máy chủ và update tính năng",
    donateHint: "Quét mã QR để donate — cảm ơn bạn đã ủng hộ!",
    lockedTitle: "Phòng này đã bị khóa",
    lockedSubtitle: "Nhập PIN để xem phòng này",
    pinPlaceholder: "PIN",
    unlockBtn: "Mở khóa",
    lockRoomBtn: "Khóa phòng",
    removeLockBtn: "Bỏ khóa",
    enterPinToUnlock: "Nhập PIN để bỏ khóa phòng:",
    setPinToLock: "Đặt PIN 4-6 số để khóa phòng:",
    NAME_REQUIRED: "Cần nhập tên",
    PERSON_HAS_EXPENSES: "Người này đã có giao dịch, không thể xoá.",
    AMOUNT_INVALID: "Số tiền không hợp lệ",
    AMOUNT_MUST_BE_POSITIVE: "Số tiền phải lớn hơn 0",
    NEED_PAYER_AND_PARTICIPANTS: "Cần chọn người trả và người tham gia",
    SHARES_INVALID: "Số phần không hợp lệ",
    SHARES_MUST_BE_POSITIVE: "Số phần phải lớn hơn 0",
    AMOUNTS_MUST_SUM_TO_TOTAL: "Số tiền chia cho từng người phải cộng lại đúng bằng tổng số tiền",
    WRONG_PIN: "Sai PIN",
    PIN_INVALID: "PIN phải có 4-6 số",
    NOT_LOCKED: "Phòng này chưa bị khóa",
    ROOM_LOCKED: "Phòng này đã bị khóa",
    MESSAGE_REQUIRED: "Bạn chưa viết gì cả",
    GENERIC_ERROR: "Có lỗi xảy ra",
    btnPay: "Thanh toán",
    btnUndo: "Hoàn tác",
    settledList: "Khoản đã thanh toán",
    settledText: "đã thanh toán cho",
        feedbackBtn: "Góp ý",
    githubFooterLink: "⭐ Open Source trên GitHub — Bạn muốn đóng góp hoặc tạo PR? Bấm vào đây!",
  },
};

(function () {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");
  if (lang && translations[lang]) {
    localStorage.setItem("lang", lang);
    params.delete("lang");
    const rest = params.toString();
    const cleanUrl = window.location.pathname + (rest ? "?" + rest : "") + window.location.hash;
    window.history.replaceState(null, "", cleanUrl);
  }
})();

function currentLang() {
  const saved = localStorage.getItem("lang");
  return translations[saved] ? saved : "vi";
}

const CURRENCIES = {
  VND: { symbol: "đ", decimals: 0, position: "suffix", locale: "vi-VN" },
  USD: { symbol: "$", decimals: 2, position: "prefix", locale: "en-US" },
  EUR: { symbol: "€", decimals: 2, position: "suffix", locale: "de-DE" },
  JPY: { symbol: "¥", decimals: 0, position: "prefix", locale: "ja-JP" },
  KRW: { symbol: "₩", decimals: 0, position: "prefix", locale: "ko-KR" },
  GBP: { symbol: "£", decimals: 2, position: "prefix", locale: "en-GB" },
};
const LANG_DEFAULT_CURRENCY = { vi: "VND", en: "USD" };

function currentCurrency() {
  const explicit = localStorage.getItem("currency");
  if (explicit && CURRENCIES[explicit]) return explicit;
  return LANG_DEFAULT_CURRENCY[currentLang()] || "VND";
}

function formatCurrency(amount) {
  const code = currentCurrency();
  const cfg = CURRENCIES[code];
  if (code === "VND") {
    const rounded = Math.round(amount);
    const spaced = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${spaced} đ`;
  }
  const num = amount.toLocaleString(cfg.locale, {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals,
  });
  return cfg.position === "prefix" ? `${cfg.symbol}${num}` : `${num} ${cfg.symbol}`;
}

function syncCurrencySelect() {
  const sel = document.getElementById("currencySelect");
  if (!sel) return;
  if (!sel.options.length) {
    Object.keys(CURRENCIES).forEach((code) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = `${CURRENCIES[code].symbol} ${code}`;
      sel.appendChild(opt);
    });
  }
  sel.value = currentCurrency();
}

function updateUrlParam(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url);
}

function setLang(lang) {
  if (translations[lang]) {
    localStorage.setItem("lang", lang);
    updateUrlParam("lang", lang);
    applyI18n();
    document.dispatchEvent(new Event("langchange"));
  }
}

function setCurrency(code) {
  if (CURRENCIES[code]) {
    localStorage.setItem("currency", code);
    updateUrlParam("currency", code);
    syncCurrencySelect();
    document.dispatchEvent(new Event("currencychange"));
  }
}

function t(key) {
  const lang = currentLang();
  return (translations[lang] && translations[lang][key]) || (translations.en && translations.en[key]) || key;
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = t(key);
  });

  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.textContent = currentLang() === "vi" ? "🇻🇳 VI" : "🇬🇧 EN";
  }
  syncCurrencySelect();
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get("lang");
  if (urlLang && translations[urlLang]) localStorage.setItem("lang", urlLang);
  const urlCurr = params.get("currency");
  if (urlCurr && CURRENCIES[urlCurr]) localStorage.setItem("currency", urlCurr);

  applyI18n();
  const langBtn = document.getElementById("langToggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      setLang(currentLang() === "vi" ? "en" : "vi");
    });
  }
  const currSel = document.getElementById("currencySelect");
  if (currSel) {
    currSel.addEventListener("change", (e) => {
      setCurrency(e.target.value);
    });
  }
});
