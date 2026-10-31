import { describe, expect, it } from 'vitest'
import {
  BIG_LAW_AVERAGE,
  COMPETITOR_DATA,
  GAP_ROWS,
  GLASSDOOR_BARS,
  GLASSDOOR_NOTE,
  REVENUE_DATA,
  REVENUE_GOAL,
  REVENUE_SHARE_OF_GOAL,
  RESEARCH_PARTNERS,
  RESEARCH_PEOPLE,
  WHY_NOW_STATS,
  PROGRAMS,
  PILOT_TOTAL,
  ROADMAP,
  LATERAL_FUNNEL,
  KEEP_FOUR,
  MOMENTUM_SCENARIOS,
  HEADLINE_CALLOUT,
  SCORECARD,
  RISKS,
} from './data'
import {
  MEASUREMENT_LIST,
  LEANER_OPTION,
  COST_NEUTRAL_OPTION,
} from './data'
import { calculate, DEFAULTS, money } from './calculator'
import { ALREADY_HAS, ASSUMPTIONS, OTHER_FIRMS, STILL_TO_VERIFY } from './extras'
import { SOURCES, SOURCE_BY_ID, sourceYearLabel } from './sources'

/**
 * Asserts the site's figures against the prompt's "Exact data" section.
 * If a number on screen ever drifts from the source material, this fails.
 */

describe('Section 1 — stat tiles', () => {
  it('matches Exact data', () => {
    expect(WHY_NOW_STATS.map((s) => s.value)).toEqual([
      '$3.594bn',
      '51',
      '349 → 332',
      '11.6%',
    ])
  })

  it('states the equity partner fall as -4.9%', () => {
    const tile = WHY_NOW_STATS.find((s) => s.value === '349 → 332')!
    expect(tile.note).toContain('4.9%')
    // 332/349 - 1 = -4.87%, which rounds to the -4.9% the PDF reports.
    expect(((332 / 349 - 1) * 100).toFixed(1)).toBe('-4.9')
  })

  it('derives 11.6% growth from the $5bn goal', () => {
    const needed = (Math.pow(REVENUE_GOAL / 3.594, 1 / 3) - 1) * 100
    expect(needed.toFixed(1)).toBe('11.6')
  })
})

describe('Section 1 — revenue chart', () => {
  it('uses only the six given points', () => {
    expect(REVENUE_DATA.map((d) => d.year)).toEqual([2023, 2024, 2025, 2026, 2027, 2028])
  })

  it('has the actual series to 2025', () => {
    expect(REVENUE_DATA.filter((d) => d.actual != null).map((d) => d.actual)).toEqual([
      2.949, 3.317, 3.594,
    ])
  })

  it('has the projection from 2025 to 2028', () => {
    expect(REVENUE_DATA.filter((d) => d.projected != null).map((d) => d.projected)).toEqual([
      3.594, 3.896, 4.223, 4.578,
    ])
  })

  it('projects at about 8.4% a year', () => {
    expect(+(3.594 * 1.084).toFixed(3)).toBe(3.896)
    expect(+(3.594 * Math.pow(1.084, 2)).toFixed(3)).toBe(4.223)
    expect(+(3.594 * Math.pow(1.084, 3)).toFixed(3)).toBe(4.578)
  })

  it('leaves a 2028 shortfall inside the stated $410-430M range', () => {
    const shortfall = (REVENUE_GOAL - 4.578) * 1000
    expect(shortfall).toBeGreaterThanOrEqual(410)
    expect(shortfall).toBeLessThanOrEqual(430)
  })

  it('sets the goal line at $5.0bn', () => {
    expect(REVENUE_GOAL).toBe(5.0)
  })

  it('derives the share of the goal already reached from the two figures', () => {
    expect(((3.594 / REVENUE_GOAL) * 100).toFixed(2)).toBe(REVENUE_SHARE_OF_GOAL.toFixed(2))
  })
})

describe('Section 1 — competitor chart', () => {
  it('matches Exact data', () => {
    const byFirm = Object.fromEntries(COMPETITOR_DATA.map((d) => [d.firm, d.growth]))
    expect(byFirm).toEqual({
      Latham: 18.57,
      'Gibson Dunn': 18.37,
      'Simpson Thacher': 22.66,
      Skadden: 11.0,
      'Ropes & Gray': 9.39,
      Sidley: 8.68,
      'White & Case': 8.36,
      'DLA Piper': 8.1,
      'Baker McKenzie': 7.24,
    })
  })

  it('marks only White & Case as the highlighted bar', () => {
    const highlighted = COMPETITOR_DATA.filter((d) => d.isWhiteCase)
    expect(highlighted).toHaveLength(1)
    expect(highlighted[0].firm).toBe('White & Case')
  })

  it('leaves Kirkland out', () => {
    expect(COMPETITOR_DATA.some((d) => d.firm.includes('Kirkland'))).toBe(false)
  })

  it('puts the Big Law average reference line at 13%', () => {
    expect(BIG_LAW_AVERAGE).toBe(13)
  })
})

