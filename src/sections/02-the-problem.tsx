import XScroll from '@/components/ui/x-scroll'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule, WhatThisMeans } from '@/components/site/section'
import { RESEARCH_PARTNERS, RESEARCH_PEOPLE, type ResearchCard } from '@/lib/data'

function Card({ card }: { card: ResearchCard }) {
  return (
    <div className="flex h-full w-[82vw] shrink-0 flex-col border-t border-stone pt-6 sm:w-auto sm:shrink">
      <p className="font-display text-[clamp(1.75rem,2.4vw,2.5rem)] leading-none text-navy">
        {card.figure}
      </p>
      <p className="mt-4 text-base text-slate">
        {card.body}
        <Footnote ids={card.sources} className="ml-1" />
      </p>
      {card.caveat && <p className="text-caption mt-3 text-muted-ink">{card.caveat}</p>}
    </div>
  )
}

/** Grid on desktop, a swipeable row on phones so nothing overflows. */
function CardRow({ cards }: { cards: ResearchCard[] }) {
  return (
    <>
      <div className="sm:hidden">
        <XScroll>
          <div className="flex gap-6 pb-4">
            {cards.map((card) => (
              <Card key={card.figure} card={card} />
            ))}
          </div>
        </XScroll>
      </div>

      <div className="hidden gap-x-10 gap-y-12 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Reveal key={card.figure} delay={i * 0.06}>
            <Card card={card} />
          </Reveal>
        ))}
      </div>
    </>
  )
}

export function TheProblem() {
  return (
    <Band id="the-problem" className="py-24 md:py-32">
      <Reveal>
        <Eyebrow>02 — The problem</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="text-h2 text-navy">
            Lateral partners leave, and people who feel alone leave with them.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            None of this is specific to White &amp; Case. It is what the published research
            says about law firms generally, which is why it is worth planning around.
          </p>
        </Reveal>
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 className="eyebrow text-muted-ink">New partners</h3>
        </Reveal>
        <div className="mt-8">
          <CardRow cards={RESEARCH_PARTNERS} />
        </div>
      </div>

      <div className="mt-24">
        <Reveal>
          <h3 className="eyebrow text-muted-ink">People</h3>
        </Reveal>
        <div className="mt-8">
          <CardRow cards={RESEARCH_PEOPLE} />
        </div>
      </div>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        the expensive problem is not hiring. It is what happens in the eighteen months after
        someone arrives.
      </WhatThisMeans>
    </Band>
  )
}
