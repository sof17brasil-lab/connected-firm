import { useEffect, useState } from 'react'
import { SECTIONS } from '@/lib/sections'

/** The id of the section currently crossing the middle of the viewport. */
export function useActiveSection(): string {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const probe = window.scrollY + window.innerHeight * 0.45
      let current = SECTIONS[0].id
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (el && probe >= el.offsetTop) current = section.id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return active
}

/** Scrolls to a section through Lenis when it is running, else jumps. */
export function scrollToSection(
  id: string,
  lenis?: { scrollTo: (t: HTMLElement, o?: Record<string, unknown>) => void } | null,
) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) lenis.scrollTo(target, { offset: -8, duration: 1.6 })
  else target.scrollIntoView()
}
