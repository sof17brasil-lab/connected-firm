import { describe, expect, it } from 'vitest'
import {
  BIG_LAW_AVERAGE,
  COMPETITOR_DATA,
  GAP_ROWS,
  GLASSDOOR_BARS,
  GLASSDOOR_NOTE,
  REVENUE_DATA,
  REVENUE_GOAL,
  RESEARCH_PARTNERS,
  RESEARCH_PEOPLE,
  WHY_NOW_STATS,
} from './data'
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
