import { Hero } from '@/sections/hero'
import { Thesis } from '@/sections/thesis'
import { ChapterOpener } from '@/sections/chapter-opener'
import { WhyNow } from '@/sections/01-why-now'
import { TheProblem } from '@/sections/02-the-problem'
import { ThePlan } from '@/sections/05-the-plan'
import { BusinessCase } from '@/sections/06-business-case'
import { HowIdMeasure } from '@/sections/07-how-id-measure'
import { Closing } from '@/sections/10-closing'

/**
 * One pass through the argument: there is a problem, it costs real money,
 * here is what I would do, here is how I would prove it. Everything that
 * supports it rather than advances it lives on /the-numbers.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Thesis />

      {/* Opener 01 and the Section 1 numbers are one continuous move. */}
      <WhyNow />

      <ChapterOpener number="02" question="What keeps *people* at a firm?" side="right" />
      <TheProblem />

      <ThePlan />

      <ChapterOpener number="04" question="What is it *worth*?" collage={false} compact />
      <BusinessCase />

      <HowIdMeasure />
      <Closing />
    </>
  )
}
