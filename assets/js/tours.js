/* ============================================================
   TOURS MODULE - Tour Catalog & Detail Page Logic
   Loads tours from JSON, renders cards, filters by category,
   handles search, and renders tour detail pages.
   ============================================================ */

const Tours = (() => {
  let allTours = [];
  let filteredTours = [];
  let currentCategory = 'all';

  /**
   * Initialize the tours module.
   * Determines if we're on catalog or detail page and acts accordingly.
   */
  async function init() {
    const catalog = document.getElementById('tours-grid');
    const detail = document.getElementById('tour-detail');

    if (catalog) {
      await loadTours();
      renderCatalog();
      initFilters();
      initSearch();
    }

    if (detail) {
      await loadTours();
      renderDetail();
    }
  }

  /**
   * Load tours data from JSON file.
   */
  async function loadTours() {
    try {
      const base = Components.getBasePath();
      const resp = await fetch(base + 'data/tours.json');
      if (!resp.ok) throw new Error('Failed to load tours data');
      const data = await resp.json();
      allTours = data.tours || [];
      filteredTours = [...allTours];
    } catch (err) {
      console.error('Tours: Failed to load data', err);
      allTours = [];
      filteredTours = [];
    }
  }

  /**
   * Render the tour catalog grid.
   */
  function renderCatalog() {
    const grid = document.getElementById('tours-grid');
    if (!grid) return;

    if (filteredTours.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state__icon">🎰</div>
          <h3>
            <span data-lang-en>No tours found</span>
            <span data-lang-tr>Tur bulunamadı</span>
          </h3>
          <p>
            <span data-lang-en>Try a different category or search term.</span>
            <span data-lang-tr>Farklı bir kategori veya arama terimi deneyin.</span>
          </p>
        </div>`;
      reapplyLanguage();
      return;
    }

    grid.innerHTML = filteredTours.map((tour, i) => renderCard(tour, i)).join('');
    reapplyLanguage();

    // Re-trigger scroll animations on new cards
    if (typeof App !== 'undefined') {
      App.init();
    }
  }

  /**
   * Render a single tour card.
   */
  function renderCard(tour, index) {
    const lang = typeof Language !== 'undefined' ? Language.get() : 'en';
    const delay = (index % 6) + 1;
    const categoryLabels = {
      adventure: { en: 'Adventure', tr: 'Macera' },
      entertainment: { en: 'Entertainment', tr: 'Eğlence' },
      sightseeing: { en: 'Sightseeing', tr: 'Gezi' },
      dining: { en: 'Dining & Hospitality', tr: 'Yeme & İçme' },
    };
    const catLabel = categoryLabels[tour.category] || { en: tour.category, tr: tour.category };

    const priceDisplay = tour.price
      ? `$${tour.price}`
      : `<span data-lang-en>Request Quote</span><span data-lang-tr>Fiyat Sorun</span>`;

    const base = Components.getBasePath();
    const detailUrl = base + 'pages/tours/detail.html?slug=' + tour.slug;

    return `
      <div class="card fade-in stagger-${delay}">
        <div class="card__image" style="background: linear-gradient(135deg, var(--color-black-lighter), var(--color-black-light)); display:flex; align-items:center; justify-content:center; font-size:3rem;">
          ${tour.icon || '🎲'}
        </div>
        <div class="card__body">
          <span class="card__category">
            <span data-lang-en>${catLabel.en}</span>
            <span data-lang-tr>${catLabel.tr}</span>
          </span>
          <h3 class="card__title">
            <span data-lang-en>${tour.name.en}</span>
            <span data-lang-tr>${tour.name.tr}</span>
          </h3>
          <p class="card__description">
            <span data-lang-en>${tour.description.en}</span>
            <span data-lang-tr>${tour.description.tr}</span>
          </p>
          <div class="card__meta">
            <span class="card__meta-item">⏱ ${tour.duration}</span>
            ${tour.groupSize ? `<span class="card__meta-item">👥 ${tour.groupSize}</span>` : ''}
          </div>
          <div class="card__footer">
            <div>
              <span class="card__price-label">
                <span data-lang-en>From</span>
                <span data-lang-tr>Başlayan</span>
              </span>
              <span class="card__price">${priceDisplay}</span>
            </div>
            <a href="${detailUrl}" class="btn btn--outline btn--sm">
              <span data-lang-en>Details</span>
              <span data-lang-tr>Detaylar</span>
            </a>
          </div>
        </div>
      </div>`;
  }

  /**
   * Initialize filter tabs.
   */
  function initFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        currentCategory = category;

        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        filterTours();
      });
    });
  }

  /**
   * Initialize search input.
   */
  function initSearch() {
    const searchInput = document.querySelector('.search-bar__input');
    if (!searchInput) return;

    const debouncedSearch = typeof App !== 'undefined'
      ? App.debounce(filterTours, 300)
      : filterTours;

    searchInput.addEventListener('input', debouncedSearch);
  }

  /**
   * Filter tours by category and search query.
   */
  function filterTours() {
    const searchInput = document.querySelector('.search-bar__input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    filteredTours = allTours.filter(tour => {
      // Category filter
      const matchCategory = currentCategory === 'all' || tour.category === currentCategory;

      // Search filter (search in both languages)
      const matchSearch = !query ||
        tour.name.en.toLowerCase().includes(query) ||
        tour.name.tr.toLowerCase().includes(query) ||
        tour.description.en.toLowerCase().includes(query) ||
        tour.description.tr.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });

    renderCatalog();
    updateResultCount();
  }

  /**
   * Update the visible result count.
   */
  function updateResultCount() {
    const countEl = document.getElementById('tours-count');
    if (countEl) {
      countEl.textContent = filteredTours.length;
    }
  }

  /**
   * Render the tour detail page.
   */
  function renderDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    const tour = allTours.find(t => t.slug === slug);

    if (!tour) {
      renderNotFound();
      return;
    }

    // Set page title
    document.title = `${tour.name.en} | Trip2Vegas`;

    // Render hero
    const heroContent = document.getElementById('tour-hero-content');
    if (heroContent) {
      const categoryLabels = {
        adventure: { en: 'Adventure', tr: 'Macera' },
        entertainment: { en: 'Entertainment', tr: 'Eğlence' },
        sightseeing: { en: 'Sightseeing', tr: 'Gezi' },
        dining: { en: 'Dining & Hospitality', tr: 'Yeme & İçme' },
      };
      const catLabel = categoryLabels[tour.category] || { en: tour.category, tr: tour.category };

      heroContent.innerHTML = `
        <div class="breadcrumb">
          <a href="${Components.getBasePath()}">
            <span data-lang-en>Home</span>
            <span data-lang-tr>Ana Sayfa</span>
          </a>
          <span class="breadcrumb__separator">›</span>
          <a href="index.html">
            <span data-lang-en>Tours</span>
            <span data-lang-tr>Turlar</span>
          </a>
          <span class="breadcrumb__separator">›</span>
          <span>
            <span data-lang-en>${tour.name.en}</span>
            <span data-lang-tr>${tour.name.tr}</span>
          </span>
        </div>
        <span class="badge badge--gold">
          <span data-lang-en>${catLabel.en}</span>
          <span data-lang-tr>${catLabel.tr}</span>
        </span>
        <h1>
          <span data-lang-en>${tour.name.en}</span>
          <span data-lang-tr>${tour.name.tr}</span>
        </h1>`;
    }

    // Render main content
    const mainContent = document.getElementById('tour-main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <h2>
          <span data-lang-en>About This Experience</span>
          <span data-lang-tr>Bu Deneyim Hakkında</span>
        </h2>
        <hr class="gold-line">
        <p style="font-size: var(--text-lg); line-height: 1.8;">
          <span data-lang-en>${tour.longDescription ? tour.longDescription.en : tour.description.en}</span>
          <span data-lang-tr>${tour.longDescription ? tour.longDescription.tr : tour.description.tr}</span>
        </p>

        ${tour.highlights ? `
        <h3 style="margin-top: var(--space-8);">
          <span data-lang-en>Highlights</span>
          <span data-lang-tr>Öne Çıkanlar</span>
        </h3>
        <ul class="tour-includes__list" style="margin-top: var(--space-4);">
          ${tour.highlights.map(h => `
            <li class="tour-includes__item">
              <span data-lang-en>${h.en}</span>
              <span data-lang-tr>${h.tr}</span>
            </li>
          `).join('')}
        </ul>` : ''}`;
    }

    // Render sidebar
    const sidebar = document.getElementById('tour-sidebar');
    if (sidebar) {
      const priceHtml = tour.price
        ? `<span class="card__price" style="font-size: var(--text-3xl);">$${tour.price}</span>
           <span class="card__price-label">
             <span data-lang-en>per person</span>
             <span data-lang-tr>kişi başı</span>
           </span>`
        : `<span class="card__price" style="font-size: var(--text-2xl);">
             <span data-lang-en>Request Quote</span>
             <span data-lang-tr>Fiyat Sorun</span>
           </span>`;

      sidebar.innerHTML = `
        <div style="text-align: center; margin-bottom: var(--space-6);">
          ${priceHtml}
        </div>

        <a href="${Components.getBasePath()}pages/contact/index.html?tour=${encodeURIComponent(tour.name.en)}" class="btn btn--gold btn--lg btn--full" style="margin-bottom: var(--space-6);">
          <span data-lang-en>Book Now</span>
          <span data-lang-tr>Şimdi Rezerve Et</span>
        </a>

        <div class="tour-info-item">
          <span>⏱</span>
          <span class="tour-info-item__label">
            <span data-lang-en>Duration</span>
            <span data-lang-tr>Süre</span>
          </span>
          <span class="tour-info-item__value">${tour.duration}</span>
        </div>

        ${tour.groupSize ? `
        <div class="tour-info-item">
          <span>👥</span>
          <span class="tour-info-item__label">
            <span data-lang-en>Group Size</span>
            <span data-lang-tr>Grup Büyüklüğü</span>
          </span>
          <span class="tour-info-item__value">${tour.groupSize}</span>
        </div>` : ''}

        ${tour.meetingPoint ? `
        <div class="tour-info-item">
          <span>📍</span>
          <span class="tour-info-item__label">
            <span data-lang-en>Meeting Point</span>
            <span data-lang-tr>Buluşma Noktası</span>
          </span>
          <span class="tour-info-item__value">
            <span data-lang-en>${tour.meetingPoint.en || tour.meetingPoint}</span>
            <span data-lang-tr>${tour.meetingPoint.tr || tour.meetingPoint}</span>
          </span>
        </div>` : ''}

        ${tour.included ? `
        <div class="tour-includes" style="margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid rgba(255,255,255,0.1);">
          <h4 style="font-size: var(--text-base); margin-bottom: var(--space-3);">
            <span data-lang-en>What's Included</span>
            <span data-lang-tr>Dahil Olanlar</span>
          </h4>
          <ul class="tour-includes__list">
            ${tour.included.map(item => `
              <li class="tour-includes__item">
                <span data-lang-en>${item.en}</span>
                <span data-lang-tr>${item.tr}</span>
              </li>
            `).join('')}
          </ul>
        </div>` : ''}`;
    }

    reapplyLanguage();
  }

  /**
   * Render 404 state for tour detail.
   */
  function renderNotFound() {
    const detail = document.getElementById('tour-detail');
    if (detail) {
      detail.innerHTML = `
        <div class="empty-state" style="padding: var(--space-24) var(--space-4);">
          <div class="empty-state__icon">🎰</div>
          <h2>
            <span data-lang-en>Tour Not Found</span>
            <span data-lang-tr>Tur Bulunamadı</span>
          </h2>
          <p>
            <span data-lang-en>The tour you're looking for doesn't exist or has been removed.</span>
            <span data-lang-tr>Aradığınız tur mevcut değil veya kaldırılmış.</span>
          </p>
          <a href="index.html" class="btn btn--gold" style="margin-top: var(--space-6);">
            <span data-lang-en>Browse All Tours</span>
            <span data-lang-tr>Tüm Turları Göz Atın</span>
          </a>
        </div>`;
      reapplyLanguage();
    }
  }

  /**
   * Re-apply language visibility to dynamically added content.
   */
  function reapplyLanguage() {
    if (typeof Language !== 'undefined') {
      const lang = Language.get();
      document.documentElement.setAttribute('data-lang', lang);
    }
  }

  /**
   * Get featured tours (for homepage).
   * @param {number} count
   * @returns {Array}
   */
  function getFeatured(count = 6) {
    return allTours.filter(t => t.featured).slice(0, count);
  }

  return { init, loadTours, getFeatured, renderCard };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Tours.init();
});
