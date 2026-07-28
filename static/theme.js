(function () {
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.checked = theme === 'dark';
  }

  const saved = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(saved);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.addEventListener('change', () => apply(toggle.checked ? 'dark' : 'light'));
  });
})();


window.customAlert = function(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-dialog-overlay';
    const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.innerHTML = `
      <div class="custom-dialog-msg">${msg}</div>
      <div class="custom-dialog-actions">
        <button class="custom-dialog-btn custom-dialog-ok">OK</button>
      </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    const okBtn = box.querySelector('.custom-dialog-ok');
    okBtn.focus();
    okBtn.onclick = () => { overlay.remove(); resolve(); };
  });
};

window.customPrompt = function(msg, defaultVal = '') {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-dialog-overlay';
    const box = document.createElement('div');
    box.className = 'custom-dialog-box';
    box.innerHTML = `
      <div class="custom-dialog-msg">${msg}</div>
      <input type="text" class="custom-dialog-input" value="${defaultVal}" />
      <div class="custom-dialog-actions">
        <button class="custom-dialog-btn custom-dialog-cancel">Hủy</button>
        <button class="custom-dialog-btn custom-dialog-ok">OK</button>
      </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    const input = box.querySelector('input');
    const okBtn = box.querySelector('.custom-dialog-ok');
    const cancelBtn = box.querySelector('.custom-dialog-cancel');
    input.focus();
    const close = (val) => { overlay.remove(); resolve(val); };
    okBtn.onclick = () => close(input.value);
    cancelBtn.onclick = () => close(null);
    input.onkeydown = (e) => {
      if (e.key === 'Enter') close(input.value);
      if (e.key === 'Escape') close(null);
    };
  });
};
