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
