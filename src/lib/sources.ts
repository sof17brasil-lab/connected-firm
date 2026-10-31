/**
 * The numbered source list from the PDF, plus #29 for revenue per lawyer.
 *
 * `year` is only set where the source itself carries one. Entries without a
 * year render as "accessed Oct 2026" rather than being guessed at.
 */
export interface Source {
  id: number
  publisher: string
  title: string
  year: number | null
  url: string
}

export const SOURCES: Source[] = [
  { id: 1, publisher: 'Global Legal Post', title: 'White & Case revenue hits $3.6bn', year: 2026, url: 'https://www.globallegalpost.com/news/white-case-revenue-hits-36bn-as-pep-jumps-10-290647087' },
  { id: 2, publisher: 'Bloomberg Law', title: 'White & Case posts $3.6 billion revenue', year: 2026, url: 'https://news.bloomberglaw.com/business-and-practice/white-case-posts-3-6-billion-revenue-as-profits-also-tick-up' },
  { id: 3, publisher: 'Bloomberg Law', title: 'White & Case targets $5 billion', year: 2026, url: 'https://news.bloomberglaw.com/ip-law/white-case-targets-5-billion-revenue-in-ambitious-growth-plan' },
  { id: 4, publisher: 'Above the Law', title: '2026 Am Law 100', year: 2026, url: 'https://abovethelaw.com/?p=1182247' },
  { id: 5, publisher: 'Legal Cheek', title: 'White & Case 2025 results and partner count', year: 2026, url: 'https://www.legalcheek.com/2026/03/white-case-hits-2-7-billion-revenues-lifting-average-partner-earnings-to-3-3-million/amp/' },
  { id: 6, publisher: 'Above the Law', title: 'A third of lateral partners gone in 5 years', year: 2026, url: 'https://abovethelaw.com/2026/05/a-third-of-lateral-partners-are-gone-in-5-years-and-biglaw-keeps-failing-to-understand-why/' },
  { id: 7, publisher: 'National Law Review', title: 'Cost of failed lateral hires', year: null, url: 'https://natlawreview.com/node/123728/printable/print' },
  { id: 8, publisher: 'National Law Review', title: 'Integration predicts lateral success', year: null, url: 'https://natlawreview.com/article/work-doesn-t-stop-once-you-hire-lateral' },
  { id: 9, publisher: 'Nexl', title: 'Law firm lateral integration', year: 2026, url: 'https://nexl.cloud/resources/article-law-firm-lateral-integration' },
  { id: 10, publisher: 'ABA Journal', title: 'Lawyers rank highest on loneliness scale', year: 2018, url: 'https://abajournal.com/news/article/lawyers_rank_highest_on_loneliness_scale_study_finds' },
  { id: 11, publisher: 'Employee Benefit News', title: 'Gallup best friend at work data', year: 2022, url: 'https://www.benefitnews.com/news/workplace-friendships-boost-engagement-and-lower-turnover' },
  { id: 12, publisher: 'SHRM', title: 'Q3 2026 Global Employee Monitor', year: 2026, url: 'https://www.shrm.org/in/about/press-room/shrm-global-employee-monitor-finds-belonging-is-key-to-engagemen' },
  { id: 13, publisher: 'RFBerlin', title: 'Friends at Work field experiment', year: null, url: 'https://www.rfberlin.com/?p=26042' },
  { id: 14, publisher: 'Above the Law', title: 'Cost of associate attrition (NALP)', year: 2017, url: 'https://abovethelaw.com/legal-innovation-center/member-content/how-does-associate-attrition-impact-the-bottom-line/?rf=1' },
  { id: 15, publisher: 'LeanLaw', title: 'Associate attrition in 2024', year: null, url: 'https://www.leanlaw.co/blog/the-path-to-partnership-compensation-at-every-stage/' },
  { id: 16, publisher: 'Attorney at Work', title: 'BTI associate satisfaction', year: 2026, url: 'https://www.attorneyatwork.com/law-firms-with-the-highest-associate-job-satisfaction-in-2026/' },
  { id: 17, publisher: 'Major, Lindsey & Africa', title: 'Associate retention survey', year: null, url: 'https://mlaglobal.com/about-us/press-releases/sixty-percent-of-law-firm-associates-feel-their-firms-are-not-trying-to-retain-them-according-to-new-survey-from-mla' },
  { id: 18, publisher: 'Intapp', title: 'Heidi Gardner on smart collaboration', year: null, url: 'https://www.intapp.com/?p=4611' },
  { id: 19, publisher: 'Thomson Reuters', title: 'Client listening programs', year: null, url: 'https://www.thomsonreuters.com/en-us/posts/legal/custom-advisory-client-listening-programs/' },
  { id: 20, publisher: 'Glassdoor', title: 'White & Case reviews', year: null, url: 'https://www.glassdoor.com/Reviews/White-and-Case-Reviews-E3439.htm' },
  { id: 21, publisher: 'Glassdoor', title: 'White & Case company overview', year: null, url: 'https://www.glassdoor.com/Overview/Working-at-White-and-Case-EI_IE3439.11,25.htm' },
  { id: 22, publisher: 'Legal Cheek', title: 'White & Case London profile', year: null, url: 'https://www.legalcheek.com/firm/white-case/' },
  { id: 23, publisher: 'White & Case', title: 'Momentum offsites', year: null, url: 'https://www.whitecase.com/insight-our-thinking/perspective-2025-leveling-up-momentum-offsites-accelerate-associate-development' },
  { id: 24, publisher: 'Legal Cheek', title: 'Law firm perks 2025-26 (W&C World Cup)', year: 2025, url: 'https://www.legalcheek.com/2025/12/from-private-concierges-to-music-lessons-the-law-firms-offering-junior-lawyers-true-perk-fection/amp/' },
  { id: 25, publisher: 'Vault', title: "Top firms for mentorship (O'Melveny)", year: null, url: 'https://legacy.vault.com/blogs/vaults-law-blog-legal-careers-and-industry-news/vaults-2025-top-ten-law-firms-for-informal-training-mentorship-sponsorship' },
  { id: 26, publisher: 'Firsthand', title: 'Notable BigLaw perks (Arnold & Porter)', year: null, url: 'https://firsthand.co/blogs/vaults-law-blog-legal-careers-and-industry-news/feeling-perk-y-notable-biglaw-perks-from-the-vault-law-100' },
  { id: 27, publisher: 'ABA Journal', title: 'Return-to-office perks (Fried Frank)', year: null, url: 'https://abajournal.com/news/article/law-firms-encourage-workers-to-return-to-office-with-these-perks' },
  { id: 28, publisher: 'Naboo', title: 'Corporate dining costs in New York City', year: 2026, url: 'https://www.naboo.app/en-us/restaurants/new-york-city' },
  { id: 29, publisher: 'LawCareers.Net', title: 'White & Case revenue climbs to $3.6 billion as PEP rises 10%', year: 2026, url: 'https://www.lawcareers.net/Explore/News/White-Case-revenue-climbs-to-36-billion-as-PEP-rises-10-30032026' },
]

export const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]))

/** "2026" where the source carries a year, otherwise "accessed Oct 2026". */
export function sourceYearLabel(source: Source): string {
  return source.year ? String(source.year) : 'accessed Oct 2026'
}
