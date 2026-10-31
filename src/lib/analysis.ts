/**
 * Values the charts on /the-numbers need, derived from data.ts and the
 * tested calculator functions rather than typed out again.
 */
import {
  COMPETITOR_DATA,
  LATERAL_FUNNEL,
  PILOT_TOTAL,
  PROGRAMS,
  REVENUE_DATA,
  REVENUE_GOAL,
} from './data'
import { DEFAULTS, calculate } from './calculator'

/** The 2028 shortfall, in millions, from the projection and the goal. */
export function shortfallM(): number {
  const final = REVENUE_DATA[REVENUE_DATA.length - 1]
  return Math.round((REVENUE_GOAL - (final.projected ?? 0)) * 1000)
}

/** Each program's share of the pilot, as a percentage of the total. */
export interface CostShare {
  name: string
  cost: number
  pct: number
  label: string
}

export function costShares(): CostShare[] {
  return PROGRAMS.map((p) => ({
    name: p.name,
    cost: p.cost,
    pct: (p.cost / PILOT_TOTAL) * 100,
    label: p.costLabel,
  }))
}

/** Firms sorted by 2025 growth, for the comparison bars. */
export function growthRanking() {
  return [...COMPETITOR_DATA].sort((a, b) => b.growth - a.growth)
}

/** The lateral funnel, step by step. */
export function lateralSteps() {
  return [
    { label: 'Lateral partners hired in 2025', value: '51', sources: [1, 5] },
    { label: 'Published failure rate', value: '30-38%', sources: [6] },
    {
      label: 'Likely to leave within five years',
      value: `${LATERAL_FUNNEL.leaveLow}-${LATERAL_FUNNEL.leaveHigh}`,
      sources: [6],
    },
    { label: 'Value at risk', value: LATERAL_FUNNEL.atRiskLabel, sources: [7] },
  ]
}

export interface SensitivityPoint {
  points: number
  savings: number
  label: string
  highlight: boolean
}

/**
 * What different results would be worth, at the calculator's own defaults.
 * Uses calculate() so the chart can never disagree with the model.
 */
export function sensitivity(): SensitivityPoint[] {
  return [0.25, 0.5, 1, 2].map((points) => {
    const out = calculate({ ...DEFAULTS, reduction: points })
    return {
      points,
      savings: out.savings,
      label:
        out.savings >= 1_000_000
          ? `$${(out.savings / 1_000_000).toFixed(1)}M`
          : `$${Math.round(out.savings / 1000)}K`,
      highlight: points === 1,
    }
  })
}

export const PILOT_COST = PILOT_TOTAL
