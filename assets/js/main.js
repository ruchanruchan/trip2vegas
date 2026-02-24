/* ============================================================
   MAIN JS - Core Site Functionality
   Scroll animations, back-to-top, smooth scroll, utilities
   ============================================================ */

const App = (() => {
  /**
   * Initialize all core functionality.
   */
  function init() {
    initScrollAnimations();
    initBackToTop();
    initSmoothScroll();
  }

  /**
   * Intersection Observer for fade-in animations.
   * Elements with .fade-in, .fade-in-left, .fade-in-right
   * get .visible class when scrolled into view.
   */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  /**
   * Back-to-top button.
   * Shows after scrolling 500px, scrolls to top on click.
   */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Smooth scroll for anchor links.
   * Offsets by header height.
   */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      ) || 70;

      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  /**
   * Format price with currency symbol.
   * @param {number} amount
   * @param {string} currency - 'USD' or 'TRY'
   * @returns {string}
   */
  function formatPrice(amount, currency = 'USD') {
    if (!amount || amount === 0) return '';
    return new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Debounce utility.
   */
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  return { init, formatPrice, debounce };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
