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
    note: 'Across 11 offices, including 15 in New York',
    sources: [32, 33],
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

/**
 * 2025 revenue growth for the Am Law top ten by revenue, as the 2026 Am Law
 * 100 lists them. Kirkland leads on both counts and belongs here: an earlier
 * version of this file said it was absent from the source, which was wrong.
 */
export const COMPETITOR_DATA: CompetitorBar[] = [
  { firm: 'Simpson Thacher', growth: 22.66, sources: [4] },
  { firm: 'Kirkland & Ellis', growth: 19.93, sources: [4] },
  { firm: 'Latham', growth: 18.57, sources: [4] },
  { firm: 'Gibson Dunn', growth: 18.37, sources: [4] },
  { firm: 'Skadden', growth: 11.0, sources: [4] },
  { firm: 'Ropes & Gray', growth: 9.39, sources: [4] },
  { firm: 'Sidley', growth: 8.68, sources: [4] },
  { firm: 'White & Case', growth: 8.36, isWhiteCase: true, sources: [4] },
  { firm: 'DLA Piper', growth: 8.1, sources: [4] },
  { firm: 'Baker McKenzie', growth: 7.24, sources: [4] },
]

/**
 * 13.0% is the Am Law 100's *aggregate* 2025 revenue growth, weighted across
 * all 100 firms — not the average of the nine plotted here, and not a
 * like-for-like benchmark for one firm. The median of the nine is computed
 * in lib/figures.ts and drawn beside it, because against that White & Case
 * sits just below the middle rather than far behind.
 */
export const BIG_LAW_AVERAGE = 13
export const BIG_LAW_AVERAGE_LABEL = 'Am Law 100 aggregate, +13.0%'

/** Am Law 100 revenue per lawyer, 2025. The per-lawyer view of the same year. */
export const AM_LAW_REVENUE_PER_LAWYER_GROWTH = 8.7
export const AM_LAW_REVENUE_PER_LAWYER = '$1.39M'

/* -- Section 2: The problem -------------------------------------------- */

export interface ResearchCard extends Sourced {
  figure: string
  body: string
  caveat?: string
}

/**
 * What one failed lateral partner costs, by Am Law band.
 *
 * ALM Intelligence and Decipher, 2022, built from compensation data and
 * SHRM attrition costs. Decipher sells lateral due diligence, so it has an
 * interest in the number being large; showing all three bands is what makes
 * the one the site uses legible rather than just big.
 */
export const FAILED_LATERAL_TIERS = [
  { band: 'Am Law 151-200', cost: 715500, label: '$715,500' },
  { band: 'Am Law 51-150', cost: 1509300, label: '$1,509,300' },
  { band: 'Am Law 50', cost: 4039200, label: '$4,039,200', isUs: true },
]

/** The Am Law 50 band, which is the one White & Case sits in. */
export const FAILED_LATERAL_COST = 4039200

export const RESEARCH_PARTNERS: ResearchCard[] = [
  {
    figure: '30-38%',
    body: 'of lateral partners leave within five years.',
    caveat:
      'Decipher Investigative Intelligence, cited by Above the Law, May 2026. An earlier Decipher/ALM survey put it near 50%.',
    sources: [6, 30],
  },
  {
    figure: '$4.04M',
    body: 'the cost of one failed lateral partner at an Am Law 50 firm.',
    caveat:
      '$4,039,200. ALM Intelligence and Decipher, 2022, from compensation data and SHRM attrition costs. The same paper puts Am Law 51-150 at $1,509,300 and Am Law 151-200 at $715,500. Decipher sells lateral vetting, so treat it as a vendor estimate.',
    sources: [7, 30],
  },
  {
    figure: 'Best predictor',
    body: 'Effective integration is the single best predictor of lateral partner satisfaction.',
    sources: [8, 9],
  },
  {
    figure: '90%',
    body: 'of firms report business development challenges with laterals.',
    sources: [6],
  },
]

