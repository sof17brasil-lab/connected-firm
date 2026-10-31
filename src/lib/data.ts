/**
 * Every figure shown on the site, with the source it came from.
 *
 * Nothing here is invented. Values come from The_Connected_Firm_Outline.pdf
 * and the prompt's "Exact data" section; data.test.ts asserts them.
 * `estimate: true` renders a "My estimate" tag, `illustrative: true` an
 * "Illustrative" tag, so the labelling can never drift from the number.
 */

export interface Sourced {
  sources: number[]
  estimate?: boolean
  illustrative?: boolean
}

/* -- Section 1: Why now ------------------------------------------------- */

export interface StatTile extends Sourced {
  value: string
  /** Numeric target for the count-up, when the value is countable. */
  countTo?: number
  prefix?: string
  suffix?: string
  decimals?: number
  label: string
  note?: string
}

export const WHY_NOW_STATS: StatTile[] = [
  {
    value: '$3.594bn',
    countTo: 3.594,
    prefix: '$',
    suffix: 'bn',
    decimals: 3,
    label: '2025 revenue',
    note: 'Up ~8.4% on 2024',
    sources: [1, 2],
  },
  {
    value: '51',
    countTo: 51,
    label: 'Lateral partners hired in 2025',
    note: 'Across 43 offices in 29 countries',
    sources: [1, 5],
  },
  {
    value: '349 → 332',
    label: 'Equity partners',
    note: 'Down 4.9%, after -7% in 2024',
    sources: [5],
  },
  {
    value: '11.6%',
    countTo: 11.6,
    suffix: '%',
    decimals: 1,
    label: 'Annual growth needed to reach $5bn',
    note: '(5 / 3.594)^(1/3) - 1 = 11.63%',
    sources: [3],
  },
]

export interface RevenuePoint {
  year: number
  actual: number | null
  projected: number | null
  goal: number
}

/**
 * Actual revenue to 2025, then the ~8.4%-a-year projection.
 * 2025 appears in both series so the solid and dotted lines meet.
 */
export const REVENUE_DATA: RevenuePoint[] = [
  { year: 2023, actual: 2.949, projected: null, goal: 5.0 },
  { year: 2024, actual: 3.317, projected: null, goal: 5.0 },
  { year: 2025, actual: 3.594, projected: 3.594, goal: 5.0 },
  { year: 2026, actual: null, projected: 3.896, goal: 5.0 },
  { year: 2027, actual: null, projected: 4.223, goal: 5.0 },
  { year: 2028, actual: null, projected: 4.578, goal: 5.0 },
]

/** 2025 revenue as a share of the 2028 goal. Derived from the two figures. */
export const REVENUE_SHARE_OF_GOAL = 71.88

export const REVENUE_GOAL = 5.0
export const REVENUE_GAP_LABEL = '~$410-430M short at the current pace'

export interface CompetitorBar extends Sourced {
  firm: string
  growth: number
  isWhiteCase?: boolean
}

/** 2025 revenue growth, Am Law 100 2026. Kirkland is absent from the source. */
export const COMPETITOR_DATA: CompetitorBar[] = [
  { firm: 'Simpson Thacher', growth: 22.66, sources: [4] },
  { firm: 'Latham', growth: 18.57, sources: [4] },
  { firm: 'Gibson Dunn', growth: 18.37, sources: [4] },
  { firm: 'Skadden', growth: 11.0, sources: [4] },
  { firm: 'Ropes & Gray', growth: 9.39, sources: [4] },
  { firm: 'Sidley', growth: 8.68, sources: [4] },
  { firm: 'White & Case', growth: 8.36, isWhiteCase: true, sources: [4] },
  { firm: 'DLA Piper', growth: 8.1, sources: [4] },
  { firm: 'Baker McKenzie', growth: 7.24, sources: [4] },
]

export const BIG_LAW_AVERAGE = 13
export const BIG_LAW_AVERAGE_LABEL = 'Big Law average'

/* -- Section 2: The problem -------------------------------------------- */

export interface ResearchCard extends Sourced {
  figure: string
  body: string
  caveat?: string
}

export const RESEARCH_PARTNERS: ResearchCard[] = [
  {
    figure: '30-38%',
    body: 'of lateral partners leave within five years.',
    caveat: 'Older studies found up to 47%, so this range is conservative.',
    sources: [6],
  },
  {
    figure: '$4.04M',
    body: 'the cost of one failed lateral partner at an Am Law 50 firm.',
    caveat: '$4,039,200, Decipher, about 2022.',
    sources: [7],
  },
  {
    figure: 'Best predictor',
    body: 'Effective integration is the single strongest predictor of lateral success.',
    sources: [8],
  },
  {
    figure: '85%',
    body: 'of firms do not track whether lateral hires succeed.',
    sources: [9],
  },
]

