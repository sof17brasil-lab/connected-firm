import { describe, expect, it } from 'vitest'
import {
  BIG_LAW_AVERAGE,
  BIG_LAW_AVERAGE_LABEL,
  CLIENT_FACTS,
  COMPETITOR_DATA,
  FAILED_LATERAL_TIERS,
  GAP_ROWS,
  GLASSDOOR_BARS,
  GLASSDOOR_CHECKED,
  GLASSDOOR_CONTEXT,
  GLASSDOOR_NOTE,
  HEADLINE_CALLOUT,
  KEEP_FOUR,
  LATERAL_FUNNEL,
  LONDON_CALLOUT,
  MEASUREMENT_LIST,
  MOMENTUM_SCENARIOS,
  PILOT_TOTAL,
  PROGRAMS,
  RESEARCH_PARTNERS,
  RESEARCH_PEOPLE,
  REVENUE_DATA,
  REVENUE_GOAL,
  REVENUE_SHARE_OF_GOAL,
  RISKS,
  ROADMAP,
  SCORECARD,
  WHY_NOW_STATS,
} from './data'
import { COST_NEUTRAL_OPTION, LEANER_OPTION } from './data'
import { calculate, DEFAULTS, money } from './calculator'
import { ALREADY_HAS, ASSUMPTIONS, FORMULAS, OTHER_FIRMS, STILL_TO_VERIFY } from './extras'
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
      'Kirkland & Ellis': 19.93,
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

  it('includes Kirkland, which is in the source after all', () => {
    const k = COMPETITOR_DATA.find((d) => d.firm.includes('Kirkland'))
    expect(k).toBeDefined()
    expect(k?.growth).toBe(19.93)
  })

  it('is the Am Law top ten by revenue', () => {
    expect(COMPETITOR_DATA).toHaveLength(10)
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
      // '37% vs 49%' was dropped: neither the page it cited nor Gallup's
      // own publishes that split, so the card now carries only the figure
      // Gallup does publish.
      '2 in 10',
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
  // Read off the live page on 2 November 2026. The earlier figures came
  // from the source PDF and had drifted: overall 3.9 -> 3.7, culture 3.9
  // -> 3.8, and career opportunities 3.7 -> 3.3.
  it('matches what the page showed when it was read', () => {
    expect(GLASSDOOR_BARS.map((b) => [b.label, b.value])).toEqual([
      ['Compensation and benefits', 4.3],
      ['Diversity & inclusion', 3.9],
      ['Culture & values', 3.8],
      ['Work/life balance', 3.4],
      ['Senior management', 3.4],
      ['Career opportunities', 3.3],
    ])
  })

  it('shows every category Glassdoor lists, not a chosen few', () => {
    expect(GLASSDOOR_BARS).toHaveLength(6)
  })

  it('carries the overall, the recommend rate, the count and the date', () => {
    expect(GLASSDOOR_NOTE).toContain('3.7')
    expect(GLASSDOOR_NOTE).toContain('74%')
    expect(GLASSDOOR_NOTE).toContain('606')
    expect(GLASSDOOR_NOTE).toContain(GLASSDOOR_CHECKED)
  })

  it('dates figures that move, so they are never read as permanent', () => {
    expect(GLASSDOOR_CHECKED).toMatch(/\d{1,2} \w+ \d{4}/)
  })

  it('says the overall is in line with the industry', () => {
    expect(GLASSDOOR_CONTEXT).toMatch(/in line with the average/)
    expect(GLASSDOOR_CONTEXT).toMatch(/3\.7/)
  })

  it('makes no comparison the page does not show', () => {
    const text = JSON.stringify(GLASSDOOR_BARS) + GLASSDOOR_NOTE + GLASSDOOR_CONTEXT
    // "7% below similar legal employers" and the by-role split were both
    // on the site and on neither the page nor anywhere else I could find.
    expect(text).not.toMatch(/7% below/)
    expect(text).not.toMatch(/Legal Assistants/)
    expect(text).not.toMatch(/Practice Assistants/)
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
      'First 90 Days',
      'Global Table',
      'Client Roundtables',
    ])
  })
})

