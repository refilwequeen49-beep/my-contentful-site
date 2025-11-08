// Simple theme switcher with persistence
(function(){
  const THEMES = ['light','dark','solarized'];
  const defaultTheme = 'light';
  const storageKey = 'site-theme';

  function applyTheme(name){
    THEMES.forEach(t => document.documentElement.classList.remove('theme-' + t));
    document.documentElement.classList.add('theme-' + name);
    localStorage.setItem(storageKey, name);
  }

  function getSavedTheme(){
    const saved = localStorage.getItem(storageKey);
    if(saved && THEMES.includes(saved)) return saved;
    // Fallback to OS preference if available
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      return 'dark';
    }
    return defaultTheme;
  }

  function initControls(){
    const select = document.getElementById('theme-select');
    const toggle = document.getElementById('toggle-theme');
    if(select) select.value = getSavedTheme();

    if(select){
      select.addEventListener('change', () => {
        const chosen = select.value;
        if(THEMES.includes(chosen)) applyTheme(chosen);
      });
    }

    if(toggle){
      toggle.addEventListener('click', () => {
        const current = localStorage.getItem(storageKey) || getSavedTheme();
        const idx = THEMES.indexOf(current);
        const next = THEMES[(idx + 1) % THEMES.length];
        applyTheme(next);
        if(select) select.value = next;
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themeToApply = getSavedTheme();
    applyTheme(themeToApply);
    initControls();
  });
})();