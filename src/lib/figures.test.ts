import { describe, expect, it } from 'vitest'
import {
  BIG_LAW_AVERAGE,
  COMPETITOR_DATA,
  LATERAL_FUNNEL,
  PILOT_TOTAL,
  PILOT_TOTAL_LABEL,
  PROGRAMS,
  REVENUE_DATA,
  REVENUE_GOAL,
} from './data'
import { DEFAULTS, calculate } from './calculator'
import {
  COMPETITOR_BARS,
  COMPETITOR_MEDIAN,
  COMPETITOR_MEDIAN_DISPLAY,
  COMPETITOR_MEDIAN_LABEL,
  COMPETITOR_REFERENCE,
  COMPETITOR_REFERENCE_LABEL,
  PER_LAWYER_NOTE,
  WHITE_CASE_GROWTH,
  WHITE_CASE_RANK,
  LATERAL_STEPS,
  PROGRAM_SPLIT,
  PROGRAM_SPLIT_TOTAL,
  REVENUE_ACTUAL,
  REVENUE_END,
  REVENUE_GAP,
  REVENUE_GAP_DISPLAY,
  REVENUE_PROJECTED,
  SENSITIVITY,
  SENSITIVITY_POINTS,
  SENSITIVITY_REFERENCE,
  SENSITIVITY_REFERENCE_LABEL,
} from './figures'

/**
 * What the five charts on /the-numbers draw has to be what data.ts holds.
 * These assertions are the mechanism: a chart cannot show a figure unless
 * that figure survives a comparison with its source here.
 */

describe('a. the gap to $5bn', () => {
  it('draws only published years as the solid series', () => {
    expect(REVENUE_ACTUAL.map((p) => p.x)).toEqual([2023, 2024, 2025])
    expect(REVENUE_ACTUAL.map((p) => p.y)).toEqual([2.949, 3.317, 3.594])
  })

  it('starts the dashed projection at the last published year', () => {
    expect(REVENUE_PROJECTED[0]).toEqual({ x: 2025, y: 3.594 })
    expect(REVENUE_PROJECTED.map((p) => p.x)).toEqual([2025, 2026, 2027, 2028])
  })

  it('projects at about 8.4% a year', () => {
    for (let i = 1; i < REVENUE_PROJECTED.length; i += 1) {
      const from = REVENUE_PROJECTED[i - 1].y as number
      const to = REVENUE_PROJECTED[i].y as number
      expect(to / from - 1).toBeCloseTo(0.084, 2)
    }
  })

  it('measures the gap at 2028 against the goal', () => {
    expect(REVENUE_END.x).toBe(2028)
    expect(REVENUE_GAP).toBeCloseTo(REVENUE_GOAL - 4.578, 6)
    expect(REVENUE_GAP_DISPLAY).toBe('$422M short')
  })

  it('never draws a year the data does not have', () => {
    const years = new Set(REVENUE_DATA.map((p) => p.year))
    for (const point of [...REVENUE_ACTUAL, ...REVENUE_PROJECTED]) {
      expect(years.has(point.x)).toBe(true)
    }
  })
})

describe('b. growing slower than rivals', () => {
  it('draws every firm in the source, and no others', () => {
    expect(COMPETITOR_BARS).toHaveLength(COMPETITOR_DATA.length)
    expect(COMPETITOR_BARS.map((bar) => bar.label)).toEqual(COMPETITOR_DATA.map((f) => f.firm))
  })

  it('draws each firm at its published growth', () => {
    for (const [i, bar] of COMPETITOR_BARS.entries()) {
      expect(bar.value).toBe(COMPETITOR_DATA[i].growth)
      expect(bar.display).toBe(`${COMPETITOR_DATA[i].growth}%`)
    }
  })

  it('highlights White & Case and nothing else', () => {
    const highlighted = COMPETITOR_BARS.filter((bar) => bar.highlight)
    expect(highlighted).toHaveLength(1)
    expect(highlighted[0].label).toBe('White & Case')
    expect(highlighted[0].value).toBe(8.36)
  })

  it('puts the first context line at the Am Law 100 aggregate, and says so', () => {
    expect(COMPETITOR_REFERENCE).toBe(BIG_LAW_AVERAGE)
    expect(COMPETITOR_REFERENCE).toBe(13)
    expect(COMPETITOR_REFERENCE_LABEL).toBe('Am Law 100 aggregate, +13.0%')
  })

  it('adds the median of the firms actually plotted', () => {
    // Ten firms, so the median falls between the fifth and sixth.
    expect(COMPETITOR_MEDIAN).toBeCloseTo(10.195, 3)
    expect(COMPETITOR_MEDIAN_DISPLAY).toBe(10.2)
    expect(COMPETITOR_MEDIAN_LABEL).toBe('Median of these 10, 10.2%')
  })

  it('is a median of this chart\u2019s own set, not of some other one', () => {
    const sorted = COMPETITOR_DATA.map((f) => f.growth).sort((a, b) => a - b)
    expect(sorted).toHaveLength(10)
    expect(COMPETITOR_MEDIAN).toBe((sorted[4] + sorted[5]) / 2)
  })

  it('shows the aggregate above the median, which is why both are drawn', () => {
    // One outlier drags the aggregate well above the middle of this chart.
    expect(COMPETITOR_REFERENCE).toBeGreaterThan(COMPETITOR_MEDIAN)
  })

  it('ranks White & Case eighth of the ten, just under the median', () => {
    expect(WHITE_CASE_RANK).toBe(8)
    expect(8.36).toBeLessThan(COMPETITOR_MEDIAN)
  })

  it('carries the per-lawyer figure, which is the fairer comparison', () => {
    expect(PER_LAWYER_NOTE).toMatch(/8\.7%/)
    expect(PER_LAWYER_NOTE).toMatch(/\$1\.39M/)
  })
})

