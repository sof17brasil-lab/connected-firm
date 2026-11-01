import { useRef } from 'react'
import { drawChart } from './primitives'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * Draws whatever outline chart it wraps as the chart scrolls through the
 * screen, and un-draws it on the way back.
 *
 * The lead-in and tail keep the chart from finishing while it is still half
 * below the fold. Under reduced motion `useScrollScrub` calls back once with
 * 1, so the chart simply renders complete.
 */
export function Drawn({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollScrub(
    ref,
    (p) => {
      if (ref.current) drawChart(ref.current, clamp01((p - 0.1) / 0.55))
    },
    { start: 'top 88%', end: 'bottom 45%', scrub: 0.8 },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
