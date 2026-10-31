import { motion, useScroll } from 'framer-motion'

/**
 * Thin sky reading-progress bar pinned to the top of the viewport.
 *
 * Lenis scrolls the window, so framer-motion's `useScroll` tracks it without
 * any extra wiring. The bar is decorative: screen readers skip it.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-sky"
      style={{ scaleX: scrollYProgress }}
    />
  )
}
