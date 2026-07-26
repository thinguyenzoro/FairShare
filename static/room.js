const room = document.body.dataset.room;
const apiBase = `/${room}/api`;

let state = { people: [], expenses: [], balances: [], settlements: [], breakdown: [] };
let editingExpenseId = null;
let splitMode = "shares";
let currentImageUrl = null;

function fmt(n) {
  return formatCurrency(n);
}

function updateAmountLabel() {
  const el = document.getElementById("amountLabelText");
  if (el) el.textContent = `${t("amountLabel")} (${CURRENCIES[currentCurrency()].symbol})`;
}

syncCurrencySelect();

async function loadState() {
  const res = await fetch(`${apiBase}/state`);
  if (!res.ok) {
    window.location.reload();
    return;
  }
  state = await res.json();
  render();
}

function render() {
  renderPeopleList();
  renderPaidBySelect();
  renderParticipantsBox();
  renderExpenseTable();
  renderBalances();
  renderBreakdown();
  renderSettlements();
  renderLockButton();
  updateExpenseFormMode();
  updateAmountLabel();
  renderSummary();
}

function renderLockButton() {
  const btn = document.getElementById("lockToggleBtn");
  if (btn) btn.textContent = state.locked ? t("removeLockBtn") : t("lockRoomBtn");
}

