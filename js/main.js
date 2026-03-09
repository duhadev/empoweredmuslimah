/**
 * EMMA Foundation - Main JavaScript
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSubscribeForms();
  setCurrentYear();
});

/**
 * Navigation functionality
 */
function initNavigation() {
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close nav when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
}

/**
 * Donation redirect function
 */
function goToDonate(event) {
  if (event) {
    event.preventDefault();
  }

  if (typeof CONFIG !== 'undefined' && CONFIG.donationUrl) {
    window.open(CONFIG.donationUrl, '_blank', 'noopener,noreferrer');
  } else {
    console.warn('Donation URL not configured. Please update config.js');
    alert('Donation link coming soon. Please check back later.');
  }
}

/**
 * Subscribe form handling
 */
function initSubscribeForms() {
  // Main email CTA form
  const mainForm = document.getElementById('subscribe-form');
  if (mainForm) {
    mainForm.addEventListener('submit', handleSubscribe);
  }

  // Footer subscribe form
  const footerForm = document.getElementById('footer-subscribe-form');
  if (footerForm) {
    footerForm.addEventListener('submit', handleFooterSubscribe);
  }
}

/**
 * Handle main subscribe form submission
 */
async function handleSubscribe(event) {
  event.preventDefault();

  const form = event.target;
  const nameInput = form.querySelector('#subscribe-name');
  const emailInput = form.querySelector('#subscribe-email');
  const messageEl = document.getElementById('form-message');
  const submitBtn = form.querySelector('button[type="submit"]');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showMessage(messageEl, 'Please fill in all fields.', 'error');
    return;
  }

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(messageEl, 'JazakAllahu Khairan! You have been subscribed.', 'success');
      form.reset();
    } else {
      showMessage(messageEl, data.error || 'Something went wrong. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Subscribe error:', error);
    showMessage(messageEl, 'Unable to connect. Please try again later.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Subscribe';
  }
}

/**
 * Handle footer subscribe form submission
 */
async function handleFooterSubscribe(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  const email = emailInput.value.trim();

  if (!email) {
    alert('Please enter your email address.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: '', email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('JazakAllahu Khairan! You have been subscribed.');
      form.reset();
    } else {
      alert(data.error || 'Something went wrong. Please try again.');
    }
  } catch (error) {
    console.error('Subscribe error:', error);
    alert('Unable to connect. Please try again later.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Subscribe';
  }
}

/**
 * Show form message
 */
function showMessage(element, message, type) {
  if (!element) return;

  element.textContent = message;
  element.className = 'email-cta__message ' + type;

  // Clear message after 5 seconds
  setTimeout(() => {
    element.textContent = '';
    element.className = 'email-cta__message';
  }, 5000);
}

/**
 * Set current year in footer
 */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