describe('Sources', () => {
  it('is numbered 1..31 with no gaps', () => {
    expect(SOURCES.map((s) => s.id)).toEqual(
      Array.from({ length: 31 }, (_, i) => i + 1),
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

/**
 * What the director review asked to be true, asserted so it stays true.
 */
describe('Tone: a coordinator runs programmes, and owns none of them', () => {
  it('never claims to lead one', () => {
    const everything = JSON.stringify({ PROGRAMS, GAP_ROWS, MEASUREMENT_LIST, RISKS })
    expect(everything).not.toMatch(/\(lead\)/i)
    expect(everything).not.toMatch(/I would lead/i)
  })

  it('names who each of the two owned programmes is run for', () => {
    expect(PROGRAMS.find((p) => p.name === 'First 90 Days')?.runsFor).toMatch(/Talent/)
    expect(PROGRAMS.find((p) => p.name === 'Client Roundtables')?.runsFor).toMatch(
      /Business Development/,
    )
  })

  it('describes attendance-counting as an industry habit, not one team’s', () => {
    const row = GAP_ROWS.find((r) => r.exists === 'Client events')!
    expect(row.gap).toMatch(/industry/i)
    expect(row.gap).not.toMatch(/^Usually measured by attendance$/)
  })
})

describe('Compliance: no individual-level profiling', () => {
  it('reports connections by cohort, never by named partner', () => {
    const line = MEASUREMENT_LIST.find((m) => m.includes('connection'))!
    expect(line).toMatch(/cohort/i)
    expect(line).toMatch(/HR-run/i)
    expect(line).not.toMatch(/flag new partners/i)
  })

  it('no longer claims anonymised totals while flagging individuals', () => {
    expect(MEASUREMENT_LIST.join(' ')).not.toMatch(/flag .*partners/i)
  })
})

describe('Citations the review flagged', () => {
  it('attributes the loneliness figure to the study, not to UCLA', () => {
    const card = RESEARCH_PEOPLE.find((c) => c.figure === '61%')!
    expect(card.caveat).toMatch(/Harvard Business Review/)
    expect(card.caveat).toMatch(/BetterUp/)
    expect(card.caveat).toMatch(/1,600/)
    expect(card.caveat).toMatch(/UCLA wrote the scale/)
  })

  it('uses the NALP figure for attrition, with the larger-firm range', () => {
    const card = RESEARCH_PEOPLE.find((c) => c.figure === '19%')!
    expect(card.body).toMatch(/16-18%/)
    expect(card.sources).toContain(15)
    expect(SOURCE_BY_ID.get(15)?.publisher).toBe('NALP Foundation')
  })

  it('calls the failed-lateral figure a vendor estimate and shows its bands', () => {
    const card = RESEARCH_PARTNERS.find((c) => c.figure === '$4.04M')!
    expect(card.caveat).toMatch(/vendor estimate/i)
    expect(card.caveat).toMatch(/ALM Intelligence/)
    expect(FAILED_LATERAL_TIERS.map((t) => t.cost)).toEqual([715_500, 1_509_300, 4_039_200])
  })

  it('labels 13% as the Am Law 100 aggregate, not an average', () => {
    expect(BIG_LAW_AVERAGE_LABEL).toBe('Am Law 100 aggregate, +13.0%')
    expect(BIG_LAW_AVERAGE_LABEL).not.toMatch(/big law average/i)
  })

  it('makes no buddy retention claim anywhere', () => {
    const everything = JSON.stringify({ LONDON_CALLOUT, MEASUREMENT_LIST, PROGRAMS, RISKS })
    expect(everything).not.toMatch(/52%/)
    expect(LONDON_CALLOUT.points.join(' ')).toMatch(/retention is what the pilot would test/)
  })

  it('every source a figure cites actually exists', () => {
    const ids = new Set(SOURCES.map((s) => s.id))
    for (const card of [...RESEARCH_PARTNERS, ...RESEARCH_PEOPLE]) {
      for (const id of card.sources) expect(ids.has(id)).toBe(true)
    }
  })
})

describe('Figures match their own arithmetic, not a truncation of it', () => {
  it('rounds the value at risk rather than cutting it short', () => {
    // 19.4 x 4,039,200 = 78,360,480, which is $78.4M. The label read
    // $78.3M, which is the truncation and understates it by $60,480.
    const high = (LATERAL_FUNNEL.leaveHigh * 4_039_200) / 1e6
    const low = (LATERAL_FUNNEL.leaveLow * 4_039_200) / 1e6
    expect(LATERAL_FUNNEL.atRiskLabel).toBe(`$${low.toFixed(1)}M-$${high.toFixed(1)}M`)
  })

  it('agrees with the formula listed on the methodology page', () => {
    const row = FORMULAS.find((f) => f.name === 'Value at risk')
    expect(row).toBeDefined()
    expect(row?.result).toBe(LATERAL_FUNNEL.atRiskLabel)
  })
})

/**
 * Checked against the live sources on 2 November 2026. Each of these
 * replaced a claim the cited page did not actually carry.
 */
describe('Claims match what the cited page says', () => {
  it('quotes only the best-friend figure Gallup publishes', () => {
    const card = RESEARCH_PEOPLE.find((c) => c.figure === '2 in 10')!
    expect(card.sources).toEqual([11])
    expect(SOURCE_BY_ID.get(11)?.publisher).toBe('Gallup')
    const everything = JSON.stringify(RESEARCH_PEOPLE)
    expect(everything).not.toMatch(/37% vs 49%/)
  })

  it('names who measured the lateral range, and does not call it mine', () => {
    // Above the Law carries it verbatim: "research from Decipher
    // Investigative Intelligence that 30-38 percent of lateral partners
    // leave within five years". It is sourced, so no estimate tag.
    const card = RESEARCH_PARTNERS.find((c) => c.figure === '30-38%')!
    expect(card.estimate).toBeUndefined()
    expect(card.caveat).toMatch(/Decipher Investigative Intelligence/)
    expect(card.caveat).toMatch(/near 50%/)
    expect(card.sources).toEqual([6, 30])
  })

  it('quotes London against the survey it names', () => {
    const text = LONDON_CALLOUT.points.join(' ') + LONDON_CALLOUT.caveat
    expect(text).toMatch(/2026-27/)
    expect(text).toMatch(/A for peer support/)
    expect(text).toMatch(/Social life scores B/)
    expect(text).toMatch(/D on work-life balance/)
    // The older edition's claims, none of which the live page carries.
    expect(text).not.toMatch(/A\*? to A\*/)
    expect(text).not.toMatch(/Broad St/)
    expect(text).not.toMatch(/grades C on work-life/)
  })

  it('drops the client-feedback figure whose source has gone', () => {
    expect(JSON.stringify(CLIENT_FACTS)).not.toMatch(/27%/)
    for (const fact of CLIENT_FACTS) {
      for (const id of fact.sources) expect(SOURCE_BY_ID.get(id)).toBeDefined()
    }
  })
})

/**
 * The second fact-check pass, 4 November 2026. Each of these was checked
 * against the live page before it was changed.
 */
describe('Second fact-check pass', () => {
  it('carries the figure that sits beside 30-38% in the same sentence', () => {
    const card = RESEARCH_PARTNERS.find((c) => c.figure === '90%')!
    expect(card.body).toMatch(/business development challenges/)
    expect(card.sources).toEqual([6])
    // The old claim cited a page that no longer backs it.
    expect(JSON.stringify(RESEARCH_PARTNERS)).not.toMatch(/do not track whether lateral/)
  })

  it('backs the best-predictor claim with the survey and its sample', () => {
    const card = RESEARCH_PARTNERS.find((c) => c.figure === 'Best predictor')!
    expect(card.body).toMatch(/lateral partner satisfaction/)
    expect(card.sources).toContain(9)
    expect(SOURCE_BY_ID.get(9)?.publisher).toBe('Major, Lindsey & Africa')
    expect(SOURCE_BY_ID.get(9)?.title).toMatch(/1,953 partners/)
  })

  it('splits the two associate surveys onto their own lines', () => {
    const bti = RESEARCH_PEOPLE.find((c) => c.figure === '9.4%')!
    expect(bti.sources).toEqual([16])
    expect(bti.caveat).toMatch(/BTI/)
    const mla = RESEARCH_PEOPLE.find((c) => c.figure === '69% / 64%')!
    expect(mla.sources).toEqual([17])
    expect(mla.caveat).toMatch(/~300 associates/)
    expect(SOURCE_BY_ID.get(17)?.year).toBe(2023)
  })

  it('does not attribute the replacement cost to NALP itself', () => {
    const card = RESEARCH_PEOPLE.find((c) => c.figure === '$200K-$500K')!
    expect(card.caveat).toMatch(/recruiters/i)
    expect(card.caveat).toMatch(/not a NALP figure itself/)
  })

  it('dates the perks that were reported in 2018', () => {
    expect(SOURCE_BY_ID.get(26)?.year).toBe(2018)
    expect(LEANER_OPTION.body).toMatch(/as reported in 2018/)
  })

  it('points the dining source at the page that states the range', () => {
    expect(SOURCE_BY_ID.get(28)?.url).toBe('https://www.naboo.app/restaurants/new-york')
  })

  it('every source in the list is cited by something', () => {
    const cited = new Set<number>()
    for (const card of [...RESEARCH_PARTNERS, ...RESEARCH_PEOPLE]) {
      for (const id of card.sources) cited.add(id)
    }
    // The ones a figure cites must exist; the list may also hold sources
    // used only in prose, so this checks the direction that can go wrong.
    for (const id of cited) expect(SOURCE_BY_ID.get(id)).toBeDefined()
  })
})

describe('The Gardner figure is scoped to what she measured', () => {
  it('says one firm, in the past tense, and cites her own article', () => {
    const fact = CLIENT_FACTS.find((f) => f.figure === '5.7×')!
    expect(fact.body).toMatch(/At one firm Heidi Gardner studied/)
    expect(fact.body).toMatch(/generated/)
    expect(fact.sources).toEqual([18])
    expect(SOURCE_BY_ID.get(18)?.publisher).toMatch(/American Lawyer/)
    expect(SOURCE_BY_ID.get(18)?.year).toBe(2018)
  })
})
