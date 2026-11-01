import { useLenis } from 'lenis/react'
import { SECTIONS } from '@/lib/sections'
import { scrollToSection, useActiveSection } from '@/hooks/use-active-section'
import { useInverted } from '@/components/site/invert-zone'
import { cn } from '@/lib/utils'

/**
 * Vertical dot navigation on the right edge. The active section's dot becomes
 * a short bar. Each dot is a real button with a label, so it works by keyboard
 * and reads correctly to a screen reader.
 */
export function DotNav() {
  const active = useActiveSection()
  const lenis = useLenis()
  const on = useInverted() > 0.5

  return (
    <nav
      aria-label="Sections"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block"
    >
      <ul
        className={cn(
          'flex flex-col items-center gap-3 rounded-full px-2.5 py-4 backdrop-blur-sm transition-colors',
          on ? 'bg-navy/70' : 'bg-ivory/80',
        )}
      >
        {SECTIONS.map((section) => {
          const current = section.id === active
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id, lenis)}
                aria-label={`${section.number} ${section.label}`}
                aria-current={current ? 'true' : undefined}
                className="group flex h-4 w-3 items-center justify-center"
              >
                <span
                  className={cn(
                    'block w-[3px] rounded-full transition-all duration-500',
                    current
                      ? on ? 'h-4 bg-ivory' : 'h-4 bg-navy'
                      : on
                        ? 'h-[3px] bg-ivory/35 group-hover:bg-ivory/60'
                        : 'h-[3px] bg-navy/25 group-hover:bg-navy/50',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
