import { Calculator } from '@/components/charts/calculator'
import { StatCard } from '@/components/charts/stat-card'
import { ProportionRect, UnitCircles } from '@/components/charts/outline/charts'
import { StatsWithText } from '@/components/ui/stats-section-with-text'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Finding, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import {
  CLIENT_FACTS,
  HEADLINE_CALLOUT,
  KEEP_FOUR,
  KEEP_FOUR_NOTE,
  LATERAL_FUNNEL,
  MOMENTUM_SCENARIOS,
} from '@/lib/data'

export function BusinessCase() {
  return (
    <Band id="business-case" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>06 — The business case</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">
            One saved partner pays for the year forty-four times over.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            These are scenarios, not forecasts. Every one is built from published figures and
            is labelled where it rests on an assumption of mine.
          </p>
        </Reveal>
      </div>

      {/* The funnel, stated plainly. */}
      <div className="mt-20 grid gap-x-20 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h3 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] leading-tight text-navy">
              One year of lateral hiring
            </h3>
            <p className="measure mt-5 text-slate">
              What the published failure rate implies for the 51 partners hired in 2025.
            </p>
          </Reveal>
        </div>

        <div>
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
              only needs the failure rate to move by {LATERAL_FUNNEL.pointsMoved}.
              <EstimateTag kind="estimate" className="ml-2" />
            </Finding>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-20">
        <StatCard
          from="right"
          figure="44×"
          connector="the"
          subject="cost"
          body="What saving a single lateral partner returns against a firmwide First 90 Days program."
          caveat="$4,039,200 ÷ $91,800. Illustrative scenario."
          sources={[7]}
          chart={(animate) => <UnitCircles animate={animate} filled={1} total={10} display="1 in 51" />}
        />
      </Reveal>

      {/* The calculator. */}
      <div className="mt-28">
        <Reveal>
          <h3 className="font-display text-[clamp(1.8rem,2.8vw,2.6rem)] text-navy">
            Try the assumptions yourself
          </h3>
          <p className="measure mt-5 text-slate">
            Move any slider and every figure updates. The model is deliberately blunt: it
            will tell you when the pilot loses money.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <Calculator />
        </Reveal>
      </div>

      {/* Headline numbers. */}
      <div className="mt-28">
        <StatsWithText
          badge="Business case"
          heading="Keep four people from leaving."
          body="The simplest version of the argument. Four people, at published replacement costs, against a pilot that costs $77,600."
          stats={[
            { value: '44×', caption: 'return if one lateral partner is saved', sources: [7], illustrative: true },
            { value: '$800K-$2M', caption: 'saved by keeping four associates', sources: [14], illustrative: true },
            { value: '1.9%', caption: 'of one failed partner’s cost', sources: [7] },
            { value: '~$3.9M', caption: 'calculator default savings', direction: 'down', sources: [14], illustrative: true },
          ]}
        />
      </div>

      <Reveal className="mt-20">
        <div>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone">
                <th className="eyebrow py-4 pr-6 font-semibold text-navy">Who</th>
                <th className="eyebrow py-4 pr-6 font-semibold text-navy">Calculation</th>
                <th className="eyebrow py-4 text-right font-semibold text-navy">Saved</th>
              </tr>
            </thead>
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

      {/* Associates and clients. */}
      <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] text-navy">
              Associates: Momentum Circles, 48 people
            </h3>
            <ul className="mt-6 space-y-5">
              <li className="border-t border-stone pt-5">
                <p className="font-display text-2xl text-navy">
                  {MOMENTUM_SCENARIOS.cautious.saved}{' '}
                  <span className="text-base text-muted-ink">
                    ({MOMENTUM_SCENARIOS.cautious.multiple})
                  </span>
                </p>
                <p className="text-caption mt-2 text-muted-ink">
                  Cautious: 48 × {MOMENTUM_SCENARIOS.cautious.rate} = {MOMENTUM_SCENARIOS.cautious.avoided}{' '}
                  departures avoided × $200,000.
                  <Footnote ids={MOMENTUM_SCENARIOS.sources} className="ml-1" />
                </p>
              </li>
              <li className="border-t border-stone pt-5">
                <p className="font-display text-2xl text-navy">
                  {MOMENTUM_SCENARIOS.field.saved}{' '}
                  <span className="text-base text-muted-ink">
                    ({MOMENTUM_SCENARIOS.field.multiple})
                  </span>
                </p>
                <p className="text-caption mt-2 text-muted-ink">
                  At the field-experiment rate: 48 × {MOMENTUM_SCENARIOS.field.rate} ={' '}
                  {MOMENTUM_SCENARIOS.field.avoided} × $200,000.
                  <Footnote ids={MOMENTUM_SCENARIOS.sources} className="ml-1" />
                </p>
              </li>
            </ul>
            <EstimateTag kind="illustrative" className="mt-5" />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h3 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] text-navy">Clients</h3>
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

      {/* The headline callout. */}
      <Reveal className="mt-24">
        <StatCard
          figure={HEADLINE_CALLOUT.figure}
          connector="of"
          subject="one failure"
          body={HEADLINE_CALLOUT.body}
          caveat={HEADLINE_CALLOUT.calculation}
          sources={HEADLINE_CALLOUT.sources}
          chart={(animate) => <ProportionRect animate={animate} pct={1.9} display="1.9%" />}
        />
      </Reveal>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        {'the pilot does not need to work often. It needs to work *once*.'}
      </WhatThisMeans>
    </Band>
  )
}
