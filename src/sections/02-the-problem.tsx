import { useState } from 'react'
import { CardDeck, type DeckCard } from '@/components/site/card-deck'
import { ArcChart, OutlineBars, UnitCircles } from '@/components/charts/outline/charts'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { WhatThisMeans } from '@/components/site/what-this-means'
import { RESEARCH_PARTNERS, RESEARCH_PEOPLE } from '@/lib/data'

/**
 * The four figures that carry the argument. The rest of the research lives on
 * /the-numbers rather than being skimmed past here.
 */
function buildCards(): DeckCard[] {
  const lateral = RESEARCH_PARTNERS[0]
  const cost = RESEARCH_PARTNERS[1]
  const lonely = RESEARCH_PEOPLE[0]
  const belonging = RESEARCH_PEOPLE[2]

  return [
    {
      figure: '$4.04M',
      subject: 'per failed hire',
      body: 'The cost of one failed lateral partner at an Am Law 50 firm.',
      caveat: cost.caveat,
      sources: cost.sources,
      tone: 'navy',
      chart: () => (
        <OutlineBars
          max={5}
          data={[
            { label: 'one failed partner', value: 4.0392, display: '$4.04M', highlight: true },
            { label: 'one associate (high)', value: 0.5, display: '$500K' },
          ]}
        />
      ),
    },
    {
      figure: '30-38%',
      connector: 'of',
      subject: 'lateral partners',
      body: 'leave within five years of joining.',
      caveat: lateral.caveat,
      sources: lateral.sources,
      tone: 'slate',
      chart: () => (
        <UnitCircles filled={3.4} total={10} display="~1 in 3" />
      ),
    },
    {
      figure: '61%',
      connector: 'of',
      subject: 'lawyers',
      body: 'scored above average on the UCLA loneliness scale, the highest of any profession studied.',
      sources: lonely.sources,
      tone: 'navy',
      chart: () => <ArcChart pct={61} display="61%" />,
    },
    {
      figure: '18% vs 61%',
      subject: 'considered quitting',
      body: 'Workers satisfied with their sense of belonging, against those who were not.',
      caveat: belonging.caveat,
      sources: belonging.sources,
      tone: 'sky',
      chart: () => (
        <OutlineBars
          max={70}
          data={[
            { label: 'feels they belong', value: 18, display: '18%', highlight: true },
            { label: 'does not', value: 61, display: '61%' },
          ]}
        />
      ),
    },
  ]
}

export function TheProblem() {
  const [cards] = useState(buildCards)

  return (
    <section id="the-problem" className="relative">
      <Band className="pb-4 pt-16 md:pb-6 md:pt-20">
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <h2 className="text-h2 max-w-2xl text-navy">
              Lateral partners leave, and people who feel alone leave with them.
            </h2>
            <Eyebrow className="shrink-0 pb-2">02 — The problem</Eyebrow>
          </div>
          <Rule className="mt-8" />
        </Reveal>
      </Band>

      <CardDeck cards={cards} />

      <Band className="pb-20 md:pb-24">
        <Rule className="mb-10" />
        <WhatThisMeans>
          {'the expensive problem is not hiring. It is what happens in the eighteen months after someone arrives.'}
        </WhatThisMeans>
      </Band>
    </section>
  )
}
