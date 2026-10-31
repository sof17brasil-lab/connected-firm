import { Hero } from '@/sections/hero'
import { Thesis } from '@/sections/thesis'
import { ChapterOpener } from '@/sections/chapter-opener'
import { WhyNow } from '@/sections/01-why-now'
import { TheProblem } from '@/sections/02-the-problem'
import { WhatPeopleSay } from '@/sections/03-what-people-say'
import { WhatExists } from '@/sections/04-what-exists'
import { ThePlan } from '@/sections/05-the-plan'
import { BusinessCase } from '@/sections/06-business-case'
import { HowIdMeasure } from '@/sections/07-how-id-measure'
import { Risks } from '@/sections/08-risks'
import { About } from '@/sections/09-about'

export default function Home() {
  return (
    <>
      <Hero />
      <Thesis />

      <ChapterOpener number="01" question="Why does *2028* matter?" side="left" />
      <WhyNow />

      <ChapterOpener number="02" question="What keeps *people* at a firm?" side="right" />
      <TheProblem />

      <WhatPeopleSay />
      <WhatExists />

      <ChapterOpener number="05" question="What would we *build*?" side="left" />
      <ThePlan />

      <ChapterOpener number="06" question="What is it *worth*?" side="right" />
      <BusinessCase />

      <HowIdMeasure />
      <Risks />
      <About />
    </>
  )
}
