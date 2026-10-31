import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { Reveal } from '@/components/site/reveal'
import { SOURCES, sourceYearLabel } from '@/lib/sources'

/**
 * Every figure on the site footnotes back to a numbered entry here.
 * Sources that carry no date of their own say so rather than being guessed at.
 */
export default function SourcesPage() {
  const { hash } = useLocation()

  // Footnote links arrive as /sources#s12; scroll that entry into view.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const target = document.getElementById(hash.slice(1))
    target?.scrollIntoView({ block: 'center' })
  }, [hash])

  return (
    <Band className="pb-28 pt-32 md:pt-40">
      <Reveal>
        <Eyebrow>Reference</Eyebrow>
        <h1 className="text-h2 mt-6 text-navy">Sources</h1>
        <p className="measure mt-6 text-lg text-slate">
          Every number on this site comes from one of these. Links open in a new tab.
          Where a source carries no publication date, it is listed as accessed in October
          2026 rather than given a year it does not state.
        </p>
      </Reveal>

      <Rule className="mt-12" />

      <ol className="mt-4">
        {SOURCES.map((source) => (
          <li
            key={source.id}
            id={`s${source.id}`}
            className="scroll-mt-28 border-b border-stone/70 py-6"
          >
            <div className="flex gap-5">
              <span className="tabular w-8 shrink-0 font-display text-xl text-sky-deep">
                {source.id}
              </span>
              <div className="min-w-0">
                <p className="text-slate">
                  <span className="font-medium text-navy">{source.publisher}</span>
                  {': '}
                  {source.title}{' '}
                  <span className="text-muted-ink">({sourceYearLabel(source)})</span>
                </p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-caption mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-sky-deep underline-offset-2 hover:underline"
                >
                  <ExternalLink className="size-3 shrink-0" strokeWidth={1.5} />
                  {source.url}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Band>
  )
}
