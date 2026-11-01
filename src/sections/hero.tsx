import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Reveal } from '@/components/site/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const NAVY = '#0E1E3A'
const IVORY = '#F7F4EE'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * The I's stem at its waist: how wide the ink is, and how far its centre
 * sits from the centre of the advance box.
 *
 * The zoom has to know how far to grow before the letter's ink covers the
 * screen, and the only honest way to know that is to draw the glyph and
 * look. Guessing from the advance box is wrong by a factor of two or more,
 * because the box includes the side bearings and the serifs are wider than
 * the stem they sit on. Scanning the middle row crosses the stem alone.
 *
 * The offset matters as much as the width: the two side bearings are not
 * equal, so the stem is slightly off-centre in its box. Zooming about the
 * box centre instead of the ink centre leaves a sliver of navy down one
 * edge of the screen at the end of the move.
 */
function measureStem(fontPx: number): { width: number; offset: number } {
  const fallback = { width: fontPx * 0.1, offset: 0 }
  const size = Math.ceil(fontPx * 1.6)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return fallback

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000'
  ctx.font = `400 ${fontPx}px "Instrument Serif", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('I', size / 2, size / 2)

  const row = ctx.getImageData(0, Math.floor(size / 2), size, 1).data
  let first = -1
  let last = -1
  for (let x = 0; x < size; x += 1) {
    if (row[x * 4] < 128) {
      if (first < 0) first = x
      last = x
    }
  }
  if (first < 0) return fallback
  return { width: last - first + 1, offset: (first + last) / 2 - size / 2 }
}

/**
 * The title, and the way into the site.
 *
 * The first screen is solid navy with THE CONNECTED FIRM in ivory. As you
 * scroll, the camera moves into the I of FIRM: the letter is scaled up about
 * its own centre while the page pans that centre to the middle of the
 * screen, so the ivory of the letter grows until it is the whole screen.
 * The subtitle then reads on that ivory and the site carries on.
 *
 * Three things this depends on, each of which can break it silently:
 *
 *  - No `overflow: hidden` on any ancestor. In CSS, `overflow-x: hidden`
 *    computes `overflow-y` to `auto`, which makes that ancestor a scroll
 *    container: ScrollTrigger then measures against the wrong element and
 *    `position: sticky` stops working. The clipping lives on the sticky
 *    stage itself, which is safe, and nowhere above it.
 *  - Instrument Serif has to be loaded before the letter is measured, or
 *    the fallback serif's metrics put the zoom origin in the wrong place.
 *    `ready` gates the whole effect on the real face.
 *  - ScrollTrigger has to hear about scrolling. Lenis drives it, and
 *    SmoothScroll also forwards native window scroll, so one failing does
 *    not freeze the other.
 *
 * `data-gp-progress` and `data-gp-motion` are written to the section on
 * every frame, so the effect can be read from outside without instrumenting
 * it again.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<HTMLDivElement>(null)
  const letterRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)

  // Measure nothing until the real face is in: the fallback serif's letter
  // sits somewhere else, and the zoom would aim at the wrong point.
  useEffect(() => {
    let live = true
    const fonts = document.fonts
    if (!fonts) {
      setReady(true)
      return
    }
    Promise.all([
      fonts.load('400 10rem "Instrument Serif"'),
      fonts.load('italic 400 10rem "Instrument Serif"'),
    ])
      .then(() => fonts.ready)
      .then(() => {
        if (live) setReady(true)
      })
      .catch(() => {
        if (live) setReady(true)
      })
    return () => {
      live = false
    }
  }, [])

  useGSAP(
    () => {
      const section = sectionRef.current
      const stage = stageRef.current
      const zoom = zoomRef.current
      const letter = letterRef.current
      if (!section || !stage || !zoom || !letter) return

      if (reducedMotion || !ready) {
        section.dataset.gpMotion = reducedMotion ? 'off' : 'pending'
        section.dataset.gpProgress = '0'
        // Without motion there is no zoom to resolve the navy screen, so the
        // title reads on ivory like the rest of the site. A navy screen that
        // never resolves would also leave the mark and the menu, which flip
        // on the swap, invisible against it.
        stage.style.backgroundColor = reducedMotion ? IVORY : NAVY
        gsap.set(zoom, { clearProps: 'transform,opacity' })
        return
      }

      section.dataset.gpMotion = 'on'

      // How far the letter has to grow before its ink covers the screen, and
      // how far the page has to pan to bring that ink to the middle.
      let scaleTo = 60
      let panX = 0
      let panY = 0

      const measure = () => {
        const box = letter.getBoundingClientRect()
        const zoomBox = zoom.getBoundingClientRect()
        if (box.width === 0) return

        const fontPx = parseFloat(getComputedStyle(letter).fontSize)
        const stem = measureStem(fontPx)

        // Scale about the stem's ink, not the middle of the headline: about
        // the headline and the I flies off screen as everything grows
        // around the block's own centre, and about the advance box it ends
        // a few pixels off and leaves navy down one side.
        const inkX = box.left + box.width / 2 + stem.offset
        const inkY = box.top + box.height / 2
        zoom.style.transformOrigin = `${inkX - zoomBox.left}px ${inkY - zoomBox.top}px`

        panX = window.innerWidth / 2 - inkX
        panY = window.innerHeight / 2 - inkY

        scaleTo = (window.innerWidth / stem.width) * 1.35
      }

      const apply = (p: number) => {
        const t = clamp01(p)
        section.dataset.gpProgress = t.toFixed(3)

        // Scale grows geometrically, because that is what a constant-speed
        // zoom looks like: ramping it linearly spends the first quarter of
        // the scroll covering the screen and the rest doing nothing.
        const e = smooth(t)
        const scale = Math.pow(scaleTo, e)
        // The camera finishes centring early, while the pan is still
        // legible; after that there is only a flat field to pan.
        const pan = smooth(Math.min(t / 0.35, 1))
        zoom.style.transform = `translate(${panX * pan}px, ${panY * pan}px) scale(${scale})`

        // Both of these happen behind a screen that is already solid ivory,
        // so neither is visible: the backdrop swap stops navy showing at the
        // edges when the stage unpins, and dropping the title at the very
        // end avoids rasterising it at sixty times its size.
        stage.style.backgroundColor = t > 0.94 ? IVORY : NAVY
        zoom.style.opacity = t > 0.97 ? '0' : '1'

        // The header sits on navy for most of this, so the mark and the menu
        // have to read light until the ivory arrives.
        window.dispatchEvent(
          new CustomEvent('tcf:invert', { detail: clamp01((0.9 - t) / 0.06) }),
        )
      }

      measure()
      apply(0)

      const proxy = { p: 0 }
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => apply(proxy.p),
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure()
            apply(proxy.p)
          },
        },
      })

      const onResize = () => {
        measure()
        apply(proxy.p)
      }
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion, ready] },
  )

  return (
    <>
      {/* No overflow on this section, and none above it: the clipping is on
          the sticky stage, where it cannot break the pin. */}
      <section
        ref={sectionRef}
        id="hero"
        data-gp-progress="0"
        data-gp-motion="pending"
        className="relative"
        style={{ height: reducedMotion ? undefined : '300vh' }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
          style={{ backgroundColor: reducedMotion ? IVORY : NAVY }}
        >
          <div ref={zoomRef} className="will-change-transform">
            <h1
              className="text-center font-display uppercase leading-[0.84] tracking-[-0.02em]"
              style={{ color: reducedMotion ? NAVY : IVORY }}
            >
              <span className="block text-[clamp(3.5rem,13vw,12rem)]">The</span>
              <span className="block text-[clamp(3.5rem,13vw,12rem)] italic">Connected</span>
              <span className="block text-[clamp(3.5rem,13vw,12rem)]">
                F<span ref={letterRef}>I</span>RM
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Out the other side of the letter, on ivory. */}
      <section className="relative">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-3 px-6 pb-24 pt-[18vh] text-center md:px-10">
          <Reveal>
            <p className="max-w-xl text-lg text-slate md:text-xl">
              An events strategy for White &amp; Case&apos;s New York office
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-caption text-muted-ink">
              Not affiliated with or endorsed by White &amp; Case LLP
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
