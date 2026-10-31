import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has been meaningfully on screen, and true forever after.
 *
 * A timer forces it true after `fallbackMs` so that anything gated on it still
 * appears if IntersectionObserver never fires — nothing on this site is allowed
 * to stay hidden waiting for an animation.
 */
export function useInViewOnce<T extends HTMLElement>(
  { rootMargin = '-12% 0px -12% 0px', fallbackMs = 2500 } = {},
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return

    const el = ref.current
    const fallback = window.setTimeout(() => setInView(true), fallbackMs)

    if (!el || typeof IntersectionObserver === 'undefined') {
      return () => window.clearTimeout(fallback)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
          window.clearTimeout(fallback)
        }
      },
      { rootMargin },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [inView, rootMargin, fallbackMs])

  return { ref, inView }
}
