# Tallow Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page waitlist landing page for Tallow, a fictional habit-tracking app, as a portfolio sample.

**Architecture:** One static `index.html` with semantic sections, one stylesheet (mobile-first, custom properties), and one small vanilla JS file that runs only the interactive parts. No build step. It is served locally with `python -m http.server` for testing.

**Tech Stack:** HTML, CSS, vanilla JS, Google Fonts (Newsreader + Manrope), Formspree (placeholder endpoint).

**Spec:** The user's brief (pasted in session, 2026-10-27), with the decisions below.

## Decisions (from brainstorming)

- **Direction:** A, "Night shift". Warm and dark, with Soot lifted off near-black. No glows and no gradient washes.
- **Differentiator:** Forgiving streaks. A missed day dims the streak instead of resetting it.
- **Headline:** "Miss a day. Keep the habit." (searched; no exact match found).
- **Prices:** Free $0. Pro $5/mo or $48/yr. Team $4 per seat/mo or $38 per seat/yr. Pro is highlighted.
- **Form:** Formspree `fetch` POST. The endpoint is a marked `FORMSPREE_ENDPOINT` placeholder.
- **Deploy docs:** Both Netlify and Vercel, short.

### Palette (measured WCAG ratios)

| Token | Hex | Role |
|---|---|---|
| `--soot` | `#2B2621` | Page background |
| `--hearth` | `#36302A` | Raised surfaces (phone body, pricing cards) |
| `--bone` | `#EFE8DA` | Primary text |
| `--ash` | `#ABA597` | Secondary text, outlines, missed-day mark |
| `--wick` | `#E8A33D` | CTAs, links, focus ring |
| `--moss` | `#9CAD72` | Real states only: completed days, success message |
| `--rust` | `#F2967A` | Functional only: form error text and border |

Pairs that must hold (AA, 4.5 for text, 3.0 for UI): bone/soot 12.29, bone/hearth 10.68, ash/soot 6.11, ash/hearth 5.31, wick/soot 6.95, wick/hearth 6.04, soot-on-wick (button text) 6.95, moss/soot 6.16, moss/hearth 5.35, soot-on-moss (check tick) 6.16, rust/soot 6.72, rust/hearth 5.84.

### Streak grid (the memorable element)

- 28 cells in a 7×4 grid inside the hero phone.
- **Completed:** Moss fill plus a Soot check tick.
- **Day 19 (missed):** No fill, a dashed Ash outline, and a diagonal slash. It reads as missed through shape, not color. Day 20 continues the run, and the label below the grid reads "27 of 28 days".
- **Day 28 (today):** Wick ring.
- The grid is `role="img"` with `aria-label="Streak calendar: 27 of the last 28 days done. Day 19 missed, streak kept."`
- **Load moment:** Cells fill in sequence (about 40 ms stagger, about 1.2 s total). With `prefers-reduced-motion: reduce`, the final state renders immediately with no transition.

## Global Constraints

- Files: `index.html`, `css/styles.css`, `js/main.js`, `assets/`, `README.md`. No other runtime files and no dependencies.
- Mobile-first, 360px up to wide desktop, no horizontal scroll at 360px.
- No purple-blue gradients, no all-caps eyebrows, no identical soft-shadow cards, no glows, no flame or candle imagery.
- Footer and README contain exactly: "Tallow is a fictional product created as a design and development sample."
- CTAs name the action ("Join the waitlist"). No lorem ipsum.
- Visible `:focus-visible` ring (Wick, 2px, offset) on every interactive element.
- Lighthouse 90+ in all four categories, measured.

## Review Focus

1. **Keyboard user opens the mobile menu:** Focus stays on the toggle and the next Tab reaches the first link (disclosure pattern). Esc closes the menu and returns focus to the hamburger, Tab doesn't reach hidden links, and tabbing or clicking out of the nav closes it. Pinned in Task 1.
2. **Form submitted twice, or the network fails:** The button is disabled while sending, an error message appears and is announced, and the typed email is kept. Pinned in Task 9.
3. **Email with spaces or uppercase letters:** It is trimmed before validating, and `name@site` (no TLD) is rejected. Pinned in Task 9.
4. **Pricing toggle with a screen reader:** The toggle is a real control (`aria-pressed` or radio group), and price changes are perceivable. Pinned in Task 7.
5. **JS disabled:** FAQ answers stay readable, the nav links still work, and the form still posts. Pinned in Tasks 1, 8 and 9.

---

Each task ends with "show the user and wait" (the user reviews section by section) and a commit.

### Task 0: Scaffold, tokens, type scale, meta

**Files:** Create `index.html`, `css/styles.css`, `js/main.js`, `assets/favicon.svg`, `assets/og.png` (generated from an SVG at 1200×630), `.gitignore`.

- [ ] `git init`, then add the folder structure.
- [ ] `index.html` gets `lang="en"`, title, description, OG and Twitter tags, the favicon, and font `preconnect` plus one Google Fonts link with `display=swap`.
- [ ] `styles.css` gets the palette tokens above, a fluid type scale (`--step--1` to `--step-4` with `clamp()`), spacing tokens, a reset, and the focus ring style.
- [ ] Add a skip link to `#main`.
- **Done-check:** The page serves at `localhost:8000` with no console errors, the tokens match the table, and Tab shows the skip link first.

### Task 1: Navbar, mobile menu, smooth scroll, active link

**Files:** Modify `index.html`, `styles.css`, `main.js`.

