import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CountUp } from '@/components/site/count-up'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'

/**
 * The whole business case in one number. The workings, the calculator and the
 * other scenarios live on /the-numbers.
 */
export function BusinessCase() {
  return (
    <Band id="business-case" className="py-24 md:py-32">
      <Reveal>
        <p className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.9] text-navy">
          <CountUp to={3.9} prefix="$" suffix="M" decimals={1} display="$3.9M" />
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="mt-10 max-w-3xl font-display text-[clamp(1.4rem,2.4vw,2.1rem)] italic leading-snug text-slate">
          If the program kept just 1 in 100 lawyers who would otherwise leave, that&apos;s
          about 19 fewer departures a year, roughly $3.9 million saved on a $77,600 pilot.
        </p>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <EstimateTag kind="estimate" />
          <span className="text-caption text-muted-ink">
            1,950 non-partner lawyers × 1 point × $200,000 replacement cost
            <Footnote ids={[14]} className="ml-1" />
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <Link
          to="/the-numbers"
          className="eyebrow mt-12 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-ivory transition-colors hover:bg-midnight"
        >
          See the numbers
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </Reveal>

      <Rule className="mt-20 mb-12" />
      <WhatThisMeans>
        {'the pilot does not need to work often. It needs to work once.'}
      </WhatThisMeans>
    </Band>
  )
}
