import { useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import { cn } from '@/lib/utils'

/**
 * A paragraph that arrives a line at a time, each line easing from pale to
 * full as the block scrolls through. Lines are given explicitly rather than
 * wrapped, so the cascade matches where the text actually breaks.
 *
 * Nothing drops below 18% opacity, so the paragraph is legible throughout.
 */
export function LineReveal({
  paragraphs,
  className,
  tone = 'light',
}: {
  paragraphs: string[][]
  className?: string
  tone?: 'light' | 'dark'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const lines = useRef<HTMLSpanElement[]>([])
  const reducedMotion = useReducedMotion()
  const dark = tone === 'dark'

  useScrollScrub(
    ref,
    (p) => {
      const nodes = lines.current
      nodes.forEach((node, i) => {
        if (!node) return
        const start = (i / nodes.length) * 0.82
        const local = Math.min(Math.max((p - start) / 0.22, 0), 1)
        node.style.opacity = String(0.18 + 0.82 * local)
      })
    },
    { start: 'top 82%', end: 'bottom 55%', scrub: 0.6 },
  )

  let index = -1

  return (
    <div ref={ref} className={cn('flex flex-col gap-7', className)}>
      {paragraphs.map((para, pi) => (
        <p
          key={pi}
          className={cn(
            'font-display text-[clamp(1.2rem,2vw,1.75rem)] leading-[1.45]',
            dark ? 'text-ivory' : 'text-navy',
          )}
        >
          {para.map((line) => {
            index += 1
            const i = index
            return (
              <span
                key={i}
                ref={(node) => {
                  if (node) lines.current[i] = node
                }}
                className="block"
                style={{ opacity: reducedMotion ? 1 : 0.18 }}
              >
                {line}
              </span>
            )
          })}
        </p>
      ))}
    </div>
  )
}
