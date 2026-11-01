'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires Lenis and GSAP together. Rendered inside <ReactLenis> so that
 * `useLenis` reads the instance from context — a forwarded ref is not
 * guaranteed to be populated when the parent's effect first runs, and if the
 * wiring is missed Lenis swallows the wheel without ever scrolling.
 */
function LenisGsapSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    /*
     * ScrollTrigger is driven from Lenis, and also straight from the window.
     *
     * Lenis alone is not enough: if its scroll event stops reaching us for
     * any reason, every scrubbed effect on the site silently freezes while
     * the page still scrolls, which is almost impossible to spot from the
     * code. The native listener is the floor under that — updating twice in
     * a frame is harmless, ScrollTrigger coalesces it.
     */
    lenis.on('scroll', ScrollTrigger.update)
    const onNativeScroll = () => ScrollTrigger.update()
    window.addEventListener('scroll', onNativeScroll, { passive: true })

    // gsap.ticker drives Lenis: `time` is in seconds, Lenis wants milliseconds.
    const advance = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(advance)

    // Don't let GSAP compensate for dropped frames; it fights scrub smoothing.
    gsap.ticker.lagSmoothing(0)

    /*
     * Triggers are created as each section mounts, but the pinned sections
     * change the page height afterwards, which leaves every later trigger
     * measuring against a page that no longer exists. Refresh once everything
     * has mounted, again on load, and again once the fonts have settled —
     * each of those changes the layout.
     */
    const refresh = () => ScrollTrigger.refresh()
    const afterMount = window.setTimeout(refresh, 0)
    const afterSettle = window.setTimeout(refresh, 400)
    window.addEventListener('load', refresh)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(refresh)

    return () => {
      window.clearTimeout(afterMount)
      window.clearTimeout(afterSettle)
      window.removeEventListener('load', refresh)
      window.removeEventListener('scroll', onNativeScroll)
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(advance)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [lenis])

  return null
}

/**
 * Lenis smooth scrolling for the whole app.
 *
 * With `prefers-reduced-motion: reduce` Lenis is skipped entirely and the
 * browser's own scrolling is used.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        // autoRaf off because gsap.ticker calls lenis.raf in LenisGsapSync.
        autoRaf: false,
        duration: 1.1,
        smoothWheel: true,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
