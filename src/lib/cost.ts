/**
 * What the pilot actually costs, and what the saving is worth against it.
 *
 * The cash budget is the smallest part of either question, and quoting it
 * alone is the fastest way to lose a finance reviewer. Two things are added
 * here that the costings leave out:
 *
 *   - the hours the programmes take out of lawyers' days, which at any
 *     realistic rate are several times the catering bill;
 *   - a share of a coordinator's year. Only a share: the role exists
 *     whether or not the pilot runs, so charging the whole salary to it
 *     would be as misleading as charging none.
 *
 * It also scopes the saving. The pilot runs in New York and reaches on the
 * order of a hundred and fifty people; applying a firmwide population to it
 * is what made the old headline indefensible. The scenarios below run the
 * same tested calculator over each population and label the firmwide one
 * for what it is — a projection of what scaling it would be worth, not a
 * result of this pilot.
 */
import { DEFAULTS, calculate } from './calculator'
import { FAILED_LATERAL_COST, PILOT_TOTAL } from './data'

/* -- The hours ----------------------------------------------------------- */

export interface TimeLine {
  programme: string
  assumption: string
  hours: number
}

/** Who attends and for how long, per programme, across the pilot year. */
export const TIME_LINES: TimeLine[] = [
  {
    programme: 'First 90 Days',
    assumption: '15 New York lateral partners × 3 lunches × 6 people × 1.5 hours',
    hours: 15 * 3 * 6 * 1.5,
  },
  {
    programme: 'Momentum Circles',
    assumption: '48 associates × 10 lunches × 1 hour',
    hours: 48 * 10 * 1,
  },
  {
    programme: 'Global Table',
    assumption: '2 mixers × 60 people × 2 hours',
    hours: 2 * 60 * 2,
  },
  {
    programme: 'Client Roundtables',
    assumption: '8 dinners × 3 of our own people × 3 hours (clients’ time is not ours to count)',
    hours: 8 * 3 * 3,
  },
]

export const TOTAL_HOURS = TIME_LINES.reduce((sum, line) => sum + line.hours, 0)

/** Three rates rather than one, because the right one is arguable. */
export const HOURLY_RATES = [400, 600, 900] as const
export const MID_RATE = 600

/* -- The coordinator ----------------------------------------------------- */

/**
 * A New York events coordinator, fully loaded. My estimate from the market:
 * no White & Case band is published, and none is assumed here.
 */
export const COORDINATOR_LOADED_COST = 95000

/** The share of that year the pilot would take. My estimate. */
export const COORDINATOR_SHARE = 0.25

export const COORDINATOR_COST = COORDINATOR_LOADED_COST * COORDINATOR_SHARE

/* -- The total ----------------------------------------------------------- */

export interface AllInCost {
  rate: number
  cash: number
  time: number
  coordinator: number
  total: number
  /** The total as a share of one failed lateral partner. */
  shareOfFailedLateral: number
}

export function allInAt(rate: number): AllInCost {
  const time = TOTAL_HOURS * rate
  const total = PILOT_TOTAL + time + COORDINATOR_COST
  return {
    rate,
    cash: PILOT_TOTAL,
    time,
    coordinator: COORDINATOR_COST,
    total,
    shareOfFailedLateral: total / FAILED_LATERAL_COST,
  }
}

export const ALL_IN = HOURLY_RATES.map(allInAt)
export const ALL_IN_MID = allInAt(MID_RATE)

/** The cash budget alone, against one failed lateral. This is the headline. */
export const PILOT_SHARE_OF_FAILED_LATERAL = PILOT_TOTAL / FAILED_LATERAL_COST

/** How many departures the cash budget has to prevent to pay for itself. */
export const BREAK_EVEN_PEOPLE = PILOT_TOTAL / DEFAULTS.costPerDeparture

/* -- Who the pilot reaches ----------------------------------------------- */

export interface ReachScenario {
  who: string
  lawyers: number
  basis: string
  /** True for the firmwide row, which is a projection and not this pilot. */
  scaled?: boolean
}

export const REACH_SCENARIOS: ReachScenario[] = [
  {
    who: 'Momentum cohort only',
    lawyers: 48,
    basis: '4 cohorts × 12 associates, the one programme with a fixed roll',
  },
  {
    who: 'Associates and New York laterals',
    lawyers: 63,
    basis: 'those 48, plus the ~15 lateral partners First 90 Days is built for',
  },
  {
    who: 'Generous New York reach',
    lawyers: 150,
    basis: 'adding the Global Table mixers, counting everyone who attends anything',
  },
  {
    who: 'Firmwide',
    lawyers: 1950,
    basis: '2,643 lawyers less 693 partners. Not this pilot: what scaling it everywhere would be worth',
    scaled: true,
  },
]

export interface ReachResult extends ReachScenario {
  avoided: number
  savings: number
  multiple: number
}

/**
 * Each population run through the same calculator, at the same one point of
 * reduced attrition and the same $200,000 a departure.
 */
export const REACH_RESULTS: ReachResult[] = REACH_SCENARIOS.map((scenario) => {
  const out = calculate({ ...DEFAULTS, lawyers: scenario.lawyers })
  return {
    ...scenario,
    avoided: out.departuresAvoided,
    savings: out.savings,
    multiple: out.savings / PILOT_TOTAL,
  }
})
