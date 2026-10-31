import { Mail } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { Band, Eyebrow, Rule } from '@/components/site/section'
import { ABOUT } from '@/lib/data'

export function About() {
  return (
    <Band id="about" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>09 — About me</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <Reveal>
          <img
            src={`${import.meta.env.BASE_URL}images/sofia-headshot.jpg`}
            alt="Sofia Mota"
            width={900}
            height={1086}
            loading="lazy"
            className="w-full max-w-[22rem] object-cover"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h2 className="text-h2 text-navy">{ABOUT.name}</h2>
            <p className="measure mt-7 text-lg text-slate">{ABOUT.bio}</p>

            <div className="mt-10">
              <p className="eyebrow text-muted-ink">Contact</p>
              <a
                href={`mailto:${ABOUT.email}`}
                className="mt-3 inline-flex items-center gap-3 font-display text-[clamp(1.4rem,2.4vw,2rem)] text-navy underline-offset-4 hover:text-sky-deep hover:underline"
              >
                <Mail className="size-5" strokeWidth={1.25} />
                {ABOUT.email}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Band>
  )
}
