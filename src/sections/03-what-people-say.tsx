import { GlassdoorBars } from '@/components/charts/glassdoor-bars'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { GLASSDOOR_BY_ROLE, GLASSDOOR_FRAMING, GLASSDOOR_NOTE } from '@/lib/data'

export function WhatPeopleSay() {
  return (
    <Band id="what-people-say" tone="midnight" className="py-24 md:py-32">
      <Reveal>
        <Eyebrow tone="dark">03 — What White &amp; Case people say</Eyebrow>
      </Reveal>
      <Rule tone="dark" className="mt-6 mb-16" />

      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-h2 text-ivory">
              The people are the strength. The consistency is the gap.
            </h2>
            <p className="measure mt-8 text-lg text-ivory/80">
              Summary ratings only, out of five
              <Footnote ids={[20]} tone="dark" className="ml-1" />. No individual reviews are
              quoted and no reviewer is identified.
            </p>
            <p className="text-caption mt-6 text-ivory/60">{GLASSDOOR_NOTE}</p>
            <p className="text-caption mt-2 text-ivory/60">{GLASSDOOR_BY_ROLE}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <GlassdoorBars tone="dark" />
        </Reveal>
      </div>

      <Rule tone="dark" className="mt-20 mb-12" />
      <Reveal>
        <p className="measure font-display text-2xl italic leading-snug text-ivory md:text-3xl">
          &ldquo;{GLASSDOOR_FRAMING}&rdquo;
        </p>
      </Reveal>
    </Band>
  )
}
