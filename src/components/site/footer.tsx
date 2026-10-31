import { Link } from 'react-router-dom'
import { Disclaimer } from '@/components/site/disclaimer'
import { Rule } from '@/components/site/section'
import { CONTACT_EMAIL } from '@/lib/data'
import { NAV_SECTIONS } from '@/lib/nav'

export function SiteFooter() {
  return (
    <footer className="bg-midnight">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl text-ivory">The Connected Firm</p>
            <p className="measure mt-4 text-ivory/70">
              An events strategy for White &amp; Case&apos;s New York office, built from
              public sources with every figure dated and every assumption labelled.
            </p>
          </div>

          <div>
            <p className="eyebrow text-sky">Sections</p>
            <ul className="mt-4 space-y-2">
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`/#${section.id}`} className="text-ivory/70 hover:text-ivory">
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-sky">Reference</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/sources" className="text-ivory/70 hover:text-ivory">
                  Sources
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-ivory/70 hover:text-ivory"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Rule tone="dark" className="my-10" />
        <Disclaimer tone="dark" />
      </div>
    </footer>
  )
}