describe('c. where the pilot goes', () => {
  it('draws one part per programme, at its own cost', () => {
    expect(PROGRAM_SPLIT).toHaveLength(PROGRAMS.length)
    for (const [i, part] of PROGRAM_SPLIT.entries()) {
      expect(part.label).toBe(PROGRAMS[i].name)
      expect(part.value).toBe(PROGRAMS[i].cost)
      expect(part.display).toBe(PROGRAMS[i].costLabel)
    }
  })

  it('adds up to the published pilot total', () => {
    expect(PROGRAM_SPLIT_TOTAL).toBe(PILOT_TOTAL)
    expect(PROGRAM_SPLIT_TOTAL).toBe(77600)
  })
})

describe('d. the cost of a failed lateral', () => {
  it('walks hires to rate to failures to money', () => {
    expect(LATERAL_STEPS.map((step) => step.value)).toEqual([
      '51',
      '30-38%',
      '~15-19',
      '$61.8M-$78.4M',
    ])
  })

  it('takes every step from the funnel data', () => {
    expect(LATERAL_STEPS[0].value).toBe(String(LATERAL_FUNNEL.hired))
    expect(LATERAL_STEPS[2].value).toBe(LATERAL_FUNNEL.leaveLabel)
    expect(LATERAL_STEPS[3].value).toBe(LATERAL_FUNNEL.atRiskLabel)
  })

  it('agrees with the arithmetic behind the funnel', () => {
    expect(LATERAL_FUNNEL.hired * 0.3).toBeCloseTo(LATERAL_FUNNEL.leaveLow, 1)
    expect(LATERAL_FUNNEL.hired * 0.38).toBeCloseTo(LATERAL_FUNNEL.leaveHigh, 1)
  })
})

describe('e. sensitivity', () => {
  it('runs the four points asked for', () => {
    expect(SENSITIVITY_POINTS).toEqual([0.25, 0.5, 1, 2])
    expect(SENSITIVITY.map((bar) => bar.label)).toEqual([
      '0.25 points',
      '0.5 points',
      '1 point',
      '2 points',
    ])
  })

  it('draws the calculator’s own output at each point', () => {
    for (const [i, bar] of SENSITIVITY.entries()) {
      const out = calculate({ ...DEFAULTS, reduction: SENSITIVITY_POINTS[i] })
      expect(bar.value).toBe(out.savings)
    }
  })

  it('shows the values the model actually produces', () => {
    // $1.9M, not $2.0M: 1.95 is 1.9499... in binary, so toFixed rounds down.
    // That understates the saving, which is the safe direction for a claim.
    expect(SENSITIVITY.map((bar) => bar.display)).toEqual(['$975K', '$1.9M', '$3.9M', '$7.8M'])
  })

  it('highlights the calculator default and nothing else', () => {
    const highlighted = SENSITIVITY.filter((bar) => bar.highlight)
    expect(highlighted).toHaveLength(1)
    expect(highlighted[0].label).toBe('1 point')
    expect(highlighted[0].value).toBe(calculate(DEFAULTS).savings)
  })

  it('compares against the published pilot cost', () => {
    expect(SENSITIVITY_REFERENCE).toBe(PILOT_TOTAL)
    expect(SENSITIVITY_REFERENCE_LABEL).toBe(`${PILOT_TOTAL_LABEL} pilot`)
  })

  it('clears the pilot cost even at the smallest reduction', () => {
    expect(SENSITIVITY[0].value).toBeGreaterThan(PILOT_TOTAL)
  })
})

describe('the copy cannot misstate the ranking', () => {
  it('counts the firms ahead of White & Case, and matches the rank', () => {
    const ahead = COMPETITOR_DATA.filter((f) => f.growth > WHITE_CASE_GROWTH)
    expect(ahead).toHaveLength(7)
    // The rank is that count plus one, which is what the sentence quotes.
    expect(WHITE_CASE_RANK).toBe(ahead.length + 1)
  })

  it('quotes White & Case’s own published growth', () => {
    expect(WHITE_CASE_GROWTH).toBe(8.36)
    expect(COMPETITOR_DATA.find((f) => f.isWhiteCase)?.growth).toBe(WHITE_CASE_GROWTH)
  })

  it('sits below the median but not far from it', () => {
    expect(WHITE_CASE_GROWTH).toBeLessThan(COMPETITOR_MEDIAN)
    expect(COMPETITOR_MEDIAN - WHITE_CASE_GROWTH).toBeLessThan(2)
  })
})
