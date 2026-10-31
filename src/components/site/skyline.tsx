import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * An original single-line New York skyline, drawn rather than traced: one
 * continuous stroke with a stepped Empire State and spire near the middle,
 * the Chrysler's tiered crown to its right, and anonymous towers either side.
 *
 * It strokes itself on as the closing line scrolls past.
 */
const PATH = [
  'M 0 150',
  'L 46 150 L 46 118 L 74 118 L 74 150',
  'L 104 150 L 104 96 L 112 88 L 120 96 L 120 150',
  'L 150 150 L 150 124 L 186 124 L 186 150',
  'L 208 150 L 208 72 L 214 72 L 214 56 L 216 56 L 216 72 L 222 72 L 222 150',
  'L 248 150 L 248 110 L 278 110 L 278 150',
  // Empire State: three setbacks into a tapered mast.
  'L 300 150 L 300 92 L 312 92 L 312 64 L 320 64 L 320 44',
  'L 328 44 L 328 22 L 330 22 L 330 8 L 332 8 L 332 22 L 334 22',
  'L 334 44 L 342 44 L 342 64 L 350 64 L 350 92 L 362 92 L 362 150',
  'L 386 150 L 386 116 L 412 116 L 412 150',
  // Chrysler: tiered crown of shallow arcs, then the needle.
  'L 436 150 L 436 86',
  'L 436 78 Q 452 60 468 78 L 468 86',
  'M 440 72 Q 452 56 464 72',
  'M 444 62 Q 452 50 460 62',
  'M 452 50 L 452 26 L 453 26 L 453 50',
  'M 468 86 L 468 150',
  'L 498 150 L 498 104 L 536 104 L 536 150',
  'L 560 150 L 560 130 L 578 130 L 578 112 L 598 112 L 598 150',
  'L 640 150',
].join(' ')

export function Skyline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // A long window, so the drawing lasts the whole approach rather than
    // finishing before it is properly on screen.
    offset: ['start end', 'end 0.55'],
  })

  const drawn = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])
  const settled = useMotionValue(1)

  // Always hand framer-motion a MotionValue for pathLength. Swapping between
  // a plain number and a MotionValue leaves the dash properties unset, and
  // the path renders fully drawn from the start.
  const pathLength = reducedMotion ? settled : drawn

  return (
    <div ref={ref} className={cn('w-full', className)} aria-hidden="true">
      <svg
        viewBox="0 0 640 160"
        preserveAspectRatio="xMidYMax meet"
        className="h-[clamp(9rem,22vw,20rem)] w-full"
        fill="none"
      >
        <motion.path
          d={PATH}
          stroke="var(--color-navy)"
          strokeOpacity={0.32}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}
