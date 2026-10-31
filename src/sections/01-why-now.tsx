import { CompetitorChart } from '@/components/charts/competitor-chart'
import { GrowCard } from '@/components/site/grow-card'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { WHY_NOW_STATS } from '@/lib/data'

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
        stats={WHY_NOW_STATS}
        image={`${import.meta.env.BASE_URL}images/nyc-hero.jpg`}
      />

      <Band className="py-24 md:py-32">
        <Reveal>
          <Eyebrow>01 — Why now</Eyebrow>
        </Reveal>
        <Rule className="mt-6 mb-14" />

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="text-h2 text-navy">
                Growing, but slower than its rivals.
              </h2>
              <p className="measure mt-6 text-slate">
                White &amp; Case grew 8.36% in 2025 against a Big Law average of about 13%
                <SourcePill id={2} label="Bloomberg Law" />. Eight comparable firms grew
                faster.
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

        <Rule className="mt-20 mb-12" />
        <WhatThisMeans>
          {'the gap to $5bn will not close on the current trajectory, and the work that closes it runs on *relationships*.'}
        </WhatThisMeans>
      </Band>
    </>
  )
}
