import { useEffect, useRef, useState } from 'react'

/**
 * Thin sky reading-progress bar pinned to the top of the viewport.
 *
 * Read straight off the document rather than through framer-motion's
 * `useScroll`, which does not see Lenis's smoothed scrolling. Decorative:
 * screen readers skip it.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const update = () => {
      frame.current = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0)
    }
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-sky"
      style={{ transform: `scaleX(${progress})` }}
    />
  )
}
