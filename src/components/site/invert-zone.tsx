import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'

const IVORY = [247, 244, 238] as const
const NAVY = [14, 30, 58] as const

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
 * eases from navy to ivory, both scrubbed to scroll over about a screen, and
 * back again at the end. The whole document background is painted, not a
 * panel, so the swap reaches the edges of the window.
 */
export function InvertZone({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const last = useRef(-1)

  useScrollScrub(
    ref,
    (p) => {
      const el = ref.current
      if (!el) return

      const height = el.offsetHeight
      const vh = window.innerHeight || 1
      // One screen of scroll to go in, one to come back out.
      const inRatio = Math.min(vh / Math.max(height, 1), 0.45)
      const t =
        p < inRatio
          ? p / inRatio
          : p > 1 - inRatio
            ? (1 - p) / inRatio
            : 1
      const eased = Math.min(Math.max(t, 0), 1)

      el.style.setProperty('--invert', String(eased))
      el.style.backgroundColor = mix(IVORY, NAVY, eased)
      el.style.color = mix(NAVY, IVORY, eased)

      if (Math.abs(eased - last.current) > 0.01) {
        last.current = eased
        window.dispatchEvent(new CustomEvent('tcf:invert', { detail: eased }))
      }
    },
    { start: 'top bottom', end: 'bottom top', scrub: 0.8 },
  )

  return (
    <div ref={ref} data-invert-zone className="relative" style={{ backgroundColor: '#F7F4EE' }}>
      {children}
    </div>
  )
}
