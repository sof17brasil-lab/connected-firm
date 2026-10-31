import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

function Word({
  children,
  progress,
  range,
  from,
  to,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  from: string
  to: string
}) {
  const color = useTransform(progress, range, [from, to])
  return (
    <motion.span style={{ color }}>
      {children}{' '}
    </motion.span>
  )
}

/**
 * A two-tone pull quote: the first clause sits in slate, the second arrives in
 * sky word by word as the quote scrolls through. Both halves are legible from
 * the moment they render — the reveal only changes colour, never opacity.
 */
export function PullQuote({
  first,
  second,
  className,
}: {
  first: string
  second: string
  className?: string
}) {
  const ref = useRef<HTMLQuoteElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'center 0.4'],
  })

  const words = second.trim().split(/\s+/)

  return (
    <blockquote
      ref={ref}
      className={cn(
        'font-display text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2]',
        className,
      )}
    >
      <span className="text-slate">{first} </span>
      {reducedMotion ? (
        <span className="text-sky-deep">{second}</span>
      ) : (
        words.map((word, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, Math.min((i + 1.4) / words.length, 1)]}
            from="#2B3445"
            to="#3D6CA6"
          >
            {word}
          </Word>
        ))
      )}
    </blockquote>
  )
}
