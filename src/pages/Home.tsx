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

      <ChapterOpener number="01" question="Why does *2028* matter?" side="left" />
      <WhyNow />

      <ChapterOpener number="02" question="What keeps *people* at a firm?" side="right" />
      <TheProblem />

      <WhatPeopleSay />
      <WhatExists />
    </>
  )
}
