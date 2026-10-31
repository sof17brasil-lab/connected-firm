import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Footnote } from '@/components/site/footnote'
import { buildCollage } from '@/lib/collage'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { StatTile } from '@/lib/data'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const RAD = Math.PI / 180
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const PIECES = buildCollage(9, 'left')

/**
 * Move 1: the chapter opener's centre square grows until it fills the screen,
 * the stats appear over it one at a time, and the next section wipes up to
 * cover it.
 *
 * Everything is scrubbed from one pinned ScrollTrigger — no timers — so the
 * whole move runs forwards and backwards with the scroll.
 *
 * Under reduced motion the whole thing collapses to a static panel with the
 * stats listed beneath it, which is the end state of the sequence.
 */
export function GrowCard({
  number,
  question,
  stats,
  image,
}: {
  number: string
  question: string
  stats: StatTile[]
  image: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !root.current) return
      const el = root.current

      const stage = el.querySelector<HTMLElement>('[data-stage]')
      const card = el.querySelector<HTMLElement>('[data-card]')
      const heading = el.querySelector<HTMLElement>('[data-heading]')
      const curtain = el.querySelector<HTMLElement>('[data-curtain]')
      const pieces = gsap.utils.toArray<HTMLElement>('[data-piece]', el)
      const statEls = gsap.utils.toArray<HTMLElement>('[data-stat]', el)
      if (!stage || !card || !heading || !curtain) return

      const apply = (p: number) => {
        const vw = window.innerWidth
        const vh = window.innerHeight

        // 0 - 0.18 : collage settles around the heading (the orbit from 01/02).
        // 0.18 - 0.55: heading leaves, squares fly out, the centre card grows.
        // 0.55 - 0.80: the stats arrive one at a time.
        // 0.80 - 1.00: the next panel wipes up and covers everything.
        const orbit = clamp01(p / 0.18)
        const grow = easeOut(clamp01((p - 0.18) / 0.37))
        const wipe = easeOut(clamp01((p - 0.8) / 0.2))

        const ring = Math.min(Math.max(Math.min(vw, vh) * 0.4, 150), 430)

        pieces.forEach((node, i) => {
          const piece = PIECES[i]
          if (!piece) return
          const local = easeOut(clamp01((orbit - piece.delay) / piece.span))
          const angle = lerp(piece.a0, piece.a1, local) * RAD
          // Once the card starts growing the squares keep going outward.
          const dist = lerp(piece.r0, piece.r1, local) * ring + grow * vw * 0.9
          gsap.set(node, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: lerp(0.6, 1, local),
            opacity: Math.min(local * 3.5, 1) * (1 - clamp01(grow * 1.6)),
          })
        })

        gsap.set(heading, { opacity: 1 - clamp01(grow * 2.2), y: -grow * vh * 0.3 })

        // The card morphs from a small portrait tile to the full viewport.
        gsap.set(card, {
          width: lerp(Math.min(vw * 0.22, 240), vw, grow),
          height: lerp(Math.min(vh * 0.26, 260), vh, grow),
          borderRadius: lerp(2, 0, grow),
        })

        statEls.forEach((node, i) => {
          const slot = 0.55 + (i * 0.25) / statEls.length
          const local = easeOut(clamp01((p - slot) / (0.25 / statEls.length)))
          gsap.set(node, { opacity: local, y: (1 - local) * 26 })
        })

        gsap.set(curtain, { yPercent: (1 - wipe) * 100 })
      }

      apply(0)

      const proxy = { p: 0 }
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => apply(proxy.p),
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: stage,
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      })

      const onResize = () => apply(proxy.p)
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: root, dependencies: [reducedMotion] },
  )

  // Reduced motion: the end state, with nothing moving.
  if (reducedMotion) {
    return (
      <section id="why-now" className="relative py-24">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <p className="eyebrow text-muted-ink">[{number}]</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,4rem)] leading-tight text-navy">
            {question.replace(/\*/g, '')}
          </h2>
          <div className="relative mt-12 aspect-[16/9] overflow-hidden bg-navy">
            <img src={image} alt="" className="absolute inset-0 size-full object-cover opacity-45" />
          </div>
          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-4xl text-navy">{stat.value}</dt>
                <dd className="mt-3 text-slate">
                  {stat.label}
                  <Footnote ids={stat.sources} className="ml-1" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    )
  }

  return (
    <div ref={root} id="why-now" className="relative h-[460vh]">
      <div data-stage className="relative h-screen w-full overflow-hidden">
        {/* Collage, orbiting then flying outward. */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-10">
          {PIECES.map((piece, i) => (
            <div
              key={i}
              data-piece
              className={cn(
                'absolute',
                piece.tone === 'navy' ? 'bg-navy' : piece.tone === 'sky' ? 'bg-sky' : 'bg-stone',
              )}
              style={{
                width: piece.size,
                height: piece.size,
                marginLeft: -piece.size / 2,
                marginTop: -piece.size / 2,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* The growing card. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div data-card className="relative overflow-hidden bg-navy">
            <img src={image} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-navy/72" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-navy/30 to-transparent"
            />

            {/* Stats, arriving one at a time over the full-bleed image. */}
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-14">
              <dl className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
                {stats.map((stat) => (
                  <div key={stat.label} data-stat style={{ opacity: 0 }} className="md:max-w-[15rem]">
                    <dt className="font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-none text-ivory">
                      {stat.value}
                    </dt>
                    <dd className="mt-3 text-sm leading-snug text-ivory/80">
                      {stat.label}
                      <Footnote ids={stat.sources} tone="dark" className="ml-1" />
                      {stat.note && (
                        <span className="text-caption mt-1 block text-ivory/55">{stat.note}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* The heading, which leaves as the card grows. */}
        <div
          data-heading
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="eyebrow font-display text-lg tracking-[0.08em] text-muted-ink">
            [{number}]
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] text-navy">
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
        </div>

        {/* The curtain: the next section rising to cover the stage. */}
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
