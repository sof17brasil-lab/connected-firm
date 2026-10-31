/**
 * Pieces of the outline chart language: thin strokes only, solid where the
 * value is the point and dashed where it is context, values in a pill on the
 * mark itself, no axis and no legend.
 *
 * Drawing is driven from outside rather than animated here. Every stroked
 * shape carries `pathLength="1"` with a normalised dash, so a parent can set
 * `stroke-dashoffset` from 0 to 1 and scrub the drawing with the scroll.
 * Everything renders fully drawn by default: if no one ever animates it, the
 * chart is still complete and readable.
 */

export const STROKE = 1.5
export const DASH = '5 4'

/** Marks a stroke as drawable and gives it its place in the stagger. */
function drawAttrs(order: number) {
  return {
    'data-draw': order,
    pathLength: 1,
    strokeDasharray: '1 1',
    strokeDashoffset: 0,
  } as const
}

/** Marks a dot or pill as poppable, for the same stagger. */
function popAttrs(order: number) {
  return { 'data-pop': order } as const
}

export function DrawPath({
  d,
  dashed,
  order = 0,
  className = 'stroke-ivory',
}: {
  d: string
  dashed?: boolean
  order?: number
  className?: string
}) {
  // A dashed context stroke cannot also use the dash array to draw itself, so
  // it fades in with the pop group instead.
  if (dashed) {
    return (
      <path
        d={d}
        fill="none"
        strokeWidth={STROKE}
        strokeDasharray={DASH}
        className={className}
        {...popAttrs(order)}
      />
    )
  }
  return <path d={d} fill="none" strokeWidth={STROKE} className={className} {...drawAttrs(order)} />
}

export function DrawRect({
  x,
  y,
  width,
  height,
  dashed,
  order = 0,
  className = 'stroke-ivory',
}: {
  x: number
  y: number
  width: number
  height: number
  dashed?: boolean
  order?: number
  className?: string
}) {
  if (dashed) {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        strokeWidth={STROKE}
        strokeDasharray={DASH}
        className={className}
        {...popAttrs(order)}
      />
    )
  }
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="none"
      strokeWidth={STROKE}
      className={className}
      {...drawAttrs(order)}
    />
  )
}

export function DrawCircle({
  cx,
  cy,
  r,
  dashed,
  order = 0,
  className = 'stroke-ivory',
}: {
  cx: number
  cy: number
  r: number
  dashed?: boolean
  order?: number
  className?: string
}) {
  if (dashed) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        strokeWidth={STROKE}
        strokeDasharray={DASH}
        className={className}
        {...popAttrs(order)}
      />
    )
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      strokeWidth={STROKE}
      className={className}
      {...drawAttrs(order)}
    />
  )
}

export function Dot({
  cx,
  cy,
  r = 4,
  order = 0,
  className = 'fill-ivory',
}: {
  cx: number
  cy: number
  r?: number
  order?: number
  className?: string
}) {
  return <circle cx={cx} cy={cy} r={r} className={className} {...popAttrs(order)} />
}

export function ValuePill({
  x,
  y,
  children,
  order = 0,
}: {
  x: number
  y: number
  children: string
  order?: number
}) {
  const w = Math.max(children.length * 8.4 + 20, 40)
  return (
    <g {...popAttrs(order)} style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - w / 2} y={y - 13} width={w} height={26} rx={13} className="fill-sky" />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        className="fill-navy"
        style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Manrope, sans-serif' }}
      >
        {children}
      </text>
    </g>
  )
}

export function AxisLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-ivory/70"
      style={{ fontSize: 12, fontFamily: 'Manrope, sans-serif' }}
    >
      {children}
    </text>
  )
}

/**
 * Scrubs the drawing of one chart. `progress` runs 0 to 1; strokes draw in
 * order, then the dots and pills arrive.
 */
export function drawChart(root: Element, progress: number) {
  const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
  const strokes = Array.from(root.querySelectorAll<SVGElement>('[data-draw]'))
  const pops = Array.from(root.querySelectorAll<SVGElement>('[data-pop]'))

  // Strokes take the first two thirds, the pills the last.
  strokes.forEach((el, i) => {
    const slice = 0.66 / Math.max(strokes.length, 1)
    const local = clamp((progress - i * slice * 0.75) / slice)
    el.setAttribute('stroke-dashoffset', String(1 - local))
  })

  pops.forEach((el, i) => {
    const start = 0.45 + (i * 0.5) / Math.max(pops.length, 1)
    const local = clamp((progress - start) / 0.22)
    el.setAttribute('opacity', String(local))
    if (el.tagName === 'g') {
      el.style.transform = `scale(${0.75 + 0.25 * local})`
    }
  })
}
