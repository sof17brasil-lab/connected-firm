'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import type { Program } from '@/lib/data'
import { PROGRAM_PHOTOS } from '@/lib/photos'
import { cn } from '@/lib/utils'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The split-screen look of the original ScrollAdventure, rebuilt as a pinned,
 * scroll-scrubbed section.
 *
 * The original hijacked the wheel, ignored touch, fought Lenis for the scroll
 * position and loaded images from an external CDN. This keeps the two halves
 * sliding past each other but drives them from ScrollTrigger, so it works on
 * a phone and stays in step with Lenis.
 */
function Stacked({ programs }: { programs: Program[] }) {
  return (
    <div className="flex flex-col gap-20">
      {programs.map((program, i) => (
        <div key={program.name} className="grid gap-6 md:grid-cols-2 md:items-center md:gap-14">
          <div>
            <p className="eyebrow text-sky-deep">
              Program {String(i + 1).padStart(2, '0')}
              {program.runsFor && ` · I'd coordinate this for ${program.runsFor}`}
            </p>
            <h3 className="mt-6 font-display text-3xl text-navy">{program.name}</h3>
            <p className="measure mt-6 text-slate">{program.blurb}</p>
            <p className="text-caption mt-6 text-muted-ink">
              {program.calculation}
              <Footnote ids={program.sources} className="ml-1" />
              {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
            </p>
          </div>
          <CostBlock program={program} className="max-h-[42vh] p-8" />
        </div>
      ))}
    </div>
  )
}

/**
 * The cost block: a photograph under a navy scrim.
 *
 * The scrim is light enough to leave the photograph visible, and the
 * gradient does the heavy lifting only at the bottom, where the figure and
 * its label actually sit. A flat scrim dark enough for the type turned
 * every card into a navy rectangle.
 */
function CostBlock({
  program,
  className,
  big,
}: {
  program: Program
  className?: string
  big?: boolean
}) {
  const photo = PROGRAM_PHOTOS[program.name]
  return (
    <div className={cn('relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden bg-navy', className)}>
      {photo && (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to top, rgba(9,20,40,0.95) 0%, rgba(9,20,40,0.72) 30%, rgba(9,20,40,0) 65%)',
        }}
      />
      <p
        className={cn(
          'font-display leading-none text-ivory',
          big ? 'text-[clamp(2.6rem,5vw,4.5rem)]' : 'text-5xl',
        )}
      >
        {program.costLabel}
      </p>
      <p className="eyebrow mt-4 text-sky">Cost for the year</p>
    </div>
  )
}

export function ProgramPanels({ programs }: { programs: Program[] }) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const total = programs.length

  useScrollScrub(
    root,
    (p) => {
      const el = root.current
      if (!el) return
      const panels = el.querySelectorAll<HTMLElement>('[data-panel]')

      panels.forEach((panel, i) => {
        const start = i / total
        const span = 1 / total
        // A fifth of each slice to arrive, the middle to read, a fifth to go.
        const inLocal = easeOut(clamp01((p - start) / (span * 0.22)))
        const outLocal = easeOut(clamp01((p - (start + span * 0.78)) / (span * 0.22)))

        const first = i === 0
        const last = i === total - 1
        const opacity = (first ? 1 : inLocal) * (last ? 1 : 1 - outLocal)

        panel.style.opacity = String(opacity)
        panel.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none'

        const text = panel.querySelector<HTMLElement>('[data-panel-text]')
        const block = panel.querySelector<HTMLElement>('[data-panel-block]')
        const shift = first ? 0 : (1 - inLocal) * 64
        if (text) gsap.set(text, { x: -shift })
        if (block) gsap.set(block, { x: shift })
      })
    },
    { start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  )

  if (reducedMotion) return <Stacked programs={programs} />

  return (
    <>
      <div
        ref={root}
        className="relative hidden md:block"
        style={{ height: `${total * 110}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {programs.map((program, i) => (
            <div
              key={program.name}
              data-panel
              className="absolute inset-0 flex items-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <div
                className={cn(
                  'mx-auto grid w-full max-w-[1100px] items-center gap-8 px-6 md:grid-cols-2 md:gap-16 md:px-10',
                  i % 2 === 1 && 'md:[&>*:first-child]:order-2',
                )}
              >
                <div data-panel-text>
                  <p className="eyebrow text-sky-deep">
                    Program {String(i + 1).padStart(2, '0')}
                    {program.runsFor && ` · I'd coordinate this for ${program.runsFor}`}
                  </p>
                  <h3 className="mt-6 font-display text-[clamp(2rem,3.4vw,3rem)] leading-tight text-navy">
                    {program.name}
                  </h3>
                  <p className="measure mt-6 text-slate">{program.blurb}</p>
                  <p className="text-caption mt-6 text-muted-ink">
                    {program.calculation}
                    <Footnote ids={program.sources} className="ml-1" />
                    {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
                  </p>
                </div>

                <div data-panel-block>
                  <CostBlock program={program} className="max-h-[46vh] p-8 md:p-10" big />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phones get the same content stacked, with no pinning. */}
      <div className="md:hidden">
        <Stacked programs={programs} />
      </div>
    </>
  )
}
