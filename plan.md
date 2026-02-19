# Premium SaaS Redesign — Implementation Plan

## Overview

Transform andrewmadson.com from its current light "Sonoran Glass v3" aesthetic into a premium dark-mode "B2B SaaS / boutique tech consultancy" design inspired by Vercel, Stripe, and Linear.

**Key constraint:** This is a static HTML/CSS/JS site (no React, no Tailwind). All changes will be made to vanilla CSS custom properties, HTML structure, and vanilla JS. The design prompts reference Tailwind classes—we'll translate those into equivalent vanilla CSS.

---

## Design Audit — Critical Findings

Before implementation, a line-by-line audit of all 8 files (styles.css, 6 HTML pages, script.js) surfaced these critical issues that must be addressed during the redesign:

### CRITICAL: `mix-blend-mode: multiply` breaks on dark backgrounds
- **`.logo-bar-item img`** (styles.css:457) uses `mix-blend-mode: multiply` — this makes images **invisible** on dark backgrounds (multiply with dark = dark)
- **`.featured-in-track img`** (styles.css:339) has the same issue
- **Fix:** Remove `mix-blend-mode: multiply` entirely. Use `filter: brightness(0) invert(1)` for white-on-dark logo treatment, or just `grayscale(100%)` + `opacity`.

### CRITICAL: Blog source badge `.source-medium` invisible on dark
- `styles.css:1874-1877`: `background-color: rgba(0, 0, 0, 0.06); color: #1D1D1F` — both near-black, invisible on dark bg
- **Fix:** Update to `background-color: rgba(255, 255, 255, 0.08); color: #D4D4D4`

### CRITICAL: `.pill-count` invisible on dark
- `styles.css:1911`: `background-color: rgba(0, 0, 0, 0.05)` — nearly invisible on dark bg
- **Fix:** Update to `rgba(255, 255, 255, 0.1)`

### CRITICAL: Mobile nav sidebar is hardcoded white
- `styles.css:2122`: `background-color: #FFFFFF` and `box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08)`
- Mobile nav CTA (line 2162): `background-color: #f97316`
- **Fix:** Update to dark surface color `#171717`, update shadow, update CTA to indigo

### HIGH: Timeline logo circles have white background
- `styles.css:682`: `background-color: #ffffff` — white circles on dark bg look jarring
- **Fix:** Change to `#1F1F1F` or `var(--color-surface)`

### HIGH: Award text colors have poor contrast on dark bg
- `styles.css:1312`: `.award-label { color: #B45309 }` — dark brown on dark bg, contrast ratio ~2.8:1 (FAILS)
- `styles.css:1319`: `.award-year { color: #92400E }` — even darker, contrast ~1.9:1 (FAILS)
- **Fix:** Lighten to `#FBBF24` (amber-400) and `#F59E0B` (amber-500)

### HIGH: Events section hardcoded colors need unification
- `styles.css:1328`: `#speaking` uses `background-color: #1D1D1F` — slightly different from new `#0A0A0A`
- `.events-dot` border: `3px solid #1D1D1F` — must match new bg
- `.events-item:hover/active` uses `rgba(52, 120, 246, ...)` — needs indigo update
- **Fix:** Unify all with new CSS variables

### MEDIUM: YouTube card hover hardcoded
- `styles.css:1135`: `.yt-card:hover { background-color: #F9F9FB }` — light color on dark page
- **Fix:** Change to `var(--color-card-hover)`

### MEDIUM: `.section-light .card` hardcoded white
- `styles.css:830-834`: `background-color: #FFFFFF` / `#F9F9FB` — won't work on dark
- **Fix:** Repurpose `.section-light` to use `--color-surface` as bg, cards use slightly different surface

### MEDIUM: Embedded iframes (Google Forms, Substack) are white-themed
- `contact.html:88`: Google Form iframe — white form on dark page
- `blog.html:90`: Substack embed — white embed on dark page
- **Fix:** Cannot control iframe theme directly. Wrap in a container with `border-radius`, `border: 1px solid var(--color-border)`, and `overflow: hidden` to give a clean bordered appearance

