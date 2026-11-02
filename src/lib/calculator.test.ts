import { describe, expect, it } from 'vitest'
import { BOUNDS, DEFAULTS, calculate, money, verdict } from './calculator'

describe('Calculator defaults', () => {
  const out = calculate(DEFAULTS)

  it('matches the five figures the brief specifies', () => {
    expect(out.baselineDepartures).toBe(390)
    expect(out.departuresAvoided).toBe(19.5)
    expect(out.savings).toBe(3_900_000)
    expect(Math.round(out.returnPerDollar)).toBe(50)
    expect(+out.breakEvenLawyers.toFixed(1)).toBe(0.4)
  })

  it('reads as $3.9M', () => {
    expect(money(out.savings)).toBe('$3.9M')
  })

  it('does not lose money at the defaults', () => {
    expect(out.losesMoney).toBe(false)
  })
})

describe('Calculator bounds', () => {
  it('matches the specified slider ranges', () => {
    expect(BOUNDS.lawyers).toMatchObject({ min: 40, max: 1950, step: 10 })
    expect(BOUNDS.attrition.min).toBe(5)
    expect(BOUNDS.attrition.max).toBe(30)
    expect(BOUNDS.costPerDeparture).toMatchObject({ min: 100000, max: 500000, step: 25000 })
    expect(BOUNDS.reduction).toMatchObject({ min: 0, max: 5, step: 0.5 })
    expect(BOUNDS.pilotCost).toMatchObject({ min: 20000, max: 200000, step: 1000 })
  })

  it('starts every input inside its own range', () => {
    for (const key of Object.keys(BOUNDS) as Array<keyof typeof BOUNDS>) {
      expect(DEFAULTS[key]).toBeGreaterThanOrEqual(BOUNDS[key].min)
      expect(DEFAULTS[key]).toBeLessThanOrEqual(BOUNDS[key].max)
    }
  })
})

describe('Calculator edge cases', () => {
  it('never avoids more departures than would have happened', () => {
    const out = calculate({ ...DEFAULTS, attrition: 5, reduction: 5 })
    expect(out.departuresAvoided).toBe(out.baselineDepartures)
    expect(out.departuresAvoided).toBe(1950 * 0.05)
  })

  it('saves nothing when the reduction is zero', () => {
    const out = calculate({ ...DEFAULTS, reduction: 0 })
    expect(out.savings).toBe(0)
    expect(out.losesMoney).toBe(true)
    expect(verdict({ ...DEFAULTS, reduction: 0 }, out)).toMatch(/saves nothing/)
  })

  it('says so plainly when the pilot loses money', () => {
    // 200 lawyers x 0.5pt = 1 departure avoided x $100k = $100k, against a $200k pilot.
    const input = { ...DEFAULTS, lawyers: 200, reduction: 0.5, costPerDeparture: 100000, pilotCost: 200000 }
    const out = calculate(input)
    expect(out.losesMoney).toBe(true)
    expect(verdict(input, out)).toMatch(/loses money/)
  })

  it('handles a zero pilot cost without dividing by zero', () => {
    const out = calculate({ ...DEFAULTS, pilotCost: 0 })
    expect(Number.isFinite(out.returnPerDollar)).toBe(true)
  })
})
