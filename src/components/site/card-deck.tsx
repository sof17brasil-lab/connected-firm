import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Footnote } from '@/components/site/footnote'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export interface DeckCard {
  figure: string
  connector?: string
  subject: string
  body: string
  caveat?: string
  sources: number[]
  /** Card fill while real photographs are still to come. */
  tone: 'navy' | 'slate' | 'sky'
  chart: (animate: boolean) => React.ReactNode
}

const TONE_CLASS = {
  navy: 'bg-navy',
  slate: 'bg-slate',
  sky: 'bg-sky-deep',
} as const

/**
 * Move 2: one tall portrait card, pinned, that rises from the bottom of the
 * screen and then changes its contents in place.
 *
 * The frame never moves or resizes once it has arrived. Each new stat wipes
 * its fill up from the bottom inside that fixed frame, the old chart fades as
 * the new one draws, and the text block crosses to the other side of the card.
 * Only ever one card on screen.
 *
 * Scrubbed from a single pinned ScrollTrigger, so scrolling back runs it in
 * reverse. Reduced motion falls back to a plain stacked list.
 */
export function CardDeck({
  cards,
  onIndexChange,
}: {
  cards: DeckCard[]
  onIndexChange?: (index: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const lastIndex = useRef(-1)

  useGSAP(
    () => {
      if (reducedMotion || !root.current) return
      const el = root.current

      const stage = el.querySelector<HTMLElement>('[data-stage]')
      const frame = el.querySelector<HTMLElement>('[data-frame]')
      const fills = gsap.utils.toArray<HTMLElement>('[data-fill]', el)
      const charts = gsap.utils.toArray<HTMLElement>('[data-chart]', el)
      const texts = gsap.utils.toArray<HTMLElement>('[data-text]', el)
      if (!stage || !frame) return

      // The first slice is the entrance; each card owns one slice after it.
      const slices = cards.length + 1
      const sliceOf = (p: number) => clamp01(p * slices)

      const apply = (p: number) => {
        const vh = window.innerHeight
        const entry = easeOut(clamp01(sliceOf(p)))

        // Rises from below the fold and grows into the portrait frame.
        gsap.set(frame, {
          y: (1 - entry) * vh * 0.62,
          scaleX: 0.55 + 0.45 * entry,
          scaleY: 0.28 + 0.72 * entry,
          opacity: Math.min(entry * 3, 1),
        })

        cards.forEach((_, i) => {
          // Where this card sits in the scroll, and how far through it we are.
          const start = (i + 1) / slices
          const local = clamp01((p - start) * slices)
          const next = clamp01((p - (i + 2) / slices) * slices)

          // The fill wipes up from the bottom inside the fixed frame.
          const wipe = i === 0 ? 1 : easeOut(clamp01(local / 0.42))
          const fill = fills[i]
          if (fill) {
            gsap.set(fill, { clipPath: `inset(${(1 - wipe) * 100}% 0% 0% 0%)` })
          }

          // The chart draws after the wipe, and fades as the next one arrives.
          const chart = charts[i]
          if (chart) {
            const inOpacity = easeOut(clamp01((local - 0.35) / 0.35))
            gsap.set(chart, { opacity: inOpacity * (1 - easeOut(clamp01(next / 0.3))) })
          }

          // The text crosses to the other side: out on one, in on the other.
          const text = texts[i]
          if (text) {
            const show = easeOut(clamp01((local - 0.28) / 0.32))
            const hide = easeOut(clamp01(next / 0.34))
            gsap.set(text, { opacity: show * (1 - hide), y: (1 - show) * 24 })
          }
        })

        // Tell the counter which card is on screen.
        const index = Math.min(Math.max(Math.floor(p * slices) - 1, 0), cards.length - 1)
        if (index !== lastIndex.current) {
          lastIndex.current = index
          onIndexChange?.(index)
        }
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
    { scope: root, dependencies: [cards, reducedMotion] },
  )

  if (reducedMotion) {
    return (
      <div className="flex flex-col gap-16">
        {cards.map((card) => (
          <div key={card.figure} className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className={cn('aspect-[3/4] w-full max-w-[20rem]', TONE_CLASS[card.tone])}>
              <div className="flex size-full items-center justify-center p-6">{card.chart(false)}</div>
            </div>
            <div>
              <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-navy">
                {card.figure}
                {card.connector && <em className="italic text-muted-ink"> {card.connector} </em>}
                {!card.connector && ' '}
                {card.subject}
              </p>
              <p className="measure mt-4 text-slate">
                {card.body}
                <Footnote ids={card.sources} className="ml-1" />
              </p>
              {card.caveat && <p className="text-caption mt-3 text-muted-ink">{card.caveat}</p>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={root} className="relative" style={{ height: `${(cards.length + 1) * 100}vh` }}>
      <div data-stage className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-start justify-center px-6 pt-[8vh] md:items-center md:pt-0">
          {/* The card frame: fixed once it has arrived. */}
          <div
            data-frame
            className="relative h-[52vh] w-[min(40vh,calc(100vw-2.5rem))] overflow-hidden md:h-[74vh] md:w-[min(58vh,calc(100vw-3rem))]"
            style={{ opacity: 0 }}
          >
            {cards.map((card, i) => (
              <div
                key={`fill-${i}`}
                data-fill
                className={cn('absolute inset-0', TONE_CLASS[card.tone])}
                style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              />
            ))}

            {cards.map((card, i) => (
              <div
                key={`chart-${i}`}
                data-chart
                className="absolute inset-0 flex items-center justify-center p-4 md:p-6"
                style={{ opacity: 0 }}
              >
                <div className="w-full">{card.chart(true)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Text blocks, alternating sides around the card. */}
        {cards.map((card, i) => (
          <div
            key={`text-${i}`}
            data-text
            style={{ opacity: 0 }}
            className={cn(
              'pointer-events-none absolute inset-x-6 bottom-6 md:inset-x-auto md:bottom-auto md:top-1/2 md:w-[min(22rem,34vw)] md:-translate-y-1/2',
              i % 2 === 0 ? 'md:left-[5vw]' : 'md:right-[5vw]',
            )}
          >
            <p className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-tight text-navy">
              {card.figure}
              {card.connector && <em className="italic text-muted-ink"> {card.connector} </em>}
              {!card.connector && ' '}
              {card.subject}
            </p>
            <p className="mt-4 text-slate">
              {card.body}
              <Footnote ids={card.sources} className="ml-1" />
            </p>
            {card.caveat && <p className="text-caption mt-3 text-muted-ink">{card.caveat}</p>}
          </div>
        ))}

      </div>
    </div>
  )
}
