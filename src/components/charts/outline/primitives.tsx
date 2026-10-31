import { motion } from 'framer-motion'
import { EASE } from '@/components/site/reveal'

/**
 * Shared pieces of the outline chart language: everything is a thin stroke,
 * solid where the value is the point and dashed where it is only context.
 * Values sit in a pill on the mark itself, so no axis or legend is needed.
 */

export const STROKE = 1.5
export const DASH = '5 4'

/** Draws a stroked path on as the chart enters. */
export function DrawPath({
  d,
  dashed,
  delay = 0,
  animate,
  className = 'stroke-ivory',
}: {
  d: string
  dashed?: boolean
  delay?: number
  animate: boolean
  className?: string
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={STROKE}
      strokeDasharray={dashed ? DASH : undefined}
      className={className}
      initial={animate ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    />
  )
}

export function DrawRect({
  x,
  y,
  width,
  height,
  dashed,
  delay = 0,
  animate,
  className = 'stroke-ivory',
}: {
  x: number
  y: number
  width: number
  height: number
  dashed?: boolean
  delay?: number
  animate: boolean
  className?: string
}) {
  return (
    <motion.rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="none"
      strokeWidth={STROKE}
      strokeDasharray={dashed ? DASH : undefined}
      className={className}
      initial={animate ? { opacity: 0, scaleY: 0.6 } : false}
      animate={{ opacity: 1, scaleY: 1 }}
      style={{ transformOrigin: `${x + width / 2}px ${y + height}px` }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    />
  )
}

export function DrawCircle({
  cx,
  cy,
  r,
  dashed,
  delay = 0,
  animate,
  className = 'stroke-ivory',
}: {
  cx: number
  cy: number
  r: number
  dashed?: boolean
  delay?: number
  animate: boolean
  className?: string
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      strokeWidth={STROKE}
      strokeDasharray={dashed ? DASH : undefined}
      className={className}
      initial={animate ? { opacity: 0, scale: 0.82 } : false}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    />
  )
}

/** Endpoint marker: a small filled dot. */
export function Dot({
  cx,
  cy,
  r = 4,
  delay = 0,
  animate,
  className = 'fill-ivory',
}: {
  cx: number
  cy: number
  r?: number
  delay?: number
  animate: boolean
  className?: string
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      className={className}
      initial={animate ? { opacity: 0, scale: 0 } : false}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    />
  )
}

/** The value pill that sits directly on the data. */
export function ValuePill({
  x,
  y,
  children,
  delay = 0,
  animate,
}: {
  x: number
  y: number
  children: string
  delay?: number
  animate: boolean
}) {
  const w = Math.max(children.length * 7.4 + 16, 34)
  return (
    <motion.g
      initial={animate ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      <rect x={x - w / 2} y={y - 11} width={w} height={22} rx={11} className="fill-sky" />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        className="fill-navy"
        style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Manrope, sans-serif' }}
      >
        {children}
      </text>
    </motion.g>
  )
}

/** Small lowercase category label under a mark. */
export function AxisLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-ivory/70"
      style={{ fontSize: 10, fontFamily: 'Manrope, sans-serif' }}
    >
      {children}
    </text>
  )
}
