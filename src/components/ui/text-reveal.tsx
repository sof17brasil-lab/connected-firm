'use client'

import { type FC, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'

interface TextRevealByWordProps {
  text: string
  className?: string
}

/**
 * Lights a sentence up word by word as it scrolls through a pinned frame.
 *
 * Driven by ScrollTrigger rather than framer-motion's `useScroll`, which does
 * not see Lenis's smoothed scrolling. Words sit at 15% until their turn and
 * never below it, so the sentence is legible the whole way through.
 */
const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const reducedMotion = useReducedMotion()
  const words = text.split(' ')

  useScrollScrub(
    targetRef,
    (p) => {
      const nodes = wordsRef.current
      nodes.forEach((node, i) => {
        if (!node) return
        const start = i / nodes.length
        const end = start + 1 / nodes.length
        const local = Math.min(Math.max((p - start) / (end - start), 0), 1)
        node.style.opacity = String(0.15 + 0.85 * local)
      })
    },
    { start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  )

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
    <div ref={targetRef} className={cn('relative z-0 h-[220vh]', className)}>
      <div className="sticky top-0 flex h-screen items-center">
        <p className="mx-auto flex max-w-4xl flex-wrap px-6 font-display text-3xl leading-[1.25] text-navy md:text-4xl lg:text-5xl">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              ref={(node) => {
                if (node) wordsRef.current[i] = node
              }}
              className="mr-[0.25em] mt-[0.1em]"
              style={{ opacity: 0.15 }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

export { TextRevealByWord }
