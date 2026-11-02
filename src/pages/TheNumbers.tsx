import { useEffect } from 'react'
import { Calculator } from '@/components/charts/calculator'
import {
  CompetitorFigure,
  LateralFlowFigure,
  PilotSplitFigure,
  RevenueGapFigure,
  SensitivityFigure,
} from '@/components/charts/outline/figures'
import { GlassdoorBars } from '@/components/charts/glassdoor-bars'
import { StatsWithText } from '@/components/ui/stats-section-with-text'
import XScroll from '@/components/ui/x-scroll'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { ExpandableCard } from '@/components/site/expandable-card'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Finding, Rule } from '@/components/site/section'
import {
  ALL_IN,
  ALL_IN_MID,
  COORDINATOR_LOADED_COST,
  COORDINATOR_SHARE,
  MID_RATE,
  PILOT_SHARE_OF_FAILED_LATERAL,
  REACH_RESULTS,
  TIME_LINES,
  TOTAL_HOURS,
} from '@/lib/cost'
import { money, round } from '@/lib/calculator'
import {
  CLIENT_FACTS,
  COST_NEUTRAL_OPTION,
  GAP_ROWS,
  GLASSDOOR_BY_ROLE,
  GLASSDOOR_FRAMING,
  GLASSDOOR_NOTE,
  HEADLINE_CALLOUT,
  KEEP_FOUR,
  KEEP_FOUR_NOTE,
  LATERAL_FUNNEL,
  LEANER_OPTION,
  LONDON_CALLOUT,
  MOMENTUM_SCENARIOS,
  FAILED_LATERAL_TIERS,
  PILOT_TOTAL_LABEL,
  PROGRAMS,
  RESEARCH_PARTNERS,
  RESEARCH_PEOPLE,
  RISKS,
  ROADMAP,
} from '@/lib/data'

/** Research shown on the home page as cards; the rest is listed here. */
const HOME_FIGURES = new Set(['$4.04M', '30-38%', '61%', '18% vs 61%'])

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-tight text-navy">
      {children}
    </h2>
  )
}

