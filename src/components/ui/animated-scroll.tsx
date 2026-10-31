'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { LineReveal } from '@/components/site/line-reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import type { Program } from '@/lib/data'
import { cn } from '@/lib/utils'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const FILL = ['bg-navy', 'bg-slate', 'bg-navy', 'bg-slate'] as const

/**
 * The four programs as square cards running a diagonal.
 *
 * Each card enters from the bottom right, passes through the centre and
 * leaves at the top left, one after another with a slight overlap, scrubbed
 * to scroll. Everything a card has to say is inside it, so nothing is
 * stranded beside a card that has already left.
 *
 * This replaces the original ScrollAdventure, which hijacked the wheel,
 * ignored touch and fought Lenis for the scroll position.
 */
function CardFace({ program, index }: { program: Program; index: number }) {
  return (
    <div
      className={cn(
        'flex size-full flex-col justify-between p-6 md:p-7',
        FILL[index % FILL.length],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow text-sky">
          {String(index + 1).padStart(2, '0')}
          {program.lead && ' · I would lead this'}
        </p>
        {program.estimate && <EstimateTag kind="estimate" tone="dark" />}
      </div>

      <div>
        <h3 className="font-display text-[clamp(1.4rem,2.1vw,2rem)] leading-tight text-ivory">
          {program.name}
        </h3>
        <p className="mt-3 text-sm leading-snug text-ivory/75">{program.blurb}</p>
      </div>

      <div>
        <p className="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none text-ivory">
          {program.costLabel}
        </p>
        <p className="text-caption mt-2 text-ivory/60">
          {program.calculation}
          <Footnote ids={program.sources} tone="dark" className="ml-1" />
        </p>
      </div>
    </div>
  )
}

export function ProgramRun({
  programs,
  label,
  heading,
  subheading,
  closing,
}: {
  programs: Program[]
  label: string
  heading: string
  subheading: string
  closing: string[][]
}) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const total = programs.length

  useScrollScrub(
    root,
    (p) => {
      const el = root.current
      if (!el) return
      const intro = el.querySelector<HTMLElement>('[data-intro]')
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'))
      const vw = window.innerWidth
      const vh = window.innerHeight

      // The intro holds the top of the screen, then scrolls away as the first
      // card arrives.
      const introOut = clamp01((p - 0.06) / 0.12)
      if (intro) {
        gsap.set(intro, { y: -introOut * vh * 0.5, opacity: 1 - introOut })
      }

      // Cards share the run between 0.14 and 0.86, overlapping by a third so
      // the next one is on its way in before the last has gone.
      const runStart = 0.14
      const runEnd = 0.86
      const span = (runEnd - runStart) / (total - 0.34 * (total - 1))

      cards.forEach((card, i) => {
        const start = runStart + i * span * 0.66
        const local = clamp01((p - start) / span)
        const eased = easeInOut(local)

        // Bottom right, through the middle, out at the top left.
        const x = (0.5 - eased) * vw * 1.7
        const y = (0.5 - eased) * vh * 1.7

        gsap.set(card, {
          x,
          y,
          // Only fades at the very ends, so it reads as travel, not a fade.
          opacity: local <= 0 || local >= 1 ? 0 : Math.min(local * 8, 1, (1 - local) * 8),
          zIndex: 10 + i,
        })
      })
    },
    { start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  )

  if (reducedMotion) {
    return (
      <div>
        <p className="eyebrow text-sky-deep">{label}</p>
        <h2 className="text-h2 mt-5 text-navy">{heading}</h2>
        <p className="measure mt-5 text-lg text-slate">{subheading}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {programs.map((program, i) => (
            <div key={program.name} className="aspect-square">
              <CardFace program={program} index={i} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={root} className="relative" style={{ height: `${120 + total * 85}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="mx-auto h-full w-full max-w-[1200px] px-6 md:px-10">
          <div data-intro className="pt-[18vh]">
            <p className="eyebrow text-sky-deep">{label}</p>
            <h2 className="text-h2 mt-5 max-w-3xl text-navy">{heading}</h2>
            <p className="measure mt-5 text-lg text-slate">{subheading}</p>
          </div>
        </div>

        {/* The run itself: square cards crossing the screen on a diagonal. */}
        <div className="pointer-events-none absolute inset-0">
          {programs.map((program, i) => (
            <div
              key={program.name}
              data-card
              className="absolute left-1/2 top-1/2 w-[min(22vw,13rem)] -translate-x-1/2 -translate-y-1/2 md:w-[22vw]"
              style={{ opacity: 0 }}
            >
              <div className="aspect-square">
                <CardFace program={program} index={i} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The closing paragraph, arriving a line at a time once the run ends. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh]">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center px-6 md:px-10">
          <div className="pointer-events-auto max-w-2xl">
            <LineReveal paragraphs={closing} />
          </div>
        </div>
      </div>
    </div>
  )
}

