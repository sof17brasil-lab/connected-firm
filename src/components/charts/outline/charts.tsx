import { AxisLabel, Dot, DrawCircle, DrawPath, DrawRect, ValuePill } from './primitives'

/**
 * The outline chart types. None of them derives or rounds a number: what is
 * drawn is what data.ts holds. Drawing order is set by `order`, which the
 * parent uses to stagger the scrub.
 */

const VB = { w: 440, h: 300 }

export interface BarDatum {
  label: string
  value: number
  display: string
  highlight?: boolean
}

/** Outlined bars. Solid for the one that matters, dashed for context. */
export function OutlineBars({ data, max }: { data: BarDatum[]; max?: number }) {
  const ceiling = max ?? Math.max(...data.map((d) => d.value)) * 1.25
  const slot = VB.w / data.length
  // Two-bar comparisons read as slivers at the old cap.
  const barW = Math.min(slot * 0.56, data.length <= 2 ? 124 : 68)
  const floor = VB.h - 42

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      {data.map((d, i) => {
        const h = (d.value / ceiling) * (floor - 56)
        const x = slot * i + slot / 2
        return (
          <g key={d.label}>
            <DrawRect
              x={x - barW / 2}
              y={floor - h}
              width={barW}
              height={h}
              dashed={!d.highlight}
              faint={!d.highlight}
              order={i}
            />
            <ValuePill x={x} y={floor - h - 20} order={i}>
              {d.display}
            </ValuePill>
            <AxisLabel x={x} y={floor + 20}>
              {d.label}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

/** A solid rectangle for the share, dashed for the remainder. */
export function ProportionRect({ pct, display }: { pct: number; display: string }) {
  const left = 40
  const right = VB.w - 40
  const top = 80
  const bottom = VB.h - 80
  const split = left + (right - left) * (pct / 100)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawRect x={left} y={top} width={split - left} height={bottom - top} order={0} />
      <DrawRect
        x={split}
        y={top}
        width={right - split}
        height={bottom - top}
        dashed
        faint
        order={1}
      />
      <Dot cx={left} cy={(top + bottom) / 2} r={3} order={1} />
      <Dot cx={split} cy={(top + bottom) / 2} r={6} order={2} />
      <ValuePill x={(left + split) / 2} y={(top + bottom) / 2} order={3}>
        {display}
      </ValuePill>
    </svg>
  )
}

/** An arc swept to the share of the circle, with a dot at the head. */
export function ArcChart({ pct, display }: { pct: number; display: string }) {
  const cx = VB.w / 2
  const cy = VB.h / 2
  const r = 96
  const angle = (pct / 100) * Math.PI * 2 - Math.PI / 2
  const endX = cx + Math.cos(angle) * r
  const endY = cy + Math.sin(angle) * r
  const large = pct > 50 ? 1 : 0

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawCircle cx={cx} cy={cy} r={r} dashed faint order={0} />
      <DrawPath d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${endX} ${endY}`} order={0} />
      <Dot cx={cx} cy={cy - r} r={3} order={1} />
      <Dot cx={endX} cy={endY} r={7} order={2} />
      <ValuePill x={cx} y={cy} order={3}>
        {display}
      </ValuePill>
    </svg>
  )
}

/** Concentric rings: outer dashed context, inner solid value. */
export function RingsChart({ pct, display }: { pct: number; display: string }) {
  const cx = VB.w / 2
  const cy = VB.h / 2
  const outer = 108
  const inner = outer * Math.sqrt(pct / 100)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawCircle cx={cx} cy={cy} r={outer} dashed faint order={0} />
      <DrawCircle cx={cx} cy={cy} r={inner} order={0} />
      <Dot cx={cx + inner} cy={cy} r={6} order={1} />
      <ValuePill x={cx} y={cy} order={2}>
        {display}
      </ValuePill>
    </svg>
  )
}

/** Pictograph: a grid of circles, filled to the share. */
export function UnitCircles({
  filled,
  total,
  display,
}: {
  filled: number
  total: number
  display: string
}) {
  const cols = Math.min(total, 5)
  const rows = Math.ceil(total / cols)
  const r = 26
  const gapX = r * 2.15
  const gapY = r * 2.3
  const startX = VB.w / 2 - ((cols - 1) * gapX) / 2
  const startY = VB.h / 2 - ((rows - 1) * gapY) / 2 - 18

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      {Array.from({ length: total }, (_, i) => {
        const cx = startX + (i % cols) * gapX
        const cy = startY + Math.floor(i / cols) * gapY
        const on = i < Math.round(filled)
        return (
          <DrawCircle key={i} cx={cx} cy={cy} r={r} dashed={!on} faint={!on} order={i} />
        )
      })}
      <ValuePill x={VB.w / 2} y={VB.h - 36} order={total}>
        {display}
      </ValuePill>
    </svg>
  )
}

/**
 * A hundred lawyers, ten by ten.
 *
 * Every fifth circle is drawn in sky, which is the published attrition rate
 * made visible; one of those is filled solid, and that single filled circle
 * is the whole business case — one percentage point of the population.
 */
export function HundredGrid({
  leaving,
  keptIndex = 49,
}: {
  /** How many of the hundred leave in a year. */
  leaving: number
  /** Which circle is the one the program keeps. */
  keptIndex?: number
}) {
  const cols = 10
  const r = 14
  const gap = 42
  const w = 440
  const h = 440
  const startX = w / 2 - ((cols - 1) * gap) / 2
  const startY = h / 2 - ((cols - 1) * gap) / 2
  // Every nth circle, so the rate reads off the grid rather than a caption.
  const every = Math.max(Math.round(100 / leaving), 1)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {Array.from({ length: 100 }, (_, i) => {
        const cx = startX + (i % cols) * gap
        const cy = startY + Math.floor(i / cols) * gap
        const leaves = i % every === every - 1
        const kept = i === keptIndex
        return (
          <DrawCircle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            faint={!leaves}
            fill={kept ? 'fill-sky' : undefined}
            order={i}
            className={leaves ? 'stroke-sky' : 'stroke-current'}
          />
        )
      })}
    </svg>
  )
}

/** A step-by-step flow: each step's figure, joined by a drawn line. */
export function StepFlow({ steps }: { steps: { label: string; value: string }[] }) {
  const w = 880
  const h = 190
  const slot = w / steps.length
  const y = 96

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {steps.slice(0, -1).map((step, i) => (
        <DrawPath
          key={`link-${step.label}`}
          d={`M ${slot * i + slot / 2 + 58} ${y} L ${slot * (i + 1) + slot / 2 - 58} ${y}`}
          order={i}
        />
      ))}
      {steps.map((step, i) => {
        const x = slot * i + slot / 2
        return (
          <g key={step.label}>
            <ValuePill x={x} y={y} order={i}>
              {step.value}
            </ValuePill>
            <AxisLabel x={x} y={y + 42}>
              {step.label}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

export interface SeriesPoint {
  x: number
  y: number | null
}

/**
 * A line chart with one solid series, one dashed series, a dashed reference
 * line and an optional gap marked between the last point and that line.
 */
export function OutlineLines({
  solid,
  dashed,
  reference,
  referenceLabel,
  gapLabel,
  domain,
  range,
  format,
}: {
  solid: SeriesPoint[]
  dashed?: SeriesPoint[]
  reference?: number
  referenceLabel?: string
  gapLabel?: string
  domain: [number, number]
  range: [number, number]
  format: (y: number) => string
}) {
  const w = 880
  const h = 380
  const pad = { top: 42, right: 110, bottom: 48, left: 28 }
  const px = (x: number) =>
    pad.left + ((x - domain[0]) / (domain[1] - domain[0])) * (w - pad.left - pad.right)
  const py = (y: number) =>
    h - pad.bottom - ((y - range[0]) / (range[1] - range[0])) * (h - pad.top - pad.bottom)

  const line = (points: SeriesPoint[]) =>
    points
      .filter((p): p is { x: number; y: number } => p.y !== null)
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.x)} ${py(p.y)}`)
      .join(' ')

  const lastSolid = [...solid].reverse().find((p) => p.y !== null)
  const lastDashed = dashed && [...dashed].reverse().find((p) => p.y !== null)
  const end = lastDashed ?? lastSolid

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {reference !== undefined && (
        <>
          <DrawPath
            d={`M ${pad.left} ${py(reference)} L ${w - pad.right} ${py(reference)}`}
            dashed
            order={0}
          />
          {referenceLabel && (
            <text
              x={w - pad.right + 12}
              y={py(reference) + 5}
              className="fill-current"
              fillOpacity={0.75}
              style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif' }}
            >
              {referenceLabel}
            </text>
          )}
        </>
      )}

      <DrawPath d={line(solid)} order={0} />
      {dashed && <DrawPath d={line(dashed)} dashed faint order={1} />}

      {/* The gap itself: a vertical tick from the last point to the line. */}
      {reference !== undefined && end?.y != null && gapLabel && (
        <>
          <DrawPath
            d={`M ${px(end.x)} ${py(end.y)} L ${px(end.x)} ${py(reference)}`}
            order={2}
          />
          <ValuePill x={px(end.x)} y={(py(end.y) + py(reference)) / 2} order={3}>
            {gapLabel}
          </ValuePill>
        </>
      )}

      {solid
        .filter((p): p is { x: number; y: number } => p.y !== null)
        .map((p, i) => (
          <Dot key={`d-${p.x}`} cx={px(p.x)} cy={py(p.y)} r={4} order={i} />
        ))}

      {[...solid, ...(dashed ?? [])]
        .map((p) => p.x)
        .filter((x, i, all) => all.indexOf(x) === i)
        .map((x) => (
          <AxisLabel key={`x-${x}`} x={px(x)} y={h - 16}>
            {String(x)}
          </AxisLabel>
        ))}

      {lastSolid?.y != null && (
        <ValuePill x={px(lastSolid.x)} y={py(lastSolid.y) - 26} order={1}>
          {format(lastSolid.y)}
        </ValuePill>
      )}
    </svg>
  )
}

/** One bar split into its parts, each labelled with its share. */
export function SplitBar({
  parts,
  total,
}: {
  parts: { label: string; value: number; display: string }[]
  total: number
}) {
  const w = 880
  const h = 210
  const left = 10
  const right = w - 10
  const top = 36
  const bottom = 104
  let x = left

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {parts.map((part, i) => {
        const width = ((right - left) * part.value) / total
        const at = x
        x += width
        return (
          <g key={part.label}>
            <DrawRect x={at} y={top} width={width} height={bottom - top} order={i} />
            <ValuePill x={at + width / 2} y={(top + bottom) / 2} order={i}>
              {part.display}
            </ValuePill>
            <AxisLabel x={at + width / 2} y={bottom + 28}>
              {part.label}
            </AxisLabel>
            {/* One decimal, so the four shares add to 100 rather than 101. */}
            <AxisLabel x={at + width / 2} y={bottom + 48}>
              {`${((part.value / total) * 100).toFixed(1)}%`}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

/**
 * Bars across a wide frame, with an optional dashed reference line.
 *
 * Used where there are too many bars for the square frame: the nine firms,
 * and the sensitivity run. Labels wrap onto a second line rather than being
 * truncated or turned on their side.
 */
export function WideBars({
  data,
  max,
  reference,
  referenceLabel,
  height = 400,
}: {
  data: BarDatum[]
  max?: number
  reference?: number
  referenceLabel?: string
  height?: number
}) {
  const w = 880
  const h = height
  const ceiling = max ?? Math.max(...data.map((d) => d.value)) * 1.3
  const slot = w / data.length
  const barW = Math.min(slot * 0.5, 72)
  const floor = h - 62
  const top = 52
  const scale = (v: number) => ((v / ceiling) * (floor - top))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
      {reference !== undefined && (
        <>
          <DrawPath d={`M 8 ${floor - scale(reference)} L ${w - 8} ${floor - scale(reference)}`} dashed order={0} />
          {referenceLabel && (
            <text
              x={8}
              y={floor - scale(reference) - 10}
              className="fill-current"
              fillOpacity={0.75}
              style={{ fontSize: 13, fontFamily: 'Manrope, sans-serif' }}
            >
              {referenceLabel}
            </text>
          )}
        </>
      )}

      {data.map((d, i) => {
        const bh = scale(d.value)
        const x = slot * i + slot / 2
        const words = d.label.split(' ')
        const mid = Math.ceil(words.length / 2)
        const lines = words.length > 1 ? [words.slice(0, mid).join(' '), words.slice(mid).join(' ')] : words
        return (
          <g key={d.label}>
            <DrawRect
              x={x - barW / 2}
              y={floor - bh}
              width={barW}
              height={bh}
              dashed={!d.highlight}
              faint={!d.highlight}
              order={i}
            />
            <ValuePill x={x} y={floor - bh - 20} order={i}>
              {d.display}
            </ValuePill>
            {lines.map((line, j) => (
              <AxisLabel key={line + j} x={x} y={floor + 24 + j * 17}>
                {line}
              </AxisLabel>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
