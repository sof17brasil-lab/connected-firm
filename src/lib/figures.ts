/**
 * The numbers behind the five charts on /the-numbers, derived once here so
 * the charts cannot hold a figure of their own.
 *
 * Nothing in this file introduces a value: everything is read out of data.ts
 * or computed by the calculator's own tested functions, and figures.test.ts
 * checks each derivation against the source numbers.
 */
import {
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

/* -- b. Growing slower than rivals --------------------------------------- */

export const COMPETITOR_BARS = COMPETITOR_DATA.map((firm) => ({
  label: firm.firm,
  value: firm.growth,
  display: `${firm.growth}%`,
  highlight: firm.isWhiteCase === true,
}))

export const COMPETITOR_REFERENCE = BIG_LAW_AVERAGE
export const COMPETITOR_REFERENCE_LABEL = `~${BIG_LAW_AVERAGE}% ${BIG_LAW_AVERAGE_LABEL.toLowerCase()}`

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
