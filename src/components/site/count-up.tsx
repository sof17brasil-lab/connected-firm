import { useEffect, useState } from 'react'
import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { EASE } from '@/components/site/reveal'

interface CountUpProps {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  /** Shown instead of the animation under reduced motion, and as the end state. */
  display?: string
  className?: string
  durationMs?: number
}

function easeOut(t: number) {
  // Matches the CSS easing used elsewhere closely enough to feel like one system.
  const [, , , p4] = EASE
  return 1 - Math.pow(1 - t, 3 * p4)
}

function format(value: number, decimals: number) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Counts a number up when it first becomes visible.
 *
 * The final value is what renders at rest, so the number is correct even if the
 * animation never runs.
 */
export function CountUp({
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  display,
  className,
  durationMs = 1200,
}: CountUpProps) {
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLSpanElement>()
  const [value, setValue] = useState(to)

  useEffect(() => {
    if (reducedMotion || !inView) {
      setValue(to)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      setValue(to * easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, to, durationMs])

  const finished = value === to
  const text = finished && display ? display : `${prefix}${format(value, decimals)}${suffix}`

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
