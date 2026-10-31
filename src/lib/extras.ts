/**
 * Content for the two reference pages. Everything here is from the outline;
 * `sources` holds the numbered entries each item is backed by.
 */

export interface ExtraItem {
  title: string
  body: string
  sources: number[]
}

export const OTHER_FIRMS: ExtraItem[] = [
  {
    title: "O'Melveny",
    body: "No. 1 on Vault's Best Law Firms to Work For. Every new associate gets a partner mentor and an associate mentor, and the firm sponsors coffee and lunch so people can meet.",
    sources: [25],
  },
  {
    title: 'Arnold & Porter',
    body: 'Unlimited free lunch with new associates for their first three months, capped at $50 a person, plus a mentorship lunch budget.',
    sources: [26],
  },
  {
    title: 'Fried Frank',
    body: 'Introduced free "grab and go" lunches on "Reconnect Wednesdays" around 2022. Described here in the past tense: whether it still runs is unverified.',
    sources: [27],
  },
  {
    title: 'Ropes & Gray',
    body: 'Complimentary breakfast and lunch in the office.',
    sources: [26],
  },
  {
    title: 'Baker Donelson',
    body: 'BakerWell, a wellness program with coaching and mental health resources.',
    sources: [],
  },
]

export const ALREADY_HAS: ExtraItem[] = [
  {
    title: 'The World Cup',
    body: 'An annual inter-office football and volleyball tournament. Madrid in 2024, Munich in 2025.',
    sources: [24],
  },
  {
    title: 'Cafeterias',
    body: 'A full-service cafeteria in the New York office, and Broad St Kitchen in London serving free meals.',
    sources: [22],
  },
  {
    title: 'London socials',
    body: 'Quarterly team socials, office-wide events, a local bar with a firm discount, and buddy lunches for newcomers.',
    sources: [22],
  },
]

export interface Idea {
  name: string
  body: string
}

export const IDEAS: Idea[] = [
  {
    name: 'Closing Bell',
    body: 'Extend closing celebrations to everyone who worked the deal, including paralegals, assistants and business services staff.',
  },
  {
    name: 'Connect Table',
    body: 'A weekly cafeteria lunch where people from different practices and roles sit together on purpose.',
  },
  {
    name: 'Lunch Roulette',
    body: 'Random pairings across practices, offices and roles for a sponsored coffee.',
  },
  {
    name: 'Seen Awards',
    body: 'Peer-nominated recognition, read aloud at a monthly gathering.',
  },
  {
    name: 'Skills Swap',
    body: 'Staff teach lawyers a skill; lawyers teach staff how a deal works.',
  },
  {
    name: 'Taste of 29 Countries',
    body: "A monthly food or culture hour hosted by one office's country.",
  },
  {
    name: 'Pro Bono Team Day',
    body: 'A team day built around pro bono work, with Partner Office Hours alongside it.',
  },
]

export const THURSDAY_TABLE = [
  'HR approval',
  'A licensed bartender',
  'Strong non-alcoholic options',
  'A set end time',
  'No open tabs paid by senior people for junior people',
]

/* -- Methodology -------------------------------------------------------- */

export interface Assumption {
  name: string
  value: string
  why: string
  sources: number[]
}

export const ASSUMPTIONS: Assumption[] = [
  {
    name: 'NY lateral partners per year',
    value: '~15',
    why: 'My estimate. The firm does not publish lateral hires by office.',
    sources: [],
  },
  {
    name: 'Lunch cost per person',
    value: '$100 ($50 lean)',
    why: 'Estimate. Arnold & Porter caps its lunches at $50.',
    sources: [26],
  },
  {
    name: 'Client dinner per person',
    value: '$200',
    why: 'NYC corporate dining runs $75-$200 a head.',
    sources: [28],
  },
  {
    name: 'Turnover reduction',
    value: '1-4 points',
    why: 'A field experiment found 4-5 points, at a non-legal firm.',
    sources: [13],
  },
  {
    name: 'Cost per associate departure',
    value: '$200,000-$500,000',
    why: 'NALP, 2017. Likely conservative today.',
    sources: [14],
  },
  {
    name: 'Cost per failed lateral partner',
    value: '$4,039,200',
    why: 'Decipher, about 2022, for an Am Law 50 firm.',
    sources: [7],
  },
  {
    name: 'Working days per year',
    value: '250',
    why: 'Standard assumption.',
    sources: [],
  },
]

export interface Formula {
  name: string
  expression: string
  result: string
}

export const FORMULAS: Formula[] = [
  {
    name: 'Growth needed to reach $5bn by 2028',
    expression: '(5 / 3.594)^(1/3) - 1',
    result: '11.63%',
  },
  {
    name: '2028 revenue at the current pace',
    expression: '3.594 × 1.0836³ = 4.573;  3.594 × 1.085³ = 4.591',
    result: '$4.57-4.59bn',
  },
  { name: 'Shortfall against the goal', expression: '5.0 - 4.578', result: '~$410-430M' },
  {
    name: 'Lateral partners likely to leave',
    expression: '51 × 30% = 15.3;  51 × 38% = 19.4',
    result: '~15-19 partners',
  },
  {
    name: 'Value at risk',
    expression: '15.3 × $4,039,200;  19.4 × $4,039,200',
    result: '$61.8M-$78.3M',
  },
  {
    name: 'Firmwide First 90 Days',
    expression: '51 × 3 × 6 × $100',
    result: '$91,800',
  },
  {
    name: 'Return on saving one partner',
    expression: '$4,039,200 ÷ $91,800',
    result: '44×',
  },
  { name: 'Pilot cost as a share of one failure', expression: '$77,600 ÷ $4,039,200', result: '1.9%' },
  {
    name: 'Momentum Circles, cautious',
    expression: '48 × 1% = 0.48 avoided × $200,000',
    result: '$96,000, or 5× the $19,200',
  },
  {
    name: 'Momentum Circles, field-experiment rate',
    expression: '48 × 4% = 1.92 avoided × $200,000',
    result: '$384,000, or 20×',
  },
  {
    name: 'Client dinner break-even',
    expression: '$1.36M ÷ 250 days = $5,440/day;  $22,400 ÷ $5,440',
    result: '~4 days of one lawyer’s work',
  },
  {
    name: 'Cost-neutral swap',
    expression: '200 × $150 = $30,000;  $30,000 ÷ $2,800',
    result: '10.7 client dinners',
  },
]

export const STILL_TO_VERIFY = [
  "New York Glassdoor figures. Glassdoor's own summary text is inconsistent, so the New York rating is left off the site entirely.",
  'Whether Fried Frank still runs Reconnect Wednesdays.',
  'Whether White & Case has an internal lateral welcome program. A question for conversations, not research.',
  'All About me details.',
]
