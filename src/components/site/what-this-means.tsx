import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '@/components/site/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * The closing line of a section. Plain by default: it simply rises into view.
 *
 * One line on the site does more: mark a word with asterisks and that word
 * alone eases to sky as the line is scrolled through. No weight change, no
 * underline.
 */
export function WhatThisMeans({
  children,
  tone = 'light',
  className,
}: {
  children: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()
  const dark = tone === 'dark'

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.5'],
  })

  // Hooks cannot be conditional, so the colour is always computed.
  const keyColor = useTransform(
    scrollYProgress,
    [0.25, 0.85],
    [dark ? '#F7F4EE' : '#0E1E3A', '#8DB4E2'],
  )

  const [before, key = '', after = ''] = children.split(/\*([^*]+)\*/g)

  return (
    <Reveal className={className}>
      <p
        ref={ref}
        className={cn(
          'measure font-display text-[clamp(1.6rem,2.8vw,2.5rem)] italic leading-snug',
          dark ? 'text-ivory' : 'text-navy',
        )}
      >
        <span className={cn('not-italic', dark ? 'text-ivory/55' : 'text-muted-ink')}>
          What this means:{' '}
        </span>
        {before}
        {key && (
          <motion.span style={reducedMotion ? { color: '#8DB4E2' } : { color: keyColor }}>
            {key}
          </motion.span>
        )}
        {after}
      </p>
    </Reveal>
  )
}
