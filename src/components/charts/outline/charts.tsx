import { AxisLabel, Dot, DrawCircle, DrawPath, DrawRect, ValuePill } from './primitives'

/**
 * The six outline chart types. Each takes already-computed values — none of
 * them derives or rounds a number, so what is drawn is what data.ts holds.
 */

const VB = { w: 420, h: 240 }

export interface BarDatum {
  label: string
  value: number
  display: string
  highlight?: boolean
}

/** Outlined bars. Solid for the one that matters, dashed for context. */
export function OutlineBars({ data, animate, max }: { data: BarDatum[]; animate: boolean; max?: number }) {
  const ceiling = max ?? Math.max(...data.map((d) => d.value)) * 1.25
  const slot = VB.w / data.length
  const barW = Math.min(slot * 0.54, 56)
  const floor = VB.h - 34

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      {data.map((d, i) => {
        const h = (d.value / ceiling) * (floor - 46)
        const x = slot * i + slot / 2
        return (
          <g key={d.label}>
            <DrawRect
              x={x - barW / 2}
              y={floor - h}
              width={barW}
              height={h}
              dashed={!d.highlight}
              animate={animate}
              delay={i * 0.08}
              className={d.highlight ? 'stroke-ivory' : 'stroke-ivory/45'}
            />
            <ValuePill x={x} y={floor - h - 16} animate={animate} delay={0.35 + i * 0.08}>
              {d.display}
            </ValuePill>
            <AxisLabel x={x} y={floor + 16}>
              {d.label}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

/** A solid rectangle for the share, dashed for the remainder. */
export function ProportionRect({
  pct,
  display,
  animate,
}: {
  pct: number
  display: string
  animate: boolean
}) {
  const left = 40
  const right = VB.w - 40
  const top = 60
  const bottom = VB.h - 60
  const split = left + (right - left) * (pct / 100)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawRect
        x={left}
        y={top}
        width={split - left}
        height={bottom - top}
        animate={animate}
      />
      <DrawRect
        x={split}
        y={top}
        width={right - split}
        height={bottom - top}
        dashed
        animate={animate}
        delay={0.2}
        className="stroke-ivory/45"
      />
      <Dot cx={left} cy={(top + bottom) / 2} r={3} animate={animate} delay={0.5} />
      <Dot cx={split} cy={(top + bottom) / 2} r={6} animate={animate} delay={0.55} />
      <ValuePill x={(left + split) / 2} y={(top + bottom) / 2} animate={animate} delay={0.6}>
        {display}
      </ValuePill>
    </svg>
  )
}

/** An arc swept to the share of the circle, with a dot at the head. */
export function ArcChart({
  pct,
  display,
  animate,
}: {
  pct: number
  display: string
  animate: boolean
}) {
  const cx = VB.w / 2
  const cy = VB.h / 2
  const r = 74
  const angle = (pct / 100) * Math.PI * 2 - Math.PI / 2
  const endX = cx + Math.cos(angle) * r
  const endY = cy + Math.sin(angle) * r
  const large = pct > 50 ? 1 : 0

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawCircle cx={cx} cy={cy} r={r} dashed animate={animate} className="stroke-ivory/35" />
      <DrawPath
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${endX} ${endY}`}
        animate={animate}
        delay={0.2}
      />
      <Dot cx={cx} cy={cy - r} r={3} animate={animate} delay={0.5} />
      <Dot cx={endX} cy={endY} r={6} animate={animate} delay={0.9} />
      <ValuePill x={cx} y={cy} animate={animate} delay={0.7}>
        {display}
      </ValuePill>
    </svg>
  )
}

/** Concentric rings: outer dashed context, inner solid value. */
export function RingsChart({
  pct,
  display,
  animate,
}: {
  pct: number
  display: string
  animate: boolean
}) {
  const cx = VB.w / 2
  const cy = VB.h / 2
  const outer = 86
  const inner = outer * Math.sqrt(pct / 100)

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      <DrawCircle cx={cx} cy={cy} r={outer} dashed animate={animate} className="stroke-ivory/35" />
      <DrawCircle cx={cx} cy={cy} r={inner} animate={animate} delay={0.25} />
      <Dot cx={cx + inner} cy={cy} r={5} animate={animate} delay={0.7} />
      <ValuePill x={cx} y={cy} animate={animate} delay={0.6}>
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
  animate,
}: {
  filled: number
  total: number
  display: string
  animate: boolean
}) {
  const cols = Math.min(total, 10)
  const rows = Math.ceil(total / cols)
  const r = 17
  const gapX = r * 2.05
  const gapY = r * 2.2
  const startX = VB.w / 2 - ((cols - 1) * gapX) / 2
  const startY = VB.h / 2 - ((rows - 1) * gapY) / 2 - 12

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
            animate={animate}
            delay={i * 0.04}
            className={on ? 'stroke-ivory' : 'stroke-ivory/35'}
          />
        )
      })}
      <ValuePill x={VB.w / 2} y={VB.h - 34} animate={animate} delay={0.7}>
        {display}
      </ValuePill>
    </svg>
  )
}

export interface ConstellationNode {
  x: number
  y: number
  filled?: boolean
}

/**
 * Connected dots around a central value.
 *
 * Deliberately not a map: the node positions are decorative and carry no
 * geography, because the research gives office counts, not locations.
 */
export function Constellation({
  nodes,
  display,
  animate,
}: {
  nodes: ConstellationNode[]
  display: string
  animate: boolean
}) {
  const cx = VB.w / 2
  const cy = VB.h / 2

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img">
      {nodes.map((n, i) => (
        <DrawPath
          key={`l${i}`}
          d={`M ${cx} ${cy} L ${n.x} ${n.y}`}
          animate={animate}
          delay={i * 0.05}
          className="stroke-ivory/30"
        />
      ))}
      {nodes.map((n, i) =>
        n.filled ? (
          <Dot key={`d${i}`} cx={n.x} cy={n.y} r={5} animate={animate} delay={0.4 + i * 0.04} />
        ) : (
          <DrawCircle
            key={`d${i}`}
            cx={n.x}
            cy={n.y}
            r={5}
            animate={animate}
            delay={0.4 + i * 0.04}
            className="stroke-ivory/70"
          />
        ),
      )}
      <ValuePill x={cx} y={cy} animate={animate} delay={0.8}>
        {display}
      </ValuePill>
    </svg>
  )
}
