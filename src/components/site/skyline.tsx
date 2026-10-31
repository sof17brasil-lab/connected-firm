import { useRef } from 'react'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import { cn } from '@/lib/utils'

/**
 * An original New York skyline drawn as ONE continuous line, left to right,
 * so it sketches on like a single pen stroke.
 *
 * Everything is a stroke: one path, `fill="none"`, no rects, no polygons and
 * no second subpath. A filled shape cannot be drawn by a dash animation, and
 * a second `M` restarts the line, which is what left pieces of the earlier
 * versions unfinished. The pen goes up and back down each building rather
 * than lifting, including the Chrysler's crown, which is traced as a set of
 * stepped arcs on the way up and mirrored on the way down.
 *
 * The viewBox has room above the tallest mast and the SVG is `overflow-
 * visible`, so nothing is clipped at the edges.
 */
export const SKYLINE_PATH = [
  'M 0 150',
  // Low blocks stepping up from the left edge.
  'L 40 150 L 40 120 L 66 120 L 66 150',
  'L 92 150 L 92 98 L 100 90 L 108 98 L 108 150',
  'L 134 150 L 134 126 L 168 126 L 168 150',
  // A slim tower with a mast: up, out to the tip, and back down.
  'L 190 150 L 190 74 L 196 74 L 196 54 L 198 54 L 198 74 L 204 74 L 204 150',
  'L 230 150 L 230 112 L 258 112 L 258 150',
  // Empire State: three setbacks up, mast, then the same steps back down.
  'L 282 150 L 282 94 L 294 94 L 294 66 L 302 66 L 302 46',
  'L 310 46 L 310 24 L 312 24 L 312 10 L 314 10 L 314 24 L 316 24',
  'L 316 46 L 324 46 L 324 66 L 332 66 L 332 94 L 344 94 L 344 150',
  'L 368 150 L 368 118 L 394 118 L 394 150',
  // Chrysler: up the left flank, three stepped arcs to the needle, back down.
  'L 418 150 L 418 92',
  'Q 420 80 430 74',
  'Q 434 66 438 60',
  'Q 441 54 444 48',
  'L 445 20 L 446 20 L 446 48',
  'Q 449 54 452 60',
  'Q 456 66 460 74',
  'Q 470 80 472 92',
  'L 472 150',
  // Right flank back to the baseline.
  'L 500 150 L 500 106 L 536 106 L 536 150',
  'L 560 150 L 560 132 L 578 132 L 578 114 L 598 114 L 598 150',
  'L 640 150',
].join(' ')

export function Skyline({
  className,
  /** Render it finished, with no animation. Used to check the shape. */
  still = false,
}: {
  className?: string
  still?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useScrollScrub(
    ref,
    (p) => {
      if (still) return
      pathRef.current?.setAttribute('stroke-dashoffset', String(1 - p))
    },
    { start: 'top bottom', end: 'top 58%', scrub: 0.7 },
  )

  return (
    <div ref={ref} className={cn('w-full', className)} aria-hidden="true">
      <svg
        viewBox="0 0 640 158"
        preserveAspectRatio="xMidYMax meet"
        className="h-[clamp(9rem,22vw,20rem)] w-full overflow-visible"
        fill="none"
      >
        <path
          ref={pathRef}
          d={SKYLINE_PATH}
          fill="none"
          stroke="var(--color-navy)"
          strokeOpacity={0.34}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={0}
        />
      </svg>
    </div>
  )
}
