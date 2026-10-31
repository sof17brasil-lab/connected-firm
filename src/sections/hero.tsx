import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Collage } from '@/components/site/collage'
import { DISCLAIMER } from '@/components/site/disclaimer'
import { buildCollage } from '@/lib/collage'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

const PIECES = buildCollage(7, 'right')

/**
 * The headline fills the screen: four lines of uppercase display serif with
 * one word in italic. As it scrolls away it fades and drifts rather than
 * simply leaving, which is what makes the next section feel like a turn of
 * the page.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.25])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  return (
    <section ref={ref} id="hero" className="relative isolate min-h-[92vh] overflow-hidden">
      <Collage pieces={PIECES} />

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1400px] flex-col justify-center px-6 pb-20 pt-32 md:px-10">
        <motion.div style={reducedMotion ? undefined : { opacity, y }}>
          <h1 className="text-center font-display uppercase leading-[0.84] tracking-[-0.02em] text-navy">
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">The</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)] italic">Connected</span>
            <span className="block text-[clamp(3.5rem,13vw,12rem)]">Firm</span>
          </h1>
        </motion.div>

        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="max-w-xl text-lg text-slate md:text-xl">
            An events strategy for White &amp; Case&apos;s New York office
          </p>
          <p className="eyebrow text-muted-ink">
            Independent proposal by Sofia Mota · October 2026
          </p>
        </div>
      </div>

      {/* Thin scroll cue: a hairline with a dot at each end. */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center md:flex"
      >
        <span className="size-1 rounded-full bg-navy/50" />
        <motion.span
          className="my-1 block w-px bg-navy/25"
          initial={{ height: 0 }}
          animate={{ height: 96 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <span className="size-1 rounded-full bg-navy/50" />
      </div>

      <p className="relative mx-auto max-w-[1400px] px-6 pb-10 text-center text-caption text-muted-ink md:px-10">
        {DISCLAIMER}
      </p>
    </section>
  )
}
