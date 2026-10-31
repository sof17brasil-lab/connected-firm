import { ProgramPanels } from '@/components/ui/animated-scroll'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { PILOT_TOTAL_LABEL, PROGRAMS } from '@/lib/data'

export function ThePlan() {
  return (
    <Band id="the-plan" className="py-24 md:py-32">
      <Reveal>
        <Eyebrow>03 — The plan</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-12" />

      <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">Four small programs, one year, New York.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            A pilot, not a department: {PILOT_TOTAL_LABEL} for the year. Each program is
            optional, short, and cheap enough to stop without anybody having to defend the
            decision.
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <ProgramPanels programs={PROGRAMS} />
      </div>

      <Rule className="mt-20 mb-12" />
      <WhatThisMeans>
        {'the whole year costs less than one failed hire, and every part of it can be stopped without drama.'}
      </WhatThisMeans>
    </Band>
  )
}
