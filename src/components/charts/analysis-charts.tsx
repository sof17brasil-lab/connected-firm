import { useRef } from 'react'
import { drawChart } from '@/components/charts/outline/primitives'
import { AxisLabel, Dot, DrawPath, DrawRect, ValuePill } from '@/components/charts/outline/primitives'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import {
  BIG_LAW_AVERAGE,
  REVENUE_DATA,
  REVENUE_GOAL,
} from '@/lib/data'
import { PILOT_COST, costShares, growthRanking, sensitivity, shortfallM } from '@/lib/analysis'

const W = 760
const H = 380

/** Wraps a chart so it draws itself as it scrolls into view. */
function Drawn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollScrub(
    ref,
    (p) => {
      if (ref.current) drawChart(ref.current, Math.min(p / 0.72, 1))
    },
    { start: 'top 88%', end: 'bottom 62%', scrub: 0.7 },
  )
  return (
    <div ref={ref} className="w-full">
      {children}
    </div>
  )
}

/** a. The gap to $5bn. */
export function RevenueGapChart() {
  const pad = { l: 58, r: 40, t: 40, b: 46 }
  const years = REVENUE_DATA.map((d) => d.year)
  const xFor = (year: number) =>
    pad.l + ((year - years[0]) / (years[years.length - 1] - years[0])) * (W - pad.l - pad.r)
  const yFor = (v: number) => H - pad.b - ((v - 2.6) / (5.4 - 2.6)) * (H - pad.t - pad.b)

  const actual = REVENUE_DATA.filter((d) => d.actual != null)
  const projected = REVENUE_DATA.filter((d) => d.projected != null)
  const line = (pts: { year: number; v: number }[]) =>
    pts.map((p, i) => `${i ? 'L' : 'M'} ${xFor(p.year)} ${yFor(p.v)}`).join(' ')

  const last = REVENUE_DATA[REVENUE_DATA.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {[3, 4, 5].map((v) => (
        <AxisLabel key={v} x={pad.l - 26} y={yFor(v) + 4}>
          {`$${v}bn`}
        </AxisLabel>
      ))}
      {years.map((y) => (
        <AxisLabel key={y} x={xFor(y)} y={H - pad.b + 24}>
          {String(y)}
        </AxisLabel>
      ))}

      {/* The goal, and the distance still to go. */}
      <DrawPath
        d={`M ${pad.l} ${yFor(REVENUE_GOAL)} L ${W - pad.r} ${yFor(REVENUE_GOAL)}`}
        dashed
        order={0}
        className="stroke-navy/45"
      />
      <DrawPath
        d={`M ${xFor(last.year)} ${yFor(last.projected!)} L ${xFor(last.year)} ${yFor(REVENUE_GOAL)}`}
        dashed
        order={1}
        className="stroke-sky-deep"
      />
      <ValuePill x={xFor(last.year) - 56} y={(yFor(last.projected!) + yFor(REVENUE_GOAL)) / 2} order={4}>
        {`~$${shortfallM()}M short`}
      </ValuePill>

      <DrawPath d={line(actual.map((d) => ({ year: d.year, v: d.actual! })))} order={0} className="stroke-navy" />
      <DrawPath
        d={line(projected.map((d) => ({ year: d.year, v: d.projected! })))}
        dashed
        order={2}
        className="stroke-sky-deep"
      />

      {actual.map((d) => (
        <Dot key={d.year} cx={xFor(d.year)} cy={yFor(d.actual!)} r={4} order={2} className="fill-navy" />
      ))}
      <ValuePill x={xFor(2025) - 10} y={yFor(3.594) - 26} order={3}>
        $3.594bn
      </ValuePill>
      <AxisLabel x={xFor(2027)} y={yFor(4.223) + 26}>
        Projection, my estimate
      </AxisLabel>
      <AxisLabel x={pad.l + 74} y={yFor(REVENUE_GOAL) - 12}>
        $5bn goal
      </AxisLabel>
    </svg>
  )
}