export const RESEARCH_PEOPLE: ResearchCard[] = [
  {
    figure: '61%',
    body: 'of lawyers scored above average on the UCLA Loneliness Scale, the highest of any profession studied.',
    caveat:
      'Achor et al., Harvard Business Review, 2018, from BetterUp research across about 1,600 workers in all occupations, so the legal sample is small. UCLA wrote the scale, not the study.',
    sources: [10],
  },
  {
    figure: '2 in 10',
    body: 'US employees report having a best friend at work, and Gallup links having one to retention and to intent to leave.',
    caveat:
      'Gallup, from a June 2022 survey. Gallup publishes the link to intent to leave without a percentage split, so no split is quoted here.',
    sources: [11],
  },
  {
    figure: '18% vs 61%',
    body: 'seriously considered quitting, by whether they were satisfied with their sense of belonging.',
    caveat: '5,107 workers across 26 countries.',
    sources: [12],
  },
  {
    figure: 'about 4-4.5 points',
    body: 'turnover fell in offices given small budgets for social activities.',
    caveat:
      'From a 9-13% baseline, in the months after a three-month program. Field experiment at a microfinance firm, not a law firm (Belot & Hakimov, RFBerlin Discussion Paper 26033, 2026).',
    sources: [13],
  },
  {
    figure: '$200K-$500K',
    body: 'to replace one associate.',
    caveat:
      'Legal recruiters\u2019 estimate drawing on NALP\u2019s 2017 attrition update, not a NALP figure itself. Likely conservative today.',
    sources: [14],
  },
  {
    figure: '19%',
    body: 'associate attrition across 141 firms in 2025, down from 20% in 2024. The four larger firm-size cohorts ran 16-18%.',
    caveat: '6,335 hires and 4,442 departures. Firms of 100 or fewer attorneys were highest, at 24%.',
    sources: [15],
  },
  {
    figure: '9.4%',
    body: 'of associates are in it for the money alone, down from 17.2% in 2022.',
    caveat: 'BTI, 2026.',
    sources: [16],
  },
  {
    figure: '69% / 64%',
    body: 'of associates rank culture and quality of work as what matters after pay.',
    caveat: 'Major, Lindsey & Africa, 2023 survey of ~300 associates.',
    sources: [17],
  },
]

/* -- Section 3: What White & Case people say ---------------------------- */

export interface RatingBar {
  label: string
  value: number
  note?: string
}

/**
 * Glassdoor category ratings, out of 5. Summary figures only, no review is
 * quoted and no reviewer identified.
 *
 * These move continuously, so they are read off the page rather than carried
 * over, dated, and shown in full: all six categories Glassdoor lists, not a
 * chosen five. Checked 2 November 2026.
 */
export const GLASSDOOR_BARS: RatingBar[] = [
  { label: 'Compensation and benefits', value: 4.3, note: 'Highest category' },
  { label: 'Diversity & inclusion', value: 3.9 },
  { label: 'Culture & values', value: 3.8 },
  { label: 'Work/life balance', value: 3.4 },
  { label: 'Senior management', value: 3.4 },
  { label: 'Career opportunities', value: 3.3, note: 'Lowest category' },
]

export const GLASSDOOR_SCALE_MAX = 5
export const GLASSDOOR_OVERALL = 3.7
export const GLASSDOOR_REVIEWS = 606
export const GLASSDOOR_CHECKED = '2 November 2026'

export const GLASSDOOR_NOTE = `Overall ${GLASSDOOR_OVERALL} out of 5 · 74% would recommend · ${GLASSDOOR_REVIEWS} reviews · read ${GLASSDOOR_CHECKED}`

/**
 * The comparison matters: without it the section reads as "this firm has a
 * culture problem", which the data does not say and a partner would reject
 * on sight. What the spread does show is where the gap is.
 */
export const GLASSDOOR_CONTEXT =
  'Glassdoor puts that 3.7 in line with the average for employers in the legal industry, which is also 3.7. The firm is not an outlier; the spread inside it is the interesting part.'

export const GLASSDOOR_FRAMING =
  'Pay is the highest score and career opportunity the lowest, a full point below it. That gap is about whether people can see a path and the people who shape it — which is the kind of thing a calendar of small, deliberate introductions can move, and money cannot.'

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
    add: 'First 90 Days',
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
    gap: 'Across the industry these are usually counted by attendance rather than by what follows',
    add: 'Client Roundtables',
    sources: [19],
  },
]

/**
 * Grades move with each year's survey, so these are quoted with the survey
 * they come from and were checked against the live scorecard rather than
 * carried over from an earlier edition.
 */
