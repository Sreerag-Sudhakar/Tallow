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
