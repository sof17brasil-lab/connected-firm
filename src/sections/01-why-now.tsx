import FeaturedSectionStats from '@/components/ui/featured-section-stats'
import { CompetitorChart } from '@/components/charts/competitor-chart'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule, WhatThisMeans } from '@/components/site/section'
import { REVENUE_GAP_LABEL, WHY_NOW_STATS } from '@/lib/data'

export function WhyNow() {
  return (
    <Band id="why-now" className="py-24 md:py-32">
      <Reveal>
        <Eyebrow>01 — Why now</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <FeaturedSectionStats
        heading="White & Case is growing, but slower than its rivals."
        subheading="The firm has set a public target of more than $5bn by 2028. At the pace of the last three years it arrives somewhere short of it."
        stats={WHY_NOW_STATS}
        chart={<RevenueChart />}
        chartCaption={
          <span>
            Revenue to 2025 <Footnote ids={[1, 2]} />, then a projection at ~8.4% a year.
            The shaded wedge is the 2028 shortfall: {REVENUE_GAP_LABEL}{' '}
            <EstimateTag kind="estimate" />. Goal from the firm&apos;s 2028 strategy{' '}
            <Footnote ids={[3]} />.
          </span>
        }
      />

      {/* Asymmetric: the argument sticks on the left while the bars scroll past. */}
      <div className="mt-28 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow className="text-muted-ink">The field</Eyebrow>
            <h3 className="mt-5 font-display text-[clamp(1.9rem,2.6vw,2.6rem)] leading-tight text-navy">
              Eight comparable firms grew faster in 2025.
            </h3>
            <p className="measure mt-6 text-slate">
              White &amp; Case grew 8.36% against a Big Law average of about 13%
              <Footnote ids={[2]} />. The firms ahead of it are not winning on rates alone;
              they are winning on the kind of cross-practice, cross-border work that depends
              on lawyers knowing each other.
            </p>
            <p className="text-caption mt-6 text-muted-ink">
              2025 revenue growth, Am Law 100 <Footnote ids={[4]} />. Kirkland is left out:
              its growth figure is not in the source.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <CompetitorChart />
        </Reveal>
      </div>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        the gap to $5bn is not going to close on the current trajectory, and the work that
        closes it runs on relationships.
      </WhatThisMeans>
    </Band>
  )
}
