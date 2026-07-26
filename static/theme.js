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

