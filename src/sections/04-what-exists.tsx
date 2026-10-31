import XScroll from '@/components/ui/x-scroll'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule, WhatThisMeans } from '@/components/site/section'
import { GAP_ROWS, LONDON_CALLOUT } from '@/lib/data'

function GapTable() {
  return (
    <table className="w-full min-w-[720px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow w-1/3 py-4 pr-6 font-semibold text-navy">Exists</th>
          <th className="eyebrow w-1/3 py-4 pr-6 font-semibold text-navy">Possible gap</th>
          <th className="eyebrow w-1/3 py-4 font-semibold text-navy">What I&apos;d add</th>
        </tr>
      </thead>
      <tbody>
        {GAP_ROWS.map((row) => (
          <tr key={row.add} className="border-b border-stone/70 align-top">
            <td className="py-6 pr-6 text-slate">
              {row.exists}
              <Footnote ids={row.sources} className="ml-1" />
            </td>
            <td className="py-6 pr-6 text-muted-ink">{row.gap}</td>
            <td className="py-6 font-display text-xl text-navy">{row.add}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function WhatExists() {
  return (
    <Band id="what-exists" className="py-24 md:py-32">
      <Reveal>
        <Eyebrow>04 — What already exists, and the gaps</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <h2 className="text-h2 text-navy">
            Most of the pieces are already here.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            Nothing in this proposal replaces what the firm does. Each addition is a small
            connective layer on top of a program that already works.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <div>
          <XScroll className="lg:hidden">
            <GapTable />
          </XScroll>
          <div className="hidden lg:block">
            <GapTable />
          </div>
        </div>
      </Reveal>

      {/* London callout: the proof that this already works inside the firm. */}
      <Reveal className="mt-24">
        <aside className="border-l-2 border-sky bg-stone/25 py-8 pl-8 pr-6 md:pl-12">
          <h3 className="font-display text-[clamp(1.6rem,2.2vw,2.1rem)] text-navy">
            {LONDON_CALLOUT.title}
            <Footnote ids={LONDON_CALLOUT.sources} className="ml-2" />
          </h3>
          <ul className="mt-6 space-y-4">
            {LONDON_CALLOUT.points.map((point) => (
              <li key={point} className="measure text-slate">
                {point}
              </li>
            ))}
          </ul>
          <p className="measure mt-6 border-t border-stone pt-5 text-muted-ink italic">
            {LONDON_CALLOUT.caveat}
          </p>
        </aside>
      </Reveal>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        New York does not need a new program so much as a predictable calendar and someone
        whose job it is to keep it.
      </WhatThisMeans>
    </Band>
  )
}
