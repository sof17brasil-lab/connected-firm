import { describe, expect, it } from 'vitest'
import { DEFAULTS, calculate } from './calculator'
import { FAILED_LATERAL_COST, FAILED_LATERAL_TIERS, PILOT_TOTAL, PROGRAMS } from './data'
import {
  ALL_IN,
  ALL_IN_MID,
  BREAK_EVEN_PEOPLE,
  COORDINATOR_COST,
  COORDINATOR_LOADED_COST,
  COORDINATOR_SHARE,
  HOURLY_RATES,
  MID_RATE,
  PILOT_SHARE_OF_FAILED_LATERAL,
  REACH_RESULTS,
  TIME_LINES,
  TOTAL_HOURS,
  allInAt,
} from './cost'

/**
 * The cost side has to add up as shown. A total that quietly leaves out a
 * line it displays is exactly the failure this file exists to prevent.
 */

describe('the hours', () => {
  it('counts one line per programme', () => {
    expect(TIME_LINES.map((l) => l.programme)).toEqual(PROGRAMS.map((p) => p.name))
  })

  it('states an assumption for every line', () => {
    for (const line of TIME_LINES) {
      expect(line.assumption.length).toBeGreaterThan(20)
      expect(line.hours).toBeGreaterThan(0)
    }
  })

  it('adds to about twelve hundred person-hours', () => {
    expect(TIME_LINES.map((l) => l.hours)).toEqual([405, 480, 240, 72])
    expect(TOTAL_HOURS).toBe(1197)
  })
})

describe('the coordinator', () => {
  it('charges a share of the year, not a whole salary', () => {
    expect(COORDINATOR_SHARE).toBeGreaterThan(0)
    expect(COORDINATOR_SHARE).toBeLessThan(1)
    expect(COORDINATOR_COST).toBe(COORDINATOR_LOADED_COST * COORDINATOR_SHARE)
    expect(COORDINATOR_COST).toBe(23_750)
  })

  it('is well short of the full loaded cost', () => {
    expect(COORDINATOR_COST).toBeLessThan(COORDINATOR_LOADED_COST)
  })
})

describe('the all-in total', () => {
  it('runs the three rates asked for', () => {
    expect(HOURLY_RATES).toEqual([400, 600, 900])
    expect(ALL_IN.map((a) => a.rate)).toEqual([400, 600, 900])
    expect(ALL_IN_MID.rate).toBe(MID_RATE)
  })

  it('includes every line it shows, at every rate', () => {
    for (const row of ALL_IN) {
      expect(row.total).toBe(row.cash + row.time + row.coordinator)
      expect(row.cash).toBe(PILOT_TOTAL)
      expect(row.coordinator).toBe(COORDINATOR_COST)
      expect(row.time).toBe(TOTAL_HOURS * row.rate)
    }
  })

  it('is the figures the page prints', () => {
    expect(ALL_IN.map((a) => a.total)).toEqual([580_150, 819_550, 1_178_650])
  })

  it('leaves nothing out — the total is strictly more than cash plus time', () => {
    // The earlier $796K quoted a salary in its own caption and then did not
    // add it. Every rate here must exceed cash + time by the coordinator.
    for (const row of ALL_IN) {
      expect(row.total).toBeGreaterThan(row.cash + row.time)
      expect(row.total - (row.cash + row.time)).toBe(COORDINATOR_COST)
    }
    expect(ALL_IN_MID.total).not.toBe(795_800)
  })

  it('is about a fifth of one failed lateral at the middle rate', () => {
    expect(ALL_IN_MID.shareOfFailedLateral).toBeCloseTo(0.2029, 4)
    expect((ALL_IN_MID.shareOfFailedLateral * 100).toFixed(1)).toBe('20.3')
  })

  it('stays between a seventh and a third across the range', () => {
    expect((ALL_IN[0].shareOfFailedLateral * 100).toFixed(1)).toBe('14.4')
    expect((ALL_IN[2].shareOfFailedLateral * 100).toFixed(1)).toBe('29.2')
  })

  it('computes any rate the same way', () => {
    const row = allInAt(750)
    expect(row.total).toBe(PILOT_TOTAL + 1197 * 750 + COORDINATOR_COST)
  })
})

describe('the headline', () => {
  it('is the cash budget over one failed lateral', () => {
    expect(PILOT_SHARE_OF_FAILED_LATERAL).toBe(PILOT_TOTAL / FAILED_LATERAL_COST)
    expect((PILOT_SHARE_OF_FAILED_LATERAL * 100).toFixed(1)).toBe('1.9')
    expect((PILOT_SHARE_OF_FAILED_LATERAL * 100).toFixed(2)).toBe('1.92')
  })

  it('needs no population assumption at all', () => {
    expect(PILOT_TOTAL).toBe(77_600)
    expect(FAILED_LATERAL_COST).toBe(4_039_200)
  })

  it('breaks even below one person', () => {
    expect(BREAK_EVEN_PEOPLE).toBe(PILOT_TOTAL / DEFAULTS.costPerDeparture)
    expect(BREAK_EVEN_PEOPLE).toBeLessThan(1)
    expect(BREAK_EVEN_PEOPLE.toFixed(2)).toBe('0.39')
  })

  it('uses the Am Law 50 band, and the paper carries all three', () => {
    expect(FAILED_LATERAL_TIERS).toHaveLength(3)
    expect(FAILED_LATERAL_TIERS.map((t) => t.cost)).toEqual([715_500, 1_509_300, 4_039_200])
    const ours = FAILED_LATERAL_TIERS.find((t) => t.isUs)
    expect(ours?.cost).toBe(FAILED_LATERAL_COST)
  })
})

describe('who the pilot reaches', () => {
  it('runs the four populations, smallest first', () => {
    expect(REACH_RESULTS.map((r) => r.lawyers)).toEqual([48, 63, 150, 1950])
  })

  it('marks only the firmwide row as scaled beyond this pilot', () => {
    expect(REACH_RESULTS.filter((r) => r.scaled)).toHaveLength(1)
    expect(REACH_RESULTS.find((r) => r.scaled)?.lawyers).toBe(1950)
  })

  it('sources the firmwide headcount rather than asserting it', () => {
    const firmwide = REACH_RESULTS.find((r) => r.scaled)!
    // 2,643 lawyers less 693 partners, both published for 2025.
    expect(2643 - 693).toBe(firmwide.lawyers)
    expect(firmwide.basis).toContain('2,643')
  })

  it('uses the calculator for every row', () => {
    for (const row of REACH_RESULTS) {
      const out = calculate({ ...DEFAULTS, lawyers: row.lawyers })
      expect(row.avoided).toBe(out.departuresAvoided)
      expect(row.savings).toBe(out.savings)
    }
  })

  it('produces the savings the table prints', () => {
    expect(REACH_RESULTS.map((r) => r.savings)).toEqual([96_000, 126_000, 300_000, 3_900_000])
  })

  it('produces the multiples the table prints', () => {
    expect(REACH_RESULTS.map((r) => +r.multiple.toFixed(1))).toEqual([1.2, 1.6, 3.9, 50.3])
  })

  it('clears the pilot cost even at the smallest reach', () => {
    expect(REACH_RESULTS[0].savings).toBeGreaterThan(PILOT_TOTAL)
  })

  it('keeps the $3.9M tied to the firmwide population, not the pilot', () => {
    const threeNine = REACH_RESULTS.find((r) => r.savings === 3_900_000)!
    expect(threeNine.scaled).toBe(true)
  })
})
