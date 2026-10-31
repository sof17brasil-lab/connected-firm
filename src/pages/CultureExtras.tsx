import { useEffect } from 'react'
import { Footnote } from '@/components/site/footnote'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { Band, Finding, Rule } from '@/components/site/section'
import { ALREADY_HAS, IDEAS, OTHER_FIRMS, THURSDAY_TABLE } from '@/lib/extras'

export default function CultureExtras() {
  useEffect(() => window.scrollTo(0, 0), [])

  return (
    <Band className="pb-28 pt-32 md:pt-40">
      <PageHeader
        eyebrow="Culture extras"
        title="Ideas worth stealing, and the ones already here."
        intro="Background to Section 5. What other firms do, what White & Case already runs, and a list of small ideas that would cost almost nothing to try."
      />

      <div className="mt-20 grid gap-x-20 gap-y-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] text-navy">
            What other firms do
          </h2>
          <div className="mt-8">
            {OTHER_FIRMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="border-t border-stone py-6">
                  <p className="font-display text-xl text-navy">{item.title}</p>
                  <p className="measure mt-3 text-slate">
                    {item.body}
                    {item.sources.length > 0 && <Footnote ids={item.sources} className="ml-1" />}
                  </p>
                  {item.sources.length === 0 && (
                    <p className="text-caption mt-2 text-muted-ink">
                      Named in my outline without a source. Unverified.
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] text-navy">
            What White &amp; Case already has
          </h2>
          <div className="mt-8">
            {ALREADY_HAS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="border-t border-stone py-6">
                  <p className="font-display text-xl text-navy">{item.title}</p>
                  <p className="measure mt-3 text-slate">
                    {item.body}
                    <Footnote ids={item.sources} className="ml-1" />
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Rule className="mt-20" />

      <div className="mt-16">
        <h2 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] text-navy">
          Ideas
        </h2>
        <p className="measure mt-4 text-slate">
          None of these is costed in the pilot. They are cheap enough to try one at a time.
        </p>

        <div className="mt-10 grid gap-x-16 md:grid-cols-2">
          {IDEAS.map((idea, i) => (
            <Reveal key={idea.name} delay={i * 0.04}>
              <Finding label={`Idea ${String(i + 1).padStart(2, '0')}`} figure={idea.name}>
                {idea.body}
              </Finding>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-20">
        <aside className="border-l-2 border-sky py-7 pl-8">
          <h2 className="font-display text-[clamp(1.5rem,2vw,1.9rem)] text-navy">
            Thursday Table guidelines
          </h2>
          <p className="measure mt-3 text-slate">
            Any regular drinks event needs rules written down before it starts.
          </p>
          <ul className="mt-6 space-y-3">
            {THURSDAY_TABLE.map((rule) => (
              <li key={rule} className="flex gap-3 text-slate">
                <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-sky-deep" />
                {rule}
              </li>
            ))}
          </ul>
        </aside>
      </Reveal>
    </Band>
  )
}
