import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import XScroll from '@/components/ui/x-scroll'
import { ProgramPanels } from '@/components/ui/animated-scroll'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import {
  COST_NEUTRAL_OPTION,
  DESIGN_RULE,
  LEANER_OPTION,
  PILOT_TOTAL_LABEL,
  PROGRAMS,
  ROADMAP,
} from '@/lib/data'

function CostTable() {
  return (
    <table className="w-full min-w-[620px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Program</th>
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Calculation</th>
          <th className="eyebrow py-4 text-right font-semibold text-navy">Cost</th>
        </tr>
      </thead>
      <tbody>
        {PROGRAMS.map((program) => (
          <tr key={program.name} className="border-b border-stone/70">
            <td className="py-5 pr-6 font-medium text-navy">
              {program.name}
              {program.lead && <span className="eyebrow ml-2 text-sky-deep">lead</span>}
            </td>
            <td className="py-5 pr-6 text-caption text-muted-ink">
              {program.calculation}
              <Footnote ids={program.sources} className="ml-1" />
              {program.estimate && <EstimateTag kind="estimate" className="ml-2" />}
            </td>
            <td className="tabular py-5 text-right text-slate">{program.costLabel}</td>
          </tr>
        ))}
        <tr>
          <td className="py-5 font-display text-xl text-navy" colSpan={2}>
            Total
          </td>
          <td className="tabular py-5 text-right font-display text-xl text-navy">
            {PILOT_TOTAL_LABEL}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export function ThePlan() {
  return (
    <Band id="the-plan" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>05 — The plan</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">Four small programs, one year, New York.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            A pilot, not a department. Each program is optional, short, and cheap enough to
            stop without anybody having to defend the decision.
          </p>
        </Reveal>
      </div>

      <div className="mt-20">
        <ProgramPanels programs={PROGRAMS} />
      </div>

      <Reveal className="mt-24">
        <div>
          <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-navy">
            What the year costs
          </h3>
          <div className="mt-8">
            <XScroll className="lg:hidden">
              <CostTable />
            </XScroll>
            <div className="hidden lg:block">
              <CostTable />
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {[LEANER_OPTION, COST_NEUTRAL_OPTION].map((option, i) => (
          <Reveal key={option.label} delay={i * 0.08}>
            <div className="h-full border-l-2 border-sky py-6 pl-7">
              <p className="eyebrow text-sky-deep">{option.label}</p>
              <p className="measure mt-3 text-slate">
                {option.body}
                <Footnote ids={option.sources} className="ml-1" />
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Roadmap: a horizontal track on phones, a four-up grid above. */}
      <Reveal className="mt-24">
        <div>
          <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] text-navy">
            Twelve months
          </h3>

          <div className="mt-8 md:hidden">
            <XScroll>
              <ol className="flex gap-5 pb-4">
                {ROADMAP.map((phase) => (
                  <li key={phase.when} className="w-[72vw] shrink-0 border-t-2 border-navy pt-5">
                    <p className="eyebrow text-sky-deep">{phase.when}</p>
                    <p className="mt-3 text-slate">{phase.what}</p>
                  </li>
                ))}
              </ol>
            </XScroll>
          </div>

          <ol className="mt-8 hidden gap-8 md:grid md:grid-cols-4">
            {ROADMAP.map((phase, i) => (
              <li key={phase.when} className="border-t-2 border-navy pt-5">
                <p className="eyebrow text-sky-deep">{phase.when}</p>
                <p className="mt-3 text-slate">{phase.what}</p>
                <span className="sr-only">Step {i + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <p className="measure font-display text-2xl italic text-navy">{DESIGN_RULE}</p>
      </Reveal>

      <Reveal className="mt-12">
        <Link
          to="/culture-extras"
          className="eyebrow inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-ivory transition-colors hover:bg-midnight"
        >
          Explore culture ideas
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </Reveal>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        {'the whole year costs less than one failed hire, and every part of it can be *stopped without drama*.'}
      </WhatThisMeans>
    </Band>
  )
}
