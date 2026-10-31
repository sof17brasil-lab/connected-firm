'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { Program } from '@/lib/data'
import { cn } from '@/lib/utils'

/**
 * The split-screen look of the original ScrollAdventure, rebuilt as a
 * scroll-linked section.
 *
 * The original hijacked the mouse wheel, ignored touch entirely, fought Lenis
 * for the scroll position and pulled images from an external CDN. This keeps
 * the two halves sliding past each other but drives them from normal scroll
 * progress, so it works on a phone and leaves the page scrollable.
 */
function Panel({
  program,
  index,
  total,
  progress,
}: {
  program: Program
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const start = index / total
  const end = (index + 1) / total
  const first = index === 0
  const last = index === total - 1

  // Every stop has to stay inside 0-1 and keep increasing: framer-motion
  // hands these to the Web Animations API as keyframe offsets, and a value
  // outside that range throws and takes the whole page down.
  // A fifth of each slice to arrive, the middle to be read, a fifth to leave.
  const span = end - start
  const stops = [
    Math.max(start, 0),
    Math.min(start + span * 0.22, 1),
    Math.min(end - span * 0.22, 1),
    Math.min(end, 1),
  ]

  // Each panel owns a slice of the scroll: text in from one side, the number
  // block in from the other, meeting in the middle. The first panel is
  // already on screen when the section pins, and the last one stays put.
  const slide: [number, number] = [stops[0], stops[1]]
  // Pixels, not percentages: a percentage slide pushed the text outside the
  // pinned container, which clips, and program names lost their first letters.
  const textX = useTransform(progress, slide, [first ? 0 : -64, 0])
  const blockX = useTransform(progress, slide, [first ? 0 : 64, 0])
  const opacity = useTransform(progress, stops, [
    first ? 1 : 0,
    1,
    1,
    last ? 1 : 0,
  ])

  const flip = index % 2 === 1

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ opacity }}
    >
      <div
        className={cn(
          'mx-auto grid w-full max-w-[1100px] items-center gap-8 px-6 md:grid-cols-2 md:gap-16 md:px-10',
          flip && 'md:[&>*:first-child]:order-2',
        )}
      >
        <motion.div style={{ x: textX }}>
          <p className="eyebrow text-sky-deep">
            Program {String(index + 1).padStart(2, '0')}
            {program.lead && ' · I would lead this'}
          </p>
          <h3 className="mt-5 font-display text-[clamp(2rem,3.4vw,3rem)] leading-tight text-navy">
            {program.name}
          </h3>
          <p className="measure mt-5 text-slate">{program.blurb}</p>
          <p className="text-caption mt-6 text-muted-ink">
            {program.calculation}
            <Footnote ids={program.sources} className="ml-1" />
            {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
          </p>
        </motion.div>

        <motion.div style={{ x: blockX }}>
          <div className="flex aspect-[4/3] max-h-[42vh] flex-col justify-end bg-navy p-8 md:p-10">
            <p className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-none text-ivory">
              {program.costLabel}
            </p>
            <p className="eyebrow mt-4 text-sky">Cost for the year</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ProgramPanels({ programs }: { programs: Program[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // On a phone, and whenever motion is reduced, the panels simply stack.
  if (reducedMotion) {
    return (
      <div className="flex flex-col gap-16">
        {programs.map((program, i) => (
          <div key={program.name} className="grid gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <p className="eyebrow text-sky-deep">
                Program {String(i + 1).padStart(2, '0')}
                {program.lead && ' · I would lead this'}
              </p>
              <h3 className="mt-4 font-display text-3xl text-navy">{program.name}</h3>
              <p className="measure mt-4 text-slate">{program.blurb}</p>
              <p className="text-caption mt-4 text-muted-ink">
                {program.calculation}
                <Footnote ids={program.sources} className="ml-1" />
                {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
              </p>
            </div>
            <div className="flex aspect-[4/3] flex-col justify-end bg-navy p-8">
              <p className="font-display text-5xl leading-none text-ivory">{program.costLabel}</p>
              <p className="eyebrow mt-3 text-sky">Cost for the year</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Tall track: the sticky frame inside holds one panel at a time. */}
      <div ref={ref} className="relative hidden md:block" style={{ height: `${programs.length * 110}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {programs.map((program, i) => (
            <Panel
              key={program.name}
              program={program}
              index={i}
              total={programs.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Phones get the same content stacked, with no pinning. */}
      <div className="flex flex-col gap-14 md:hidden">
        {programs.map((program, i) => (
          <div key={program.name}>
            <p className="eyebrow text-sky-deep">
              Program {String(i + 1).padStart(2, '0')}
              {program.lead && ' · I would lead this'}
            </p>
            <h3 className="mt-4 font-display text-3xl text-navy">{program.name}</h3>
            <p className="measure mt-4 text-slate">{program.blurb}</p>
            <div className="mt-6 flex aspect-[4/3] flex-col justify-end bg-navy p-7">
              <p className="font-display text-4xl leading-none text-ivory">{program.costLabel}</p>
              <p className="eyebrow mt-3 text-sky">Cost for the year</p>
            </div>
            <p className="text-caption mt-4 text-muted-ink">
              {program.calculation}
              <Footnote ids={program.sources} className="ml-1" />
              {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
