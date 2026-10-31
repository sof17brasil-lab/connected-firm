'use client'

import { type FC, type ReactNode, useRef } from 'react'
import { motion, type MotionValue, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface TextRevealByWordProps {
  text: string
  className?: string
}

/**
 * Lights a sentence up word by word as it scrolls through a sticky frame.
 *
 * Two fixes to the original: `targetRef` was attached to both the wrapper and
 * the <p>, so the scroll range was measured against the wrong element; it is on
 * the wrapper only. The faded words were also a separate absolutely-positioned
 * copy at 30% — now one layer of navy at 15%, which is what the design calls for.
 */
const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: targetRef })
  const words = text.split(' ')

  // Reduced motion: the whole sentence, legible, no scroll dependency.
  if (reducedMotion) {
    return (
      <div className={cn('mx-auto max-w-4xl px-6 py-24', className)}>
        <p className="font-display text-3xl leading-[1.25] text-navy md:text-4xl lg:text-5xl">
          {text}
        </p>
      </div>
    )
  }

  return (
    <div ref={targetRef} className={cn('relative z-0 h-[180vh]', className)}>
      <div className="sticky top-0 flex h-screen items-center">
        <p className="mx-auto flex max-w-4xl flex-wrap px-6 font-display text-3xl leading-[1.25] md:text-4xl lg:text-5xl">
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            return (
              <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            )
          })}
        </p>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <span className="relative mr-[0.25em] mt-[0.1em]">
      <motion.span style={{ opacity }} className="text-navy">
        {children}
      </motion.span>
    </span>
  )
}

export { TextRevealByWord }
