(function () {
  const root   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const DARK   = 'dark';
  const LIGHT  = 'light';

  function systemDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    localStorage.setItem('iprd-theme', t);
  }

  // Init: stored pref → else follow browser
  const stored = localStorage.getItem('iprd-theme');
  applyTheme(stored || (systemDark() ? DARK : LIGHT));

  // Follow browser changes when no manual override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('iprd-theme')) applyTheme(e.matches ? DARK : LIGHT);
  });

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === DARK ? LIGHT : DARK);
  });
})();
