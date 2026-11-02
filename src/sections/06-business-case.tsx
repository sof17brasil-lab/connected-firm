import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NestedSquares } from '@/components/charts/outline/charts'
import { Drawn } from '@/components/charts/outline/drawn'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { DEFAULTS, money } from '@/lib/calculator'
import {
  ALL_IN_MID,
  BREAK_EVEN_PEOPLE,
  COORDINATOR_SHARE,
  MID_RATE,
  PILOT_SHARE_OF_FAILED_LATERAL,
  TOTAL_HOURS,
} from '@/lib/cost'
import { FAILED_LATERAL_COST, PILOT_TOTAL_LABEL } from '@/lib/data'

const pct = (n: number, places = 1) => `${(n * 100).toFixed(places)}%`
const dollars = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

/**
 * The business case, read on navy.
 *
 * It leads with the one number that needs no model: the pilot's cash cost
 * against one failed lateral partner, which is two published figures and a
 * division. The attrition model that used to sit here assumed a firmwide
 * population for a New York pilot, so it has moved to /the-numbers where it
 * can be scoped and labelled properly.
 *
 * The colour swap and the pin are driven from the heading block: InvertZone
 * finds the marker by `data-invert-in`, runs the ivory-to-navy swap as it
 * travels up the screen, and the heading below is sticky, so by the time
 * the page is navy the question is held at the top.
 */
export function BusinessCase() {
  return (
    <section id="business-case" className="scroll-mt-4">
      {/* The swap is measured from here rather than from the heading itself.
          A sticky element reports its stuck position, so any ScrollTrigger
          refresh that lands while the heading is held at the top would put
          the trigger in the wrong place and the colours would freeze. */}
      <div data-invert-in aria-hidden="true" className="h-0" />

      {/* The question, held at the top of the screen for the whole argument. */}
      <div
        className="sticky top-0 z-20 pb-7 pt-[11vh]"
        style={{ backgroundColor: 'var(--zone-bg)' }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <p className="mb-5 text-center font-display text-base tracking-[0.08em] opacity-70">
            [04]
          </p>
          {/* The base layer paints every h2 navy, so this one has to opt
              back into the zone's colour or it disappears on navy. */}
          <h2
            className="text-center font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.12]"
            style={{ color: 'inherit' }}
          >
            What is it <em className="italic">worth</em>?
          </h2>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-full h-10"
          style={{ background: 'linear-gradient(to bottom, var(--zone-bg), transparent)' }}
        />
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        {/* a. The number that needs no model at all. */}
        <Reveal className="pt-[12vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-[clamp(4.5rem,16vw,13rem)] font-light leading-[0.9]">
              {pct(PILOT_SHARE_OF_FAILED_LATERAL)}
            </p>
            <p className="measure mx-auto mt-8 font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-snug">
              The whole year costs less than 2% of one failed lateral partner hire.
            </p>
            <p className="text-caption mt-6 opacity-60">
              {PILOT_TOTAL_LABEL} ÷ {dollars(FAILED_LATERAL_COST)} ={' '}
              {pct(PILOT_SHARE_OF_FAILED_LATERAL, 2)}. No attrition rate and no headcount
              assumption — two published figures and a division.
              <Footnote ids={[7, 30]} tone="dark" className="ml-1" />
            </p>
          </div>
        </Reveal>

        {/* b. The same two numbers, drawn to area. */}
        <Reveal className="pt-[12vh]">
          <div className="mx-auto max-w-[32rem]">
            <Drawn>
              <NestedSquares
                outerLabel="one failed lateral partner"
                outerDisplay="$4.04M"
                layers={[
                  {
                    share: PILOT_SHARE_OF_FAILED_LATERAL,
                    label: 'the whole pilot',
                    display: PILOT_TOTAL_LABEL,
                    solid: true,
                  },
                ]}
              />
            </Drawn>
          </div>
        </Reveal>

        {/* c. And with the hours counted, which is the harder version. */}
        <Reveal className="pt-[14vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="measure mx-auto font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug">
              Even counting partner and lawyer time, it&rsquo;s still about a fifth of one
              failed hire.
            </p>
            <p className="text-caption mt-6 opacity-60">
              {PILOT_TOTAL_LABEL} cash, plus {TOTAL_HOURS.toLocaleString('en-US')} person-hours
              at ${MID_RATE} an hour, plus {Math.round(COORDINATOR_SHARE * 100)}% of a
              coordinator&rsquo;s year: {dollars(ALL_IN_MID.total)}, or{' '}
              {pct(ALL_IN_MID.shareOfFailedLateral)} of one failed lateral.
              <EstimateTag kind="estimate" tone="dark" className="ml-2" />
            </p>
          </div>
        </Reveal>

        <Reveal className="pt-[10vh]">
          <div className="mx-auto max-w-[32rem]">
            <Drawn>
              <NestedSquares
                outerLabel="one failed lateral partner"
                outerDisplay="$4.04M"
                layers={[
                  {
                    share: ALL_IN_MID.shareOfFailedLateral,
                    label: 'all-in, with the hours',
                    display: money(ALL_IN_MID.total),
                  },
                  {
                    share: PILOT_SHARE_OF_FAILED_LATERAL,
                    label: 'cash only',
                    display: PILOT_TOTAL_LABEL,
                    solid: true,
                  },
                ]}
              />
            </Drawn>
          </div>
        </Reveal>

        {/* d. The floor under all of it. */}
        <Reveal className="pb-[14vh] pt-[12vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="measure mx-auto font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug">
              Break-even: the pilot pays for itself if it keeps fewer than one person who
              would have left.
            </p>
            <p className="text-caption mt-5 opacity-60">
              {PILOT_TOTAL_LABEL} ÷ {dollars(DEFAULTS.costPerDeparture)} ={' '}
              {BREAK_EVEN_PEOPLE.toFixed(2)} people
              <Footnote ids={[14]} tone="dark" className="ml-1" />
              <EstimateTag kind="estimate" tone="dark" className="ml-2" />
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/the-numbers"
                className="eyebrow inline-flex items-center gap-2 rounded-full border border-sky px-6 py-3.5 text-sky transition-colors hover:bg-sky hover:text-navy"
              >
                See the numbers
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
