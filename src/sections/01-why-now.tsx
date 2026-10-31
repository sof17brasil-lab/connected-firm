import { CompetitorChart } from '@/components/charts/competitor-chart'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { StatCard } from '@/components/charts/stat-card'
import { OutlineBars, ProportionRect } from '@/components/charts/outline/charts'
import { CountUp } from '@/components/site/count-up'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Rule, WhatThisMeans } from '@/components/site/section'
import {
  BIG_LAW_AVERAGE,
  REVENUE_GAP_LABEL,
  REVENUE_SHARE_OF_GOAL,
  WHY_NOW_STATS,
} from '@/lib/data'

export function WhyNow() {
  return (
    <Band id="why-now" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>01 — Why now</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      {/* Asymmetric opening: statement left, context right. */}
      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">
            White &amp; Case is growing, but slower than its rivals.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            The firm has told the market it will pass $5bn by 2028
            <SourcePill id={3} label="Bloomberg Law" />. At the pace of the last three
            years it arrives somewhere short of that.
          </p>
        </Reveal>
      </div>

      {/* Stat row, hairline-divided. */}
      <div className="mt-20 grid grid-cols-1 gap-px border-t border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        {WHY_NOW_STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07} className="bg-transparent">
            <div className="flex h-full flex-col py-9 sm:px-6 sm:first:pl-0">
              <p className="font-display text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none text-navy">
                {stat.countTo != null ? (
                  <CountUp
                    to={stat.countTo}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                    display={stat.value}
                  />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-4 text-base font-medium text-slate">
                {stat.label}
                <Footnote ids={stat.sources} className="ml-1" />
              </p>
              {stat.note && <p className="text-caption mt-2 text-muted-ink">{stat.note}</p>}
            </div>
          </Reveal>
        ))}
      </div>

      {/* The revenue trajectory needs a real line chart; it stays, restyled. */}
      <Reveal className="mt-24">
        <div>
          <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-navy">
            The gap to $5bn, at the current pace
          </h3>
          <div className="mt-8">
            <RevenueChart />
          </div>
          <p className="text-caption mt-5 max-w-2xl text-muted-ink">
            Revenue to 2025 <Footnote ids={[1, 2]} />, then a projection at ~8.4% a year. The
            shaded wedge is the 2028 shortfall: {REVENUE_GAP_LABEL}{' '}
            <EstimateTag kind="estimate" />.
          </p>
        </div>
      </Reveal>

      {/* Card 01 — the growth gap, told sentence-first. */}
      <Reveal className="mt-24">
        <StatCard
          figure="8.36%"
          connector="against"
          subject="13%"
          body="White & Case grew 8.36% in 2025. The Big Law average was about 13%."
          sources={[2, 4]}
          chart={(animate) => (
            <OutlineBars
              animate={animate}
              max={16}
              data={[
                { label: 'white & case', value: 8.36, display: '8.36%', highlight: true },
                { label: 'big law average', value: BIG_LAW_AVERAGE, display: '~13%' },
              ]}
            />
          )}
        />
      </Reveal>

      {/* Sticky argument, bars scrolling past it. */}
      <div className="mt-28 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow className="text-muted-ink">The field</Eyebrow>
            <h3 className="mt-5 font-display text-[clamp(1.9rem,2.6vw,2.6rem)] leading-tight text-navy">
              Eight comparable firms grew faster in 2025.
            </h3>
            <p className="measure mt-6 text-slate">
              The firms ahead are not winning on rates alone. They are winning on the
              cross-practice, cross-border work that depends on lawyers knowing each other.
            </p>
            <p className="text-caption mt-6 text-muted-ink">
              2025 revenue growth <SourcePill id={4} label="Am Law 100" />. Kirkland is left
              out: its growth figure is not in the source.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <CompetitorChart />
        </Reveal>
      </div>

      {/* Card 02 — how far along the road to $5bn the firm already is. */}
      <Reveal className="mt-24">
        <StatCard
          figure="$3.594bn"
          connector="of"
          subject="$5bn"
          body="2025 revenue against the 2028 goal. The solid block is where the firm is; the dashed block is what the 2028 plan still has to find."
          sources={[1, 2, 3]}
          chart={(animate) => (
            <ProportionRect animate={animate} pct={REVENUE_SHARE_OF_GOAL} display="71.9%" />
          )}
          caveat="Share of the $5bn goal reached in 2025. My calculation from the two figures."
        />
      </Reveal>

      <Rule className="mt-28 mb-12" />
      <WhatThisMeans>
        the gap to $5bn will not close on the current trajectory, and the work that closes it
        runs on relationships.
      </WhatThisMeans>
    </Band>
  )
}
