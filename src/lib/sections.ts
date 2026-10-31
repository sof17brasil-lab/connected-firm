/**
 * The page's sections in scroll order, shared by the nav, the menu panel, the
 * dot navigation and the background tone system so they can never disagree.
 *
 * `tone` drives both the page background at that point and the text colour.
 * Sections 5-9 join this list in round 2.
 */
export type Tone = 'ivory' | 'stone' | 'navy' | 'midnight' | 'sky'

export interface SectionDef {
  id: string
  number: string
  label: string
  /** Grey second line in the menu panel. */
  subtitle: string
  tone: Tone
}

export const SECTIONS: SectionDef[] = [
  { id: 'hero', number: '00', label: 'The Connected Firm', subtitle: 'An events strategy for New York', tone: 'ivory' },
  { id: 'why-now', number: '01', label: 'Why now', subtitle: 'The 2028 target and the gap to it', tone: 'ivory' },
  { id: 'the-problem', number: '02', label: 'The problem', subtitle: 'What the research says about law firms', tone: 'stone' },
  { id: 'what-people-say', number: '03', label: 'What people say', subtitle: 'Glassdoor, summary ratings only', tone: 'midnight' },
  { id: 'what-exists', number: '04', label: 'What exists', subtitle: 'Current programs and the gaps', tone: 'ivory' },
  { id: 'the-plan', number: '05', label: 'The plan', subtitle: 'Four programs, one year, $77,600', tone: 'ivory' },
  { id: 'business-case', number: '06', label: 'The business case', subtitle: 'The numbers, and a calculator', tone: 'stone' },
  { id: 'measure', number: '07', label: 'How I\u2019d measure it', subtitle: 'The scorecard and what it tracks', tone: 'ivory' },
  { id: 'risks', number: '08', label: 'Risks', subtitle: 'Six objections, answered', tone: 'midnight' },
  { id: 'about', number: '09', label: 'About me', subtitle: 'Sofia Mota, and how to reach me', tone: 'ivory' },
]

/** Hex for each tone, used by the interpolating page background. */
export const TONE_HEX: Record<Tone, string> = {
  ivory: '#F7F4EE',
  stone: '#EDE8DD',
  navy: '#0E1E3A',
  midnight: '#081428',
  sky: '#8DB4E2',
}

/** True where a tone needs light text on top of it. */
export function isDarkTone(tone: Tone): boolean {
  return tone === 'navy' || tone === 'midnight'
}