export const RESEARCH_PEOPLE: ResearchCard[] = [
  {
    figure: '61%',
    body: 'of lawyers scored above average on the UCLA loneliness scale, the highest of any profession studied.',
    sources: [10],
  },
  {
    figure: '37% vs 49%',
    body: 'were willing to leave, with versus without a best friend at work. Only 2 in 10 US employees have one.',
    sources: [11],
  },
  {
    figure: '18% vs 61%',
    body: 'seriously considered quitting, by whether they were satisfied with their sense of belonging.',
    caveat: '5,107 workers across 26 countries.',
    sources: [12],
  },
  {
    figure: '4-5 points',
    body: 'turnover fell in offices given small budgets for social activities.',
    caveat: 'Field experiment at a microfinance company, not a law firm.',
    sources: [13],
  },
  {
    figure: '$200K-$500K',
    body: 'to replace one associate.',
    caveat: 'Likely conservative today.',
    sources: [14],
  },
  {
    figure: '~20%',
    body: 'associate attrition reached about this level in 2024.',
    sources: [15],
  },
  {
    figure: '9.4%',
    body: 'of associates are in it for the money alone, down from 17.2% in 2022.',
    caveat: 'After pay, associates rank culture (69%) and quality of work (64%).',
    sources: [16, 17],
  },
]

/* -- Section 3: What White & Case people say ---------------------------- */

export interface RatingBar {
  label: string
  value: number
  note?: string
}

/** Glassdoor category ratings, out of 5. Summary figures only. */
export const GLASSDOOR_BARS: RatingBar[] = [
  { label: 'Compensation & benefits', value: 4.3, note: 'Strongest category' },
  { label: 'Overall', value: 3.9 },
  { label: 'Culture & values', value: 3.9 },
  { label: 'Career opportunities', value: 3.7 },
  { label: 'Work-life balance', value: 3.4, note: '7% below similar legal employers' },
]

export const GLASSDOOR_SCALE_MAX = 5
export const GLASSDOOR_NOTE = '75% would recommend · 601 reviews'
export const GLASSDOOR_BY_ROLE = 'By role, Legal Assistants rate the firm 4.7 and Practice Assistants 3.5.'
export const GLASSDOOR_FRAMING =
  'People praise their colleagues. The opportunity is making that experience consistent across every team and office.'

/* -- Section 4: What already exists, and the gaps ----------------------- */

export interface GapRow extends Sourced {
  exists: string
  gap: string
  add: string
}

export const GAP_ROWS: GapRow[] = [
  {
    exists: 'Momentum summits for 3rd- and 5th-year associates',
    gap: 'Connections can fade between yearly summits',
    add: 'Momentum Circles',
    sources: [23],
  },
  {
    exists: '~50 lateral partners a year',
    gap: 'No public sign of a structured welcome program',
    add: 'First 90 Days (lead)',
    sources: [1, 5],
  },
  {
    exists: '43 offices, ~50% cross-border work',
    gap: 'Office ties depend on individual deals',
    add: 'Global Table',
    sources: [1],
  },
  {
    exists: 'Client events',
    gap: 'Usually measured by attendance',
    add: 'Client Roundtables',
    sources: [19],
  },
]

export const LONDON_CALLOUT = {
  title: 'Proven inside White & Case: London',
  points: [
    'Quarterly team socials, office-wide events, a local bar with a White & Case discount, a free in-house restaurant (Broad St Kitchen), and supervisor and buddy lunches for newcomers.',
    "Junior lawyers grade London's social life A to A* and peer support A*.",
    'Lesson for New York: put socializing on a predictable calendar, use the cafeteria as a hub, give every newcomer a buddy.',
  ],
  caveat:
    'Honest caveat: London still grades C on work-life balance. Connection helps people stay; it does not fix long hours.',
  sources: [22],
}

/* -- Copy shared across sections ---------------------------------------- */

export const THESIS =
  "White & Case already runs great events. I'd help connect them into one system and measure what they achieve, starting with the lateral partners the 2028 plan depends on."

export const THESIS_SECOND =
  "I'd handle the logistics like any coordinator, and I'd also measure what each event achieves, so the team can show leadership exactly how events support the 2028 plan."

export const CONTACT_EMAIL = 'sofiamotaus@gmail.com'
