import { Mail } from 'lucide-react'
import { Skyline } from '@/components/site/skyline'
import { Reveal } from '@/components/site/reveal'
import { Band, Rule } from '@/components/site/section'
import { ABOUT } from '@/lib/data'

/**
 * The last word, and the only place on the home page that asks for anything:
 * the closing line over the skyline, then who wrote this and how to reply.
 */
export function Closing() {
  return (
    <Band id="close" className="pb-24 pt-24 md:pb-32 md:pt-32">
      <Reveal>
        <p className="measure font-display text-[clamp(1.7rem,3vw,2.7rem)] italic leading-snug text-navy">
          New York does not need a new program so much as a predictable calendar and someone
          whose job it is to keep it.
        </p>
      </Reveal>

      <Skyline className="mt-6" />

      <Rule className="mt-12 mb-14" />

      <div className="grid gap-10 md:grid-cols-[0.6fr_1.4fr] md:gap-16">
        <Reveal>
          <img
            src={`${import.meta.env.BASE_URL}images/sofia-headshot.jpg`}
            alt="Sofia Mota"
            width={900}
            height={1086}
            loading="lazy"
            className="w-full max-w-[14rem] object-cover"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] text-navy">
              {ABOUT.name}
            </h2>
            <p className="measure mt-5 text-slate">{ABOUT.bio}</p>
            <a
              href={`mailto:${ABOUT.email}`}
              className="mt-8 inline-flex items-center gap-3 font-display text-[clamp(1.3rem,2.2vw,1.9rem)] text-navy underline-offset-4 hover:text-sky-deep hover:underline"
            >
              <Mail className="size-5" strokeWidth={1.25} />
              {ABOUT.email}
            </a>
          </div>
        </Reveal>
      </div>
    </Band>
  )
}
