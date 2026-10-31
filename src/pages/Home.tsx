import { Hero } from '@/sections/hero'
import { Thesis } from '@/sections/thesis'
import { ChapterOpener } from '@/sections/chapter-opener'
import { WhyNow } from '@/sections/01-why-now'
import { TheProblem } from '@/sections/02-the-problem'
import { WhatPeopleSay } from '@/sections/03-what-people-say'
import { WhatExists } from '@/sections/04-what-exists'

export default function Home() {
  return (
    <>
      <Hero />
      <Thesis />

      <ChapterOpener
        number="01"
        label="Why now"
        headline="A Public Target"
        sentence="White & Case has told the market it will pass $5bn by 2028. The current pace does not get there."
        figure="$5bn"
        figureCaption="2028 revenue goal"
        tone="midnight"
      />
      <WhyNow />

      <ChapterOpener
        number="02"
        label="The problem"
        headline="People Leave"
        sentence="Up to 38% of lateral partners are gone within five years, and each one costs about $4m."
        figure="30-38%"
        figureCaption="Lateral partners gone within five years"
        tone="ivory"
      />
      <TheProblem />

      <WhatPeopleSay />
      <WhatExists />
    </>
  )
}
