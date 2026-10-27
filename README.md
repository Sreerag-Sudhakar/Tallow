# Tallow: habit-tracker landing page

A conversion-focused waitlist page for **Tallow**, a habit-tracking app for busy professionals who keep dropping their habits. The product idea: a missed day dims your streak instead of resetting it.

> Tallow is a fictional product created as a design and development sample.

## What's in it

- A sticky navbar with a mobile menu (Esc closes it and returns focus) and active-link highlighting on scroll
- A hero with a CSS-built phone and a 28-day streak grid that fills in on load. Day 19 is missed and reads as missed without relying on colour.
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