function renderPeopleList() {
  const ul = document.getElementById("peopleList");
  if (!ul) return;
  ul.innerHTML = "";
  state.people.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.title = t("deleteBtn");
    btn.addEventListener("click", () => deletePerson(p.id));
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function renderPaidBySelect() {
  const sel = document.getElementById("expPaidBy");
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = `<option value="">${t("paidBySelectDefault")}</option>`;
  state.people.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
}

function renderParticipantsBox() {
  const box = document.getElementById("participantsBox");
  if (!box) return;
  box.classList.toggle("mode-amount", splitMode === "amount");
  box.innerHTML = "";
  state.people.forEach((p) => {
    const row = document.createElement("div");
    row.className = "participant-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.personId = p.id;
    checkbox.className = "participant-check";
    checkbox.addEventListener("change", updateSplitStatus);

    const label = document.createElement("span");
    label.textContent = p.name;
    label.style.flex = "1";

    const shares = document.createElement("input");
    shares.type = "number";
    shares.dataset.personId = p.id;
    shares.className = "participant-shares";
    shares.addEventListener("input", updateSplitStatus);
    if (splitMode === "amount") {
      shares.min = "0";
      shares.step = "any";
      shares.value = "0";
    } else {
      shares.min = "0.5";
      shares.step = "0.5";
      shares.value = "1";
    }

    row.appendChild(checkbox);
    row.appendChild(label);
    row.appendChild(shares);
    box.appendChild(row);
  });
  updateSplitStatus();
}

function updateSplitStatus() {
  const statusEl = document.getElementById("splitStatus");
  const evenBtn = document.getElementById("evenSplitBtn");
  if (!statusEl || !evenBtn) return;
  if (splitMode !== "amount") {
    statusEl.classList.add("hidden");
    evenBtn.classList.add("hidden");
    return;
  }
  evenBtn.classList.remove("hidden");
  statusEl.classList.remove("hidden");

  const target = parseFloat(document.getElementById("expAmount").value) || 0;
  let allocated = 0;
  document.querySelectorAll(".participant-check").forEach((c) => {
    if (c.checked) {
      const sharesInput = document.querySelector(`.participant-shares[data-person-id="${c.dataset.personId}"]`);
      if (sharesInput) allocated += parseFloat(sharesInput.value) || 0;
    }
  });

  const diff = target - allocated;
  if (Math.abs(diff) < 0.005) {
    statusEl.textContent = `${t("splitExact")} (${fmt(allocated)})`;
    statusEl.className = "split-status split-status-ok";
  } else if (diff > 0) {
    statusEl.textContent = `${t("splitShortBy")} ${fmt(diff)} (${fmt(allocated)} / ${fmt(target)})`;
    statusEl.className = "split-status split-status-bad";
  } else {
    statusEl.textContent = `${t("splitOverBy")} ${fmt(-diff)} (${fmt(allocated)} / ${fmt(target)})`;
    statusEl.className = "split-status split-status-bad";
  }
}

function splitEvenly() {
  const decimals = CURRENCIES[currentCurrency()].decimals;
  const multiplier = Math.pow(10, decimals);
  const targetUnits = Math.round((parseFloat(document.getElementById("expAmount").value) || 0) * multiplier);
  const checks = Array.from(document.querySelectorAll(".participant-check")).filter((c) => c.checked);
  if (checks.length === 0) return;

  const baseUnits = Math.floor(targetUnits / checks.length);
  const remainderUnits = targetUnits - baseUnits * checks.length;
  checks.forEach((c, i) => {
    const sharesInput = document.querySelector(`.participant-shares[data-person-id="${c.dataset.personId}"]`);
    if (sharesInput) {
      const units = baseUnits + (i < remainderUnits ? 1 : 0);
      sharesInput.value = (units / multiplier).toFixed(decimals);
    }
  });
  updateSplitStatus();
}

function renderExpenseTable() {
  const tbody = document.getElementById("expenseTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const nameById = Object.fromEntries(state.people.map((p) => [p.id, p.name]));

  state.expenses.forEach((e) => {
    const tr = document.createElement("tr");
    const participantsText = e.participants
      .map((s) => `${nameById[s.person_id] || "?"} (${s.shares})`)
      .join(", ");

    const imgCell = e.image_url
      ? `<img src="${e.image_url}" class="bill-thumb" alt="Bill" onclick="openLightbox('${e.image_url}')">`
      : "-";

    tr.innerHTML = `
      <td>${e.description || ""}</td>
      <td>${fmt(e.amount)}</td>
      <td>${nameById[e.paid_by] || "?"}</td>
      <td>${participantsText}</td>
      <td>${imgCell}</td>
      <td></td>
    `;
    const editBtn = document.createElement("button");
    editBtn.textContent = t("editBtn");
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => startEditExpense(e));

    const delBtn = document.createElement("button");
    delBtn.textContent = t("deleteBtn");
    delBtn.addEventListener("click", () => deleteExpense(e.id));

    tr.lastElementChild.appendChild(editBtn);
    tr.lastElementChild.appendChild(delBtn);
    tbody.appendChild(tr);
  });
}

function renderBalances() {
  const ul = document.getElementById("balancesList");
  if (!ul) return;
  ul.innerHTML = "";
  state.balances.forEach((b) => {
    const li = document.createElement("li");
    let cls = "balance-zero";
    let text = `${b.name}: ${t("balanceSettled")}`;
    if (b.balance > 0) {
      cls = "balance-positive";
      text = `${b.name}: ${t("balanceGets")} ${fmt(b.balance)}`;
    } else if (b.balance < 0) {
      cls = "balance-negative";
      text = `${b.name}: ${t("balanceOwes")} ${fmt(-b.balance)}`;
    }
    li.className = cls;
    li.textContent = text;
    ul.appendChild(li);
  });
}

function renderBreakdown() {
  const ul = document.getElementById("breakdownList");
  if (!ul) return;
  ul.innerHTML = "";
  state.breakdown.forEach((b) => {
    const li = document.createElement("li");
    if (b.items.length === 0) {
      li.textContent = `${b.name}: ${t("noExpensesYet")}`;
      ul.appendChild(li);
      return;
    }
    const parts = b.items
      .map((i) => `${i.description || t("noDescription")} ${fmt(i.owed)} (${i.shares} ${t("shareUnit")})`)
      .join(" + ");
    li.textContent = `${b.name}: ${parts} = ${fmt(b.total)}`;
    ul.appendChild(li);
  });
}

function renderSettlements() {
  const ul = document.getElementById("settlementsList");
  if (!ul) return;
  ul.innerHTML = "";
  if (state.settlements.length === 0) {
    const li = document.createElement("li");
    li.textContent = t("noSettlements");
    ul.appendChild(li);
    return;
  }
  state.settlements.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = `${s.from_name} ${t("settlementPays")} ${s.to_name}: ${fmt(s.amount)}`;
    ul.appendChild(li);
  });
}

