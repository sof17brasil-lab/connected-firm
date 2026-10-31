import { useEffect, useRef, useState } from 'react'
import { SECTIONS, TONE_HEX, type Tone } from '@/lib/sections'

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const
}

function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const bl = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

/**
 * One fixed background pane for the whole page, easing between section tones.
 *
 * Sections themselves are transparent. The colour blends across the last
 * stretch of a section so that by the time the next one's text arrives the
 * background has already settled and contrast is correct.
 */
export function PageBackground({ fallback = 'ivory' as Tone }) {
  const [color, setColor] = useState(TONE_HEX[fallback])
  const frame = useRef(0)

  useEffect(() => {
    const update = () => {
      frame.current = 0

      const marks = SECTIONS.map((section) => {
        const el = document.getElementById(section.id)
        if (!el) return null
        const rect = el.getBoundingClientRect()
        return { tone: section.tone, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY }
      }).filter(Boolean) as Array<{ tone: Tone; top: number; bottom: number }>

      if (marks.length === 0) return

      // Judge by the middle of the viewport, not its top edge.
      const probe = window.scrollY + window.innerHeight * 0.5

      let current = marks[0]
      let next = marks[0]
      for (let i = 0; i < marks.length; i++) {
        if (probe >= marks[i].top) {
          current = marks[i]
          next = marks[i + 1] ?? marks[i]
        }
      }

      // Blend across the final 30% of the current section.
      const span = Math.max(current.bottom - current.top, 1)
      const blendStart = current.bottom - span * 0.3
      const t =
        next === current || probe < blendStart
          ? 0
          : Math.min((probe - blendStart) / (current.bottom - blendStart || 1), 1)

      setColor(mix(TONE_HEX[current.tone], TONE_HEX[next.tone], t))
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: color, transition: 'background-color 120ms linear' }}
    />
  )
}