- [ ] The sticky header holds the logo (an inline SVG wordmark), anchor links (Features, How it works, Pricing, FAQ) and a "Join the waitlist" CTA.
- [ ] The hamburger is a `<button aria-expanded aria-controls>`. It handles Esc to close and returns focus to itself. Closed links are `hidden`.
- [ ] Smooth scrolling uses CSS `scroll-behavior` wrapped in a no-preference media query, with `scroll-margin-top` set to the header height.
- [ ] An `IntersectionObserver` sets `aria-current="true"` on the link for the section in view.
- **Done-check:** At 360px the menu opens and closes by mouse, Enter and Esc, and focus returns to the button. At desktop the active link updates while scrolling. With JS off, the links are visible and work.

### Task 2: Hero with phone mockup and streak grid

**Files:** Modify `index.html`, `styles.css`, `main.js`.

- [ ] Headline "Miss a day. Keep the habit.", a one-line subheadline, primary CTA "Join the waitlist" (to `#waitlist`) and secondary CTA "See how it works".
- [ ] The phone is built in CSS (a Hearth body). The grid follows the Streak grid spec above.
- [ ] The animation is a CSS class added by JS once fonts load. The reduced-motion path renders the final state.
- **Done-check:** With emulated reduced motion, the full grid shows on first paint. Day 19 is distinguishable in a grayscale screenshot. The `aria-label` is present. No layout shift (the CLS score in Task 11 holds).

### Task 3: Social proof strip

- [ ] One line: "12,400 people on the waitlist · 4.8 from 900 beta testers". The stars are inline SVG with a text equivalent.
- **Done-check:** It reads correctly when announced, and it wraps cleanly at 360px.

### Task 4: Features (5)

- [ ] Five benefit-led items with inline SVG icons (`aria-hidden`): forgiving streaks, a 10-second check-in, a gentle evening nudge, a weekly look-back, and private by default.
- [ ] The layout is a varied grid, not identical cards. Forgiving streaks gets the wide slot.
- **Done-check:** Heading order is h2 then h3, and there are no orphan icons when read aloud.

### Task 5: How it works (3 steps)

- [ ] An ordered list `<ol>` with large Newsreader numerals: pick one habit, check in nightly, let a missed day pass.
- **Done-check:** It is an `<ol>` in the DOM, and it stacks at 360px.

### Task 6: Testimonials (3)

- [ ] Three `<figure>` elements with `<blockquote>` and `<figcaption>` (name and role). Avatars are initials in SVG with no photos.
- **Done-check:** The quotes are specific, not generic praise, and the markup is valid.

### Task 7: Pricing with toggle

**Interfaces:** Each price element carries `data-monthly` and `data-yearly`. `setBilling(period: 'monthly'|'yearly')` updates the text and the "/mo" or "/yr" suffix.

- [ ] The toggle is two buttons in a group with `aria-pressed`. A polite live region announces "Showing yearly prices".
- [ ] Pro is highlighted through its border, position and a "Most picked" label (sentence case), not a glow.
- **Done-check:** Clicking and keyboard both switch all three prices to the exact values in Decisions. The screen reader hears the change. With JS off, monthly prices show.

### Task 8: FAQ accordion

- [ ] Each question is an `<h3><button aria-expanded aria-controls>` with a panel. Enter and Space toggle it, and panels open independently.
- [ ] Without JS, all panels render open. JS collapses them on init.
- [ ] 5 to 6 questions, including what happens on a missed day, platforms and launch date, data privacy, and team billing.
- **Done-check:** Tab reaches every question, `aria-expanded` flips, and panels are hidden from the accessibility tree when closed.

### Task 9: Final CTA and waitlist form

**Interfaces:** `validateEmail(value: string) -> ''|'empty'|'format'`. Form states: `idle`, `sending`, `success`, `error`.

- [ ] There is a `<label>`, `type="email"`, `autocomplete="email"` and `novalidate`. Custom messages go in an `aria-live` region linked with `aria-describedby`, and `aria-invalid` is set on error.
- [ ] Messages:
  - Empty: "Add your email so we can save your spot."
  - Format: "That email looks incomplete. Check for a typo?"
  - Success (Moss): "You're on the list. We'll write once, when Tallow is ready."
  - Network error (Rust): "That didn't go through. Your email is still here, so try again."
- [ ] `const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // REPLACE` sits at the top of `main.js`. The form `action` holds the same value as a no-JS fallback.
- **Done-check:** Test each case: empty, `  A@B.COM  ` (accepted), `name@site` (rejected), success (with `fetch` mocked to 200), network failure (with the placeholder endpoint or offline), and double-click (one request).

### Task 10: Footer and README

- [ ] The footer has link columns, social icons (inline SVG with `aria-label`) and the fictional-product line.
- [ ] The README covers the description, the fictional line, local setup, where to put the Formspree ID, and Netlify and Vercel deploy steps.
- **Done-check:** The fictional line appears verbatim in both files (checked with `grep`).

### Task 11: Verification pass

- [ ] Take screenshots at 360×800 and 1440×900 and check for horizontal overflow (`scrollWidth === clientWidth`).
- [ ] Run a scripted keyboard pass through the whole page and the form states from Task 9.
- [ ] Run Lighthouse (mobile and desktop) and record the real scores.
- [ ] Re-measure contrast against the shipped CSS, and remove unused CSS (Coverage check).
- **Done-check:** All four Lighthouse categories are 90 or above on both runs, with numbers reported. Any failure goes through systematic debugging.

### Task 12: Independent review

- [ ] Dispatch a review agent for design critique and accessibility, read-only.
- [ ] Triage the findings with the user, then fix the approved ones.
- **Done-check:** Each finding is marked as fixed, skipped (with a reason), or not needed.

### Task 13: Finish

- [ ] Write the manual test checklist in the README, confirm the deploy steps, suggest 3 gallery screenshots, and write the one-line case-study caption.
- **Done-check:** The user has everything needed to deploy and post.
