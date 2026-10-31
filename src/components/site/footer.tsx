import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { DISCLAIMER } from '@/components/site/disclaimer'
import { CONTACT_EMAIL } from '@/lib/data'
import { SECTIONS } from '@/lib/sections'

const PAGES = [
  { to: '/the-numbers', label: 'The numbers' },
  { to: '/culture-extras', label: 'Culture extras' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/sources', label: 'Sources' },
]

export function SiteFooter() {
  return (
    <footer className="bg-midnight">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-tight text-ivory">
              The Connected Firm
            </p>
            <p className="measure mt-5 text-ivory/70">
              An events strategy for White &amp; Case&apos;s New York office, built from public
              sources with every figure dated and every assumption labelled.
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex items-center gap-2 font-display text-xl text-ivory underline-offset-4 hover:text-sky hover:underline"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </a>
          </div>

          <nav aria-label="Sections">
            <p className="eyebrow text-sky">Sections</p>
            <ul className="mt-5 space-y-2.5">
              {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
                <li key={section.id}>
                  <a
                    href={`/#${section.id}`}
                    className="flex gap-3 text-ivory/70 transition-colors hover:text-ivory"
                  >
                    <span className="tabular text-caption text-ivory/35">{section.number}</span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Reference">
            <p className="eyebrow text-sky">Reference</p>
            <ul className="mt-5 space-y-2.5">
              {PAGES.map((page) => (
                <li key={page.to}>
                  <Link to={page.to} className="text-ivory/70 transition-colors hover:text-ivory">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="hairline-light my-12" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="eyebrow text-ivory/60">{DISCLAIMER}</p>
          <p className="eyebrow text-ivory/35">October 2026</p>
        </div>
      </div>
    </footer>
  )
}
