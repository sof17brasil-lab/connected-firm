import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { Menu, X } from 'lucide-react'
import { NAV_SECTIONS } from '@/lib/nav'
import { cn } from '@/lib/utils'

/**
 * Sticky top navigation. Transparent over the hero, midnight once scrolled.
 *
 * Section links scroll through Lenis so the easing matches the rest of the
 * page; when Lenis is off (reduced motion) it falls back to a plain jump.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lenis = useLenis()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (id: string) => (event: React.MouseEvent) => {
    if (!onHome) return // let the router navigate home first
    event.preventDefault()
    setMenuOpen(false)
    const target = document.getElementById(id)
    if (!target) return
    if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 })
    else target.scrollIntoView()
  }

  const solid = scrolled || menuOpen || !onHome

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        solid ? 'bg-midnight/95 backdrop-blur-sm' : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 px-6 md:h-18 md:px-10"
      >
        <Link
          to="/"
          className="font-display text-xl text-ivory transition-opacity hover:opacity-80"
        >
          The Connected Firm
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`/#${section.id}`}
                onClick={goTo(section.id)}
                className="eyebrow text-ivory/70 transition-colors hover:text-ivory"
              >
                <span className="text-sky">{section.number}</span> {section.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/sources"
              className="eyebrow text-ivory/70 transition-colors hover:text-ivory"
            >
              Sources
            </Link>
          </li>
        </ul>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
          className="text-ivory lg:hidden"
        >
          {menuOpen ? <X className="size-5" strokeWidth={1.25} /> : <Menu className="size-5" strokeWidth={1.25} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-ivory/10 bg-midnight px-6 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {NAV_SECTIONS.map((section) => (
              <li key={section.id} className="border-b border-ivory/10">
                <a
                  href={`/#${section.id}`}
                  onClick={goTo(section.id)}
                  className="eyebrow block py-4 text-ivory/80"
                >
                  <span className="text-sky">{section.number}</span> {section.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/sources"
                onClick={() => setMenuOpen(false)}
                className="eyebrow block py-4 text-ivory/80"
              >
                Sources
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
