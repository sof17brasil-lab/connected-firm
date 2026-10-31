import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import { cn } from '@/lib/utils'

/**
 * A two-tone pull quote: the first clause sits in slate, the second turns to
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
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const reducedMotion = useReducedMotion()
  const words = second.trim().split(/\s+/)

  useScrollScrub(
    ref,
    (p) => {
      wordsRef.current.forEach((node, i) => {
        if (!node) return
        const start = i / words.length
        const local = Math.min(Math.max((p - start) / (1.4 / words.length), 0), 1)
        node.style.color = local > 0.5 ? '#3D6CA6' : '#2B3445'
      })
    },
    { start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
  )

  return (
    <blockquote
      ref={ref}
      className={cn('font-display text-[clamp(1.7rem,3.6vw,3.2rem)] leading-[1.2]', className)}
    >
      <span className="text-slate">{first} </span>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(node) => {
            if (node) wordsRef.current[i] = node
          }}
          style={{ color: reducedMotion ? '#3D6CA6' : '#2B3445' }}
        >
          {word}{' '}
        </span>
      ))}
    </blockquote>
  )
}
