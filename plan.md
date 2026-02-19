# Premium SaaS Redesign — Implementation Plan

## Overview

Transform andrewmadson.com from its current light "Sonoran Glass v3" aesthetic into a premium dark-mode "B2B SaaS / boutique tech consultancy" design inspired by Vercel, Stripe, and Linear.

**Key constraint:** This is a static HTML/CSS/JS site (no React, no Tailwind). All changes will be made to vanilla CSS custom properties, HTML structure, and vanilla JS. The design prompts reference Tailwind classes—we'll translate those into equivalent vanilla CSS.

---

## Step 1: Global Design System & Typography Overhaul (`styles.css`)

**What changes:**
- **CSS Variables (`:root`)** — Replace the entire light palette with the premium dark palette:
  - `--color-bg`: `#FFFFFF` → `#0A0A0A` (Midnight off-black)
  - `--color-surface` / `--color-card`: `#F5F5F7` → `#171717` (elevated dark gray)
  - `--color-card-hover`: `#EBEBED` → `#1F1F1F`
  - `--color-text`: `#1D1D1F` → `#FFFFFF` (headings) / `#A3A3A3` (body ≈ neutral-400)
  - `--color-text-secondary`: `#6E6E73` → `#A3A3A3`
  - `--color-text-tertiary`: `#86868B` → `#737373`
  - `--color-accent`: `#3478F6` → `#4F46E5` (Electric Indigo / indigo-500)
  - `--color-accent-hover`: `#2563EB` → `#6366F1` (indigo-400 for hover, slightly lighter on dark)
  - `--color-accent-text`: → `#818CF8` (indigo-400 for links)
  - `--color-accent-muted`: → `rgba(79, 70, 229, 0.1)`
  - `--color-border`: `#E8E8ED` → `#262626` (neutral-800)
  - `--color-border-hover`: `#D2D2D7` → `#404040` (neutral-600)
  - Remove sand gold variable (or repurpose sparingly)
  - `--color-success`, `--color-warning` — keep semantically but adjust for dark bg legibility

- **Typography** — Switch from `Instrument Sans` to `Inter` (geometric sans-serif):
  - Update Google Fonts `<link>` in all HTML files
  - Update `--font-family` to `'Inter', -apple-system, ...`
  - Keep `JetBrains Mono` for monospace kickers
  - Tighten letter-spacing on headings to `tracking-tight` equivalent (`-0.025em`)
  - Headings → `color: #FFFFFF` (`text-white`)
  - Body text → `color: #A3A3A3` (`text-neutral-400`)

- **Shadows & Borders** — Remove all `box-shadow` usage globally; replace with flat `1px solid var(--color-border)` borders on cards and surfaces.

- **Navigation header** — Update glassmorphic background from white-translucent to dark-translucent:
  - `background: rgba(10, 10, 10, 0.8)` with `backdrop-filter: blur(12px)`
  - Border-bottom: `1px solid #262626`

---

## Step 2: Unified Button / CTA Component (`styles.css` + all HTML files)

