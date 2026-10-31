import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * The closing line of each section, and the one place the page raises its
 * voice: words lift in as you scroll, then the phrase the section turns on
 * shifts to sky, thickens, and takes a highlight sweeping in beneath it.
 *
 * Mark the key phrase with asterisks: "...runs on *relationships*."
 */

function Word({
  children,
  progress,
  range,
  dark,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  dark: boolean
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className={dark ? 'text-ivory' : 'text-navy'}>
      {children}{' '}
    </motion.span>
  )
}

export function WhatThisMeans({
  children,
  tone = 'light',
  className,
}: {
  /** The sentence, with the key phrase wrapped in asterisks. */
  children: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()
  const dark = tone === 'dark'

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.45'],
  })

  // Words occupy the first 70% of the range; the key phrase lands after.
  const keyProgress = useTransform(scrollYProgress, [0.68, 1], [0, 1])

  const [before, key = '', after = ''] = children.split(/\*([^*]+)\*/g)
  const beforeWords = before.trim().split(/\s+/).filter(Boolean)
  const afterWords = after.trim().split(/\s+/).filter(Boolean)
  const total = beforeWords.length + afterWords.length + 1

  // Hooks run unconditionally; reduced motion picks the settled value after.
  const keyColor = useTransform(
    keyProgress,
    [0, 1],
    [dark ? '#F7F4EE' : '#0E1E3A', dark ? '#8DB4E2' : '#3D6CA6'],
  )

  const Key = (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span
        className="relative z-10 font-semibold"
        style={reducedMotion ? { color: dark ? '#8DB4E2' : '#3D6CA6' } : { color: keyColor }}
      >
        {key}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.34em] origin-left bg-sky/45"
        style={reducedMotion ? { scaleX: 1 } : { scaleX: keyProgress }}
      />
    </span>
  )

  return (
    <p
      ref={ref}
      className={cn(
        'measure font-display text-[clamp(1.6rem,2.8vw,2.5rem)] italic leading-snug',
        className,
      )}
    >
      <span className={cn('not-italic', dark ? 'text-ivory/55' : 'text-muted-ink')}>
        What this means:{' '}
      </span>
      {beforeWords.map((word, i) => (
        <Word
          key={`b${i}`}
          progress={scrollYProgress}
          range={[i / total, Math.min((i + 1.5) / total, 1)]}
          dark={dark}
        >
          {word}
        </Word>
      ))}
      {Key}
      {afterWords.length > 0 && ' '}
      {afterWords.map((word, i) => {
        const idx = beforeWords.length + 1 + i
        return (
          <Word
            key={`a${i}`}
            progress={scrollYProgress}
            range={[idx / total, Math.min((idx + 1.5) / total, 1)]}
            dark={dark}
          >
            {word}
          </Word>
        )
      })}
    </p>
  )
}
