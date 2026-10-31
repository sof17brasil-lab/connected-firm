import XScroll from '@/components/ui/x-scroll'
import { PullQuote } from '@/components/site/pull-quote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { MEASUREMENT_LIST, SCORECARD } from '@/lib/data'

/**
 * The scorecard deliberately carries no values. Inventing plausible numbers
 * would produce something that reads as real once it is screenshotted out of
 * context; an empty frame shows what gets measured without pretending to know
 * the answer.
 */
function Scorecard() {
  return (
    <div className="border border-stone">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone px-6 py-5">
        <p className="font-display text-xl text-navy">Event Impact Scorecard</p>
        <p className="eyebrow text-muted-ink">Sample layout · monthly</p>
      </div>

      <XScroll>
        <table className="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr className="border-b border-stone/70">
            <th className="eyebrow px-6 py-3 font-semibold text-muted-ink">Measure</th>
            <th className="eyebrow px-6 py-3 font-semibold text-muted-ink">Target</th>
            <th className="eyebrow px-6 py-3 text-right font-semibold text-muted-ink">
              This month
            </th>
          </tr>
        </thead>
        <tbody>
          {SCORECARD.map((metric) => (
            <tr key={metric.name} className="border-b border-stone/50 last:border-0">
              <td className="px-6 py-4 text-slate">{metric.name}</td>
              <td className="px-6 py-4 text-caption text-muted-ink">
                {metric.target ?? <span aria-label="No target set yet">—</span>}
              </td>
              <td className="px-6 py-4 text-right text-stone" aria-label="No data yet">
                —
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </XScroll>

      <p className="text-caption border-t border-stone px-6 py-4 text-muted-ink">
        Empty by design. The figures arrive once the pilot runs; nothing here is a forecast.
      </p>
    </div>
  )
}

export function HowIdMeasure() {
  return (
    <Band id="measure" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>07 — How I&apos;d measure it</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <Reveal>
        <PullQuote
          className="measure"
          first="I&rsquo;d handle the logistics like any coordinator,"
          second="and I&rsquo;d also measure what each event achieves, so the team can show leadership exactly how events support the 2028 plan."
        />
      </Reveal>

      <div className="mt-24 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <Scorecard />
        </Reveal>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.08}>
            <h3 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] leading-tight text-navy">
              What I&apos;d actually track
            </h3>
            <ul className="mt-7 space-y-4">
              {MEASUREMENT_LIST.map((item) => (
                <li key={item} className="border-t border-stone pt-4 text-slate">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        {'the point is not more events. It is being able to say *what they did*.'}
      </WhatThisMeans>
    </Band>
  )
}
