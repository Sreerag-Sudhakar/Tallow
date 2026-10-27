/* Tallow landing page: interactive parts only. Everything works without JS; this layers on top. */

/* ---------- Mobile menu ---------- */
const siteNav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const isMenuOpen = () => navMenu.classList.contains('is-open');

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navMenu.classList.toggle('is-open', open);
}

navToggle.addEventListener('click', () => {
  setMenu(!isMenuOpen());
});

// Esc closes the menu; focus goes back to the toggle only if it was inside the menu
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen()) {
    const focusWasInside = siteNav.contains(document.activeElement);
    setMenu(false);
    if (focusWasInside) navToggle.focus();
  }
});

// Choosing a link closes the menu
navMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

// Tabbing out of the nav, or clicking anywhere else, closes it so the panel never covers focus
siteNav.addEventListener('focusout', (event) => {
  if (isMenuOpen() && !siteNav.contains(event.relatedTarget)) setMenu(false);
});

document.addEventListener('click', (event) => {
  if (isMenuOpen() && !siteNav.contains(event.target)) setMenu(false);
});

/* ---------- Active nav link on scroll ---------- */
// Watches every section against one line 30% down the viewport. The section crossing that line
// is "current"; if it has a nav link (sections like the waitlist don't), that link is marked.
const navLinks = [...navMenu.querySelectorAll('a[href^="#"]')];
const sections = [...document.querySelectorAll('main > section[id]')];
const crossing = new Set();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) crossing.add(entry.target);
    else crossing.delete(entry.target);
  });
  const current = sections.find((section) => crossing.has(section));
  navLinks.forEach((link) => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-30% 0px -70% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Pricing toggle ---------- */
const billingButtons = document.querySelectorAll('[data-billing]');
const billingStatus = document.getElementById('billing-status');

// period: 'monthly' | 'yearly'. Swaps every price that has data-monthly/data-yearly,
// then announces the new prices in words, e.g. "Pro $48 per year".
function setBilling(period) {
  billingButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.billing === period));
  });
  document.querySelectorAll('[data-monthly]').forEach((el) => {
    el.textContent = el.dataset[period];
  });
  const prices = [...document.querySelectorAll('.plan')]
    .filter((plan) => plan.querySelector('.price-amount[data-monthly]'))
    .map((plan) => [
      plan.querySelector('h3').textContent,
      plan.querySelector('.price-amount').textContent,
      plan.querySelector('.price-period .visually-hidden').textContent,
    ].join(' '));
  billingStatus.textContent = `Showing ${period} prices: ${prices.join(', ')}.`;
}

billingButtons.forEach((button) => {
  button.addEventListener('click', () => setBilling(button.dataset.billing));
});

/* ---------- FAQ accordion ---------- */
// Without JS each question is a plain heading over an open answer. Here each h3[data-controls]
// gets a real button (aria-expanded/aria-controls), its answer collapses, and each toggles on its own.
document.querySelectorAll('.faq-item h3[data-controls]').forEach((heading) => {
  const panel = document.getElementById(heading.dataset.controls);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'faq-q';
  button.setAttribute('aria-controls', panel.id);
  button.append(...heading.childNodes);
  button.insertAdjacentHTML('beforeend', '<span class="faq-icon" aria-hidden="true"></span>');
  heading.append(button);

  function setOpen(open) {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }

  setOpen(false);
  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
});

/* ---------- Waitlist form ---------- */
// Posts to the form's action URL. FORMSPREE PLACEHOLDER: set your form ID in index.html (form action).
const waitlistForm = document.querySelector('.waitlist-form');
const emailInput = document.getElementById('waitlist-email');
const formMessage = document.getElementById('waitlist-msg');
const submitButton = waitlistForm.querySelector('button[type="submit"]');

const MESSAGES = {
  sending: 'Saving your spot…',
  empty: 'Add your email so we can save your spot.',
  format: 'That email looks incomplete. Check for a typo?',
  success: 'You’re on the list. We’ll write once, when Tallow is ready.',
  error: 'That didn’t go through. Your email is still here, so try again.',
};

// DEMO MODE: while the action still holds the placeholder, valid emails get a simulated success
// and nothing is sent. Paste a real Formspree ID into the form action and this switches off.
const isDemoMode = () => waitlistForm.action.includes('YOUR_FORM_ID');

// Something@something.tld, with a TLD of 2+ characters and no spaces
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns '' when valid, otherwise the MESSAGES key for the problem.
function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'empty';
  return EMAIL_PATTERN.test(email) ? '' : 'format';
}

// Clear, then write on the next tick, so screen readers announce a message even if it repeats
let messageTimer;
function showMessage(key, state) {
  clearMessage();
  messageTimer = setTimeout(() => {
    formMessage.textContent = MESSAGES[key];
    formMessage.dataset.state = state;
  }, 50);
}

function clearMessage() {
  clearTimeout(messageTimer);
  formMessage.textContent = '';
  delete formMessage.dataset.state;
}

// aria-disabled instead of disabled: a focused button keeps focus; the flag blocks double submits
let sending = false;
function setSending(on) {
  sending = on;
  if (on) submitButton.setAttribute('aria-disabled', 'true');
  else submitButton.removeAttribute('aria-disabled');
}

// JS takes over validation so messages are ours, not the browser's bubbles
waitlistForm.noValidate = true;

waitlistForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending) return; // a request is already in flight

  const problem = validateEmail(emailInput.value);
  if (problem) {
    emailInput.setAttribute('aria-invalid', 'true');
    showMessage(problem, 'error');
    emailInput.focus();
    return;
  }

  emailInput.value = emailInput.value.trim();
  emailInput.removeAttribute('aria-invalid');
  setSending(true);
  showMessage('sending', 'pending');

  try {
    if (isDemoMode()) {
      console.warn('Tallow waitlist is in demo mode: no email was sent. Replace YOUR_FORM_ID in index.html to collect signups.');
      await new Promise((resolve) => setTimeout(resolve, 700));
    } else {
      const response = await fetch(waitlistForm.action, {
        method: 'POST',
        body: new FormData(waitlistForm),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
    }
    waitlistForm.reset();
    setSending(false);
    showMessage('success', 'success');
  } catch {
    setSending(false);
    showMessage('error', 'error'); // email stays in the field for a retry
  }
});

// Editing the field clears the error state
emailInput.addEventListener('input', () => {
  if (emailInput.hasAttribute('aria-invalid')) {
    emailInput.removeAttribute('aria-invalid');
    clearMessage();
  }
});

// Everything above ran: tell the page's load-time fallback that JS is really in charge
document.documentElement.classList.add('js-ready');