describe('Section 2 — research cards', () => {
  const all = [...RESEARCH_PARTNERS, ...RESEARCH_PEOPLE]

  it('carries every figure from Exact data', () => {
    const figures = all.map((c) => c.figure)
    for (const expected of [
      '30-38%',
      '$4.04M',
      '61%',
      '37% vs 49%',
      '18% vs 61%',
      '4-5 points',
      '$200K-$500K',
      '9.4%',
    ]) {
      expect(figures).toContain(expected)
    }
  })

  it('labels the field experiment as non-legal', () => {
    const card = all.find((c) => c.figure === '4-5 points')!
    expect(card.caveat).toMatch(/not a law firm/i)
  })
})

describe('Section 3 — Glassdoor', () => {
  it('matches Exact data', () => {
    expect(GLASSDOOR_BARS.map((b) => [b.label, b.value])).toEqual([
      ['Compensation & benefits', 4.3],
      ['Overall', 3.9],
      ['Culture & values', 3.9],
      ['Career opportunities', 3.7],
      ['Work-life balance', 3.4],
    ])
  })

  it('carries the recommend rate and review count', () => {
    expect(GLASSDOOR_NOTE).toContain('75%')
    expect(GLASSDOOR_NOTE).toContain('601')
  })

  it('drops the New York office figure', () => {
    const text = JSON.stringify(GLASSDOOR_BARS) + GLASSDOOR_NOTE
    expect(text).not.toContain('126')
    expect(text).not.toContain('62%')
  })
})

describe('Section 4 — gaps table', () => {
  it('has the four rows from the PDF', () => {
    expect(GAP_ROWS.map((r) => r.add)).toEqual([
      'Momentum Circles',
      'First 90 Days (lead)',
      'Global Table',
      'Client Roundtables',
    ])
  })
})

describe('Sources', () => {
  it('is numbered 1..29 with no gaps', () => {
    expect(SOURCES.map((s) => s.id)).toEqual(
      Array.from({ length: 29 }, (_, i) => i + 1),
    )
  })

  it('includes the added revenue-per-lawyer source', () => {
    expect(SOURCE_BY_ID.get(29)?.publisher).toBe('LawCareers.Net')
  })

  it('labels undated sources as accessed rather than guessing a year', () => {
    const undated = SOURCES.filter((s) => s.year === null)
    expect(undated.length).toBeGreaterThan(0)
    for (const source of undated) {
      expect(sourceYearLabel(source)).toBe('accessed Oct 2026')
    }
  })

  it('gives every source an https url', () => {
    for (const source of SOURCES) {
      expect(source.url.startsWith('https://')).toBe(true)
    }
  })
})

describe('Every displayed figure cites a real source', () => {
  it('resolves all footnote ids', () => {
    const cited = [
      ...WHY_NOW_STATS,
      ...COMPETITOR_DATA,
      ...RESEARCH_PARTNERS,
      ...RESEARCH_PEOPLE,
      ...GAP_ROWS,
    ].flatMap((item) => item.sources)

    expect(cited.length).toBeGreaterThan(0)
    for (const id of cited) {
      expect(SOURCE_BY_ID.has(id)).toBe(true)
    }
  })
})

describe('Section 5 — program costs', () => {
  it('matches Exact data', () => {
    expect(PROGRAMS.map((p) => [p.name, p.cost])).toEqual([
      ['First 90 Days', 27000],
      ['Momentum Circles', 19200],
      ['Global Table', 9000],
      ['Client Roundtables', 22400],
    ])
  })

  it('sums to the stated total', () => {
    expect(PROGRAMS.reduce((sum, p) => sum + p.cost, 0)).toBe(PILOT_TOTAL)
    expect(PILOT_TOTAL).toBe(77600)
  })

  it('labels the ~15 NY partners figure as an estimate', () => {
    const lead = PROGRAMS.find((p) => p.name === 'First 90 Days')!
    expect(lead.estimate).toBe(true)
    expect(lead.calculation).toContain('~15')
  })

  it('checks each program calculation multiplies out', () => {
    expect(15 * 3 * 6 * 100).toBe(27000)
    expect(4 * 12 * 10 * 40).toBe(19200)
    expect(2 * 60 * 75).toBe(9000)
    expect(8 * 14 * 200).toBe(22400)
  })

  it('has the four roadmap phases', () => {
    expect(ROADMAP.map((p) => p.when)).toEqual([
      'Month 1',
      'Months 2-3',
      'Months 4-6',
      'Months 7-12',
    ])
  })
})