export const LONDON_CALLOUT = {
  title: 'What London already scores well on',
  points: [
    'In the Legal Cheek Trainee and Junior Lawyer Survey 2026-27, of over 2,000 trainees and junior associates, the London office scores A for peer support, A* for training, A for quality of work and A* for perks.',
    'Social life scores B, so the raw ingredients are there without the calendar that would make the most of them.',
    'Lesson for New York: put socializing on a predictable calendar and give every newcomer a buddy. The published evidence for buddy pairing is faster ramp-up and higher satisfaction, not retention; retention is what the pilot would test.',
  ],
  caveat:
    'Honest caveat: the same survey grades London D on work-life balance, its lowest score. Connection helps people stay; it does not fix long hours.',
  sources: [22],
}

/* -- Copy shared across sections ---------------------------------------- */

export const THESIS =
  "White & Case already runs great events. I'd help connect them into one system and measure what they achieve, starting with the lateral partners the 2028 plan depends on."

export const THESIS_SECOND =
  "I'd handle the logistics like any coordinator, and I'd also measure what each event achieves, so the team can show leadership exactly how events support the 2028 plan."

export const CONTACT_EMAIL = 'sofiamotaus@gmail.com'

/* -- Section 5: The plan ------------------------------------------------ */

export interface Program extends Sourced {
  name: string
  /** Whose programme it is. A coordinator runs it; they do not own it. */
  runsFor?: string
  calculation: string
  cost: number
  costLabel: string
  /** What it is, in a sentence. */
  blurb: string
}

export const PROGRAMS: Program[] = [
  {
    name: 'First 90 Days',
    runsFor: 'the Talent team and practice leaders',
    calculation: '15 New York lateral partners × 3 lunches × 6 people × $100',
    cost: 27000,
    costLabel: '$27,000',
    blurb:
      'A structured welcome for every lateral partner: three small lunches in their first ninety days, each with people they would not otherwise meet.',
    // The headcount is published now; the three lunches, the six seats and
    // the hundred dollars are still mine, so the tag stays.
    estimate: true,
    sources: [28, 33],
  },
  {
    name: 'Momentum Circles',
    calculation: '4 cohorts × 12 people × 10 lunches × $40',
    cost: 19200,
    costLabel: '$19,200',
    blurb:
      'Keeps the Momentum summit cohorts talking between summits, with a standing monthly lunch rather than a yearly event.',
    sources: [23],
  },
  {
    name: 'Global Table',
    calculation: '2 mixers × 60 people × $75, virtual sessions ~free',
    cost: 9000,
    costLabel: '$9,000',
    blurb:
      'Brings New York together with one other office at a time, so cross-border ties exist before a deal needs them.',
    sources: [1],
  },
  {
    name: 'Client Roundtables',
    runsFor: 'Business Development',
    calculation: '8 dinners × 14 seats × $200',
    cost: 22400,
    costLabel: '$22,400',
    blurb:
      'Small client dinners built around a topic rather than a pitch, measured by what follows rather than who attended.',
    sources: [19, 28],
  },
]

export const PILOT_TOTAL = 77600
export const PILOT_TOTAL_LABEL = '$77,600'

export const LEANER_OPTION = {
  label: 'Leaner',
  body: "At Arnold & Porter's $50-per-person lunch limit (as reported in 2018), First 90 Days costs $13,500 and the total drops to about $64K.",
  sources: [26],
}

export const COST_NEUTRAL_OPTION = {
  label: 'Cost-neutral',
  body: 'One 200-person reception (200 × $150 = $30,000) pays for about ten client dinners: $30,000 ÷ $2,800 = 10.7.',
  sources: [28],
}

export const DESIGN_RULE =
  'Every program is optional, small and short. Mandatory team-building can backfire.'

export interface RoadmapPhase {
  when: string
  what: string
}

export const ROADMAP: RoadmapPhase[] = [
  { when: 'Month 1', what: 'Listen and set baselines.' },
  { when: 'Months 2-3', what: 'Launch First 90 Days and Momentum Circles.' },
  { when: 'Months 4-6', what: 'Add Client Roundtables and Global Table.' },
  {
    when: 'Months 7-12',
    what: 'Compare participants with non-participants, then recommend scale, adjust or stop.',
  },
]

/* -- Section 6: The business case --------------------------------------- */

export const LATERAL_FUNNEL = {
  hired: 51,
  leaveLow: 15.3,
  leaveHigh: 19.4,
  leaveLabel: '~15-19',
  // 15.3 x 4,039,200 = 61,799,760 and 19.4 x 4,039,200 = 78,360,480.
  atRiskLabel: '$61.8M-$78.4M',
  firmwideCost: 91800,
  firmwideCostLabel: '$91,800',
  returnMultiple: 44,
  pointsMoved: '1 / 51 = 2 points',
  sources: [6, 7],
}