function updateExpenseFormMode() {
  const submitBtn = document.getElementById("expenseSubmitBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (submitBtn) submitBtn.textContent = editingExpenseId ? t("updateExpenseBtn") : t("addExpenseBtn");
  if (cancelBtn) cancelBtn.classList.toggle("hidden", !editingExpenseId);
}

function setSplitMode(mode) {
  splitMode = mode;
  const modeSharesBtn = document.getElementById("modeSharesBtn");
  const modeAmountBtn = document.getElementById("modeAmountBtn");
  if (modeSharesBtn) modeSharesBtn.classList.toggle("active", mode === "shares");
  if (modeAmountBtn) modeAmountBtn.classList.toggle("active", mode === "amount");
  renderParticipantsBox();
}

function startEditExpense(expense) {
  editingExpenseId = expense.id;
  currentImageUrl = expense.image_url || null;
  const previewContainer = document.getElementById("imagePreviewContainer");
  const previewImg = document.getElementById("imagePreview");
  if (previewContainer && previewImg) {
    if (currentImageUrl) {
      previewImg.src = currentImageUrl;
      previewContainer.classList.remove("hidden");
    } else {
      previewContainer.classList.add("hidden");
    }
  }

  document.getElementById("expenseError").textContent = "";
  document.getElementById("expDesc").value = expense.description || "";
  document.getElementById("expAmount").value = expense.amount;
  document.getElementById("expPaidBy").value = expense.paid_by;

  setSplitMode("shares");
  document.querySelectorAll(".participant-check").forEach((c) => {
    const pid = parseInt(c.dataset.personId, 10);
    const match = expense.participants.find((p) => p.person_id === pid);
    c.checked = !!match;
    const sharesInput = document.querySelector(`.participant-shares[data-person-id="${pid}"]`);
    if (sharesInput) sharesInput.value = match ? match.shares : 1;
  });

  updateExpenseFormMode();
  document.getElementById("expenseForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelEditExpense() {
  editingExpenseId = null;
  currentImageUrl = null;
  const previewContainer = document.getElementById("imagePreviewContainer");
  if (previewContainer) previewContainer.classList.add("hidden");
  const imgInput = document.getElementById("expImageInput");
  if (imgInput) imgInput.value = "";
  document.getElementById("expenseForm").reset();
  document.getElementById("expenseError").textContent = "";
  setSplitMode("shares");
  updateExpenseFormMode();
}

function buildSummaryText() {
  const nameById = Object.fromEntries(state.people.map((p) => [p.id, p.name]));
  const lines = [`${room} — ${t("appTitle")}`, ""];

  lines.push(t("sectionExpenseList"));
  if (state.expenses.length === 0) {
    lines.push("-");
  } else {
    state.expenses.forEach((e) => {
      lines.push(`- ${e.description || t("noDescription")}: ${fmt(e.amount)} (${t("paidByLabel")} ${nameById[e.paid_by] || "?"})`);
    });
  }
  lines.push("", t("sectionBreakdown"));
  state.breakdown.forEach((b) => {
    if (b.items.length === 0) {
      lines.push(`- ${b.name}: ${t("noExpensesYet")}`);
      return;
    }
    const parts = b.items
      .map((i) => `${i.description || t("noDescription")} ${fmt(i.owed)} (${i.shares} ${t("shareUnit")})`)
      .join(" + ");
    lines.push(`- ${b.name}: ${parts} = ${fmt(b.total)}`);
  });

  lines.push("", t("sectionBalances"));
  state.balances.forEach((b) => {
    let text = t("balanceSettled");
    if (b.balance > 0) text = `${t("balanceGets")} ${fmt(b.balance)}`;
    else if (b.balance < 0) text = `${t("balanceOwes")} ${fmt(-b.balance)}`;
    lines.push(`- ${b.name}: ${text}`);
  });

  lines.push("", t("sectionSettlements"));
  if (state.settlements.length === 0) {
    lines.push(t("noSettlements"));
  } else {
    state.settlements.forEach((s) => {
      lines.push(`- ${s.from_name} ${t("settlementPays")} ${s.to_name}: ${fmt(s.amount)}`);
    });
  }

  return lines.join("\n");
}

function renderSummary() {
  const el = document.getElementById("summaryText");
  if (el) el.value = buildSummaryText();
}

// ---- People actions ----

const genFieldsBtn = document.getElementById("genFieldsBtn");
if (genFieldsBtn) {
  genFieldsBtn.addEventListener("click", () => {
    const count = parseInt(document.getElementById("peopleCount").value, 10) || 0;
    const container = document.getElementById("bulkFields");
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `${t("namePlaceholderPrefix")} ${i + 1}`;
      container.appendChild(input);
    }
    document.getElementById("saveBulkBtn").classList.toggle("hidden", count === 0);
  });
}

const saveBulkBtn = document.getElementById("saveBulkBtn");
if (saveBulkBtn) {
  saveBulkBtn.addEventListener("click", async () => {
    const inputs = document.querySelectorAll("#bulkFields input");
    const names = Array.from(inputs).map((i) => i.value.trim()).filter(Boolean);
    for (const name of names) {
      await fetch(`${apiBase}/people`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }
    document.getElementById("bulkFields").innerHTML = "";
    document.getElementById("saveBulkBtn").classList.add("hidden");
    await loadState();
  });
}

const addPersonBtn = document.getElementById("addPersonBtn");
if (addPersonBtn) addPersonBtn.addEventListener("click", addSinglePerson);

const singleNameInput = document.getElementById("singleNameInput");
if (singleNameInput) {
  singleNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addSinglePerson();
  });
}

