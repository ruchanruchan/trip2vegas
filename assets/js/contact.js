/* ============================================================
   CONTACT MODULE - Contact Form Handling
   Validates and submits form via Formspree (Phase 1)
   or Azure Functions API (Phase 2+).
   ============================================================ */

const Contact = (() => {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpznqkdl'; // Replace with actual Formspree ID

  /**
   * Initialize the contact form.
   */
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Pre-fill tour interest from URL param
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    if (tourParam) {
      const tourSelect = form.querySelector('#tour-interest');
      if (tourSelect) {
        // Try to match the tour name to an option
        for (const option of tourSelect.options) {
          if (option.value.toLowerCase() === tourParam.toLowerCase()) {
            option.selected = true;
            break;
          }
        }
        // If no match, set the "Other" option and fill in
        const otherInput = form.querySelector('#tour-other');
        if (otherInput) {
          otherInput.value = tourParam;
        }
      }
    }
  }

  /**
   * Handle form submission.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Validate
    if (!validate(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span data-lang-en>Sending...</span>
      <span data-lang-tr>Gönderiliyor...</span>
    `;
    if (typeof Language !== 'undefined') {
      document.documentElement.setAttribute('data-lang', Language.get());
    }

    try {
      const formData = new FormData(form);

      const resp = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (resp.ok) {
        showMessage('success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      console.error('Contact: submission error', err);
      showMessage('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (typeof Language !== 'undefined') {
        document.documentElement.setAttribute('data-lang', Language.get());
      }
    }
  }

  /**
   * Basic form validation.
   */
  function validate(form) {
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      clearFieldError(field);

      if (!field.value.trim()) {
        showFieldError(field, {
          en: 'This field is required',
          tr: 'Bu alan zorunludur'
        });
        valid = false;
      }

      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          showFieldError(field, {
            en: 'Please enter a valid email address',
            tr: 'Lütfen geçerli bir e-posta adresi girin'
          });
          valid = false;
        }
      }
    });

    return valid;
  }

  /**
   * Show field-level validation error.
   */
  function showFieldError(field, message) {
    field.style.borderColor = 'var(--color-red)';
    const error = document.createElement('span');
    error.className = 'field-error';
    error.style.cssText = 'color: var(--color-red-light); font-size: var(--text-xs); display: block; margin-top: var(--space-1);';
    error.innerHTML = `
      <span data-lang-en>${message.en}</span>
      <span data-lang-tr>${message.tr}</span>
    `;
    field.parentNode.appendChild(error);
    if (typeof Language !== 'undefined') {
      document.documentElement.setAttribute('data-lang', Language.get());
    }
  }

  /**
   * Clear field error.
   */
  function clearFieldError(field) {
    field.style.borderColor = '';
    const existing = field.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
  }

  /**
   * Show success/error message.
   */
  function showMessage(type) {
    const container = document.getElementById('form-message');
    if (!container) return;

    const messages = {
      success: {
        en: 'Thank you! We\'ll get back to you within 24 hours.',
        tr: 'Teşekkürler! 24 saat içinde size geri döneceğiz.',
      },
      error: {
        en: 'Something went wrong. Please try again or email us directly.',
        tr: 'Bir sorun oluştu. Lütfen tekrar deneyin veya bize doğrudan e-posta gönderin.',
      },
    };

    container.className = `alert alert--${type}`;
    container.innerHTML = `
      <span data-lang-en>${messages[type].en}</span>
      <span data-lang-tr>${messages[type].tr}</span>
    `;
    container.style.display = 'block';

    if (typeof Language !== 'undefined') {
      document.documentElement.setAttribute('data-lang', Language.get());
    }

    // Auto-hide after 8 seconds
    setTimeout(() => {
      container.style.display = 'none';
    }, 8000);
  }

  return { init };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Contact.init();
});
