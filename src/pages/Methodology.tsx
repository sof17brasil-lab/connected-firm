import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import XScroll from '@/components/ui/x-scroll'
import { Footnote } from '@/components/site/footnote'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { Band, Rule } from '@/components/site/section'
import { ASSUMPTIONS, FORMULAS, STILL_TO_VERIFY } from '@/lib/extras'

function AssumptionsTable() {
  return (
    <table className="w-full min-w-[680px] border-collapse text-left">
      <thead>
        <tr className="border-b border-stone">
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Assumption</th>
          <th className="eyebrow py-4 pr-6 font-semibold text-navy">Value used</th>
          <th className="eyebrow py-4 font-semibold text-navy">Why</th>
        </tr>
      </thead>
      <tbody>
        {ASSUMPTIONS.map((row) => (
          <tr key={row.name} className="border-b border-stone/70 align-top">
            <td className="py-5 pr-6 text-slate">{row.name}</td>
            <td className="tabular py-5 pr-6 font-display text-lg text-navy">{row.value}</td>
            <td className="py-5 text-caption text-muted-ink">
              {row.why}
              {row.sources.length > 0 && <Footnote ids={row.sources} className="ml-1" />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Methodology() {
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <Band className="pb-28 pt-32 md:pt-40">
      <PageHeader
        eyebrow="Methodology"
        title="Every formula, and every assumption behind it."
        intro="Nothing on this site is derived without being shown here. Where a figure is my estimate rather than a published number, it says so."
      />

      <div className="mt-20">
        <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] text-navy">Assumptions</h2>
        <Reveal className="mt-8">
          <div>
            <XScroll className="lg:hidden">
              <AssumptionsTable />
            </XScroll>
            <div className="hidden lg:block">
              <AssumptionsTable />
            </div>
          </div>
        </Reveal>
      </div>

      <Rule className="mt-20" />

      <div className="mt-16">
        <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] text-navy">Formulas</h2>
        <div className="mt-8 grid gap-x-16 md:grid-cols-2">
          {FORMULAS.map((formula, i) => (
            <Reveal key={formula.name} delay={i * 0.03}>
              <div className="border-t border-stone py-6">
                <p className="eyebrow text-sky-deep">{formula.name}</p>
                <p className="tabular mt-3 text-slate">{formula.expression}</p>
                <p className="tabular mt-2 font-display text-xl text-navy">= {formula.result}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-20">
        <aside className="border-l-2 border-sky py-7 pl-8">
          <p className="flex items-center gap-2.5 font-display text-[clamp(1.5rem,2vw,1.9rem)] text-navy">
            <AlertCircle className="size-5 text-sky-deep" strokeWidth={1.25} />
            Still to verify
          </p>
          <p className="measure mt-3 text-slate">
            Open questions I would want answered before this went any further.
          </p>
          <ul className="mt-6 space-y-4">
            {STILL_TO_VERIFY.map((item) => (
              <li key={item} className="measure flex gap-3 text-slate">
                <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-sky-deep" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </Reveal>
    </Band>
  )
}
