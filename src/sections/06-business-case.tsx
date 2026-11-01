import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HundredGrid, OutlineBars } from '@/components/charts/outline/charts'
import { Drawn } from '@/components/charts/outline/drawn'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { DEFAULTS, calculate, money, round } from '@/lib/calculator'
import { PILOT_TOTAL_LABEL } from '@/lib/data'

/**
 * The business case, read on navy, as one argument told a step at a time.
 *
 * The colour swap and the pin are driven from the heading block: InvertZone
 * finds it by `data-invert-in`, runs the ivory-to-navy swap as it travels up
 * the screen, and the same block is sticky, so by the time the page is fully
 * navy the question is already held at the top and the argument scrolls
 * underneath it.
 *
 * Every figure here comes out of `calculate(DEFAULTS)` rather than being
 * written into the copy, so the section cannot drift away from the
 * calculator on /the-numbers.
 */
export function BusinessCase() {
  const out = calculate(DEFAULTS)

  // 20% attrition is 1 in 5; the sentence says whatever the default says.
  const oneIn = Math.round(100 / DEFAULTS.attrition)
  const leavingPerHundred = DEFAULTS.attrition

  return (
    <section id="business-case" className="scroll-mt-4">
      {/* The swap is measured from here rather than from the heading itself.
          A sticky element reports its stuck position, so any ScrollTrigger
          refresh that lands while the heading is held at the top — a lazy
          image arriving, a resize, a font load — would put the trigger in
          the wrong place and the colours would stop changing. */}
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
        {/* a. The rate, as the calculator's own default. */}
        <Reveal className="pt-[12vh]">
          <p className="measure mx-auto text-center font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-snug">
            Every year, about 1 in {oneIn} lawyers at a large firm leaves.
            <Footnote ids={[15]} tone="dark" className="ml-1" />
          </p>
        </Reveal>

        {/* b. A hundred lawyers, and the one the program keeps. */}
        <Reveal className="pt-[12vh]">
          <div className="mx-auto max-w-[30rem]">
            <Drawn>
              <HundredGrid leaving={leavingPerHundred} />
            </Drawn>
            <p className="mt-9 text-center text-base opacity-80">
              A hundred lawyers. {leavingPerHundred} of them leave this year. If the program
              keeps just one of those hundred from leaving&hellip;
              <EstimateTag kind="estimate" tone="dark" className="ml-2" />
            </p>
          </div>
        </Reveal>

        {/* c. What that one person is worth. */}
        <Reveal className="pt-[14vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="measure mx-auto text-lg opacity-80 md:text-xl">
              &hellip;at ${(DEFAULTS.costPerDeparture / 1000).toFixed(0)},000 each, the low end
              of what replacing a lawyer costs, that&rsquo;s
              <Footnote ids={[14]} tone="dark" className="ml-1" />
            </p>
            <p className="mt-8 font-display text-[clamp(4.5rem,16vw,13rem)] font-light leading-[0.9]">
              {money(out.savings)}
            </p>
            <p className="mt-8 text-lg opacity-80 md:text-xl">
              a year, about {out.returnPerDollar.toFixed(0)}× the {PILOT_TOTAL_LABEL} pilot.
            </p>
            <p className="text-caption mt-6 opacity-60">
              {DEFAULTS.lawyers.toLocaleString('en-US')} non-partner lawyers × 1 point × $
              {DEFAULTS.costPerDeparture.toLocaleString('en-US')} ={' '}
              {round(out.departuresAvoided)} departures avoided
              <EstimateTag kind="estimate" tone="dark" className="ml-2" />
            </p>
          </div>
        </Reveal>

        {/* d. The two numbers side by side. */}
        <Reveal className="pt-[14vh]">
          <div className="mx-auto max-w-[34rem]">
            <Drawn>
              <OutlineBars
                max={out.savings * 1.22}
                data={[
                  {
                    label: 'the pilot',
                    value: DEFAULTS.pilotCost,
                    display: `$${DEFAULTS.pilotCost.toLocaleString('en-US')}`,
                  },
                  {
                    label: 'estimated savings a year',
                    value: out.savings,
                    display: money(out.savings),
                    highlight: true,
                  },
                ]}
              />
            </Drawn>
          </div>
        </Reveal>

        {/* e. The honest floor under all of it. */}
        <Reveal className="pb-[14vh] pt-[12vh]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="measure mx-auto font-display text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug">
              Break-even: the pilot pays for itself if it keeps fewer than one person.
            </p>
            <p className="text-caption mt-5 opacity-60">
              ${DEFAULTS.pilotCost.toLocaleString('en-US')} ÷ $
              {DEFAULTS.costPerDeparture.toLocaleString('en-US')} ={' '}
              {out.breakEvenLawyers.toFixed(2)} people
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
