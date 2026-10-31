import { describe, expect, it } from 'vitest'
import { costShares, growthRanking, lateralSteps, sensitivity, shortfallM, PILOT_COST } from './analysis'
import { COMPETITOR_DATA, PILOT_TOTAL, PROGRAMS, REVENUE_GOAL } from './data'
import { DEFAULTS, calculate } from './calculator'

/** The charts may only show what data.ts and the calculator already hold. */
describe('Analysis values behind the charts', () => {
  it('derives the 2028 shortfall inside the published range', () => {
    expect(shortfallM()).toBeGreaterThanOrEqual(410)
    expect(shortfallM()).toBeLessThanOrEqual(430)
    expect(shortfallM()).toBe(Math.round((REVENUE_GOAL - 4.578) * 1000))
  })

  it('splits the pilot into the four real program costs', () => {
    const shares = costShares()
    expect(shares.map((s) => s.name)).toEqual(PROGRAMS.map((p) => p.name))
    expect(shares.map((s) => s.cost)).toEqual(PROGRAMS.map((p) => p.cost))
    expect(shares.reduce((sum, s) => sum + s.pct, 0)).toBeCloseTo(100, 6)
    expect(PILOT_COST).toBe(PILOT_TOTAL)
  })

  it('ranks every firm by growth, descending, inventing none', () => {
    const ranked = growthRanking()
    expect(ranked).toHaveLength(COMPETITOR_DATA.length)
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].growth).toBeGreaterThanOrEqual(ranked[i].growth)
    }
    expect(ranked[0].firm).toBe('Simpson Thacher')
    expect(ranked.find((r) => r.isWhiteCase)?.growth).toBe(8.36)
  })

  it('states the lateral funnel exactly as the outline does', () => {
    expect(lateralSteps().map((s) => s.value)).toEqual([
      '51',
      '30-38%',
      '15.3-19.4',
      '$61.8M-$78.3M',
    ])
  })

  it('takes sensitivity straight from the calculator', () => {
    const points = sensitivity()
    expect(points.map((p) => p.points)).toEqual([0.25, 0.5, 1, 2])
    for (const point of points) {
      expect(point.savings).toBe(calculate({ ...DEFAULTS, reduction: point.points }).savings)
    }
    const one = points.find((p) => p.points === 1)!
    expect(one.highlight).toBe(true)
    expect(one.label).toBe('$3.9M')
    expect(one.savings).toBe(3_900_000)
  })

  it('shows every scenario beating the pilot cost', () => {
    for (const point of sensitivity()) {
      expect(point.savings).toBeGreaterThan(PILOT_COST)
    }
  })
})