export interface KeepFourRow extends Sourced {
  who: string
  calculation: string
  saved: string
}

export const KEEP_FOUR: KeepFourRow[] = [
  { who: '4 associates (low)', calculation: '4 × $200,000', saved: '$800,000', sources: [14] },
  { who: '4 associates (high)', calculation: '4 × $500,000', saved: '$2,000,000', sources: [14] },
  { who: '4 lateral partners', calculation: '4 × $4,039,200', saved: '~$16.2M', sources: [7] },
]

export const KEEP_FOUR_NOTE =
  'Keeping four associates returns 10-26× the $77,600 pilot cost.'

export const MOMENTUM_SCENARIOS = {
  people: 48,
  cautious: { rate: '1%', avoided: 0.48, saved: '$96,000', multiple: '5×' },
  field: { rate: '4%', avoided: 1.92, saved: '$384,000', multiple: '20×' },
  sources: [13, 14],
}

export const CLIENT_FACTS = [
  {
    figure: '5.7×',
    body: 'At one firm Heidi Gardner studied, clients served by three practice groups generated 5.7 times the revenue of clients served by one.',
    sources: [18],
  },
  {
    figure: '~4 days',
    body: 'The dinners break even on about four days of one lawyer’s work: $1.36M per lawyer ÷ 250 days = $5,440 a day, and $22,400 ÷ $5,440 ≈ 4.',
    sources: [29],
  },
]

export const HEADLINE_CALLOUT = {
  figure: '1.9%',
  calculation: '$77,600 ÷ $4,039,200',
  body: 'The whole pilot costs less than 2% of one failed lateral partner.',
  sources: [7],
}

/* -- Section 7: How I'd measure it -------------------------------------- */

export interface ScorecardMetric {
  name: string
  target: string | null
}

/**
 * Deliberately has no values. A sample layout with invented numbers would be
 * fiction that screenshots out of context; the targets that do exist are the
 * ones named in the outline.
 */
export const SCORECARD: ScorecardMetric[] = [
  { name: 'Attendance', target: null },
  { name: 'Repeat rate', target: null },
  { name: 'Follow-ups within 30 days', target: null },
  { name: 'New matters', target: null },
  { name: 'Cost per relationship', target: null },
  { name: 'Belonging score', target: null },
  { name: 'Cross-office introductions per new partner', target: '10+ in 90 days' },
]

export const MEASUREMENT_LIST = [
  'Set success targets before launch, for example 10+ cross-office introductions per new partner in 90 days.',
  'Link event attendance to the firm’s client and new-work data.',
  'Publish a monthly Event Impact Scorecard.',
  'Compare participants with similar non-participants, with surveys before and after.',
  'Report connection counts by cohort only, never by individual: an HR-run process, on an agreed basis, with no flagging of named partners.',
  'Track no-show rates and cost per guest to cut waste.',
  'Analyze client feedback themes in English and Portuguese.',
  'Add one survey question: “I feel valued for my work.”',
]

/* -- Section 8: Risks --------------------------------------------------- */

export interface Risk {
  pushback: string
  answer: string
}

export const RISKS: Risk[] = [
  {
    pushback: 'We already do this.',
    answer:
      'It builds on Momentum, the alumni program and client events, and supports the HR and talent teams that own retention.',
  },
  {
    pushback: 'Lawyers won’t show up.',
    answer: 'Optional, small and short: a lunch, or ninety minutes in the evening.',
  },
  {
    pushback: 'You can’t prove it.',
    answer:
      'True in year one. Track early signals, then compare participants with non-participants.',
  },
  {
    pushback: 'Costs are already up.',
    answer: 'Use the cost-neutral version: move budget from one large reception.',
  },
  {
    pushback: 'Partners won’t host.',
    answer:
      'Hosting supports the new partner evaluations, which reward client engagement and collaboration.',
  },
  {
    pushback: 'Privacy and compliance.',
    answer:
      'Anonymized reporting only, HR and compliance sign-off, and client gift rules respected.',
  },
]

/* -- Section 9: About --------------------------------------------------- */

export const ABOUT = {
  name: 'Sofia Mota',
  bio: '2026 Business Analytics graduate of Biola University. Events Coordinator for Biola’s Global Student Engagement office, running about ten events a semester. Coordinated camps for 200+ children and built dashboards with Restoration Ministries in São Paulo. Speaks English and Portuguese.',
  email: CONTACT_EMAIL,
}
