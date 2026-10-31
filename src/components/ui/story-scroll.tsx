'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Incoming rotation, toned down from the original 30deg for a law-firm audience. */
const ROTATION_DEG = 8

export interface FlowSectionProps {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  'aria-label'?: string
}

/**
 * One full-screen chapter opener that rotates in as it is scrolled into view.
 *
 * The original FlowArt pinned every section and stacked them, which only works
 * for consecutive siblings in one container. These openers are spread across
 * the page with whole sections between them, so pinning would make content
 * scroll over a stuck panel. This keeps the rotate-in and drops the pinning.
 * It also renders a <section>, not a <main>: there is only one <main> per page.
 */
export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return

      const inner = sectionRef.current.querySelector<HTMLElement>('[data-flow-inner]')
      if (!inner) return

      gsap.set(inner, { rotation: ROTATION_DEG, transformOrigin: 'bottom left' })
      gsap.to(inner, {
        rotation: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top 25%',
          scrub: true,
        },
      })
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  )

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={cn('relative flex min-h-screen w-full overflow-hidden', className)}
      style={style}
    >
      <div
        data-flow-inner
        className="flex min-h-screen w-full flex-col justify-between gap-6 px-[6vw] pt-[clamp(4rem,10vw,7rem)] pb-[6vw] will-change-transform"
        style={{ transformOrigin: 'bottom left' }}
      >
        {children}
      </div>
    </section>
  )
}

export default FlowSection
