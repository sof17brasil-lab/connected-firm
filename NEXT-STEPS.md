# Where we got to

Live locally with `npm run dev` → http://localhost:5173/connected-firm/
(the `/connected-firm/` path matters — it's the GitHub Pages base.)

Home page is 22.9 viewports: hero → thesis → why now → the problem →
the plan → what it's worth → how I'd measure it → close.
Detail lives on /the-numbers, /methodology, /culture-extras, /sources.

56 tests pass (`npm test`). Build is clean (`npm run build`).

## Stopped mid-round (usage limit)

Done in the last round: the 2028 opener (smaller square, heading lifted onto
its own layer above the photo, staged standfirst), the programs rebuilt as
four square cards running a diagonal with a line-by-line closing paragraph,
"What is it worth?" as a midnight panel that rises inset and widens, the
skyline redrawn as ONE continuous stroke, and five outline charts on
/the-numbers with tests tying them to data.ts and the calculator.

NOT done, still outstanding from that round:
- Item 4, the spacing pass: one consistent scale (120px desktop / 80px
  mobile), remove leftover spacers and pin-spacing at the ends of pinned
  sections, and list each gap before and after.
- None of the new moves has been checked in a browser. The skyline in
  particular should first be rendered with `<Skyline still />` to confirm the
  whole shape is there before trusting the animation.

## Still to do

**Design, from the last review**
- New idea for the "What keeps people at a firm?" heading (collage removed,
  nothing decided yet).
- Decide whether the hero keeps its drifting squares.
- Whatever else came out of that last pass.

**Content**
- Photos go in `W&C/reference-photos/`; 12–15 is enough. Card backgrounds
  ~1600×1600, collage pieces ~800×600. They slot in behind the existing
  navy scrim with no other change.
- Baker Donelson's BakerWell program on /culture-extras has no source and is
  currently labelled unverified. Needs a citation or removal.

**Before it ships**
- Code-split the bundle (1.03MB, 330KB gzipped) — needed for Lighthouse 90+.
- WebP/AVIF images; `sips` on this machine can't write WebP, so add `sharp`.
- Reduced-motion and accessibility pass.
- GitHub Pages deploy: repo must be named `connected-firm` to match the Vite
  base. `dist/404.html` is already emitted for deep links.

## Things worth remembering

- Vite's dep cache goes stale when a library is added; "Invalid hook call"
  errors mean `rm -rf node_modules/.vite` and restart.
- framer-motion hands `useTransform` ranges to the Web Animations API as
  keyframe offsets, which must stay inside 0–1 and keep increasing. A value
  outside that throws during mount and blanks the whole page.
- Always pass framer-motion a MotionValue for `pathLength`, never a plain
  number on one branch and a MotionValue on another.
