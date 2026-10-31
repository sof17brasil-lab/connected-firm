# Build "The Connected Firm": a portfolio case-study website

## Who I am and what this is
I'm Sofia Mota, a 2026 Business Analytics graduate applying for the Coordinator, Events role in White & Case LLP's New York office. This site is an independent proposal showing how events can help White & Case reach its 2028 goals, with research, a business case and an interactive calculator. It must look like a premium law-firm annual report crossed with a polished financial dashboard: classy, elegant, quiet and confident. Readers are hiring managers and recruiters, often on their phones.

## Source material
- **Read the whole PDF first:** `The_Connected_Firm_Outline.pdf` (in this folder). It is the single source of truth for all content, numbers, sources and section order.
- The key data is also listed below in "Exact data". If the PDF and this prompt ever disagree, stop and ask me.
- My photos are in this folder: `sofia-headshot.jpg` and `nyc.jpg`. Copy them to `public/images/`. If a file is missing, use a neutral placeholder and tell me.

## Non-negotiable honesty rules
1. Use ONLY the numbers in the PDF and in this prompt. Never invent data, never fill in missing years, never round in a way that changes meaning.
2. Every number gets a footnote marker like [3] that links to the Sources page entry, with the source's year.
3. Anything that is my estimate or a scenario must be labeled "Illustrative" or "My estimate" right next to it.
4. A visible line at the top and in the footer: "Independent proposal by Sofia Mota. Not affiliated with or endorsed by White & Case LLP."
5. Do NOT use White & Case's logo, brand marks, or photos of their offices or people.
6. No quotes from individual Glassdoor reviews. Summary ratings only.

