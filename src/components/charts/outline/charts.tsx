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
              order={i}
              className={d.highlight ? 'stroke-ivory' : 'stroke-ivory/45'}
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
        order={1}
        className="stroke-ivory/45"
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
      <DrawCircle cx={cx} cy={cy} r={r} dashed order={0} className="stroke-ivory/35" />
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
      <DrawCircle cx={cx} cy={cy} r={outer} dashed order={0} className="stroke-ivory/35" />
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
          <DrawCircle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            dashed={!on}
            order={i}
            className={on ? 'stroke-ivory' : 'stroke-ivory/35'}
          />
        )
      })}
      <ValuePill x={VB.w / 2} y={VB.h - 36} order={total}>
        {display}
      </ValuePill>
    </svg>
  )
}
