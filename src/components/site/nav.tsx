import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SECTIONS } from '@/lib/sections'
import { scrollToSection } from '@/hooks/use-active-section'
import { EASE } from '@/components/site/reveal'
import { CONTACT_EMAIL } from '@/lib/data'
import { cn } from '@/lib/utils'

/** The wordmark plus three colour bars, echoing the loader. */
function Mark() {
  return (
    <Link to="/" className="flex flex-col items-center gap-1.5" aria-label="The Connected Firm, home">
      <span className="font-display text-xl leading-none text-navy">TCF</span>
      <span className="flex gap-1">
        <span className="block h-[3px] w-3 bg-navy" />
        <span className="block h-[3px] w-3 bg-sky" />
        <span className="block h-[3px] w-3 bg-stone" />
      </span>
    </Link>
  )
}

/** Right-hand panel over a blurred page, with numbered rows. */
function MenuPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis()
  const { pathname } = useLocation()

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const go = (id: string) => () => {
    onClose()
    if (pathname === '/') scrollToSection(id, lenis)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-navy/20 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-3 top-3 z-50 flex max-h-[calc(100vh-1.5rem)] w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-sm bg-ivory shadow-xl"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-stone px-6 py-5">
              <p className="eyebrow text-muted-ink">Menu</p>
              <button type="button" onClick={onClose} aria-label="Close menu" className="text-navy">
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            <ul>
              {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
                <li key={section.id} className="border-b border-stone/70">
                  <button
                    type="button"
                    onClick={go(section.id)}
                    className="flex w-full gap-5 px-6 py-5 text-left transition-colors hover:bg-stone/30"
                  >
                    <span className="tabular mt-1 text-caption text-sky-deep">{section.number}</span>
                    <span>
                      <span className="block font-display text-xl leading-tight text-navy">
                        {section.label}
                      </span>
                      <span className="mt-1 block text-caption text-muted-ink">
                        {section.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 px-6 py-6">
              <Link to="/sources" onClick={onClose} className="eyebrow text-muted-ink hover:text-navy">
                Sources
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="eyebrow text-muted-ink hover:text-navy">
                {CONTACT_EMAIL}
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Fixed chrome: the mark centred at the top, and a round menu button on the
 * right that grows a "Menu" label once the page has been scrolled.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-[1400px] items-start justify-between px-6 py-5 md:px-10">
          <div className="w-24" />
          <div className="pointer-events-auto">
            <Mark />
          </div>

          <div className="flex w-24 justify-end">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-label="Open menu"
              className="pointer-events-auto flex items-center gap-3"
            >
              <span
                className={cn(
                  'eyebrow hidden text-navy transition-opacity duration-500 md:inline',
                  scrolled ? 'opacity-100' : 'opacity-0',
                )}
              >
                Menu
              </span>
              <span className="flex size-11 items-center justify-center rounded-full bg-ivory/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-ivory">
                <span className="flex flex-col gap-[3px]">
                  <span className="block h-px w-4 bg-navy" />
                  <span className="block h-px w-4 bg-navy" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <MenuPanel open={open} onClose={() => setOpen(false)} />
    </>
  )
}
