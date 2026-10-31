import { useRef } from 'react'
import { gsap } from 'gsap'
import { Footnote } from '@/components/site/footnote'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
import type { StatTile } from '@/lib/data'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Move 1: the picture grows until it fills the screen, then the standfirst
 * and the four numbers arrive over it, and the next section wipes up to
 * cover the lot.
 *
 * Every piece of text here sits on the photograph, so all of it is ivory and
 * the photograph carries a heavy navy scrim the whole way through. The
 * picture starts large enough to sit behind the heading at its widest, which
 * is what lets the heading be white from the first frame rather than
 * switching colour partway.
 */
export function GrowCard({
  number,
  question,
  standfirst,
  stats,
  image,
}: {
  number: string
  question: string
  /** Appears only once the picture is full screen. */
  standfirst?: React.ReactNode
  stats: StatTile[]
  image: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useScrollScrub(
    root,
    (p) => {
      const el = root.current
      if (!el) return

      const card = el.querySelector<HTMLElement>('[data-card]')
      const heading = el.querySelector<HTMLElement>('[data-heading]')
      const stand = el.querySelector<HTMLElement>('[data-standfirst]')
      const curtain = el.querySelector<HTMLElement>('[data-curtain]')
      const statEls = Array.from(el.querySelectorAll<HTMLElement>('[data-stat]'))
      if (!card || !heading || !curtain) return

      const vw = window.innerWidth
      const vh = window.innerHeight

      // 0.00 - 0.34  the picture grows to full bleed, heading over it
      // 0.34 - 0.44  the heading leaves
      // 0.42 - 0.54  the standfirst arrives, full screen reached
      // 0.56 - 0.84  the numbers, one at a time
      // 0.86 - 1.00  the next panel wipes up
      const grow = easeOut(clamp01(p / 0.34))
      const headOut = easeOut(clamp01((p - 0.34) / 0.1))
      const standIn = easeOut(clamp01((p - 0.42) / 0.12))
      const wipe = easeOut(clamp01((p - 0.86) / 0.14))

      gsap.set(card, {
        width: lerp(Math.min(vw * 0.26, 300), vw, grow),
        height: lerp(Math.min(vh * 0.3, 300), vh, grow),
        borderRadius: lerp(2, 0, grow),
      })

      // The heading sits on ivory before the picture is behind it and on the
      // darkened photograph after, so it needs a deeper blue at the start and
      // the lighter one once there is something dark underneath.
      const onPhoto = grow > 0.12
      const title = el.querySelector<HTMLElement>('[data-title]')
      const eyebrow = el.querySelector<HTMLElement>('[data-eyebrow]')
      if (title) gsap.set(title, { color: onPhoto ? '#8DB4E2' : '#3D6CA6' })
      if (eyebrow) gsap.set(eyebrow, { color: onPhoto ? 'rgba(247,244,238,0.7)' : '#6A6F7A' })

      gsap.set(heading, { opacity: 1 - headOut, y: -headOut * vh * 0.12 })
      if (stand) gsap.set(stand, { opacity: standIn, y: (1 - standIn) * 24 })

      statEls.forEach((node, i) => {
        const slot = 0.56 + (i * 0.28) / statEls.length
        const local = easeOut(clamp01((p - slot) / (0.28 / statEls.length)))
        gsap.set(node, { opacity: local, y: (1 - local) * 30 })
      })

      gsap.set(curtain, { yPercent: (1 - wipe) * 100 })
    },
    { start: 'top top', end: 'bottom bottom', scrub: 0.8 },
  )

  const Heading = (
    <h2
      data-title
      className="max-w-3xl font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] text-sky-deep"
    >
      {question.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="italic">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h2>
  )

  if (reducedMotion) {
    return (
      <section id="why-now" className="relative py-20">
        <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <div className="relative isolate overflow-hidden bg-navy p-8 md:p-14">
            <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-navy/80" />
            <div className="relative">
              <p className="eyebrow text-ivory/70">[{number}]</p>
              <div className="mt-5">{Heading}</div>
              {standfirst && (
                <p className="measure mt-6 text-lg text-ivory/85">{standfirst}</p>
              )}
              <dl className="mt-12 grid gap-10 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-none text-ivory">
                      {stat.value}
                    </dt>
                    <dd className="mt-2 text-ivory/80">
                      {stat.label}
                      <Footnote ids={stat.sources} tone="dark" className="ml-1" />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div ref={root} id="why-now" className="relative h-[420vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div data-card className="relative overflow-hidden bg-navy">
            <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
            {/* Heavy scrim: every word in this section sits on this picture. */}
            <div aria-hidden="true" className="absolute inset-0 bg-navy/78" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-navy/35 to-navy/45"
            />

            {/* All the type lives inside the picture, so it is never on ivory. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-7 text-center md:px-12">
              <div data-heading>
                <p
                  data-eyebrow
                  className="eyebrow mb-6 font-display text-lg tracking-[0.08em] text-muted-ink"
                >
                  [{number}]
                </p>
                {Heading}
              </div>

              {standfirst && (
                <p
                  data-standfirst
                  style={{ opacity: 0 }}
                  className="absolute inset-x-7 top-[14vh] mx-auto max-w-2xl text-lg text-ivory/90 md:inset-x-12 md:text-xl"
                >
                  {standfirst}
                </p>
              )}

              <dl className="grid w-full max-w-[1100px] grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} data-stat style={{ opacity: 0 }}>
                    <dt className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.92] text-ivory">
                      {stat.value}
                    </dt>
                    <dd className="mt-2 text-sm leading-snug text-ivory/80 md:text-base">
                      {stat.label}
                      <Footnote ids={stat.sources} tone="dark" className="ml-1" />
                      {stat.note && (
                        <span className="text-caption mt-1 block text-ivory/60">{stat.note}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div
          data-curtain
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-ivory"
          style={{ transform: 'translateY(100%)' }}
        />
      </div>
    </div>
  )
}
