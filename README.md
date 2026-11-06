# AI Office Company — Website

Three-page marketing website for [AI Office Company](https://aiofficecompany.com/), a New Orleans company that builds AI Offices for small businesses: a Vault of the business's information, rules and instructions, plus AI Agents that work from it, with the owner approving everything.

## Structure

```
ai-office-company-website/
├── index.html              # Homepage: copy, SEO meta, Open Graph and schema.org data
├── what-ai-can-do/index.html       # What AI Can Do For You (Case 1)
├── why-ai-isnt-working/index.html  # Why AI Isn't Working For You (Case 2)
├── assets/
│   ├── css/site.css        # All styles; design tokens on :root
│   ├── js/site.js          # Animation only (copy lives in index.html)
│   ├── fonts/              # Self-hosted Cinzel, Inter, EB Garamond, Sora, JetBrains Mono (woff2, Latin)
│   └── images/             # Section photos: desktop/mobile crops, each as .webp (served) + .jpg (fallback); og-image.jpg, logo.png
├── favicon.ico / favicon.svg / apple-touch-icon.png
├── _headers                # Netlify cache headers (fonts 1 year, images 30 days)
├── robots.txt
├── sitemap.xml
└── README.md
```

## Pages and sections

**Homepage (`/`)**
1. **Hero:** "The AI Revolution is here." headline, two case cards with a gold "Click here" (Case 1 opens `/what-ai-can-do/`, Case 2 opens `/why-ai-isnt-working/`), founder line, and a looping demo (Vault drawers + chat) of four stories where a generic AI gets it wrong and the Vault fixes it.
2. **A day with your AI Office:** a live clock (7 AM–5 PM), task counter, the current task and a timeline.
3. **Building Your AI Office:** four steps.
4. **Our Packages:** Vault Setup + Agents (from $495, optional $45/month tech support) and the Marketing Package.
5. **FAQs:** static `<details>` blocks; the same questions are in the FAQPage schema.
6. **Closing CTA** and **footer** (contact, socials).

**What AI Can Do (`/what-ai-can-do/`)**: six benefit tiles; "See it in your business" (gold divider, industry tabs, CTA); the Vault demo from the hero; footer.

**Why AI Isn't Working (`/why-ai-isnt-working/`)**: the Without/With Vault comparison and the "What goes in your Vault" diagram; closing CTA; footer.

Nav, footer and the closing section are copied into each page (no build step), so change them in all three files. Subpages use root-relative paths (`/assets/...`).

## How it works

- **One responsive layout.** Phone styles first; the desktop design applies from 1024px. Between 1024px and 1440px `site.js` scales the 1440px design to fit.
- **Content is real HTML.** Every word is in `index.html`; `site.js` only toggles state classes and timers. With JavaScript off, every animated element shows its final state.
- **Reduced motion.** Visitors with `prefers-reduced-motion` see final states with no movement.
- **Design tokens.** Colours and fonts are CSS variables at the top of `site.css` (Imperial palette: muted plum, antique gold `#D9A84E`, cream; status colours; four accent hues; and `--chat-*` tokens for the hero chat mock-up). The `--navy*` token names are kept from v3 but hold the plum shades. Blue survives only in the Vault diagram and the Vault Setup package. Change colours there, not inline.
- **Fonts.** Cinzel (headings), Inter (body), EB Garamond (hero case cards, FAQ questions), JetBrains Mono (system details: times, file names, counters). The hero demo keeps its original fonts: Sora for the Vault title, and Apple's San Francisco for the chat where installed (Inter elsewhere).

## Editing common things

| To change | Where |
|---|---|
| Any copy, prices, FAQ answers | `index.html` (also update the FAQPage / ProfessionalService JSON-LD in `<head>` if the facts change) |
| Booking form link | the four `docs.google.com/forms/...` links in `index.html` |
| Hero demo stories | the `.story` blocks in `index.html`; timing in `site.js` (`STEPS`, `HOLD`) |
| What AI Can Do tiles and industry tabs | `what-ai-can-do/index.html` (tab switching in `site.js`) |
| "A day with your AI Office" tasks | `TASKS` in `site.js` (and the fallback row in `index.html`) |
| Colours | tokens at the top of `assets/css/site.css` |
| A section photo | replace both the `.jpg` and the `.webp` of that name in `assets/images/` (and bump the hero preload in `<head>` if it's the hero). Because images are cached for 30 days, give a changed photo a new file name |

## Deployment

Static files only, no build step. Deploy the folder as-is (Netlify drag-and-drop, or connect this repository for continuous deployment). Keep the folder structure: the page references `assets/`, `favicon.*` and `apple-touch-icon.png` at the site root.

To preview locally, serve the folder (opening `index.html` directly blocks the fonts):

```
python -m http.server 8000
```

then open `http://localhost:8000`.

## Credits

- Photos: [Unsplash](https://unsplash.com)
- Vault icon: [Font Awesome Free](https://fontawesome.com) (CC BY 4.0; licence comment kept in the SVG)
- Line icons: [Lucide](https://lucide.dev) (ISC)
- Fonts: Cinzel, Inter, EB Garamond, Sora, JetBrains Mono (SIL Open Font License)

---

© 2026 AI Office Company. New Orleans, Louisiana.
