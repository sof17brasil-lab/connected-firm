/**
 * The retention calculator's arithmetic, kept as pure functions so it can be
 * tested on its own and so the component cannot quietly change a figure.
 *
 * It is an illustrative model built on public industry figures. White & Case
 * does not publish its own attrition rate, and the UI says so next to it.
 */

export interface CalculatorInputs {
  /** Non-partner lawyers in scope. */
  lawyers: number
  /** Annual attrition, in percent. */
  attrition: number
  /** Cost of one departure, in dollars. */
  costPerDeparture: number
  /** Turnover reduction, in percentage points. */
  reduction: number
  /** Pilot cost, in dollars. */
  pilotCost: number
}

export interface CalculatorOutputs {
  baselineDepartures: number
  departuresAvoided: number
  savings: number
  returnPerDollar: number
  breakEvenLawyers: number
  /** True when the pilot costs more than it saves. */
  losesMoney: boolean
}

export const DEFAULTS: CalculatorInputs = {
  lawyers: 1950,
  attrition: 20,
  costPerDeparture: 200000,
  reduction: 1,
  pilotCost: 77600,
}

export const BOUNDS = {
  lawyers: { min: 200, max: 1950, step: 50 },
  attrition: { min: 5, max: 30, step: 1 },
  costPerDeparture: { min: 100000, max: 500000, step: 25000 },
  reduction: { min: 0, max: 5, step: 0.5 },
  pilotCost: { min: 20000, max: 200000, step: 1000 },
} as const

export function calculate(input: CalculatorInputs): CalculatorOutputs {
  const baselineDepartures = input.lawyers * (input.attrition / 100)

  // A pilot cannot prevent more departures than would have happened anyway.
  const departuresAvoided = Math.min(
    input.lawyers * (input.reduction / 100),
    baselineDepartures,
  )

  const savings = departuresAvoided * input.costPerDeparture
  const returnPerDollar = input.pilotCost > 0 ? savings / input.pilotCost : 0
  const breakEvenLawyers =
    input.costPerDeparture > 0 ? input.pilotCost / input.costPerDeparture : 0

  return {
    baselineDepartures,
    departuresAvoided,
    savings,
    returnPerDollar,
    breakEvenLawyers,
    losesMoney: savings < input.pilotCost,
  }
}

/** The sentence under the chart, which has to stay honest when the model turns negative. */
export function verdict(input: CalculatorInputs, out: CalculatorOutputs): string {
  if (out.departuresAvoided === 0) {
    return 'With no reduction in turnover, the pilot saves nothing and costs its full price.'
  }

  if (out.losesMoney) {
    return `At these settings the pilot loses money: it costs ${money(input.pilotCost)} and saves ${money(out.savings)}.`
  }

  return `Keeping ${round(out.departuresAvoided)} of ${round(out.baselineDepartures)} expected departures saves ${money(out.savings)}, or ${out.returnPerDollar.toFixed(0)}× the ${money(input.pilotCost)} pilot.`
}

export function money(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${Math.round(value)}`
}

export function round(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 })
}
