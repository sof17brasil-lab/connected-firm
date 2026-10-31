import XScroll from '@/components/ui/x-scroll'
import { StatCard } from '@/components/charts/stat-card'
import { Constellation } from '@/components/charts/outline/charts'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Rule, WhatThisMeans } from '@/components/site/section'
import { GAP_ROWS, LONDON_CALLOUT } from '@/lib/data'

/**
 * Decorative node positions. The research gives 43 offices in 29 countries and
 * no locations, so this is a constellation, not a map — nothing here claims to
 * be a city.
 */
const NODES = [
  { x: 96, y: 62, filled: true }, { x: 168, y: 36 }, { x: 258, y: 48, filled: true },
  { x: 330, y: 74 }, { x: 362, y: 134, filled: true }, { x: 316, y: 190 },
  { x: 238, y: 206, filled: true }, { x: 154, y: 198 }, { x: 78, y: 162, filled: true },
  { x: 58, y: 110 },
]

function GapTable() {
  return (
    <table className="w-full min-w-[760px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow w-[30%] py-4 pr-6 font-semibold text-navy">Exists today</th>
          <th className="eyebrow w-[36%] py-4 pr-6 font-semibold text-navy">Possible gap</th>
          <th className="eyebrow w-[34%] py-4 font-semibold text-sky-deep">Proposed</th>
        </tr>
      </thead>
      <tbody>
        {GAP_ROWS.map((row) => (
          <tr key={row.add} className="border-b border-stone/70 align-top">
            <td className="py-7 pr-6 text-slate">
              {row.exists}
              <Footnote ids={row.sources} className="ml-1" />
            </td>
            <td className="py-7 pr-6 text-muted-ink">{row.gap}</td>
            <td className="py-7">
              <span className="font-display text-xl text-navy">{row.add}</span>
              <span className="eyebrow mt-2 block text-sky-deep">My proposal</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function WhatExists() {
  return (
    <Band id="what-exists" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>04 — What already exists, and the gaps</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">Most of the pieces are already here.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            Nothing in this proposal replaces what the firm does. Each addition is a small
            connective layer on top of a program that already works.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <StatCard
          figure="43 offices"
          connector="in"
          subject="29 countries"
          body="About half of the firm's revenue comes from cross-border work, which depends on those offices knowing each other."
          caveat="Constellation, not a map: the research gives office counts, not locations."
          sources={[1]}
          chart={(animate) => (
            <Constellation animate={animate} nodes={NODES} display="~50% cross-border" />
          )}
        />
      </Reveal>

      <Reveal className="mt-24">
        <div>
          <XScroll className="lg:hidden">
            <GapTable />
          </XScroll>
          <div className="hidden lg:block">
            <GapTable />
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-24">
        <aside className="border-l-2 border-sky py-9 pl-8 pr-6 md:pl-12">
          <h3 className="font-display text-[clamp(1.7rem,2.3vw,2.2rem)] text-navy">
            {LONDON_CALLOUT.title}
          </h3>
          <p className="measure mt-4 text-slate">
            Graded by junior lawyers at
            <SourcePill id={22} label="Legal Cheek" />
          </p>
          <ul className="mt-7 space-y-4">
            {LONDON_CALLOUT.points.map((point) => (
              <li key={point} className="measure text-slate">
                {point}
              </li>
            ))}
          </ul>
          <p className="measure mt-7 border-t border-stone pt-5 italic text-muted-ink">
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
