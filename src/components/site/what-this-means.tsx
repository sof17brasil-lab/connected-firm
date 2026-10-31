import { useRef } from 'react'
import { Reveal } from '@/components/site/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'
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
  const keyRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const dark = tone === 'dark'

  const [before, key = '', after = ''] = children.split(/\*([^*]+)\*/g)
  const base = dark ? '#F7F4EE' : '#0E1E3A'

  useScrollScrub(
    ref,
    (p) => {
      if (!keyRef.current) return
      keyRef.current.style.color = p > 0.5 ? '#8DB4E2' : base
    },
    { start: 'top 85%', end: 'bottom 55%', scrub: 0.8 },
  )

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
          <span ref={keyRef} style={{ color: reducedMotion ? '#8DB4E2' : base }}>
            {key}
          </span>
        )}
        {after}
      </p>
    </Reveal>
  )
}