async function addSinglePerson() {
  const input = document.getElementById("singleNameInput");
  const name = input.value.trim();
  if (!name) return;
  await fetch(`${apiBase}/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  input.value = "";
  await loadState();
}

async function deletePerson(id) {
  const res = await fetch(`${apiBase}/people/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    alert(t(data.error) || t("GENERIC_ERROR"));
    return;
  }
  await loadState();
}

// ---- Expense actions ----

const modeSharesBtn = document.getElementById("modeSharesBtn");
if (modeSharesBtn) modeSharesBtn.addEventListener("click", () => setSplitMode("shares"));

const modeAmountBtn = document.getElementById("modeAmountBtn");
if (modeAmountBtn) modeAmountBtn.addEventListener("click", () => setSplitMode("amount"));

const evenSplitBtn = document.getElementById("evenSplitBtn");
if (evenSplitBtn) evenSplitBtn.addEventListener("click", splitEvenly);

const expAmount = document.getElementById("expAmount");
if (expAmount) expAmount.addEventListener("input", updateSplitStatus);

const expenseForm = document.getElementById("expenseForm");
if (expenseForm) {
  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById("expenseError");
    errorEl.textContent = "";

    const description = document.getElementById("expDesc").value.trim();
    const amount = document.getElementById("expAmount").value;
    const paidBy = document.getElementById("expPaidBy").value;

    if (!paidBy) {
      errorEl.textContent = t("NEED_PAYER_AND_PARTICIPANTS");
      return;
    }

    const checks = document.querySelectorAll(".participant-check");
    const participants = [];
    checks.forEach((c) => {
      if (c.checked) {
        const sharesInput = document.querySelector(
          `.participant-shares[data-person-id="${c.dataset.personId}"]`
        );
        if (sharesInput) {
          participants.push({ person_id: parseInt(c.dataset.personId, 10), shares: parseFloat(sharesInput.value) || 0 });
        }
      }
    });

    if (participants.length === 0) {
      errorEl.textContent = t("NEED_PAYER_AND_PARTICIPANTS");
      return;
    }

    if (splitMode === "amount") {
      const allocated = participants.reduce((sum, p) => sum + p.shares, 0);
      if (Math.abs(allocated - (parseFloat(amount) || 0)) > 0.005) {
        errorEl.textContent = t("AMOUNTS_MUST_SUM_TO_TOTAL");
        return;
      }
    }

    const url = editingExpenseId ? `${apiBase}/expenses/${editingExpenseId}` : `${apiBase}/expenses`;
    const method = editingExpenseId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        amount,
        paid_by: parseInt(paidBy, 10),
        participants,
        split_mode: splitMode,
        image_url: currentImageUrl,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = t(data.error) || t("GENERIC_ERROR");
      return;
    }
    expenseForm.reset();
    editingExpenseId = null;
    currentImageUrl = null;
    const previewContainer = document.getElementById("imagePreviewContainer");
    if (previewContainer) previewContainer.classList.add("hidden");
    const expImgInput = document.getElementById("expImageInput");
    if (expImgInput) expImgInput.value = "";
    setSplitMode("shares");
    state = data;
    render();
  });
}

