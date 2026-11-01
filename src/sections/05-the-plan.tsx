import { ProgramPanels } from '@/components/ui/animated-scroll'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { PILOT_TOTAL_LABEL, PROGRAMS } from '@/lib/data'

export function ThePlan() {
  return (
    <Band id="the-plan" className="py-16 md:py-24">
      <Reveal>
        <Eyebrow>03 — The plan</Eyebrow>
      </Reveal>
      <Rule className="mt-5 mb-10" />

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

      <div className="mt-10">
        <ProgramPanels programs={PROGRAMS} />
      </div>

      {/* The cost block and the line that reads it belong to the same group,
          so the rule between them is a small gap, not a section break. */}
      <Rule className="mt-8 mb-6" />
      <WhatThisMeans>
        {'the whole year costs less than one failed hire, and every part of it can be stopped without drama.'}
      </WhatThisMeans>
    </Band>
  )
}