function CostTable() {
  return (
    <table className="w-full min-w-[620px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Program</th>
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Calculation</th>
          <th className="eyebrow py-4 text-right font-semibold text-navy">Cost</th>
        </tr>
      </thead>
      <tbody>
        {PROGRAMS.map((program) => (
          <tr key={program.name} className="border-b border-stone/70">
            <td className="py-5 pr-6 font-medium text-navy">{program.name}</td>
            <td className="py-5 pr-6 text-caption text-muted-ink">
              {program.calculation}
              <Footnote ids={program.sources} className="ml-1" />
              {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
            </td>
            <td className="tabular py-5 text-right text-slate">{program.costLabel}</td>
          </tr>
        ))}
        <tr>
          <td className="py-5 font-display text-xl text-navy" colSpan={2}>
            Total
          </td>
          <td className="tabular py-5 text-right font-display text-xl text-navy">
            {PILOT_TOTAL_LABEL}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

/** The hours each programme takes, and what each assumption is. */
function TimeTable() {
  return (
    <table className="w-full min-w-[620px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Programme</th>
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Who attends, for how long</th>
          <th className="eyebrow py-4 text-right font-semibold text-navy">Person-hours</th>
        </tr>
      </thead>
      <tbody>
        {TIME_LINES.map((line) => (
          <tr key={line.programme} className="border-b border-stone/70">
            <td className="py-5 pr-6 font-medium text-navy">{line.programme}</td>
            <td className="py-5 pr-6 text-caption text-muted-ink">{line.assumption}</td>
            <td className="tabular py-5 text-right text-slate">
              {line.hours.toLocaleString('en-US')}
            </td>
          </tr>
        ))}
        <tr>
          <td className="py-5 font-display text-xl text-navy" colSpan={2}>
            Total
          </td>
          <td className="tabular py-5 text-right font-display text-xl text-navy">
            {TOTAL_HOURS.toLocaleString('en-US')}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

/** Cash, hours and coordinator share, at three defensible hourly rates. */
function AllInTable() {
  return (
    <table className="w-full min-w-[680px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Rate for lawyer time</th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">Cash</th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">
            {TOTAL_HOURS.toLocaleString('en-US')} hours
          </th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">Coordinator</th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">All in</th>
          <th className="eyebrow py-4 text-right font-semibold text-navy">
            Of one failed lateral
          </th>
        </tr>
      </thead>
      <tbody>
        {ALL_IN.map((row) => (
          <tr key={row.rate} className="border-b border-stone/70">
            <td className="py-5 pr-6 font-medium text-navy">
              ${row.rate} an hour
              {row.rate === MID_RATE && (
                <span className="text-caption ml-2 text-muted-ink">(used on the home page)</span>
              )}
            </td>
            <td className="tabular py-5 pr-6 text-right text-slate">
              ${row.cash.toLocaleString('en-US')}
            </td>
            <td className="tabular py-5 pr-6 text-right text-slate">
              ${row.time.toLocaleString('en-US')}
            </td>
            <td className="tabular py-5 pr-6 text-right text-slate">
              ${row.coordinator.toLocaleString('en-US')}
            </td>
            <td className="tabular py-5 pr-6 text-right font-display text-xl text-navy">
              ${Math.round(row.total).toLocaleString('en-US')}
            </td>
            <td className="tabular py-5 text-right text-slate">
              {(row.shareOfFailedLateral * 100).toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** The saving, scoped to each population the pilot could be said to reach. */
function ReachTable() {
  return (
    <table className="w-full min-w-[680px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Population</th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">Lawyers</th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">
            Departures avoided
          </th>
          <th className="eyebrow py-4 pr-6 text-right font-semibold text-navy">Saved</th>
          <th className="eyebrow py-4 text-right font-semibold text-navy">× the pilot</th>
        </tr>
      </thead>
      <tbody>
        {REACH_RESULTS.map((row) => (
          <tr key={row.who} className="border-b border-stone/70">
            <td className="py-5 pr-6">
              <span className="font-medium text-navy">{row.who}</span>
              {row.scaled && (
                <span className="eyebrow ml-2 rounded-sm border border-stone px-1.5 py-0.5 text-[10px] text-muted-ink">
                  if scaled firmwide
                </span>
              )}
              <span className="text-caption mt-1 block text-muted-ink">{row.basis}</span>
            </td>
            <td className="tabular py-5 pr-6 text-right text-slate">
              {row.lawyers.toLocaleString('en-US')}
            </td>
            <td className="tabular py-5 pr-6 text-right text-slate">{round(row.avoided)}</td>
            <td className="tabular py-5 pr-6 text-right font-display text-xl text-navy">
              {money(row.savings)}
            </td>
            <td className="tabular py-5 text-right text-slate">{row.multiple.toFixed(1)}×</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function TheNumbers() {
  // A block body on purpose: Lenis patches window.scrollTo and its return
  // value is not undefined, so an arrow shorthand hands React something it
  // treats as a cleanup function and the page crashes on unmount.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const rest = [...RESEARCH_PARTNERS, ...RESEARCH_PEOPLE].filter(
    (card) => !HOME_FIGURES.has(card.figure),
  )

  return (
    <Band className="pb-28 pt-32 md:pt-40">
      <PageHeader
        eyebrow="The numbers"
        title="The workings behind the proposal."
        intro="The home page makes the argument in one pass. This is everything underneath it: the model you can move yourself, the full research, the costs and the objections."
      />

      {/* --- What it really costs --- */}
      <div className="mt-20">
        <SubHeading>What the pilot really costs</SubHeading>
        <p className="measure mt-5 text-slate">
          {PILOT_TOTAL_LABEL} is the catering and venue budget. It is not the cost. The hours
          the programmes take out of lawyers&rsquo; days are worth several times that, and a
          share of a coordinator&rsquo;s year belongs here too &mdash; a share, not a salary,
          because the role exists whether or not the pilot runs.
        </p>

        <Reveal className="mt-10">
          <div>
            <XScroll className="lg:hidden">
              <TimeTable />
            </XScroll>
            <div className="hidden lg:block">
              <TimeTable />
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div>
            <XScroll className="lg:hidden">
              <AllInTable />
            </XScroll>
            <div className="hidden lg:block">
              <AllInTable />
            </div>
            <p className="text-caption mt-4 text-muted-ink">
              Coordinator line: {Math.round(COORDINATOR_SHARE * 100)}% of one New York events
              coordinator at ${COORDINATOR_LOADED_COST.toLocaleString('en-US')} fully loaded.
              No White &amp; Case band is published and none is assumed.
              <EstimateTag kind="estimate" className="ml-2" />
            </p>
            <p className="measure mt-5 text-slate">
              At ${MID_RATE} an hour the whole thing comes to $
              {Math.round(ALL_IN_MID.total).toLocaleString('en-US')}, which is{' '}
              {(ALL_IN_MID.shareOfFailedLateral * 100).toFixed(1)}% of one failed lateral
              partner &mdash; about a fifth, against{' '}
              {(PILOT_SHARE_OF_FAILED_LATERAL * 100).toFixed(1)}% for the cash alone.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div>
            <p className="eyebrow text-sky-deep">What one failed lateral costs, by band</p>
            <ul className="mt-5 flex flex-col gap-3">
              {FAILED_LATERAL_TIERS.map((tier) => (
                <li key={tier.band} className="flex items-baseline justify-between border-b border-stone/70 pb-3">
                  <span className={tier.isUs ? 'font-medium text-navy' : 'text-muted-ink'}>
                    {tier.band}
                    {tier.isUs && ' — the band White & Case sits in'}
                  </span>
                  <span className="tabular font-display text-xl text-navy">{tier.label}</span>
                </li>
              ))}
            </ul>
            <p className="text-caption mt-4 text-muted-ink">
              ALM Intelligence and Decipher, 2022, built from compensation data and SHRM
              attrition costs. Decipher sells lateral vetting, so this is a vendor estimate.
              <Footnote ids={[7, 30]} className="ml-1" />
            </p>
          </div>
        </Reveal>
      </div>

      <Rule className="mt-24" />

      {/* --- Who the pilot actually reaches --- */}
      <div className="mt-16">
        <SubHeading>Who the pilot actually reaches</SubHeading>
        <p className="measure mt-5 text-slate">
          A saving is only as good as the population it is drawn from. The pilot runs in New
          York and reaches on the order of a hundred and fifty people, so that is the number
          the model should use. The firmwide row is included because it is the obvious next
          question, but it is a projection of what scaling the pilot everywhere would be
          worth &mdash; not a result of this one.
        </p>
        <Reveal className="mt-10">
          <div>
            <XScroll className="lg:hidden">
              <ReachTable />
            </XScroll>
            <div className="hidden lg:block">
              <ReachTable />
            </div>
            <p className="text-caption mt-4 text-muted-ink">
              Every row at one point of reduced attrition and $200,000 a departure, through
              the same calculator below. <EstimateTag kind="illustrative" className="ml-1" />
            </p>
          </div>
        </Reveal>
      </div>

      <Rule className="mt-24" />

      {/* --- The five charts --- */}
      <div className="mt-20">
        <SubHeading>Five charts</SubHeading>
        <p className="measure mt-5 text-slate">
          The argument drawn out: the gap the firm has to close, how fast its rivals are
          moving, where the pilot&rsquo;s money goes, what one year of lateral hiring puts at
          risk, and how the model behaves if the effect is smaller than assumed.
        </p>
        <div className="mt-14 flex flex-col gap-20">
          <RevenueGapFigure />
          <CompetitorFigure />
          <PilotSplitFigure />
          <LateralFlowFigure />
          <SensitivityFigure />
        </div>
      </div>

      <Rule className="mt-24" />

      {/* --- The calculator --- */}
      <div className="mt-16">
        <SubHeading>Try the assumptions yourself</SubHeading>
        <p className="measure mt-5 text-slate">
          Move any slider and every figure updates. The model is deliberately blunt: it will
          tell you when the pilot loses money.
        </p>
        <Reveal className="mt-10">
          <Calculator />
        </Reveal>
      </div>

      <Rule className="mt-24" />

      {/* --- Lateral funnel --- */}
      <div className="mt-16">
        <SubHeading>One year of lateral hiring</SubHeading>
        <div className="mt-10 grid gap-x-16 md:grid-cols-2">
          <Reveal>
            <Finding label="Hired in 2025" figure="51">
              Lateral partners, across 43 offices in 29 countries.
              <Footnote ids={[1, 5]} className="ml-1" />
            </Finding>
          </Reveal>
          <Reveal delay={0.06}>
            <Finding label="Likely to leave within five years" figure={LATERAL_FUNNEL.leaveLabel}>
              At the published 30-38% rate, that is 15.3 to 19.4 partners.
              <Footnote ids={[6]} className="ml-1" />
            </Finding>
          </Reveal>
          <Reveal delay={0.12}>
            <Finding label="Value at risk" figure={LATERAL_FUNNEL.atRiskLabel}>
              15.3 and 19.4 partners, each at $4,039,200.
              <Footnote ids={[7]} className="ml-1" />
              <EstimateTag kind="illustrative" className="ml-2" />
            </Finding>
          </Reveal>
          <Reveal delay={0.18}>
            <Finding label="Firmwide First 90 Days" figure={LATERAL_FUNNEL.firmwideCostLabel}>
              51 × 3 lunches × 6 people × $100. Saving one partner returns 44× that cost, and
              needs the failure rate to move by only {LATERAL_FUNNEL.pointsMoved}.
              <EstimateTag kind="estimate" className="ml-2" />
            </Finding>
          </Reveal>
        </div>
      </div>

      <Rule className="mt-20" />

      {/* --- Headline numbers --- */}
      <div className="mt-16">
        <StatsWithText
          badge="Business case"
          heading="Keep four people from leaving."
          body="The simplest version of the argument. Four people, at published replacement costs, against a pilot that costs $77,600."
          stats={[
            { value: '44×', caption: 'return if one lateral partner is saved', sources: [7], illustrative: true },
            { value: '$800K-$2M', caption: 'saved by keeping four associates', sources: [14], illustrative: true },
            { value: '1.9%', caption: HEADLINE_CALLOUT.body, sources: HEADLINE_CALLOUT.sources },
            { value: '~$300K', caption: 'saved at the pilot\u2019s own New York reach of about 150 lawyers', direction: 'down', sources: [14], illustrative: true },
          ]}
        />
      </div>

      <Reveal className="mt-16">
        <div>
          <XScroll className="lg:hidden">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <tbody>
                {KEEP_FOUR.map((row) => (
                  <tr key={row.who} className="border-b border-stone/70">
                    <td className="py-5 pr-6 text-slate">{row.who}</td>
                    <td className="tabular py-5 pr-6 text-caption text-muted-ink">
                      {row.calculation}
                      <Footnote ids={row.sources} className="ml-1" />
                    </td>
                    <td className="tabular py-5 text-right font-display text-xl text-navy">
                      {row.saved}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </XScroll>
          <table className="hidden w-full border-collapse text-left lg:table">
            <tbody>
              {KEEP_FOUR.map((row) => (
                <tr key={row.who} className="border-b border-stone/70">
                  <td className="py-5 pr-6 text-slate">{row.who}</td>
                  <td className="tabular py-5 pr-6 text-caption text-muted-ink">
                    {row.calculation}
                    <Footnote ids={row.sources} className="ml-1" />
                  </td>
                  <td className="tabular py-5 text-right font-display text-xl text-navy">
                    {row.saved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-caption mt-4 text-muted-ink">
            {KEEP_FOUR_NOTE} <EstimateTag kind="illustrative" />
          </p>
        </div>
      </Reveal>

      <Rule className="mt-20" />

      {/* --- Associates and clients --- */}
      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <SubHeading>Associates: Momentum Circles, 48 people</SubHeading>
            <ul className="mt-6 space-y-5">
              {[MOMENTUM_SCENARIOS.cautious, MOMENTUM_SCENARIOS.field].map((scenario, i) => (
                <li key={scenario.saved} className="border-t border-stone pt-5">
                  <p className="font-display text-2xl text-navy">
                    {scenario.saved}{' '}
                    <span className="text-base text-muted-ink">({scenario.multiple})</span>
                  </p>
                  <p className="text-caption mt-2 text-muted-ink">
                    {i === 0 ? 'Cautious' : 'At the field-experiment rate'}: 48 × {scenario.rate} ={' '}
                    {scenario.avoided} departures avoided × $200,000.
                    <Footnote ids={MOMENTUM_SCENARIOS.sources} className="ml-1" />
                  </p>
                </li>
              ))}
            </ul>
            <EstimateTag kind="illustrative" className="mt-5" />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <SubHeading>Clients</SubHeading>
            <ul className="mt-6 space-y-5">
              {CLIENT_FACTS.map((fact) => (
                <li key={fact.figure} className="border-t border-stone pt-5">
                  <p className="font-display text-2xl text-navy">{fact.figure}</p>
                  <p className="text-caption mt-2 text-muted-ink">
                    {fact.body}
                    <Footnote ids={fact.sources} className="ml-1" />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Rule className="mt-20" />

      {/* --- Costs --- */}
      <div className="mt-16">
        <SubHeading>What the year costs</SubHeading>
        <Reveal className="mt-8">
          <div>
            <XScroll className="lg:hidden">
              <CostTable />
            </XScroll>
            <div className="hidden lg:block">
              <CostTable />
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[LEANER_OPTION, COST_NEUTRAL_OPTION].map((option, i) => (
            <Reveal key={option.label} delay={i * 0.08}>
              <div className="h-full border-l-2 border-sky py-6 pl-7">
                <p className="eyebrow text-sky-deep">{option.label}</p>
                <p className="measure mt-3 text-slate">
                  {option.body}
                  <Footnote ids={option.sources} className="ml-1" />
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-4">
          {ROADMAP.map((phase) => (
            <li key={phase.when} className="border-t-2 border-navy pt-5">
              <p className="eyebrow text-sky-deep">{phase.when}</p>
              <p className="mt-3 text-slate">{phase.what}</p>
            </li>
          ))}
        </ol>
      </div>

      <Rule className="mt-20" />

      {/* --- The rest of the research --- */}
      <div className="mt-16">
        <SubHeading>The rest of the evidence</SubHeading>
        <p className="measure mt-5 text-slate">
          The four figures on the home page are the strongest. These are the others.
        </p>
        <div className="mt-10 grid gap-x-16 md:grid-cols-2">
          {rest.map((card, i) => (
            <Reveal key={card.figure} delay={i * 0.04}>
              <Finding label="Research" figure={card.figure}>
                {card.body}
                <Footnote ids={card.sources} className="ml-1" />
                {card.caveat && (
                  <span className="text-caption mt-2 block text-muted-ink">{card.caveat}</span>
                )}
              </Finding>
            </Reveal>
          ))}
        </div>
      </div>

      <Rule className="mt-20" />

      {/* --- Glassdoor --- */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SubHeading>What White &amp; Case people say</SubHeading>
          <p className="measure mt-5 text-slate">
            Summary ratings only, out of five, from
            <SourcePill id={20} label="Glassdoor" />. No individual review is quoted and no
            reviewer is identified.
          </p>
          <p className="text-caption mt-6 text-muted-ink">{GLASSDOOR_NOTE}</p>
          <p className="text-caption mt-2 text-muted-ink">{GLASSDOOR_BY_ROLE}</p>
          <p className="measure mt-8 font-display text-xl italic text-navy">
            &ldquo;{GLASSDOOR_FRAMING}&rdquo;
          </p>
        </div>
        <Reveal delay={0.08}>
          <GlassdoorBars />
        </Reveal>
      </div>

      <Rule className="mt-20" />

      {/* --- What exists --- */}
      <div className="mt-16">
        <SubHeading>What already exists, and the gaps</SubHeading>
        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {GAP_ROWS.map((row, i) => (
            <Reveal key={row.add} delay={i * 0.05}>
              <div className="border-t border-stone pt-6">
                <p className="eyebrow text-muted-ink">Exists today</p>
                <p className="mt-2 text-slate">
                  {row.exists}
                  <Footnote ids={row.sources} className="ml-1" />
                </p>
                <p className="eyebrow mt-5 text-muted-ink">Possible gap</p>
                <p className="mt-2 text-muted-ink">{row.gap}</p>
                <p className="eyebrow mt-5 text-sky-deep">Proposed</p>
                <p className="mt-2 font-display text-xl text-navy">{row.add}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <aside className="border-l-2 border-sky py-7 pl-8">
            <h3 className="font-display text-[clamp(1.5rem,2vw,2rem)] text-navy">
              {LONDON_CALLOUT.title}
              <SourcePill id={22} label="Legal Cheek" />
            </h3>
            <ul className="mt-6 space-y-4">
              {LONDON_CALLOUT.points.map((point) => (
                <li key={point} className="measure text-slate">
                  {point}
                </li>
              ))}
            </ul>
            <p className="measure mt-6 border-t border-stone pt-5 italic text-muted-ink">
              {LONDON_CALLOUT.caveat}
            </p>
          </aside>
        </Reveal>
      </div>

      <Rule className="mt-20" />

      {/* --- Risks --- */}
      <div className="mt-16">
        <SubHeading>Risks I&apos;d plan for</SubHeading>
        <p className="measure mt-5 text-slate">
          The six objections I would expect. Open any one of them.
        </p>
        <div className="mt-10 border-b border-stone">
          {RISKS.map((risk) => (
            <ExpandableCard key={risk.pushback} title={risk.pushback} label="Pushback">
              {risk.answer}
            </ExpandableCard>
          ))}
        </div>
      </div>
    </Band>
  )
}
