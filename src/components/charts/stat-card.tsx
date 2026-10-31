import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Footnote } from '@/components/site/footnote'
import { EASE } from '@/components/site/reveal'
import { useCardCounter } from '@/components/site/card-counter'
import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  /** "61%" — the number, set in the accent colour. */
  figure: string
  /** Italic connector between figure and subject, e.g. "of". */
  connector?: string
  /** "lawyers" — completes the headline next to the figure. */
  subject: string
  /** The rest of the sentence, quiet, beneath. */
  body: string
  sources: number[]
  /** One of the six outline charts. */
  chart: (animate: boolean) => React.ReactNode
  /** Background photo. Falls back to a navy panel until photos arrive. */
  photo?: string
  caveat?: string
  className?: string
  /** Which way the card slides in from; alternate it down a column. */
  from?: 'left' | 'right'
}

/**
 * A numbered data card: outline chart on a darkened panel, with the sentence
 * doing the talking underneath. One idea per card.
 *
 * The photo is always overlaid with a heavy navy scrim — the chart is thin
 * ivory strokes and has to stay legible whatever the image behind it.
 */
export function StatCard({
  figure,
  connector,
  subject,
  body,
  sources,
  chart,
  photo,
  caveat,
  className,
  from = 'left',
}: StatCardProps) {
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const counter = useCardCounter()
  const indexRef = useRef<number | null>(null)
  const [index, setIndex] = useState<number | null>(null)

  // Register once so the fixed counter knows how many cards exist.
  useEffect(() => {
    if (!counter || indexRef.current != null) return
    indexRef.current = counter.register()
    setIndex(indexRef.current)
  }, [counter])

  // Claim the counter while this card is the one on screen.
  useEffect(() => {
    if (inView && counter && index != null) counter.setCurrent(index)
  }, [inView, counter, index])

  const animate = inView && !reducedMotion

  return (
    <motion.figure
      ref={ref}
      className={cn('w-full max-w-[34rem]', className)}
      initial={reducedMotion ? false : { opacity: 0, scale: 0.88, x: from === 'left' ? -56 : 56, y: 72 }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div className="relative isolate overflow-hidden rounded-sm bg-navy">
        {photo && (
          <img src={photo} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        )}
        {/* Scrim: keeps thin ivory strokes readable over any photograph. */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy/85" />

        <div className="relative px-6 py-10 md:px-10 md:py-12">
          {index != null && (
            <p className="eyebrow tabular absolute right-5 top-5 text-ivory/45">
              {String(index).padStart(2, '0')}
            </p>
          )}

          <div className="mx-auto max-w-sm">{chart(animate)}</div>

          <motion.figcaption
            className="mt-8 text-center"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            <p className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-tight text-sky">
              {figure}
              {connector && <em className="italic text-ivory/70"> {connector} </em>}
              {!connector && ' '}
              <span className="text-ivory">{subject}</span>
            </p>
            <p className="mx-auto mt-4 max-w-md text-ivory/75">
              {body}
              <Footnote ids={sources} tone="dark" className="ml-1" />
            </p>
            {caveat && <p className="text-caption mx-auto mt-3 max-w-md text-ivory/50">{caveat}</p>}
          </motion.figcaption>
        </div>
      </div>
    </motion.figure>
  )
}
