import { CompetitorChart } from '@/components/charts/competitor-chart'
import { GrowCard } from '@/components/site/grow-card'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { WHY_NOW_STATS } from '@/lib/data'
import { HERO_PHOTO } from '@/lib/photos'
import { AM_LAW_REVENUE_PER_LAWYER_GROWTH, BIG_LAW_AVERAGE } from '@/lib/data'
import { COMPETITOR_MEDIAN, WHITE_CASE_GROWTH, WHITE_CASE_RANK } from '@/lib/figures'

/**
 * Move 1 carries this section: the opener's centre square grows to fill the
 * screen and the four numbers arrive over it, so there is no separate tile
 * grid any more.
 */
export function WhyNow() {
  return (
    <>
      <GrowCard
        number="01"
        question="Why does *2028* matter?"
        standfirst={
          <>
            White &amp; Case aims to pass $5bn in revenue by 2028. Here&rsquo;s where
            it&rsquo;s starting from.
            <SourcePill id={3} label="Bloomberg Law" tone="dark" />
          </>
        }
        stats={WHY_NOW_STATS}
        image={HERO_PHOTO}
      />

      <Band className="py-16 md:py-24">
        <Reveal>
          <Eyebrow>01 — Why now</Eyebrow>
        </Reveal>
        <Rule className="mt-5 mb-10" />

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="text-h2 text-navy">
                White &amp; Case is growing, but not fast enough for 2028.
              </h2>
              <p className="measure mt-6 text-slate">
                White &amp; Case grew {WHITE_CASE_GROWTH}% in 2025
                <SourcePill id={2} label="Bloomberg Law" />: {WHITE_CASE_RANK}th of the nine
                firms here and a little under their {COMPETITOR_MEDIAN}% median. The Am Law
                100 grew {BIG_LAW_AVERAGE}.0% in aggregate, weighted across all hundred
                firms, and revenue per lawyer rose {AM_LAW_REVENUE_PER_LAWYER_GROWTH}%.
              </p>
              <p className="text-caption mt-6 text-muted-ink">
                2025 revenue growth <SourcePill id={4} label="Am Law 100" />. Kirkland is
                left out: its growth figure is not in the source.
                <Footnote ids={[4]} className="ml-1" />
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <CompetitorChart />
          </Reveal>
        </div>

        <Rule className="mt-16 mb-10" />
        <WhatThisMeans>
          {'the gap to $5bn will not close on the current trajectory, and the work that closes it runs on *relationships*.'}
        </WhatThisMeans>
      </Band>
    </>
  )
}