/** b. Growing slower than rivals. */
export function GrowthRankingChart() {
  const data = growthRanking()
  const pad = { l: 150, r: 70, t: 30, b: 34 }
  const rowH = (H - pad.t - pad.b) / data.length
  const xFor = (v: number) => pad.l + (v / 24) * (W - pad.l - pad.r)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <DrawPath
        d={`M ${xFor(BIG_LAW_AVERAGE)} ${pad.t - 8} L ${xFor(BIG_LAW_AVERAGE)} ${H - pad.b}`}
        dashed
        order={0}
        className="stroke-navy/45"
      />
      <AxisLabel x={xFor(BIG_LAW_AVERAGE) + 48} y={pad.t - 14}>
        Big Law average ~13%
      </AxisLabel>

      {data.map((row, i) => {
        const y = pad.t + i * rowH + rowH * 0.2
        const h = rowH * 0.56
        return (
          <g key={row.firm}>
            <text
              x={pad.l - 14}
              y={y + h / 2 + 4}
              textAnchor="end"
              className={row.isWhiteCase ? 'fill-navy' : 'fill-muted-ink'}
              style={{ fontSize: 12, fontFamily: 'Manrope, sans-serif' }}
            >
              {row.firm}
            </text>
            <DrawRect
              x={pad.l}
              y={y}
              width={xFor(row.growth) - pad.l}
              height={h}
              dashed={!row.isWhiteCase}
              order={i}
              className={row.isWhiteCase ? 'stroke-sky-deep' : 'stroke-navy/35'}
            />
            <ValuePill x={xFor(row.growth) + 34} y={y + h / 2} order={i}>
              {`${row.growth.toFixed(2)}%`}
            </ValuePill>
          </g>
        )
      })}
    </svg>
  )
}

/** c. Where the $77,600 goes. */
export function CostSplitChart() {
  const shares = costShares()
  const pad = { l: 40, r: 40 }
  const top = 120
  const h = 86
  const width = W - pad.l - pad.r
  let cursor = pad.l

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {shares.map((share, i) => {
        const w = (share.pct / 100) * width
        const x = cursor
        cursor += w
        return (
          <g key={share.name}>
            <DrawRect
              x={x}
              y={top}
              width={w}
              height={h}
              dashed={i > 0}
              order={i}
              className={i === 0 ? 'stroke-sky-deep' : 'stroke-navy/40'}
            />
            <ValuePill x={x + w / 2} y={top + h + 34} order={i}>
              {share.label}
            </ValuePill>
            <text
              x={x + w / 2}
              y={top - 18}
              textAnchor="middle"
              className="fill-navy"
              style={{ fontSize: 12, fontFamily: 'Manrope, sans-serif' }}
            >
              {share.name}
            </text>
            <AxisLabel x={x + w / 2} y={top + h + 66}>
              {`${share.pct.toFixed(1)}%`}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

/** d. The cost of a failed lateral, as a flow. */
export function LateralFlowChart({ steps }: { steps: { label: string; value: string }[] }) {
  const pad = 40
  const boxW = (W - pad * 2 - 3 * 26) / 4
  const top = 130
  const h = 100

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {steps.map((step, i) => {
        const x = pad + i * (boxW + 26)
        return (
          <g key={step.label}>
            <DrawRect
              x={x}
              y={top}
              width={boxW}
              height={h}
              dashed={i < steps.length - 1}
              order={i}
              className={i === steps.length - 1 ? 'stroke-sky-deep' : 'stroke-navy/40'}
            />
            <text
              x={x + boxW / 2}
              y={top + h / 2 + 6}
              textAnchor="middle"
              className="fill-navy"
              style={{ fontSize: 17, fontFamily: 'Instrument Serif, serif' }}
            >
              {step.value}
            </text>
            <AxisLabel x={x + boxW / 2} y={top + h + 26}>
              {step.label}
            </AxisLabel>
            {i < steps.length - 1 && (
              <DrawPath
                d={`M ${x + boxW + 5} ${top + h / 2} L ${x + boxW + 21} ${top + h / 2}`}
                order={i}
                className="stroke-navy/50"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

/** e. What different results would be worth. */
export function SensitivityChart() {
  const points = sensitivity()
  const pad = { l: 60, r: 50, t: 50, b: 56 }
  const max = Math.max(...points.map((p) => p.savings)) * 1.18
  const slot = (W - pad.l - pad.r) / points.length
  const barW = Math.min(slot * 0.46, 92)
  const floor = H - pad.b
  const yFor = (v: number) => floor - (v / max) * (floor - pad.t)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <DrawPath
        d={`M ${pad.l - 10} ${yFor(PILOT_COST)} L ${W - pad.r} ${yFor(PILOT_COST)}`}
        dashed
        order={0}
        className="stroke-navy/45"
      />
      <AxisLabel x={pad.l + 86} y={yFor(PILOT_COST) - 12}>
        $77,600 pilot cost
      </AxisLabel>

      {points.map((point, i) => {
        const x = pad.l + slot * i + slot / 2
        const y = yFor(point.savings)
        return (
          <g key={point.points}>
            <DrawRect
              x={x - barW / 2}
              y={y}
              width={barW}
              height={floor - y}
              dashed={!point.highlight}
              order={i}
              className={point.highlight ? 'stroke-sky-deep' : 'stroke-navy/35'}
            />
            <ValuePill x={x} y={y - 22} order={i}>
              {point.label}
            </ValuePill>
            <AxisLabel x={x} y={floor + 24}>
              {`${point.points} point${point.points === 1 ? '' : 's'}`}
            </AxisLabel>
          </g>
        )
      })}
    </svg>
  )
}

export { Drawn }
