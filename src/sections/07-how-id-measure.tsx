import { MeasureStrip } from '@/components/site/measure-strip'
import { PullQuote } from '@/components/site/pull-quote'
import { Reveal } from '@/components/site/reveal'

export function HowIdMeasure() {
  return (
    <section id="measure" className="scroll-mt-4 py-16 md:py-24">
      {/* Where the page goes back to ivory: InvertZone reads this marker. */}
      <div data-invert-out className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Reveal>
          <PullQuote
            className="max-w-4xl"
            first="I&rsquo;d handle the logistics like any coordinator,"
            second="and I&rsquo;d also measure what each event achieves so the team can show leadership exactly how this supports the 2028 plan."
          />
        </Reveal>
      </div>

      {/* Full-bleed: the strip runs the whole width of the screen. */}
      <Reveal className="mt-16">
        <MeasureStrip />
      </Reveal>
    </section>
  )
}