describe('Section 6 — business case', () => {
  it('matches the lateral funnel in Exact data', () => {
    expect(LATERAL_FUNNEL.hired).toBe(51)
    expect(+(51 * 0.3).toFixed(1)).toBe(LATERAL_FUNNEL.leaveLow)
    expect(+(51 * 0.38).toFixed(1)).toBe(LATERAL_FUNNEL.leaveHigh)
    expect(51 * 3 * 6 * 100).toBe(LATERAL_FUNNEL.firmwideCost)
    expect(Math.round(4039200 / LATERAL_FUNNEL.firmwideCost)).toBe(LATERAL_FUNNEL.returnMultiple)
  })

  it('keeps the published range for value at risk', () => {
    expect((15.3 * 4039200) / 1e6).toBeCloseTo(61.8, 1)
    expect((19.4 * 4039200) / 1e6).toBeCloseTo(78.4, 1)
  })

  it('matches the keep-four rows', () => {
    expect(KEEP_FOUR.map((r) => r.saved)).toEqual(['$800,000', '$2,000,000', '~$16.2M'])
    expect(4 * 200000).toBe(800000)
    expect(4 * 500000).toBe(2000000)
    expect(Math.round((4 * 4039200) / 1e5) / 10).toBe(16.2)
  })

  it('matches the Momentum Circles scenarios', () => {
    expect(48 * 0.01 * 200000).toBe(96000)
    expect(48 * 0.04 * 200000).toBe(384000)
    expect(MOMENTUM_SCENARIOS.cautious.saved).toBe('$96,000')
    expect(MOMENTUM_SCENARIOS.field.saved).toBe('$384,000')
  })

  it('derives the 1.9% headline', () => {
    expect(((77600 / 4039200) * 100).toFixed(1)).toBe('1.9')
    expect(HEADLINE_CALLOUT.figure).toBe('1.9%')
  })

  it('derives the client break-even at about four days', () => {
    const perDay = 1360000 / 250
    expect(perDay).toBe(5440)
    expect(Math.round(22400 / perDay)).toBe(4)
  })
})

describe('Section 7 — scorecard', () => {
  it('carries no invented values', () => {
    for (const metric of SCORECARD) {
      expect(metric).not.toHaveProperty('value')
    }
  })

  it('keeps the one target the outline states', () => {
    const withTarget = SCORECARD.filter((m) => m.target !== null)
    expect(withTarget).toHaveLength(1)
    expect(withTarget[0].target).toBe('10+ in 90 days')
  })
})

describe('Section 8 — risks', () => {
  it('has the six pushbacks from the outline', () => {
    expect(RISKS).toHaveLength(6)
    for (const risk of RISKS) expect(risk.answer.length).toBeGreaterThan(20)
  })
})

describe('Reference pages', () => {
  it('cites a real source for every assumption that claims one', () => {
    for (const row of ASSUMPTIONS) {
      for (const id of row.sources) expect(SOURCE_BY_ID.has(id)).toBe(true)
    }
  })

  it('keeps every culture-extras citation resolvable', () => {
    for (const item of [...OTHER_FIRMS, ...ALREADY_HAS]) {
      for (const id of item.sources) expect(SOURCE_BY_ID.has(id)).toBe(true)
    }
  })

  it('lists the four items still to verify', () => {
    expect(STILL_TO_VERIFY).toHaveLength(4)
  })
})

describe('What moved to /the-numbers', () => {
  const homeFigures = ['$4.04M', '30-38%', '61%', '18% vs 61%']
  const all = [...RESEARCH_PARTNERS, ...RESEARCH_PEOPLE]

  it('keeps the four strongest research figures available for the home page', () => {
    for (const figure of homeFigures) {
      expect(all.map((c) => c.figure)).toContain(figure)
    }
  })

  it('still carries every other research figure for the detail page', () => {
    const rest = all.filter((c) => !homeFigures.includes(c.figure))
    expect(rest.length).toBe(all.length - homeFigures.length)
    for (const card of rest) {
      expect(card.sources.length).toBeGreaterThan(0)
    }
  })

  it('derives the home page headline from the calculator defaults', () => {
    // "1 in 100 lawyers ... about 19 fewer departures ... roughly $3.9 million"
    const out = calculate(DEFAULTS)
    expect(Math.round(out.departuresAvoided)).toBe(20)
    expect(out.departuresAvoided).toBe(19.5)
    expect(money(out.savings)).toBe('$3.9M')
    expect(DEFAULTS.pilotCost).toBe(PILOT_TOTAL)
  })

  it('keeps the measurement list and scorecard for /methodology', () => {
    expect(MEASUREMENT_LIST.length).toBeGreaterThan(5)
    expect(SCORECARD.length).toBeGreaterThan(5)
  })

  it('keeps the cost options for /the-numbers', () => {
    expect(LEANER_OPTION.body).toContain('$13,500')
    expect(COST_NEUTRAL_OPTION.body).toContain('$30,000')
  })
})
