import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { DEFAULTS, calculate, money } from '@/lib/calculator'

/**
 * The business case, read on navy.
 *
 * The colour swap itself is handled by the InvertZone that wraps this and
 * the logistics line on the home page, so this section only has to lay the
 * figures out. Text here inherits the zone's colour, which eases from navy
 * to ivory as the background goes the other way; sky accents are fixed
 * because they read on both.
 */
export function BusinessCase() {
  const out = calculate(DEFAULTS)

  const FIGURES = [
    { value: money(out.savings), label: 'Estimated savings a year', estimate: true },
    { value: `${out.returnPerDollar.toFixed(0)}×`, label: 'The pilot cost', estimate: true },
    { value: '$77,600', label: 'What the pilot costs', estimate: false },
    { value: '0.4', label: 'People kept to break even', estimate: true },
  ]

  return (
    <section id="business-case" className="scroll-mt-4 py-[14vh]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <p className="eyebrow text-sky">04 — What is it worth?</p>
          <h2 className="text-h2 mt-6 max-w-3xl" style={{ color: 'inherit' }}>
            What is it worth?
          </h2>
          <p className="measure mt-7 text-lg opacity-80 md:text-xl">
            If the program kept just 1 in 100 lawyers who would otherwise leave, that&rsquo;s
            about 19 fewer departures a year, roughly $3.9 million saved on a $77,600 pilot.
          </p>
        </Reveal>

        {/* The key numbers, divided by hairlines rather than boxed in. */}
        <Reveal className="mt-16">
          <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {FIGURES.map((figure, i) => (
              <div
                key={figure.label}
                className="px-0 sm:px-7 sm:first:pl-0"
                style={{
                  borderLeft: i === 0 ? undefined : '1px solid rgb(247 244 238 / 0.2)',
                }}
              >
                <dt className="font-display text-[clamp(2.4rem,6vw,5rem)] font-light leading-none">
                  {figure.value}
                </dt>
                <dd className="mt-4 text-sm opacity-70">
                  {figure.label}
                  {figure.estimate && (
                    <span className="mt-2 block">
                      <EstimateTag kind="estimate" tone="dark" />
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-14">
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/the-numbers"
              className="eyebrow inline-flex items-center gap-2 rounded-full border border-sky px-6 py-3.5 text-sky transition-colors hover:bg-sky hover:text-navy"
            >
              See the numbers
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Link>
            <span className="text-caption opacity-60">
              1,950 non-partner lawyers × 1 point × $200,000
              <Footnote ids={[14]} tone="dark" className="ml-1" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
