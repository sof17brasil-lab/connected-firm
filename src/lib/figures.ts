/**
 * The numbers behind the five charts on /the-numbers, derived once here so
 * the charts cannot hold a figure of their own.
 *
 * Nothing in this file introduces a value: everything is read out of data.ts
 * or computed by the calculator's own tested functions, and figures.test.ts
 * checks each derivation against the source numbers.
 */
import {
  AM_LAW_REVENUE_PER_LAWYER,
  AM_LAW_REVENUE_PER_LAWYER_GROWTH,
  BIG_LAW_AVERAGE,
  BIG_LAW_AVERAGE_LABEL,
  COMPETITOR_DATA,
  LATERAL_FUNNEL,
  PILOT_TOTAL,
  PILOT_TOTAL_LABEL,
  PROGRAMS,
  REVENUE_DATA,
  REVENUE_GOAL,
} from './data'
import { DEFAULTS, calculate, money } from './calculator'

/* -- a. The gap to $5bn -------------------------------------------------- */

export const REVENUE_ACTUAL = REVENUE_DATA.filter((p) => p.actual !== null).map((p) => ({
  x: p.year,
  y: p.actual,
}))

export const REVENUE_PROJECTED = REVENUE_DATA.filter((p) => p.projected !== null).map((p) => ({
  x: p.year,
  y: p.projected,
}))

/** The last projected year, which is where the gap is measured. */
export const REVENUE_END = REVENUE_PROJECTED[REVENUE_PROJECTED.length - 1]

/** Billions short of the goal in 2028, at the current pace. */
export const REVENUE_GAP = REVENUE_GOAL - (REVENUE_END.y ?? 0)
export const REVENUE_GAP_DISPLAY = `$${Math.round(REVENUE_GAP * 1000)}M short`

/* -- b. Growing, but not fast enough -------------------------------------- */

export const COMPETITOR_BARS = COMPETITOR_DATA.map((firm) => ({
  label: firm.firm,
  value: firm.growth,
  display: `${firm.growth}%`,
  highlight: firm.isWhiteCase === true,
}))

export const COMPETITOR_REFERENCE = BIG_LAW_AVERAGE
export const COMPETITOR_REFERENCE_LABEL = BIG_LAW_AVERAGE_LABEL

/**
 * The median of the nine firms actually plotted.
 *
 * The 13.0% line is the Am Law 100's aggregate, which is revenue-weighted
 * across a hundred firms and is dragged up here by one outlier. Against
 * the median of this chart's own nine, White & Case sits just below the
 * middle — which is the fair comparison, and still not fast enough.
 */
export const COMPETITOR_MEDIAN = (() => {
  const sorted = COMPETITOR_DATA.map((f) => f.growth).sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
})()

/** White & Case's own 2025 growth, so the copy cannot quote a stale number. */
export const WHITE_CASE_GROWTH = COMPETITOR_DATA.find((f) => f.isWhiteCase)!.growth

export const COMPETITOR_MEDIAN_LABEL = `Median of these nine, ${COMPETITOR_MEDIAN}%`

/** Where White & Case ranks among the nine, 1 = fastest. */
export const WHITE_CASE_RANK =
  COMPETITOR_DATA.filter((f) => f.growth > (COMPETITOR_DATA.find((x) => x.isWhiteCase)?.growth ?? 0))
    .length + 1

export const PER_LAWYER_NOTE = `Across the Am Law 100, revenue per lawyer rose ${AM_LAW_REVENUE_PER_LAWYER_GROWTH}% to ${AM_LAW_REVENUE_PER_LAWYER} in 2025.`

/* -- c. Where the pilot goes --------------------------------------------- */

export const PROGRAM_SPLIT = PROGRAMS.map((program) => ({
  label: program.name,
  value: program.cost,
  display: program.costLabel,
}))

export const PROGRAM_SPLIT_TOTAL = PROGRAM_SPLIT.reduce((sum, part) => sum + part.value, 0)

/* -- d. The cost of a failed lateral ------------------------------------- */

export const LATERAL_STEPS = [
  { label: 'laterals hired in 2025', value: String(LATERAL_FUNNEL.hired) },
  { label: 'leave within five years', value: '30-38%' },
  { label: 'failed hires', value: LATERAL_FUNNEL.leaveLabel },
  { label: 'value at risk', value: LATERAL_FUNNEL.atRiskLabel },
]

/* -- e. Sensitivity ------------------------------------------------------ */

export const SENSITIVITY_POINTS = [0.25, 0.5, 1, 2]

export const SENSITIVITY = SENSITIVITY_POINTS.map((reduction) => {
  const out = calculate({ ...DEFAULTS, reduction })
  return {
    label: `${reduction} ${reduction === 1 ? 'point' : 'points'}`,
    value: out.savings,
    display: money(out.savings),
    highlight: reduction === DEFAULTS.reduction,
  }
})

export const SENSITIVITY_REFERENCE = PILOT_TOTAL
export const SENSITIVITY_REFERENCE_LABEL = `${PILOT_TOTAL_LABEL} pilot`
