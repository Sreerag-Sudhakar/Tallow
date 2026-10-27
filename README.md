# Tallow: habit-tracker landing page

A conversion-focused waitlist page for **Tallow**, a habit-tracking app for busy professionals who keep dropping their habits. The product idea: a missed day dims your streak instead of resetting it.

> Tallow is a fictional product created as a design and development sample.

## What's in it

- A sticky navbar with a mobile menu (Esc closes it and returns focus) and active-link highlighting on scroll
- A hero with a CSS-built phone and a 28-day streak grid that fills in on load. Day 19 is missed (dashed and slashed, so it reads without colour), and days 20–22 dim, then recover.
- A social proof strip, five features, three steps, and three testimonials
- Pricing with a monthly/yearly toggle (Free, Pro, Team)
- An accessible FAQ accordion (`aria-expanded`, keyboard operable, readable without JS)
- A waitlist form with client-side validation and empty, format, sending, success and error states
- Reduced-motion support: the streak grid renders in its final state with no animation

**Stack:** plain HTML, CSS and vanilla JavaScript. No frameworks, no build step, no dependencies. The fonts are Newsreader (headlines) and Manrope (body) from Google Fonts.

## Project structure

```
index.html        All page markup
css/styles.css    Design tokens, layout and components (mobile-first)
js/main.js        Menu, active link, pricing toggle, FAQ, waitlist form
assets/           favicon.svg, og.png (social preview)
```

## Palette

| Token | Hex | Used for |
|---|---|---|
| Soot | `#2B2621` | Page background |
| Hearth | `#36302A` | Raised surfaces |
| Bone | `#EFE8DA` | Primary text |
| Ash | `#ABA597` | Secondary text, outlines |
| Wick | `#E8A33D` | Actions, links, focus ring |
| Moss | `#9CAD72` | Real states only: completed days, success |
| Rust | `#F2967A` | Form errors only |

Every text/background pair meets WCAG AA. The lowest is Ash on Hearth at 5.31:1.

## Run it locally

No install needed. Serve the folder with any static server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly in a browser also works.

## The waitlist form (demo mode)

The form runs in **demo mode** while its endpoint is the placeholder. A valid email shows the success message after a short pause, and nothing is sent anywhere. That's intentional for a portfolio demo.

To collect real signups:

1. Create a free form at [formspree.io](https://formspree.io).
2. In `index.html`, find the form's `action` attribute and replace `YOUR_FORM_ID` with your form ID.

Demo mode switches off automatically, and `main.js` posts to that URL. Without JavaScript, the form posts there directly.

## Deploy

The site is static: no build command, and the output directory is the project root.

### Netlify

1. Easiest: drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Or connect the Git repo: **Add new site → Import an existing project**, leave **Build command** empty, and set **Publish directory** to `.`.

### Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. On [vercel.com/new](https://vercel.com/new), import the repo.
3. Set **Framework Preset** to **Other**, leave the build command empty, and keep the output directory as the root.
4. Deploy. Alternatively, run `npx vercel` from the project folder.

### After deploying

- In `index.html`, change `og:image` to the absolute URL (for example `https://your-site.netlify.app/assets/og.png`) so link previews show the image.
- Replace the `href="#"` social links in the footer with real profile URLs, or remove them.

## Quality (measured)

Lighthouse 13.5.0 against a local static server:

| Run | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile timings: FCP 0.9 s, LCP 1.2 s, TBT 0 ms, CLS 0.001. Re-run Lighthouse after deploying to confirm on the live host.

Other checks:

- Rendered text contrast is 5.31:1 at worst (WCAG AA).
- 31 keyboard tab stops, each with a visible focus ring.
- No unused CSS selectors.
- No horizontal scroll at 360px.

## Manual test checklist

Run these at 360px and at desktop width.

**Mobile menu**
- [ ] The ☰ button opens the menu on tap, Enter and Space.
- [ ] Esc closes the menu and puts focus back on ☰.
- [ ] Tabbing past the last link closes the menu.
- [ ] Tapping outside the menu closes it.
- [ ] Tapping a link closes the menu and scrolls to that section, clear of the sticky header.

**Active nav link**
- [ ] Scrolling through Features, How it works, Pricing and FAQ highlights the matching link.
- [ ] Nothing is highlighted in the hero or the waitlist.

**Waitlist form**
- [ ] Submitting empty shows "Add your email so we can save your spot." The field turns Rust and focus returns to it.
- [ ] `name@site` shows "That email looks incomplete. Check for a typo?"
- [ ] Typing after an error clears the error.
- [ ] A valid email (`  A@B.COM  ` is trimmed) shows "Saving your spot…", then the Moss success message, and the field clears.
- [ ] Double-clicking the button sends one request (real endpoint).
- [ ] When offline with a real endpoint, an error appears and the email stays in the field.
- [ ] Enter in the field submits.

**Pricing toggle**
- [ ] Yearly shows Pro $48/yr and Team $38/seat/yr. Monthly shows $5/mo and $4/seat/mo.
- [ ] The toggle works by click, Enter and Space.
- [ ] A screen reader announces the new prices.

**FAQ accordion**
- [ ] Enter and Space open and close each question, and several can be open at once.
- [ ] `aria-expanded` flips on each toggle.
- [ ] With JS disabled, all answers are visible.

**Keyboard and motion**
- [ ] The skip link is the first Tab stop.
- [ ] The focus ring is visible everywhere, and focus never sits under the header.
- [ ] With "Reduce motion" on, the streak grid appears complete immediately.

## Gallery

Ready-made 1280×769 images for portfolio or gig listings are in [`docs/gallery/`](docs/gallery/):

1. `1-hero-desktop.png`: the hero and streak grid
2. `2-mobile-screens.png`: three 360px screens (hero, pricing, waitlist success)
3. `3-detail-and-scores.png`: a grid close-up with the measured Lighthouse scores
