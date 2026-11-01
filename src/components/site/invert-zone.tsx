import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const IVORY = [247, 244, 238] as const
const NAVY = [14, 30, 58] as const

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * The text crosses in a tenth of the distance the background takes.
 *
 * Both colours travel the same line between ivory and navy, so if they
 * eased at the same rate they would meet in the middle and the text would
 * be the exact colour of what is behind it — invisible for a third of the
 * swap. Flipping the text in a narrow band around the halfway point keeps
 * it well clear of the background everywhere except for about fifteen
 * pixels of scroll, where the background is neutral grey anyway.
 */
const CROSS_AT = 0.485
const CROSS_OVER = 0.03
const textAt = (t: number) => clamp01((t - CROSS_AT) / CROSS_OVER)

const mix = (a: readonly number[], b: readonly number[], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`

/**
 * How far the page has inverted, 0 = ivory with navy text, 1 = navy with
 * ivory text. The chrome reads this so the mark, menu, dot nav and the
 * bottom pill flip with everything else.
 */
const InvertContext = createContext(0)
export const useInverted = () => useContext(InvertContext)

export function InvertProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const onChange = (e: Event) => setValue((e as CustomEvent<number>).detail)
    window.addEventListener('tcf:invert', onChange)
    return () => window.removeEventListener('tcf:invert', onChange)
  }, [])

  return <InvertContext.Provider value={value}>{children}</InvertContext.Provider>
}

/**
 * A stretch of page where the colours swap.
 *
 * Nothing moves: the page background eases from ivory to navy while the text
 * eases from navy to ivory, and back again later. Two elements inside the
 * zone say where, both marked in the markup rather than guessed from the
 * zone's own height:
 *
 *   [data-invert-in]   the heading the swap runs against. The swap begins as
 *                      it enters the screen and is complete by the time it
 *                      has travelled two thirds of the way up, which is also
 *                      where it pins.
 *   [data-invert-out]  the line that takes the page back to ivory, over the
 *                      same distance.
 *
 * The zone also publishes --zone-bg and --zone-fg, so anything inside it that
 * needs its own opaque background — a sticky heading, say — can track the
 * swap without re-deriving it.
 */
export function InvertZone({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const last = useRef(-1)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const paint = (t: number) => {
        const eased = clamp01(t)
        const ink = textAt(eased)
        el.style.setProperty('--invert', String(eased))
        el.style.setProperty('--zone-bg', mix(IVORY, NAVY, eased))
        el.style.setProperty('--zone-fg', mix(NAVY, IVORY, ink))
        el.style.backgroundColor = mix(IVORY, NAVY, eased)
        el.style.color = mix(NAVY, IVORY, ink)

        if (Math.abs(eased - last.current) > 0.01) {
          last.current = eased
          window.dispatchEvent(new CustomEvent('tcf:invert', { detail: eased }))
        }
      }

      // Without motion the stretch is simply navy; there is nothing to scrub.
      if (reducedMotion) {
        paint(1)
        return
      }

      const inEl = el.querySelector<HTMLElement>('[data-invert-in]')
      const outEl = el.querySelector<HTMLElement>('[data-invert-out]')
      if (!inEl) {
        paint(0)
        return
      }

      const going = { p: 0 }
      const coming = { p: 0 }
      const update = () => paint(going.p - coming.p)
      update()

      const tweens = [
        gsap.to(going, {
          p: 1,
          ease: 'none',
          onUpdate: update,
          // The marker sits at the top of the heading block, and the
          // question itself hangs about 17vh below it, so ending at 18%
          // puts the heading roughly a third down the screen when the swap
          // completes — and the heading pins a moment later, at 0.
          scrollTrigger: {
            trigger: inEl,
            start: 'top bottom',
            end: 'top 18%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }),
      ]

      if (outEl) {
        tweens.push(
          gsap.to(coming, {
            p: 1,
            ease: 'none',
            onUpdate: update,
            // Starts a screen earlier than the swap in, and finishes as the
            // line arrives rather than once it has travelled up: its own
            // colours are fixed slate and sky, which would be unreadable if
            // it crossed the screen while the page was still navy.
            scrollTrigger: {
              trigger: outEl,
              start: 'top 165%',
              end: 'top 72%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }),
        )
      }

      return () => {
        for (const tween of tweens) {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      }
    },
    { scope: ref, dependencies: [reducedMotion] },
  )

  return (
    <div
      ref={ref}
      data-invert-zone
      className="relative"
      style={{ backgroundColor: '#F7F4EE', ['--zone-bg' as string]: '#F7F4EE' }}
    >
      {children}
    </div>
  )
}
