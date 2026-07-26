const translations = {
  en: {
    appTitle: "FairShare",
    tagline: "The simplest way to split group expenses",
    urlPrefix: "fairshare/",
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
    splitModeShares: "By shares",
    splitModeAmount: "By exact amount",
    evenSplitBtn: "Split evenly",
    splitExact: "â Fully allocated, matches the total",
    splitShortBy: "Short by",
    splitOverBy: "Over by",
    addExpenseBtn: "Add expense",
    updateExpenseBtn: "Update expense",
    cancelEditBtn: "Cancel",
    editBtn: "Edit",
    sectionExpenseList: "3. Expense list",
    thDesc: "Description",
    thAmount: "Amount",
    thPaidBy: "Paid by",
    thSplitWith: "Split with",
    deleteBtn: "Delete",
    sectionBalances: "4. Balances",
    sectionBreakdown: "5. Breakdown per person",
    sectionSettlements: "6. Settlement",
    sectionExport: "7. Export summary",
    copySummaryBtn: "Copy summary",
    downloadPdfBtn: "Download PDF",
    noSettlements: "No transfers needed â everyone is settled up.",
    balanceSettled: "settled up",
    balanceGets: "gets back",
    balanceOwes: "owes",
    settlementPays: "pays",
    noExpensesYet: "hasn't joined any expense yet",
    noDescription: "(no description)",
    shareUnit: "share(s)",
    namePlaceholderPrefix: "Person",
    donateHeading: "Buy the author a coffee",
    donateHint: "Scan the QR code to donate â thank you for the support!",
    lockedTitle: "This room is locked",
    lockedSubtitle: "Enter the PIN to view this room",
    pinPlaceholder: "PIN",
    unlockBtn: "Unlock",
    lockRoomBtn: "Lock room",
    removeLockBtn: "Remove lock",
    enterPinToUnlock: "Enter the PIN to remove the lock:",
    setPinToLock: "Set a 4-6 digit PIN to lock this room:",
    NAME_REQUIRED: "Name is required",
    PERSON_HAS_EXPENSES: "This person already has transactions and cannot be removed.",
    AMOUNT_INVALID: "Invalid amount",
    AMOUNT_MUST_BE_POSITIVE: "Amount must be greater than 0",
    NEED_PAYER_AND_PARTICIPANTS: "Please select a payer and at least one participant",
    SHARES_INVALID: "Invalid share value",
    SHARES_MUST_BE_POSITIVE: "Shares must be greater than 0",
    AMOUNTS_MUST_SUM_TO_TOTAL: "The amounts entered must add up exactly to the total",
    WRONG_PIN: "Incorrect PIN",
    PIN_INVALID: "PIN must be 4-6 digits",
    NOT_LOCKED: "This room is not locked",
    ROOM_LOCKED: "This room is locked",
    MESSAGE_REQUIRED: "Please write something first",
    GENERIC_ERROR: "Something went wrong",
    feedbackBtn: "Feedback",
    feedbackPrompt: "What's on your mind? (bug, suggestion, anything)",
    feedbackThanks: "Thanks for the feedback!",
  },
  vi: {
    appTitle: "Chia Tiá»n",
    tagline: "CÃ¡ch ÄÆ¡n giáº£n nháº¥t Äá» chia tiá»n nhÃ³m",
    urlPrefix: "fairshare/",
    slugPlaceholder: "ten-nhom-cua-ban",
    goButton: "Vào",
    landingHint: "KhÃ´ng cáº§n ÄÄng nháº­p. GÃµ má»t tÃªn phÃ²ng báº¥t ká»³ rá»i chia sáº» link ÄÃ³ cho má»i ngÆ°á»i trong nhÃ³m.",
    copyLink: "Copy link phòng",
    copied: "ÄÃ£ copy!",
    sectionMembers: "1. Thành viên",
    peopleCountLabel: "Sá» ngÆ°á»i:",
    genFieldsBtn: "Tạo ô nhập tên",
    saveBulkBtn: "Lưu tất cả tên",
    singleNamePlaceholder: "Thêm 1 ngÆ°á»i...",
    addBtn: "Thêm",
    sectionAddExpense: "2. Thêm chi tiÃªu",
    descLabel: "Mô tả",
    descPlaceholder: "Än tá»i, xÄng xe, ...",
    amountLabel: "Sá» tiá»n",
    paidByLabel: "Tráº£ bá»i",
    paidBySelectDefault: "-- chá»n ngÆ°á»i --",
    participantsLabel: "Chia cho ai (tick ngÆ°á»i tham gia, nháº­p sá» phần):",
    splitModeShares: "Theo phần",
    splitModeAmount: "Theo sá» tiá»n",
    evenSplitBtn: "Chia Äá»u",
    splitExact: "â ÄÃ£ chia Äá»§, khá»p tá»ng tiá»n",
    splitShortBy: "Còn thiếu",
    splitOverBy: "Dư",
    addExpenseBtn: "Thêm chi tiÃªu",
    updateExpenseBtn: "Cập nhật chi tiêu",
    cancelEditBtn: "Hủy",
    editBtn: "Sửa",
    sectionExpenseList: "3. Danh sách chi tiêu",
    thDesc: "Mô tả",
    thAmount: "Sá» tiá»n",
    thPaidBy: "Tráº£ bá»i",
    thSplitWith: "Chia cho",
    deleteBtn: "Xoá",
    sectionBalances: "4. Sá» dÆ°",
    sectionBreakdown: "5. Chi tiáº¿t theo ngÆ°á»i",
    sectionSettlements: "6. Cấn trừ nợ",
    sectionExport: "7. Xuất kết quả",
    copySummaryBtn: "Copy tá»ng káº¿t",
    downloadPdfBtn: "Tải file PDF",
    noSettlements: "KhÃ´ng cáº§n chuyá»n tiá»n â má»i ngÆ°á»i ÄÃ£ cÃ¢n báº±ng.",
    balanceSettled: "ÄÃ£ cÃ¢n báº±ng",
    balanceGets: "ÄÆ°á»£c nháº­n",
    balanceOwes: "phải trả",
    settlementPays: "trả",
    noExpensesYet: "chưa tham gia chi tiêu nào",
    noDescription: "(không mô tả)",
    shareUnit: "phần",
    namePlaceholderPrefix: "NgÆ°á»i",
    donateHeading: "á»¦ng há» tÃ¡c giáº£ má»t ly cÃ  phÃª",
    donateHint: "QuÃ©t mÃ£ QR Äá» donate â cáº£m Æ¡n báº¡n ÄÃ£ á»§ng há»!",
    lockedTitle: "PhÃ²ng nÃ y ÄÃ£ bá» khÃ³a",
    lockedSubtitle: "Nháº­p PIN Äá» xem phÃ²ng nÃ y",
    pinPlaceholder: "PIN",
    unlockBtn: "Má» khÃ³a",
    lockRoomBtn: "Khóa phòng",
    removeLockBtn: "Bá» khÃ³a",
    enterPinToUnlock: "Nháº­p PIN Äá» bá» khÃ³a phÃ²ng:",
    setPinToLock: "Äáº·t PIN 4-6 sá» Äá» khÃ³a phÃ²ng:",
    NAME_REQUIRED: "Cần nhập tên",
    PERSON_HAS_EXPENSES: "NgÆ°á»i nÃ y ÄÃ£ cÃ³ giao dá»ch, khÃ´ng thá» xoÃ¡.",
    AMOUNT_INVALID: "Sá» tiá»n khÃ´ng há»£p lá»",
    AMOUNT_MUST_BE_POSITIVE: "Sá» tiá»n pháº£i lá»n hÆ¡n 0",
    NEED_PAYER_AND_PARTICIPANTS: "Cáº§n chá»n ngÆ°á»i trả vÃ  ngÆ°á»i tham gia",
    SHARES_INVALID: "Sá» phần khÃ´ng há»£p lá»",
    SHARES_MUST_BE_POSITIVE: "Sá» phần pháº£i lá»n hÆ¡n 0",
    AMOUNTS_MUST_SUM_TO_TOTAL: "Sá» tiá»n chia cho tá»«ng ngÆ°á»i pháº£i cá»ng láº¡i ÄÃºng báº±ng tá»ng sá» tiá»n",
    WRONG_PIN: "Sai PIN",
    PIN_INVALID: "PIN pháº£i cÃ³ 4-6 sá»",
    NOT_LOCKED: "PhÃ²ng nÃ y chÆ°a bá» khÃ³a",
    ROOM_LOCKED: "PhÃ²ng nÃ y ÄÃ£ bá» khÃ³a",
    MESSAGE_REQUIRED: "Bạn chưa viết gì cả",
    GENERIC_ERROR: "CÃ³ lá»i xáº£y ra",
    feedbackBtn: "Góp ý",
    feedbackPrompt: "Báº¡n muá»n gÃ³p Ã½ gÃ¬? (lá»i, Äá» xuáº¥t, báº¥t ká»³ Äiá»u gÃ¬)",
    feedbackThanks: "Cảm ơn góp ý của bạn!",
  },
};