**New CSS classes:**
- `.btn-primary` — Solid `bg-indigo-600` (#4F46E5), white text, `border-radius: 0.5rem` (rounded-lg), hover lifts up (`transform: translateY(-1px)`) and lightens to indigo-500
- `.btn-secondary` — Transparent bg, `1px solid #404040` border (neutral-700), `color: #D4D4D4` (neutral-300), hover: border → indigo-500, text → white

**HTML audit & replacement:**
- Replace all `.btn-orange` instances with `.btn-primary`
- Replace `.btn-outline` instances with `.btn-secondary`
- Replace `.libutton` / `.hero-libutton` with `.btn-secondary` (keep LinkedIn icon)
- Ensure "Work with Me" / "Book a Strategy Call" always uses `.btn-primary`
- Ensure "Podcast", "Speaking", "Publications" links use `.btn-secondary`
- Nav CTA (`.nav-cta`) — change from orange to `.btn-primary` styling

---

## Step 3: Redesign Hero Section (`index.html` + `styles.css`)

**New hero layout:**
- Remove circular headshot from hero (move to About page or de-emphasize)
- Center-aligned, massive whitespace: `padding: 8rem 0` (py-32 equivalent)
- Add monospace kicker: `// TECH RELATIONS & STRATEGY` in indigo-400, small font, JetBrains Mono
- New H1: "Bridging Data Architecture, Product Marketing, and GTM Strategy." — Apply gradient text effect (`background-clip: text`, gradient from white to neutral-500)
- New subheadline: "I help organizations build scalable data foundations, drive developer adoption, and execute market-leading tech strategies."
- Two buttons side-by-side: Primary "Work with Me" + Secondary "Listen to Podcast" (or "Watch Keynotes")
- Retain existing fade-up animations

**Social Proof Logo Banner (below hero):**
- Restyle existing `.logo-bar` section:
  - Apply `filter: grayscale(100%); opacity: 0.5` default state
  - Hover: `grayscale(0); opacity: 1` with transition
  - Add "Trusted By" label above the logo strip
  - Ensure existing logos (Fivetran, Dremio, J.P. Morgan, ASU, etc.) are displayed

---

## Step 4: "Expertise" Bento Box Grid (`index.html` + `styles.css`)

**Replace the current Featured Work grid** with a Bento Box layout:

**CSS Grid structure:**
```
grid-template-columns: repeat(3, 1fr)
grid-template-rows: auto auto
gap: 1rem
```

**5 cards:**
1. **Tech Relations** — "Developer adoption and community building" — 1 col
2. **Data & AI Development** — "Modern data stacks and engineering" — 1 col
3. **Product Marketing** — "GTM strategy and positioning" — 1 col
4. **Thought Leadership** — "Podcasting, speaking, and authorship" — 1 col
5. **Strategy Consulting** — "High-level enterprise advising" — **spans 2 columns**

**Card styling:**
- `background: #171717`
- `border: 1px solid #262626`
- `border-radius: 1rem` (rounded-2xl)
- `padding: 2rem` (p-8)
- Minimalist icon in indigo-400 (use inline SVG icons from Lucide or simple Unicode/SVG)
- Hover: `border-color: #404040` transition

**Mobile:** Single column stack (all cards full-width)

---

## Step 5: Update Remaining Pages for Dark Theme Consistency

**All pages (`about-me.html`, `books.html`, `speaking.html`, `blog.html`, `contact.html`):**
- The CSS variable changes in Step 1 will cascade globally, but we need to audit:
  - Any hardcoded colors in HTML `style` attributes
  - The speaking page already has dark sections — unify with new palette
  - Blog card source badges — ensure contrast on dark bg
  - Timeline dots/lines — update colors for dark theme
  - Contact card grid — ensure visibility
  - Footer — update for dark palette
  - `.section-light` overrides — repurpose or remove (everything is dark now)
  - Form embeds (Google Forms iframe) — check if they need dark mode params

---

## Step 6: Bottom-of-Page CTA Banner (all pages)

**Add a persistent CTA section before the footer on every page:**
- Background: subtle gradient or slightly different surface color
- Headline: "Ready to accelerate your GTM strategy?"
- Subtext: brief value prop
- Primary CTA button: "Book a Strategy Call"
- This ensures the primary conversion action is always visible at the end of content

---

## Step 7: Polish & QA

- Test responsive breakpoints (1024px, 768px, 600px, 480px)
- Verify all animations still work with new colors
- Check image contrast against dark backgrounds
- Ensure all text meets WCAG AA contrast ratios on dark bg
- Verify the scrolling logo bars and carousels look correct
- Test mobile nav (hamburger menu) with dark theme

---

## File Change Summary

| File | Changes |
|------|---------|
| `styles.css` | Complete color system overhaul, new button classes, hero redesign, bento grid, dark nav, CTA banner, shadow removal |
| `index.html` | New hero content, bento box grid section, CTA banner, Google Fonts update |
| `about-me.html` | Google Fonts update, CTA banner, audit hardcoded colors |
| `books.html` | Google Fonts update, CTA banner, audit hardcoded colors |
| `speaking.html` | Google Fonts update, CTA banner, unify dark theme |
| `blog.html` | Google Fonts update, CTA banner, audit hardcoded colors |
| `contact.html` | Google Fonts update, CTA banner, audit hardcoded colors |
| `script.js` | Minor: ensure scrolled header works with new dark bg |

---

## Risk Considerations

- **No framework migration** — We are NOT adding React or Tailwind. All changes remain vanilla HTML/CSS/JS. The design prompts reference Tailwind utility classes but we translate them to CSS equivalents.
- **Image assets** — Company logos in `/images/logos/` are already present; grayscale filter applied via CSS. No new assets needed for the logo bar.
- **Lucide icons** — We'll use inline SVGs for the bento box icons rather than adding a dependency.
- **Google Fonts** — Switching from Instrument Sans to Inter requires updating the `<link>` tag in every HTML file.
- **Existing content** — Hero copy changes per the spec. All other page content remains unchanged.