## Tech stack
- Vite + React + TypeScript + Tailwind CSS, initialized with the shadcn CLI so `@/components/ui` and `@/lib/utils` (the `cn` helper) exist. If the shadcn default component path is not `/components/ui`, create it. My animation components import from there.
- Charts: shadcn charts (built on Recharts).
- Animation: `lenis`, `framer-motion`, `gsap` and `@gsap/react` (ScrollTrigger). Because Lenis and GSAP ScrollTrigger are both used, sync them: call `ScrollTrigger.update` on every Lenis scroll event and drive Lenis from `gsap.ticker` (with `gsap.ticker.lagSmoothing(0)`), so pinned sections don't jitter.
- shadcn components needed: `badge`, `scroll-area`, `separator` (plus `class-variance-authority`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`).
- If a component's CSS snippet sets a different font (for example Plus Jakarta Sans), ignore it and keep Manrope and Instrument Serif.
- Icons: `lucide-react`, used sparingly with thin strokes.
- Deploy target: GitHub Pages. Set the Vite `base` to `/connected-firm/` and add a GitHub Actions workflow for Pages. Give me step-by-step deploy instructions at the end.

## Design system
**Feel:** generous white space, very few colors, large elegant numbers, thin hairline rules instead of heavy boxes, consistent chart styling, sharp or very slightly rounded corners (max 4px radius). Restraint is what makes it look expensive.

**Colors (define as CSS variables and Tailwind theme tokens):**
| Token | Hex | Use |
|---|---|---|
| navy | #0E1E3A | headings, nav, main chart color |
| midnight | #081428 | dark full-width sections, footer |
| ivory | #F7F4EE | page background |
| stone | #E6E1D6 | cards, dividers, secondary chart bars |
| slate | #2B3445 | body text |
| sky | #8DB4E2 | accent FILLS only: highlighted bars, lines, underlines |
| sky-deep | #3D6CA6 | accent TEXT and links (sky is too light for text on ivory) |
| muted | #6A6F7A | captions, footnotes |
Single light theme by design. On midnight sections use ivory text, with sky as the accent.

**Fonts (Google Fonts):**
- Display: **Instrument Serif** (regular and italic) for headlines, big numbers and pull quotes.
- Body: **Manrope** (400, 500, 600, 700) for text, labels, tables, nav.
- Tables and number columns: Manrope with `font-variant-numeric: tabular-nums`.
- Type scale: hero 72-96px desktop / 44px mobile; H2 44-56px; big stat numbers 64-88px; body 17-18px; captions 13px; small-caps eyebrow labels with letter-spacing 0.12em.
- Line length for paragraphs around 65 characters. Headings use `text-wrap: balance`.

**The section pattern (use it every time so heavy data stays easy to read):**
1. Small eyebrow label (section number and name).
2. One plain-English headline that states the point.
3. One big number (count-up animation).
4. One chart or visual.
5. One italic "What this means" line.
6. Footnote markers linking to Sources.

## Animations: integrate my three components carefully
1. **Smooth scroll (`smooth-scroll.tsx`, Lenis):** create `@/components/ui/smooth-scroll.tsx` and use only the `ReactLenis root` wrapper around the whole app. Delete the demo's sections, dark slate colors, grid background and emoji text. Disable smooth scrolling when the user has `prefers-reduced-motion: reduce`.
2. **Text reveal (`text-reveal.tsx`, framer-motion):** create `@/components/ui/text-reveal.tsx`. Fix the bug: `targetRef` is attached to both the wrapper div and the `<p>`; attach it to the wrapper div only. Restyle: navy text in Instrument Serif, faded words in navy at 15% opacity. Use it ONCE, for the thesis line right after the hero: "White & Case already runs great events. I'd help connect them into one system and measure what they achieve, starting with the lateral partners the 2028 plan depends on." With reduced motion, show the full sentence statically.
3. **Split-screen pages (`animated-scroll.tsx`, ScrollAdventure):** do NOT use it as written. It hijacks the mouse wheel, doesn't work on touch devices, conflicts with Lenis, and loads images from an external CDN. Instead, recreate its look as a scroll-linked section (framer-motion `useScroll`, sticky container, normal scrolling, works on touch) for Section 5 "The Plan": four split panels, one per program, image or number panel on one side and text on the other, sliding in as you scroll. On mobile, stack the panels vertically with simple fade-ins.

4. **Story scroll (`story-scroll.tsx`, GSAP FlowArt + FlowSection):** create `@/components/ui/story-scroll.tsx` (keep its built-in reduced-motion handling). Use it ONLY for four short full-screen "chapter openers" that introduce the big parts of the story: "01 Why now", "02 The problem", "03 The plan", "04 The business case". Each opener has the eyebrow label, a hairline rule, one large Instrument Serif headline (2-4 words, title case, NOT all caps), one short sentence, and one big number. Alternate backgrounds: midnight, ivory, navy, ivory. Tone the motion down for a law-firm audience: change the incoming rotation from 30 degrees to 8 degrees. Delete all demo copy and demo colors.
5. **Featured stats with area chart (`featured-section-stats.tsx`, Recharts):** create `@/components/ui/featured-section-stats.tsx`, rewrite it to accept props (heading, subheading, stats array, chart data), and use it for Section 1 "Why now": heading "White & Case is growing, but slower than its rivals.", four stats ($3.594bn revenue; 51 lateral partners; 349 → 332 equity partners; 11.6% growth needed a year), and the revenue chart from "Exact data". Replace the demo's area chart: keep the soft gradient fill (sky) under the solid actual line, add the dotted projection line, the dashed $5bn goal line and the shaded gap, plus minimal axes (years and $bn) with stone gridlines, and a styled tooltip. Remove dark-mode classes.
6. **Stats cards with badge (`stats-section-with-text.tsx`):** create `@/components/ui/stats-section-with-text.tsx`, rewrite it to accept props, and use it for the Section 6 headline numbers: "44× return if one partner is saved", "$800K-$2M saved by keeping 4 associates", "1.9% of one failed partner's cost", "~$3.9M calculator default savings". Badge text "Business case". Use the up/down arrow icons only where meaningful, colored sky-deep (up) and slate (down), never red. Label illustrative figures.
7. **Horizontal scroll (`x-scroll.tsx` + shadcn `scroll-area`):** create `@/components/ui/x-scroll.tsx`. Use it on mobile for the research stat cards (Section 2), the 12-month roadmap (Section 5) and the wide tables (cost table, competitor list), so nothing overflows the page. On desktop those show as normal grids. Style the scrollbar thumb in stone.

**Motion budget:** this is a lot of animation for a law-firm audience, so keep everything subtle: no bouncing, no spinning, slow easing, and at most one "big" effect visible at a time.

**Other motion:**
- Sections fade up 16px as they enter the viewport (once).
- Big numbers count up when visible (about 1.2s).
- Charts draw in when visible.
- A thin sky-colored reading-progress bar at the very top.
- A sticky top nav (midnight background on scroll) with section links and a "Sources" link.
- Content must be fully visible and readable at rest. Never leave anything at opacity 0 waiting for an animation, and respect `prefers-reduced-motion` everywhere.

## Page structure
**Main page (one long scroll, in this order). Copy is in the PDF; keep text short.**

0. **Hero.** Title "The Connected Firm", subtitle "An events strategy for White & Case's New York office", byline "Independent proposal by Sofia Mota · October 2026". Background: `nyc.jpg` with a navy duotone overlay (navy gradient + mix-blend), ivory text. Size it to its content, not 100vh. Then the text-reveal thesis section, then the second line: "I'd handle the logistics like any coordinator, and I'd also measure what each event achieves, so the team can show leadership exactly how events support the 2028 plan."
1. **Why now.** Four stat tiles plus the revenue chart plus the competitor growth chart.
2. **The problem (research).** Two rows of stat cards: "New partners" and "People".
3. **What White & Case people say.** Glassdoor category rating bars plus the framing line.
4. **What already exists, and the gaps.** The four-row table, then the London callout box (sky left border).
5. **The plan.** The scroll-linked split panels for the four programs, then a cost table, the leaner and cost-neutral options, and a horizontal 12-month roadmap (Month 1 / 2-3 / 4-6 / 7-12).
6. **The business case.** Lateral partner funnel, the interactive calculator (the showpiece), the "Keep 4 people from leaving" big numbers, associates and clients results, and the headline callout.
7. **How I'd measure it.** A mock "Event Impact Scorecard" dashboard (clearly labeled "Sample layout, illustrative values") plus the measurement list.
8. **Risks I'd plan for.** Six pushback/answer rows.
9. **About me.** `sofia-headshot.jpg` (circular or tall portrait crop), short bio from the PDF, contact email sofiamotaus@gmail.com shown as text plus a mailto link.

**Separate pages (React Router, linked from the nav and from buttons in the relevant sections):**
- **/culture-extras:** the "Culture Extras" content from the PDF (what other firms do, what White & Case already has, the ideas list, Thursday Table guidelines). Link to it from a button after Section 5: "Explore culture ideas →".
- **/methodology:** every formula from the PDF plus the assumptions table and the "Still to verify" list.
- **/sources:** the numbered source list from the PDF, with years, each linking out (open in a new tab).

## Exact data (use these values)
**Revenue chart (Section 1):** actual: 2023 $2.949bn, 2024 $3.317bn, 2025 $3.594bn (solid navy line). Projection at ~8.4% a year (dotted sky line): 2026 $3.896bn, 2027 $4.223bn, 2028 $4.578bn. Horizontal dashed line at the $5.0bn 2028 goal. Shade the 2028 gap and label it "~$410-430M short at the current pace (my calculation)". Use only these points.

**Competitor growth chart (Section 1), 2025 revenue growth, Am Law 100 2026:** Latham 18.57%, Gibson Dunn 18.37%, Simpson Thacher 22.66%, Skadden 11.00%, Ropes & Gray 9.39%, Sidley 8.68%, White & Case 8.36%, DLA Piper 8.10%, Baker McKenzie 7.24%. Sort descending. White & Case bar in sky, the rest in stone. Add a reference line at ~13% labeled "Big Law average". Leave Kirkland out (its growth figure is not in the source).

**Stat tiles (Section 1):** $3.594bn revenue (~8.4%); 51 lateral partners hired in 2025; equity partners 349 → 332 (-4.9%); 11.6% annual growth needed to reach $5bn.

**Research cards (Section 2):** 30-38% of lateral partners leave within 5 years; ~$4.04M per failed lateral partner (2022 estimate); 61% of lawyers above average on the loneliness scale (2018); 37% vs 49% willing to leave, with vs without a best friend at work (Gallup 2022); 18% vs 61% considered quitting, by sense of belonging (SHRM, Oct 2026); 4-5 point turnover drop from small social budgets (field experiment); $200K-$500K to replace an associate (NALP 2017); 9.4% of associates in it for the money alone (BTI 2026).

**Glassdoor bars (Section 3):** Compensation & benefits 4.3, Overall 3.9, Culture & values 3.9, Career opportunities 3.7, Work-life balance 3.4 (out of 5). Note: "75% would recommend · 601 reviews".

**Program costs (Section 5):** First 90 Days $27,000 (~15 NY partners × 3 lunches × 6 people × $100; "~15" is my estimate); Momentum Circles $19,200 (4 × 12 × 10 × $40); Global Table $9,000 (2 × 60 × $75); Client Roundtables $22,400 (8 × 14 × $200). Total $77,600. Leaner option: $13,500 for First 90 Days at $50 per person, about $64K total. Cost-neutral: one 200-person reception ($30,000) ≈ 10 client dinners.

**Lateral funnel (Section 6):** 51 hired → 15-19 likely to leave within 5 years (30-38%) → $61.8M-$78.3M at risk. Firmwide First 90 Days costs $91,800; saving one partner = 44× the cost.

**Keep 4 people (Section 6):** 4 associates $800,000-$2,000,000; 4 lateral partners ~$16.2M.

**Associates and clients (Section 6):** Momentum Circles, 48 people: cautious $96,000 (5×), field-experiment result $384,000 (20×). Clients: 3-practice clients bring in 5.7× the revenue of 1-practice clients; dinners break even at about 4 days of one lawyer's work ($1.36M ÷ 250 days = $5,440 a day).

**Headline callout:** $77,600 ÷ $4,039,200 = 1.9%. "The whole pilot costs less than 2% of one failed lateral partner."

## The calculator (Section 6): make it excellent
Inputs (sliders with live values, labeled, keyboard accessible):
- Non-partner lawyers in scope: 200 to 1,950, step 50, default 1,950
- Annual attrition rate: 5% to 30%, default 20%
- Cost of one departure: $100,000 to $500,000, step $25,000, default $200,000
- Turnover reduction (points): 0 to 5, step 0.5, default 1
- Pilot cost: $20,000 to $200,000, step $1,000, default $77,600

Outputs:
- Baseline departures = lawyers × attrition
- Departures avoided = min(lawyers × reduction ÷ 100, baseline)
- Savings = avoided × cost per departure
- Return per $1 = savings ÷ pilot cost
- Break-even lawyers kept = pilot cost ÷ cost per departure
- Show a two-bar comparison (pilot cost vs savings) and a plain-English verdict sentence that updates, including a "loses money" message when savings < cost.
- Defaults must show: 390 baseline, 19.5 avoided, $3.9M savings, ~50× return, break-even 0.4 lawyers.
- Add a "Reset" button and the label "Illustrative model using public industry figures. White & Case's own attrition rate is not public."
Write the calculator math as pure functions with a small unit test that checks the default outputs above.

## Quality bar
- Fully responsive: test at 375px, 768px and 1440px. No horizontal scrolling. Charts resize and stay readable on phones.
- Accessibility: semantic HTML, alt text on images, visible keyboard focus, color contrast at least WCAG AA (sky is fills only; use sky-deep for text).
- Performance: optimize images, lazy-load below the fold, and target a Lighthouse score of 90+.
- Meta tags: title "The Connected Firm | Sofia Mota", a description, and an Open Graph image (crop of the hero) so the link previews nicely on LinkedIn.

## How to work with me
1. First, read the PDF and this prompt, then reply with a short plan, the file structure, and any questions. Wait for my OK before building.
2. Build in this order and show me each step running locally: (a) setup, design system, Lenis + GSAP sync, (b) hero, text reveal, nav and the four chapter openers, (c) Sections 1-4 with charts (featured stats, x-scroll), (d) Section 5 split panels, (e) Section 6 calculator with tests and the stats cards, (f) Sections 7-9, (g) the three extra pages, (h) responsive, reduced-motion and accessibility pass, (i) deploy.

## Component map (where each of my components goes)
| Component | Where |
|---|---|
| smooth-scroll (Lenis) | Wraps the whole app |
| text-reveal | Once, the thesis line after the hero |
| story-scroll (GSAP) | Four chapter openers before Sections 1, 2, 5 and 6 |
| featured-section-stats | Section 1 (stats + revenue chart) |
| animated-scroll (ScrollAdventure) | Not used as-is; its look is rebuilt as the Section 5 scroll-linked split panels |
| stats-section-with-text | Section 6 headline numbers |
| x-scroll | Mobile carousels and wide tables in Sections 1, 2 and 5 |
3. After each step, check every number on screen against "Exact data" and tell me if anything doesn't match.