(function () {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if (urlLang && translations[urlLang]) {
    localStorage.setItem('lang', urlLang);
    params.delete('lang');
    const rest = params.toString();
    const cleanUrl = window.location.pathname + (rest ? '?' + rest : '') + window.location.hash;
    window.history.replaceState(null, '', cleanUrl);
  }
})();

function currentLang() {
  const saved = localStorage.getItem('lang');
  return translations[saved] ? saved : 'en';
}

const CURRENCIES = {
  VND: { symbol: 'Ä', decimals: 0, position: 'suffix', locale: 'vi-VN' },
  USD: { symbol: '$', decimals: 2, position: 'prefix', locale: 'en-US' },
  EUR: { symbol: 'â¬', decimals: 2, position: 'suffix', locale: 'de-DE' },
  JPY: { symbol: ¥, decimals: 0, position: 'prefix', locale: 'ja-JP' },
  KRW: { symbol: 'â©', decimals: 0, position: 'prefix', locale: 'ko-KR' },
  GBP: { symbol: £, decimals: 2, position: 'prefix', locale: 'en-GB' },
};
const LANG_DEFAULT_CURRENCY = { vi: 'VND', en: 'USD' };

function currentCurrency() {
  const explicit = localStorage.getItem('currency');
  if (explicit && CURRENCIES[explicit]) return explicit;
  return LANG_DEFAULT_CURRENCY[currentLang()] || 'USD';
}

