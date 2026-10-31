import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Footnote } from '@/components/site/footnote'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { StatTile } from '@/lib/data'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Move 1: the chapter opener's picture grows until it fills the screen, the
 * stats appear over it one at a time, and the next section wipes up to cover
 * it, switching the page from the dark image back to ivory.
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
  standfirst,
  stats,
  image,
}: {
  number: string
  question: string
  /** One line under the question: the numbers alone do not explain 2028. */
  standfirst?: React.ReactNode
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
      const title = el.querySelector<HTMLElement>('[data-title]')
      const curtain = el.querySelector<HTMLElement>('[data-curtain]')
      const statEls = gsap.utils.toArray<HTMLElement>('[data-stat]', el)
      if (!stage || !card || !heading || !curtain) return

      const apply = (p: number) => {
        const vw = window.innerWidth
        const vh = window.innerHeight

        // 0.00 - 0.42: the heading leaves and the picture grows to full bleed.
        // 0.45 - 0.78: the numbers arrive, one after another.
        // 0.80 - 1.00: the next panel wipes up and covers everything.
        const grow = easeOut(clamp01(p / 0.42))
        const wipe = easeOut(clamp01((p - 0.8) / 0.2))

        gsap.set(heading, { opacity: 1 - clamp01(grow * 2.4), y: -grow * vh * 0.3 })

        // Light blue throughout, but a deeper one before the dark picture is
        // behind it, so it never sits washed out on ivory.
        if (title) {
          gsap.set(title, { color: grow > 0.12 ? '#8DB4E2' : '#3D6CA6' })
        }

        gsap.set(card, {
          width: lerp(Math.min(vw * 0.26, 300), vw, grow),
          height: lerp(Math.min(vh * 0.3, 300), vh, grow),
          borderRadius: lerp(2, 0, grow),
        })

        statEls.forEach((node, i) => {
          const slot = 0.45 + (i * 0.33) / statEls.length
          const local = easeOut(clamp01((p - slot) / (0.33 / statEls.length)))
          gsap.set(node, { opacity: local, y: (1 - local) * 30 })
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
          {standfirst && <p className="measure mt-6 text-lg text-slate">{standfirst}</p>}
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
    <div ref={root} id="why-now" className="relative h-[400vh]">
      <div data-stage className="relative h-screen w-full overflow-hidden">

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
            <div className="absolute inset-0 flex items-center justify-center p-7 md:p-12">
              <dl className="grid w-full max-w-[1100px] grid-cols-1 gap-x-16 gap-y-10 text-center sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} data-stat style={{ opacity: 0 }}>
                    <dt className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.92] text-ivory">
                      {stat.value}
                    </dt>
                    <dd className="mt-2 text-sm leading-snug text-ivory/80 md:text-base">
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
          <h2
            data-title
            className="mt-6 max-w-3xl font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.12] text-sky-deep"
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
          {standfirst && (
            <p className="measure mt-7 text-lg text-slate md:text-xl">{standfirst}</p>
          )}
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