const cancelEditBtn = document.getElementById("cancelEditBtn");
if (cancelEditBtn) cancelEditBtn.addEventListener("click", cancelEditExpense);

async function deleteExpense(id) {
  await fetch(`${apiBase}/expenses/${id}`, { method: "DELETE" });
  await loadState();
}

// ---- Lock / unlock ----

const lockToggleBtn = document.getElementById("lockToggleBtn");
if (lockToggleBtn) {
  lockToggleBtn.addEventListener("click", async () => {
    if (state.locked) {
      const pin = prompt(t("enterPinToUnlock"));
      if (pin === null) return;
      const res = await fetch(`${apiBase}/remove-lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(t(data.error) || t("GENERIC_ERROR"));
        return;
      }
      state = data;
      render();
    } else {
      const pin = prompt(t("setPinToLock"));
      if (pin === null) return;
      const res = await fetch(`${apiBase}/lock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(t(data.error) || t("GENERIC_ERROR"));
        return;
      }
      state = data;
      render();
    }
  });
}

// ---- Misc ----

const copyLinkBtn = document.getElementById("copyLinkBtn");
if (copyLinkBtn) {
  copyLinkBtn.addEventListener("click", async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", currentLang());
    await navigator.clipboard.writeText(url.toString());
    const old = copyLinkBtn.textContent;
    copyLinkBtn.textContent = t("copied");
    setTimeout(() => (copyLinkBtn.textContent = old), 1500);
  });
}

const copySummaryBtn = document.getElementById("copySummaryBtn");
if (copySummaryBtn) {
  copySummaryBtn.addEventListener("click", async () => {
    const summaryInput = document.getElementById("summaryText");
    if (summaryInput) await navigator.clipboard.writeText(summaryInput.value);
    const old = copySummaryBtn.textContent;
    copySummaryBtn.textContent = t("copied");
    setTimeout(() => (copySummaryBtn.textContent = old), 1500);
  });
}

const downloadPdfBtn = document.getElementById("downloadPdfBtn");
if (downloadPdfBtn) {
  downloadPdfBtn.addEventListener("click", () => {
    window.location.href = `${apiBase}/export.pdf?lang=${currentLang()}&currency=${currentCurrency()}`;
  });
}

document.addEventListener("langchange", () => render());
document.addEventListener("currencychange", () => render());

loadState();

// ---- Bill Image Upload & Lightbox ----

const expImageInput = document.getElementById("expImageInput");
const removeImageBtn = document.getElementById("removeImageBtn");

if (expImageInput) {
  expImageInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const errorEl = document.getElementById("expenseError");
    if (errorEl) errorEl.textContent = t("uploadingBill") || "Uploading bill...";

    const formData = new FormData();
    formData.append("bill", file);

    try {
      const res = await fetch(`${apiBase}/upload-bill`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (errorEl) errorEl.textContent = t(data.error) || "Upload failed";
        return;
      }
      if (errorEl) errorEl.textContent = "";
      currentImageUrl = data.image_url;
      const previewImg = document.getElementById("imagePreview");
      if (previewImg) previewImg.src = currentImageUrl;
      const previewContainer = document.getElementById("imagePreviewContainer");
      if (previewContainer) previewContainer.classList.remove("hidden");
    } catch (err) {
      if (errorEl) errorEl.textContent = "Upload failed";
    }
  });
}

if (removeImageBtn) {
  removeImageBtn.addEventListener("click", () => {
    currentImageUrl = null;
    const previewContainer = document.getElementById("imagePreviewContainer");
    if (previewContainer) previewContainer.classList.add("hidden");
    const expImgInput = document.getElementById("expImageInput");
    if (expImgInput) expImgInput.value = "";
  });
}

function openLightbox(src) {
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  if (modal && img) {
    img.src = src;
    modal.classList.remove("hidden");
  }
}

const closeLightboxBtn = document.getElementById("closeLightbox");
const lightboxModal = document.getElementById("lightboxModal");

if (closeLightboxBtn && lightboxModal) {
  closeLightboxBtn.addEventListener("click", () => {
    lightboxModal.classList.add("hidden");
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.add("hidden");
    }
  });
}
