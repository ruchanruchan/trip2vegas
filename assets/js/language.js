/* ============================================================
   LANGUAGE MODULE - Bilingual EN/TR Toggle System
   Manages language switching and persistence via localStorage.
   CSS handles visibility via html[data-lang] attribute.
   ============================================================ */

const Language = (() => {
  const STORAGE_KEY = 'trip2vegas_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'tr'];

  let currentLang = DEFAULT_LANG;

  /**
   * Initialize language system.
   * Reads saved preference or browser language, applies it.
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) {
      currentLang = saved;
    } else {
      // Detect browser language
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      currentLang = SUPPORTED.includes(browserLang) ? browserLang : DEFAULT_LANG;
    }
    apply(currentLang);
    updateButtons();
  }

  /**
   * Set language and persist it.
   * @param {string} lang - 'en' or 'tr'
   */
  function set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
    updateButtons();
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  }

  /**
   * Toggle between EN and TR.
   */
  function toggle() {
    set(currentLang === 'en' ? 'tr' : 'en');
  }

  /**
   * Get current language.
   * @returns {string}
   */
  function get() {
    return currentLang;
  }

  /**
   * Apply language to DOM.
   * Sets data-lang attribute on <html> and updates lang attribute.
   */
  function apply(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'tr' ? 'tr' : 'en');
  }

  /**
   * Update toggle button active states.
   */
  function updateButtons() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang-btn');
      btn.classList.toggle('active', btnLang === currentLang);
    });
  }

  /**
   * Get translated string from a data object.
   * @param {object} obj - { en: '...', tr: '...' }
   * @returns {string}
   */
  function t(obj) {
    if (!obj) return '';
    return obj[currentLang] || obj[DEFAULT_LANG] || '';
  }

  return { init, set, toggle, get, t };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Language.init();
});
