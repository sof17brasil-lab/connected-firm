import { MeasureStrip } from '@/components/site/measure-strip'
import { PullQuote } from '@/components/site/pull-quote'
import { Reveal } from '@/components/site/reveal'
import { Band } from '@/components/site/section'

export function HowIdMeasure() {
  return (
    <Band id="measure" className="py-24 md:py-32">
      <Reveal>
        <PullQuote
          className="max-w-4xl"
          first="I&rsquo;d handle the logistics like any coordinator,"
          second="and I&rsquo;d also measure what each event achieves so the team can show leadership exactly how this supports the 2028 plan."
        />
      </Reveal>

      <Reveal className="mt-16">
        <MeasureStrip />
      </Reveal>
    </Band>
  )
}