function formatCurrency(amount) {
  const cfg = CURRENCIES[currentCurrency()];
  const num = amount.toLocaleString(cfg.locale, {
    minimumFractionDigits: cfg.decimals,
    maximumFractionDigits: cfg.decimals,
  });
  return cfg.position === 'prefix' ? `${cfg.symbol}${num}` : `${num} ${cfg.symbol}`;
}

function syncCurrencySelect() {
  const sel = document.getElementById('currencySelect');
  if (!sel) return;
  if (!sel.options.length) {
    Object.keys(CURRENCIES).forEach((code) => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = `${CURRENCIES[code].symbol} ${code}`;
      sel.appendChild(opt);
    });
  }
  sel.value = currentCurrency();
}

function setCurrency(code) {
  if (!CURRENCIES[code]) return;
  localStorage.setItem('currency', code);
  syncCurrencySelect();
  document.dispatchEvent(new CustomEvent('currencychange'));
}

function t(key) {
  const lang = currentLang();
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}

function applyTranslations() {
  document.documentElement.setAttribute('lang', currentLang());

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  const room = document.body.dataset.room;
  document.title = room ? `${room} - ${t('appTitle')}` : t('appTitle');

  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = currentLang() === 'en' ? 'VI' : 'EN';

  syncCurrencySelect();
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations();
  document.dispatchEvent(new CustomEvent('langchange'));
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  const langBtn = document.getElementById('langToggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => setLang(currentLang() === 'en' ? 'vi' : 'en'));
  }
  const currencySel = document.getElementById('currencySelect');
  if (currencySel) {
    currencySel.addEventListener('change', () => setCurrency(currencySel.value));
  }
});

