import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { LineReveal } from '@/components/site/line-reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import { DEFAULTS, calculate, money } from '@/lib/calculator'
import { cn } from '@/lib/utils'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const TILES = [
  'bg-navy', 'bg-slate', 'bg-sky-deep', 'bg-navy',
  'bg-slate', 'bg-sky-deep', 'bg-navy', 'bg-slate',
] as const

/**
 * The business case as a midnight panel that rises over the page.
 *
 * It starts inset from the edges and widens as it climbs, holds the screen
 * while the figures are read, swaps the left block halfway, then narrows back
 * to an inset rectangle and leaves upward, returning the page to ivory.
 */
export function BusinessCase() {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const out = calculate(DEFAULTS)

  useScrollScrub(
    root,
    (p) => {
      const el = root.current
      if (!el) return
      const panel = el.querySelector<HTMLElement>('[data-panel]')
      const first = el.querySelector<HTMLElement>('[data-block="first"]')
      const second = el.querySelector<HTMLElement>('[data-block="second"]')
      const rail = el.querySelector<HTMLElement>('[data-rail]')
      if (!panel) return

      // 0.00-0.22 rises and widens · 0.22-0.78 holds · 0.78-1.00 leaves
      const rise = easeOut(clamp01(p / 0.22))
      const leave = easeOut(clamp01((p - 0.78) / 0.22))
      const open = rise - leave

      const inset = (1 - open) * 7
      gsap.set(panel, {
        yPercent: (1 - rise) * 100 - leave * 100,
        left: `${inset}vw`,
        right: `${inset}vw`,
        top: `${(1 - open) * 6}vh`,
        bottom: `${(1 - open) * 6}vh`,
      })

      // The left block swaps halfway through the hold.
      const swap = clamp01((p - 0.46) / 0.12)
      if (first) gsap.set(first, { opacity: 1 - swap, y: -swap * 24 })
      if (second) gsap.set(second, { opacity: swap, y: (1 - swap) * 24 })

      // The rail of squares climbs faster than the text beside it.
      if (rail) gsap.set(rail, { yPercent: -p * 42 })
    },
    { start: 'top top', end: 'bottom bottom', scrub: 0.9 },
  )

  const Figure = (
    <>
      <p className="font-display text-[clamp(3.4rem,9vw,8rem)] leading-[0.9] text-ivory">
        {money(out.savings)}
      </p>
      <p className="measure mt-7 text-lg leading-snug text-ivory/85 md:text-xl">
        If the program kept just 1 in 100 lawyers who would otherwise leave, that&rsquo;s
        about 19 fewer departures a year, roughly $3.9 million saved on a $77,600 pilot.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <EstimateTag kind="estimate" tone="dark" />
        <span className="text-caption text-ivory/60">
          1,950 non-partner lawyers × 1 point × $200,000
          <Footnote ids={[14]} tone="dark" className="ml-1" />
        </span>
      </div>
    </>
  )

  const BreakEven = (
    <>
      <p className="font-display text-[clamp(3.4rem,9vw,8rem)] leading-[0.9] text-ivory">
        0.4
      </p>
      <p className="measure mt-7 text-lg leading-snug text-ivory/85 md:text-xl">
        The pilot pays for itself if it keeps fewer than one person. At $200,000 a
        departure, $77,600 is four tenths of a single exit.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <EstimateTag kind="estimate" tone="dark" />
        <span className="text-caption text-ivory/60">
          $77,600 ÷ $200,000
          <Footnote ids={[14]} tone="dark" className="ml-1" />
        </span>
      </div>
    </>
  )

  const Pill = (
    <Link
      to="/the-numbers"
      className="eyebrow mt-10 inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3.5 text-navy transition-colors hover:bg-sky"
    >
      See the numbers
      <ArrowRight className="size-3.5" strokeWidth={1.5} />
    </Link>
  )

  if (reducedMotion) {
    return (
      <section id="business-case" className="scroll-mt-4 py-20">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <LineReveal
            paragraphs={[['So what would it actually be worth?']]}
            className="mb-12"
          />
          <div className="bg-midnight p-8 md:p-14">
            <p className="eyebrow text-sky">04 — What is it worth?</p>
            <div className="mt-8">{Figure}</div>
            <div className="mt-12 border-t border-ivory/15 pt-8">{BreakEven}</div>
            {Pill}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="business-case" className="scroll-mt-4">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-[12vh] pt-[8vh] md:px-10">
        <LineReveal
          paragraphs={[
            ['Four programs, one year, $77,600.', 'So what would it actually be worth?'],
          ]}
          className="max-w-3xl"
        />
      </div>

      <div ref={root} className="relative h-[320vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            data-panel
            className="absolute overflow-hidden bg-midnight"
            style={{ transform: 'translateY(100%)' }}
          >
            <div className="grid h-full grid-cols-1 items-center gap-8 px-7 md:grid-cols-[1.25fr_0.75fr] md:px-14">
              {/* Left: the number, swapped halfway for the break-even line. */}
              <div className="relative">
                <p className="eyebrow text-sky">04 — What is it worth?</p>

                <div className="relative mt-8 min-h-[22rem]">
                  <div data-block="first" className="absolute inset-0">
                    {Figure}
                  </div>
                  <div data-block="second" className="absolute inset-0" style={{ opacity: 0 }}>
                    {BreakEven}
                  </div>
                </div>

                {Pill}
              </div>

              {/* Right: a rail of squares climbing past the text. */}
              <div aria-hidden="true" className="relative hidden h-full overflow-hidden md:block">
                <div data-rail className="flex flex-col gap-5 pt-[12vh]">
                  {TILES.map((fill, i) => (
                    <div
                      key={i}
                      className={cn('aspect-square w-full max-w-[13rem] shrink-0', fill)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
