import { GlassdoorBars } from '@/components/charts/glassdoor-bars'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { GLASSDOOR_BY_ROLE, GLASSDOOR_FRAMING, GLASSDOOR_NOTE } from '@/lib/data'

export function WhatPeopleSay() {
  return (
    <Band id="what-people-say" className="py-28 md:py-40">
      {/*
        PageBackground paints midnight here, but this section's text is ivory
        and must never be left on a light background if that script stalls.
        The gradient guarantees the dark backing while still fading in and out
        at the edges, so the blend between sections is preserved.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -inset-y-px -z-[1] bg-gradient-to-b from-transparent via-midnight to-transparent"
      />
      <Reveal>
        <Eyebrow tone="dark">03 — What White &amp; Case people say</Eyebrow>
      </Reveal>
      <Rule tone="dark" className="mt-6 mb-16" />

      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-h2 text-ivory">
              The people are the strength. The consistency is the gap.
            </h2>
            <p className="measure mt-8 text-lg text-ivory/80">
              Summary ratings only, out of five, from
              <SourcePill id={20} label="Glassdoor" tone="dark" />. No individual review is
              quoted and no reviewer is identified.
            </p>
            <p className="text-caption mt-8 text-ivory/60">{GLASSDOOR_NOTE}</p>
            <p className="text-caption mt-2 text-ivory/60">{GLASSDOOR_BY_ROLE}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <GlassdoorBars tone="dark" />
        </Reveal>
      </div>

      <Rule tone="dark" className="mt-24 mb-14" />
      <Reveal>
        <p className="mx-auto max-w-4xl text-center font-display text-[clamp(1.8rem,3.4vw,3rem)] italic leading-snug text-ivory">
          &ldquo;{GLASSDOOR_FRAMING}&rdquo;
        </p>
      </Reveal>
    </Band>
  )
}
