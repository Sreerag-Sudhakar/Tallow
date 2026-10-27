/* Tallow landing page: interactive parts only. Everything works without JS; this layers on top. */

/* ---------- Mobile menu ---------- */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

function setMenu(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navMenu.classList.toggle('is-open', open);
}

navToggle.addEventListener('click', () => {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

// Esc closes the menu and returns focus to the toggle
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    setMenu(false);
    navToggle.focus();
  }
});

// Choosing a link closes the menu
navMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

/* ---------- Active nav link on scroll ---------- */
// Marks the first linked section (in page order) that overlaps the top band of the viewport.
// The band starts 16px below the 64px header so the previous section's sub-pixel edge doesn't count.
const navLinks = [...navMenu.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.hash));
const visible = new Set();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) visible.add(entry.target);
    else visible.delete(entry.target);
  });
  const current = sections.find((section) => visible.has(section));
  navLinks.forEach((link) => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-80px 0px -60% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Pricing toggle ---------- */
const billingButtons = document.querySelectorAll('[data-billing]');
const billingStatus = document.getElementById('billing-status');

// period: 'monthly' | 'yearly'. Swaps every price that has data-monthly/data-yearly.
function setBilling(period) {
  billingButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.billing === period));
  });
  document.querySelectorAll('[data-monthly]').forEach((el) => {
    el.textContent = el.dataset[period];
  });
  billingStatus.textContent = `Showing ${period} prices.`;
}

billingButtons.forEach((button) => {
  button.addEventListener('click', () => setBilling(button.dataset.billing));
});

/* ---------- FAQ accordion ---------- */
// Answers ship open (readable without JS). Collapse them here; each question toggles on its own.
document.querySelectorAll('.faq-q').forEach((button) => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));

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

function showMessage(key, state) {
  formMessage.textContent = MESSAGES[key];
  formMessage.dataset.state = state;
}

function setSending(sending) {
  submitButton.disabled = sending;
  waitlistForm.setAttribute('aria-busy', String(sending));
}

// JS takes over validation so messages are ours, not the browser's bubbles
waitlistForm.noValidate = true;

waitlistForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitButton.disabled) return; // a request is already in flight

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

  try {
    if (isDemoMode()) {
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
    showMessage('success', 'success');
  } catch {
    showMessage('error', 'error'); // email stays in the field for a retry
  } finally {
    setSending(false);
  }
});

// Editing the field clears the error state
emailInput.addEventListener('input', () => {
  if (emailInput.hasAttribute('aria-invalid')) {
    emailInput.removeAttribute('aria-invalid');
    formMessage.textContent = '';
    delete formMessage.dataset.state;
  }
});
