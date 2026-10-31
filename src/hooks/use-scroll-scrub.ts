import { useRef, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Options {
  start?: string
  end?: string
  /** Seconds of easing behind the scroll. */
  scrub?: number | boolean
}

/**
 * Runs `onUpdate` with a 0-1 progress as an element scrolls through a range.
 *
 * Everything scroll-linked on this site goes through here rather than through
 * framer-motion's `useScroll`. Lenis smooths the scroll and ScrollTrigger is
 * explicitly told about it (see smooth-scroll.tsx), but `useScroll` listens to
 * native scroll events, which Lenis changes the timing of — so effects built
 * on it fire late, partially, or not at all.
 *
 * `onUpdate` is called once with the settled value under reduced motion, and
 * once at 0 on setup otherwise, so the element is never left mid-state.
 */
export function useScrollScrub(
  ref: RefObject<HTMLElement | null>,
  onUpdate: (progress: number) => void,
  { start = 'top bottom', end = 'bottom top', scrub = 1 }: Options = {},
) {
  const reducedMotion = useReducedMotion()
  const callback = useRef(onUpdate)
  callback.current = onUpdate

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      if (reducedMotion) {
        callback.current(1)
        return
      }

      callback.current(0)

      const proxy = { p: 0 }
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => callback.current(proxy.p),
        scrollTrigger: { trigger: el, start, end, scrub, invalidateOnRefresh: true },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { dependencies: [reducedMotion, start, end, scrub] },
  )
}
