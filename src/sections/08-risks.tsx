import { ExpandableCard } from '@/components/site/expandable-card'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { RISKS } from '@/lib/data'

export function Risks() {
  return (
    <Band id="risks" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow tone="dark">08 — Risks I&apos;d plan for</Eyebrow>
      </Reveal>
      <Rule tone="dark" className="mt-6 mb-16" />

      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-h2 text-ivory">The six objections I would expect.</h2>
            <p className="measure mt-7 text-lg text-ivory/75">
              Worth answering before they are asked. Open any one of them.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="border-b border-ivory/15">
            {RISKS.map((risk) => (
              <ExpandableCard key={risk.pushback} title={risk.pushback} label="Pushback" tone="dark">
                {risk.answer}
              </ExpandableCard>
            ))}
          </div>
        </Reveal>
      </div>

      <Rule tone="dark" className="mt-24 mb-12" />
      <WhatThisMeans tone="dark">
        {'none of these is a reason not to start. They are reasons to start *small*.'}
      </WhatThisMeans>
    </Band>
  )
}
