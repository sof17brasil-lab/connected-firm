import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Eyebrow, Rule } from '@/components/site/section'

/** Shared opening for the three reference pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro: string
}) {
  return (
    <Reveal>
      <div>
        <Link
          to="/"
          className="eyebrow inline-flex items-center gap-2 text-muted-ink hover:text-navy"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} />
          Back to the proposal
        </Link>

        <Eyebrow className="mt-12">{eyebrow}</Eyebrow>
        <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-navy">
          {title}
        </h1>
        <p className="measure mt-7 text-lg text-slate">{intro}</p>
        <Rule className="mt-12" />
      </div>
    </Reveal>
  )
}
