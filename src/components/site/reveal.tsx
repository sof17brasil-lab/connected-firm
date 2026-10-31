import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

/** The one easing used site-wide: slow out, no overshoot, never a bounce. */
export const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Stagger position, for rows of tiles. */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'tr'
}

/**
 * Fades content up 16px as it enters the viewport, once.
 * Under reduced motion it renders a plain element with no animation at all.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  )
}
