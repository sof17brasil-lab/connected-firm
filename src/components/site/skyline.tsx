import { useRef } from 'react'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import { cn } from '@/lib/utils'

/**
 * An original single-line New York skyline, drawn rather than traced.
 *
 * Split into separate paths rather than one `d` with several subpaths: each
 * gets its own `pathLength="1"`, so each one's dash offset runs cleanly from
 * 1 to 0 and no part of the drawing can be left unfinished. They draw left to
 * right, so it reads as one continuous scribble.
 *
 * The baseline is continuous by construction — every segment below starts on
 * the point the previous one ended on, which `skyline.test.ts` asserts.
 */
export interface Segment {
  /** Where the stroke begins, for the continuity check. */
  from: [number, number]
  /** Where it ends. */
  to: [number, number]
  d: string
  /** Crown details float above the roofline and join nothing. */
  detached?: boolean
}

export const SKYLINE: Segment[] = [
  {
    from: [0, 150],
    to: [300, 150],
    d: 'M 0 150 L 46 150 L 46 118 L 74 118 L 74 150 L 104 150 L 104 96 L 112 88 L 120 96 L 120 150 L 150 150 L 150 124 L 186 124 L 186 150 L 208 150 L 208 72 L 214 72 L 214 56 L 216 56 L 216 72 L 222 72 L 222 150 L 248 150 L 248 110 L 278 110 L 278 150 L 300 150',
  },
  {
    // Empire State: three setbacks into a tapered mast.
    from: [300, 150],
    to: [386, 150],
    d: 'M 300 150 L 300 92 L 312 92 L 312 64 L 320 64 L 320 44 L 328 44 L 328 22 L 330 22 L 330 8 L 332 8 L 332 22 L 334 22 L 334 44 L 342 44 L 342 64 L 350 64 L 350 92 L 362 92 L 362 150 L 386 150',
  },
  {
    from: [386, 150],
    to: [436, 150],
    d: 'M 386 150 L 386 116 L 412 116 L 412 150 L 436 150',
  },
  {
    // Chrysler: up one side, over the crown, back down the other.
    from: [436, 150],
    to: [468, 150],
    d: 'M 436 150 L 436 78 Q 452 60 468 78 L 468 150',
  },
  { from: [440, 72], to: [464, 72], d: 'M 440 72 Q 452 56 464 72', detached: true },
  { from: [444, 62], to: [460, 62], d: 'M 444 62 Q 452 50 460 62', detached: true },
  { from: [452, 50], to: [452, 24], d: 'M 452 50 L 452 24', detached: true },
  {
    from: [468, 150],
    to: [640, 150],
    d: 'M 468 150 L 498 150 L 498 104 L 536 104 L 536 150 L 560 150 L 560 130 L 578 130 L 578 112 L 598 112 L 598 150 L 640 150',
  },
]

export function Skyline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const paths = useRef<SVGPathElement[]>([])

  useScrollScrub(
    ref,
    (p) => {
      const nodes = paths.current
      nodes.forEach((node, i) => {
        if (!node) return
        // Overlapping slices: each segment starts before the last finishes,
        // so the line keeps moving instead of stepping.
        const slice = 1 / nodes.length
        const start = i * slice * 0.86
        const local = Math.min(Math.max((p - start) / slice, 0), 1)
        node.setAttribute('stroke-dashoffset', String(1 - local))
      })
    },
    { start: 'top bottom', end: 'top 58%', scrub: 0.7 },
  )

  return (
    <div ref={ref} className={cn('w-full', className)} aria-hidden="true">
      <svg
        viewBox="0 0 640 160"
        preserveAspectRatio="xMidYMax meet"
        className="h-[clamp(9rem,22vw,20rem)] w-full"
        fill="none"
      >
        {SKYLINE.map((segment, i) => (
          <path
            key={i}
            ref={(node) => {
              if (node) paths.current[i] = node
            }}
            d={segment.d}
            stroke="var(--color-navy)"
            strokeOpacity={0.32}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={0}
          />
        ))}
      </svg>
    </div>
  )
}
