import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { Band } from '@/components/site/section'
import { SOURCES, sourceYearLabel } from '@/lib/sources'
import { PHOTO_CREDIT } from '@/lib/photos'

/**
 * Every figure on the site footnotes back to a numbered entry here.
 * Sources that carry no date of their own say so rather than being guessed at.
 */
export default function SourcesPage() {
  const { hash } = useLocation()

  // Footnote links arrive as /sources#s12; bring that entry into view.
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
      <PageHeader
        eyebrow="Reference"
        title="Sources"
        intro="Every number on this site comes from one of these. Links open in a new tab. Where a source carries no publication date it is listed as accessed in October 2026, rather than given a year it does not state."
      />

      <ol className="mt-10">
        {SOURCES.map((source, i) => (
          <Reveal key={source.id} delay={Math.min(i, 8) * 0.02}>
            <li
              id={`s${source.id}`}
              className="group scroll-mt-28 border-b border-stone/70 target:bg-sky/10"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-start gap-6 py-6 transition-colors hover:bg-stone/25"
              >
                <span className="tabular w-9 shrink-0 font-display text-2xl leading-none text-sky-deep">
                  {String(source.id).padStart(2, '0')}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-slate">
                    <span className="font-medium text-navy">{source.publisher}</span>
                    {' — '}
                    {source.title}
                  </span>
                  <span className="text-caption mt-1.5 block text-muted-ink">
                    {sourceYearLabel(source)}
                    <span className="mx-2 text-stone">·</span>
                    <span className="break-all">{source.url.replace(/^https:\/\//, '')}</span>
                  </span>
                </span>

                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 text-stone transition-colors group-hover:text-sky-deep"
                  strokeWidth={1.5}
                />
              </a>
            </li>
          </Reveal>
        ))}
      </ol>

      <p className="text-caption mt-10 text-muted-ink">
        {PHOTO_CREDIT} They illustrate the argument and do not show White &amp; Case, its
        offices or its people.
      </p>
    </Band>
  )
}
