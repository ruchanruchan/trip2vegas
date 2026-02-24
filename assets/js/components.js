/* ============================================================
   COMPONENTS MODULE - Shared Header/Footer Loader
   Fetches HTML fragments and injects them into each page.
   ============================================================ */

const Components = (() => {
  /**
   * Determine the base path to /components/ relative to current page.
   * Pages at root: ''
   * Pages in /pages/tours/: '../../'
   */
  function getBasePath() {
    const path = window.location.pathname;
    // Count depth from root
    const segments = path.split('/').filter(s => s && !s.includes('.'));
    // If on Azure SWA, paths may be rewritten — check for /pages/ prefix
    if (segments.length >= 2) return '../../';
    if (segments.length === 1) return '../';
    return '';
  }

  /**
   * Load an HTML fragment into a target element.
   * @param {string} url - path to HTML fragment
   * @param {string} targetSelector - CSS selector for target element
   */
  async function load(url, targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to load ${url}`);
      const html = await resp.text();
      target.innerHTML = html;
    } catch (err) {
      console.warn(`Components: Could not load ${url}`, err);
    }
  }

  /**
   * Initialize all shared components.
   * Call this on every page.
   */
  async function init() {
    const base = getBasePath();

    await Promise.all([
      load(base + 'components/header.html', '#header-placeholder'),
      load(base + 'components/footer.html', '#footer-placeholder'),
    ]);

    // Re-apply language to newly loaded content
    if (typeof Language !== 'undefined') {
      Language.init();
    }

    // Initialize header behavior
    initHeader();

    // Mark page as loaded (removes loading state)
    document.body.classList.add('page-loaded');
    document.body.classList.remove('page-loading');
  }

  /**
   * Set up header scroll behavior and mobile menu.
   */
  function initHeader() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.header__menu-btn');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.nav__overlay');

    if (!header) return;

    // Scroll effect: add background on scroll
    const onScroll = () => {
      header.classList.toggle('header--scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check

    // Mobile menu toggle
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.contains('active');
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', () => {
          nav.classList.remove('active');
          menuBtn.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      // Close on nav link click (mobile)
      nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          menuBtn.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Language toggle buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-btn');
        Language.set(lang);
      });
    });

    // Highlight current page in nav
    highlightCurrentPage();
  }

  /**
   * Highlight the current page link in navigation.
   */
  function highlightCurrentPage() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Normalize paths for comparison
      const linkPath = new URL(href, window.location.origin).pathname;
      const isActive = path === linkPath ||
        (path.endsWith('/') && linkPath === path) ||
        (path.includes('/tours') && href.includes('/tours')) ||
        (path.includes('/about') && href.includes('/about')) ||
        (path.includes('/contact') && href.includes('/contact'));

      if (isActive) {
        link.classList.add('active');
      }
    });
  }

  return { init, load, getBasePath };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Components.init();
});