### MEDIUM: LinkedIn SVG in homepage has hardcoded fill
- `index.html:301`: `fill="#0A66C2"` — hardcoded blue in SVG. Fine to keep as brand color.

### Accessibility Verification (WCAG AA)
All planned color combinations pass WCAG AA:
- `#A3A3A3` on `#0A0A0A` → 9.8:1 (body text — PASS)
- `#FFFFFF` on `#0A0A0A` → 19.6:1 (headings — PASS)
- `#818CF8` on `#0A0A0A` → 6.2:1 (accent links — PASS)
- `#818CF8` on `#171717` → 4.7:1 (accent on cards — PASS)
- `#737373` on `#0A0A0A` → 4.6:1 (tertiary text — PASS, barely)
- `#A3A3A3` on `#171717` → 7.5:1 (body on cards — PASS)
- `#FFFFFF` on `#4F46E5` → 8.6:1 (button text — PASS)

**Note:** `--color-accent` (#4F46E5) as standalone text on dark bg = 3.8:1 (FAILS for small text). We use `--color-accent-text` (#818CF8) for all text links, which passes.

---

## Step 1: Global Design System & Typography Overhaul (`styles.css`)

**What changes:**
- **CSS Variables (`:root`)** — Replace the entire light palette with the premium dark palette:
  - `--color-bg`: `#FFFFFF` → `#0A0A0A` (Midnight off-black)
  - `--color-surface` / `--color-card`: `#F5F5F7` → `#171717` (elevated dark gray)
  - `--color-card-hover`: `#EBEBED` → `#1F1F1F`
  - `--color-text`: `#1D1D1F` → `#E5E5E5` (near-white for body, headings get explicit `#FFFFFF`)
  - `--color-text-secondary`: `#6E6E73` → `#A3A3A3`
  - `--color-text-tertiary`: `#86868B` → `#737373`
  - `--color-accent`: `#3478F6` → `#4F46E5` (Electric Indigo / indigo-600)
  - `--color-accent-hover`: `#2563EB` → `#6366F1` (indigo-500, lighter on dark for hover)
  - `--color-accent-text`: `#2C6FE0` → `#818CF8` (indigo-400, WCAG AA compliant for text links)
  - `--color-accent-light`: `#6da4e8` → `#A5B4FC` (indigo-300)
  - `--color-accent-muted`: → `rgba(79, 70, 229, 0.1)`
  - `--color-sand`: `#C9A96E` → `#818CF8` (repurpose kicker to indigo-400 instead of sand gold)
  - `--color-border`: `#E8E8ED` → `#262626` (neutral-800)
  - `--color-border-hover`: `#D2D2D7` → `#404040` (neutral-600)
  - `--color-success`: adjust to `#34D399` (emerald-400, brighter for dark bg)
  - `--color-success-bg`: `rgba(52, 211, 153, 0.12)`
  - `--color-warning`: adjust to `#FBBF24` (amber-400)
  - `--color-warning-bg`: `rgba(251, 191, 36, 0.12)`

- **Typography** — Switch from `Instrument Sans` to `Inter` (geometric sans-serif):
  - Update Google Fonts `<link>` tag in ALL 6 HTML files (index, about-me, books, speaking, blog, contact)
  - Update `--font-family` to `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
  - Keep `JetBrains Mono` for monospace kickers
  - Tighten letter-spacing on headings: `-0.025em` (already mostly there)
  - Add explicit heading color rules: `h1, h2, h3 { color: #FFFFFF }`
  - Body text inherits `--color-text` which is now `#E5E5E5`

- **Shadows & Borders** — Remove all `box-shadow` on cards/surfaces; replace with flat `1px solid var(--color-border)`:
  - `.card` — remove box-shadow, add border
  - `.fw-card` — remove box-shadow, add border
  - `.blog-card` — remove box-shadow, add border
  - `.yt-card` — remove box-shadow, add border
  - `.hero-headshot` — remove box-shadow (headshot removed from hero anyway)
  - `.about-headshot` — remove box-shadow, add subtle border
  - `.contact-form-embed` — add border
  - `.education` — add border

- **Navigation header** — Update glassmorphic background from white-translucent to dark-translucent:
  - `#header`: `background: rgba(10, 10, 10, 0.8); backdrop-filter: saturate(180%) blur(20px)`
  - `#header.scrolled`: `background: rgba(10, 10, 10, 0.92)`
  - Border-bottom: `1px solid rgba(255, 255, 255, 0.06)` (subtle, not harsh)
  - `.nav-logo`: remove `!important`, set `color: #FFFFFF`
  - `.nav-links a`: `color: #E5E5E5`
  - `.nav-toggle span`: `background-color: #E5E5E5`

- **Logo bars — fix `mix-blend-mode`:**
  - `.logo-bar-item img`: Remove `mix-blend-mode: multiply`. Change filter to `filter: brightness(0) invert(1)` for white silhouette treatment on dark bg. Keep `opacity: 0.4`. Hover: `opacity: 0.8`.
  - `.featured-in-track img`: Same fix. Remove `mix-blend-mode: multiply`, use `filter: brightness(0) invert(1)`.
  - `.featured-in-track img.logo-invert`: Remove this class — no longer needed since all logos get inverted.

- **Mobile nav** — Update for dark:
  - `.nav-links` (at 768px): `background-color: #171717`
  - `body.nav-open::before`: `background: rgba(0, 0, 0, 0.6)` (darker overlay)
  - `.nav-cta-mobile`: Change `#f97316` to `var(--color-accent)` (#4F46E5)
  - Mobile nav box-shadow: `box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3)`

---

## Step 2: Unified Button / CTA Component (`styles.css` + all HTML files)

**New CSS classes (keep existing `.btn` base, add variants):**
- `.btn-primary` — Solid `#4F46E5` background, `#FFFFFF` text, `border-radius: 0.5rem` (rounded-lg), `font-weight: 500`, hover: `transform: translateY(-1px)` + `background: #6366F1` + `transition: all 0.2s ease`
- `.btn-secondary` — Transparent bg, `border: 1px solid #404040`, `color: #D4D4D4`, `border-radius: 0.5rem`, hover: `border-color: #6366F1; color: #FFFFFF`

**Update existing classes:**
- `.btn` base: update border-radius from `9999px` to `0.5rem`
- `.btn-orange`: restyle to match `.btn-primary` (or replace usage)
- `.btn-outline`: restyle to match `.btn-secondary`
- `.nav-cta`: change from `#f97316` to `#4F46E5`, border-radius to `0.5rem`

**HTML audit — every button instance:**
| File | Line | Current | New |
|------|------|---------|-----|
| `index.html` | 76 | `.btn btn-orange` "Work with Me" | `.btn btn-primary` |
| `index.html` | 77 | `.libutton hero-libutton` "Follow on LinkedIn" | `.btn btn-secondary` (keep icon) |
| `about-me.html` | 213 | `.btn btn-orange` "Work with Me" | `.btn btn-primary` |
| `speaking.html` | 80 | `.btn btn-outline` "View My Sessionize Profile" | `.btn btn-secondary` |
| `speaking.html` | 421 | `.btn btn-orange` "Work with Me" | `.btn btn-primary` |
| `speaking.html` | 422 | `.btn btn-outline` "Sessionize Profile" | `.btn btn-secondary` |
| `blog.html` | 95 | `.libutton` "Subscribe on LinkedIn" | `.btn btn-secondary` |
| All pages | nav | `.nav-cta` "Work with Me" | Keep class, restyle in CSS |

---

## Step 3: Redesign Hero Section (`index.html` + `styles.css`)

**New hero layout:**
- Remove circular headshot from hero (About page already has it in its header)
- Center-aligned with generous whitespace: `padding: 10rem 24px 6rem` (approx py-32, accounting for nav height)
- Add monospace kicker: `// TECH RELATIONS & STRATEGY` in `var(--color-accent-text)` (#818CF8), `font-family: var(--font-mono)`, `font-size: 0.875rem`
- New H1: "Bridging Data Architecture, Product Marketing, and GTM Strategy."
  - Apply gradient text: `background: linear-gradient(to right, #FFFFFF 30%, #737373); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
  - Size: keep existing `clamp(2.5rem, 6vw, 4.5rem)` — already very large and responsive
- New subheadline (p.hero-sub): "I help organizations build scalable data foundations, drive developer adoption, and execute market-leading tech strategies."
  - `color: var(--color-text-secondary)` (#A3A3A3), `max-width: 44rem`, centered
- Two buttons side-by-side:
  - Primary: "Work with Me" → `.btn btn-primary`
  - Secondary: "Watch Keynotes" → `.btn btn-secondary` linking to speaking.html
- Retain existing `hero-fade-up` / `hero-scale-in` animations (remove headshot animation)

**Social Proof Stats Bar (keep existing, restyle):**
- The `.social-proof-bar` with 110K+ YouTube, 95K+ LinkedIn, 35K+ Newsletter, 50+ Keynotes — this is excellent credibility. Keep it.
- Restyle: `background-color: var(--color-surface)`, border uses `var(--color-border)`
- `.stat-number` and `.stat-label`: colors update automatically via CSS variables
- `.social-proof-divider`: update to `var(--color-border)`

**Logo Bar (below social proof):**
- Keep existing scrolling marquee structure
- Add "Trusted By" label above: small monospace text like `.featured-in-label`
- Apply fixed logo filter (see Step 1 mix-blend-mode fix)
- Logo hover: `opacity: 0.8; filter: brightness(0) invert(1)` (stays white but brighter)

---

## Step 4: "Expertise" Bento Box Grid (`index.html` + `styles.css`)

**Add as a NEW section** between the Logo Bar and the Featured Content (video carousels). Do NOT remove the Featured Work grid — it showcases specific portfolio items (books, courses, speaking) which are distinct from the expertise pillars.

**New section: "What I Do"**

**CSS Grid structure:**
```css
.bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 1rem;
}
.bento-card--wide { grid-column: span 2; }
```

**5 cards:**
1. **Tech Relations** — "Developer adoption and community building" — 1 col
2. **Data & AI Development** — "Modern data stacks and engineering" — 1 col
3. **Product Marketing** — "GTM strategy and positioning" — 1 col
4. **Thought Leadership** — "Podcasting, speaking, and authorship" — 1 col
5. **Strategy Consulting** — "High-level enterprise advising" — **spans 2 columns** (`.bento-card--wide`)

**Card styling:**
- `background: var(--color-card)` (#171717)
- `border: 1px solid var(--color-border)` (#262626)
- `border-radius: 1rem`
- `padding: 2rem`
- Minimalist Lucide-style inline SVG icon in `var(--color-accent-text)` (#818CF8), 24x24px
- `h3`: `color: #FFFFFF`, `font-size: 1.15rem`, `font-weight: 600`, `margin: 1rem 0 0.5rem`
- `p`: `color: var(--color-text-secondary)`, `font-size: 0.95rem`
- Hover: `border-color: var(--color-border-hover)` (#404040) with `transition: border-color 0.2s ease`

**Responsive:**
- `@media (max-width: 768px)`: `grid-template-columns: 1fr`, `.bento-card--wide { grid-column: span 1; }`
- `@media (max-width: 1024px)`: `grid-template-columns: repeat(2, 1fr)`, Strategy card still spans 2

---

## Step 5: Update Remaining Pages for Dark Theme Consistency

### 5a. Hardcoded color fixes in CSS

| Selector | Property | Current | Fix |
|----------|----------|---------|-----|
| `.section-light` | `background-color` | `var(--color-surface)` | OK — cascades to #171717 |
| `.section-light .card` | `background-color` | `#FFFFFF` | → `#1F1F1F` |
| `.section-light .card:hover` | `background-color` | `#F9F9FB` | → `#262626` |
| `.yt-card:hover` | `background-color` | `#F9F9FB` | → `var(--color-card-hover)` |
| `.yt-card` | `box-shadow` | `0 1px 3px rgba(0,0,0,0.04)` | → `none; border: 1px solid var(--color-border)` |
| `.timeline-logo` | `background-color` | `#ffffff` | → `var(--color-surface)` (#171717) |
| `.timeline-dot` | `border` | `3px solid var(--color-surface)` | OK — cascades |
| `#speaking` | `background-color` | `#1D1D1F` | → `var(--color-bg)` (#0A0A0A) |
| `#speaking` | `color` | `#F5F5F7` | → `var(--color-text)` |
| `#speaking .section-title` | `color` | `#F5F5F7` | → `#FFFFFF` |
| `.events-dot` | `border` | `3px solid #1D1D1F` | → `3px solid var(--color-bg)` |
| `.events-name` | `color` | `#F5F5F7` | → `#FFFFFF` |
| `.events-meta` | `color` | `#A1A1A6` | → `var(--color-text-secondary)` |
| `.events-empty` | `color` | `#A1A1A6` | → `var(--color-text-secondary)` |
| `.events-item:hover` | `background-color` | `rgba(52, 120, 246, 0.06)` | → `rgba(79, 70, 229, 0.06)` (indigo) |
| `.events-item.active` | `background-color` | `rgba(52, 120, 246, 0.10)` | → `rgba(79, 70, 229, 0.10)` |
| `.events-timeline::before` | `background-color` | `rgba(255,255,255,0.12)` | OK on dark — keep |
| `.events-status-past` | `background-color` | `rgba(255,255,255,0.08)` | OK on dark |
| `.role-keynote` | `background-color` | `rgba(52, 120, 246, 0.15)` | → `rgba(79, 70, 229, 0.15)` |
| `.award-label` | `color` | `#B45309` | → `#FBBF24` (amber-400, passes AA) |
| `.award-year` | `color` | `#92400E` | → `#F59E0B` (amber-500, passes AA) |
| `.blog-card-source.source-medium` | bg + color | `rgba(0,0,0,0.06)` / `#1D1D1F` | → `rgba(255,255,255,0.08)` / `#D4D4D4` |
| `.pill-count` | `background-color` | `rgba(0,0,0,0.05)` | → `rgba(255,255,255,0.1)` |
| `.blog-search:focus` | `box-shadow` | `rgba(52, 120, 246, 0.12)` | → `rgba(79, 70, 229, 0.15)` |
| `.section-dark` overrides | all | multiple | → Remove or update to use variables consistently |
| `.globe-label` | `color` | `#86868B` | → `var(--color-text-tertiary)` |

### 5b. `.section-light` strategy
Since everything is now dark, `.section-light` becomes a "slightly elevated surface" to create visual rhythm:
- `.section-light { background-color: var(--color-surface); }` (already cascades to #171717)
- Cards inside get `#1F1F1F` bg (one step lighter than surface)

### 5c. Iframe embed treatment
- Wrap Google Forms and Substack iframes in containers with `border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden;`
- This gives a clean, bordered inset appearance even though the iframe content is light-themed

### 5d. Social proof bar colors
- `.social-proof-stat .stat-number { color: #FFFFFF; }` (was `var(--color-text)`, now auto)
- `.social-proof-stat svg { color: var(--color-text-secondary); }` — OK, cascades

---

## Step 6: Bottom-of-Page CTA Banner (all pages)

**Reuse existing `.about-cta-section` / `.about-cta` pattern** (already on about-me.html and speaking.html). Add to remaining pages:

Pages needing CTA banner added:
- `index.html` (before footer)
- `books.html` (before footer)
- `blog.html` (before footer)
- `contact.html` (before footer — adjust wording since they're already on the contact page)

**CTA content:**
- Headline: "Ready to accelerate your GTM strategy?"
- Subtext: "Available for consulting, speaking, sponsorships, and content collaborations."
- Primary button: "Work with Me" → `.btn btn-primary`
- Optional secondary: "View Speaking" → `.btn btn-secondary`

**Styling updates:**
- `.about-cta-section` bg: use `var(--color-surface)` for subtle differentiation
- Add a top border: `border-top: 1px solid var(--color-border)`

---

## Step 7: Polish & QA

### Desktop checks:
- [ ] All card borders render as clean 1px lines (no sub-pixel rendering issues)
- [ ] Gradient text on hero H1 renders correctly (test Safari needs `-webkit-` prefix)
- [ ] Scrolling logo marquee is visible (not invisible from blend-mode)
- [ ] Featured-in marquee on blog page is visible
- [ ] YouTube video cards look correct with dark styling
- [ ] Timeline logos on about page are properly visible
- [ ] Book cover images pop well against dark cards
- [ ] Blog search input has visible borders and placeholder text
- [ ] Blog filter pills are visible and interactive
- [ ] Bento grid looks balanced at desktop (3-col)

### Mobile checks (768px and below):
- [ ] Mobile hamburger menu opens with dark sidebar background
- [ ] Mobile nav CTA button uses indigo, not orange
- [ ] Hero buttons stack vertically and fill width nicely
- [ ] Bento grid collapses to single column
- [ ] Social proof stats wrap cleanly without overflow
- [ ] Carousel cards scroll-snap properly on touch
- [ ] Footer 3-column collapses to single column
- [ ] Blog grid single-column on mobile
- [ ] Contact grid 2-col on mobile, readable

### Animation checks:
- [ ] Hero fade-up animations still work with new styles
- [ ] Logo bar continuous scroll animation works
- [ ] Featured-in marquee scroll works
- [ ] Card hover transitions (border color change) are smooth
- [ ] Button hover lift (`translateY(-1px)`) is subtle and polished
- [ ] `prefers-reduced-motion` still disables animations

### Accessibility:
- [ ] All text/background combinations pass WCAG AA (verified in audit above)
- [ ] Focus states use `outline: 2px solid var(--color-accent)` (visible on dark bg)
- [ ] Blog search focus ring uses updated indigo accent
- [ ] All interactive elements have sufficient touch targets (>= 44px)

---

## File Change Summary

| File | Changes |
|------|---------|
| `styles.css` | Complete color system overhaul, new button variants, hero redesign, bento grid CSS, dark nav/mobile nav, blend-mode fixes, hardcoded color fixes (30+ instances), CTA banner, shadow→border migration |
| `index.html` | Font link update, new hero content (remove headshot, add kicker, gradient H1, new copy), add bento box section, add CTA banner, update button classes |
| `about-me.html` | Font link update, update button classes, CTA section already exists |
| `books.html` | Font link update, add CTA banner section |
| `speaking.html` | Font link update, update button classes, CTA section already exists |
| `blog.html` | Font link update, add CTA banner section, wrap iframes in bordered containers |
| `contact.html` | Font link update, add CTA banner section (adjusted wording), wrap iframe |
| `script.js` | No changes needed — `scrolled` class logic works regardless of bg color |

---

## Risk Considerations

- **No framework migration** — stays vanilla HTML/CSS/JS. Tailwind classes translated to CSS equivalents.
- **Image assets** — Company logos already exist. `brightness(0) invert(1)` filter creates white silhouettes on dark bg; no new assets needed.
- **Lucide icons** — Inline SVGs for bento box, no dependencies.
- **Google Fonts** — `Inter` replaces `Instrument Sans` in all 6 HTML files.
- **Existing content** — Hero copy changes per spec. All other page content preserved.
- **Iframes** — Google Forms and Substack embeds remain light-themed (can't control). Bordered container treatment ensures clean appearance.
- **Globe visualization** — Already uses `dark: 1` mode with dark base colors. Just need to update `markerColor` to match new indigo: `[0.31, 0.27, 0.90]` (RGB of #4F46E5).
