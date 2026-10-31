import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '@/components/site/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const BARS = ['bg-navy', 'bg-sky', 'bg-stone']

/**
 * Opening screen: the wordmark, three colour bars and a slow ring, fading out
 * once the fonts are in. It never blocks the page — the site is already
 * rendered underneath and the loader is purely an overlay, so a stalled font
 * load cannot leave the visitor looking at nothing.
 */
export function Loader() {
  const reducedMotion = useReducedMotion()
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    const finish = () => {
      if (!cancelled) setDone(true)
    }

    // Wait for fonts, but never longer than 2s.
    const timer = window.setTimeout(finish, 2000)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    const ready = fonts?.ready ?? Promise.resolve()
    ready.then(() => window.setTimeout(finish, 650))

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  // With reduced motion there is nothing to cover up, so skip it entirely.
  if (reducedMotion) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center"
          >
            <p className="font-display text-[clamp(2rem,4vw,3rem)] tracking-tight text-navy">
              The Connected Firm
            </p>

            <div className="mt-5 flex gap-2">
              {BARS.map((bar, i) => (
                <motion.span
                  key={bar}
                  className={`block h-[3px] w-12 ${bar}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: 'left' }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.25 + i * 0.12 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Slow ring, low on the screen like the reference's. */}
          <motion.svg
            className="absolute bottom-[12vh] size-9"
            viewBox="0 0 40 40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' },
            }}
          >
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="var(--color-stone)"
              strokeWidth="2"
            />
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              stroke="var(--color-sky-deep)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="30 200"
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
