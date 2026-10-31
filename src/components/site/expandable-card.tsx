import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { EASE } from '@/components/site/reveal'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * A row that opens to reveal its answer.
 *
 * A real <button> controlling a panel via aria-expanded and aria-controls, so
 * it works by keyboard and announces its state. The panel is unmounted when
 * closed rather than hidden, which keeps collapsed content out of the tab
 * order and out of find-in-page.
 */
export function ExpandableCard({
  title,
  label,
  children,
  tone = 'light',
}: {
  title: string
  label?: string
  children: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const dark = tone === 'dark'

  return (
    <div className={cn('border-t', dark ? 'border-ivory/15' : 'border-stone')}>
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full items-start justify-between gap-6 py-7 text-left"
        >
          <span className="flex-1">
            {label && (
              <span className={cn('eyebrow block', dark ? 'text-sky' : 'text-sky-deep')}>
                {label}
              </span>
            )}
            <span
              className={cn(
                'mt-2 block font-display text-[clamp(1.3rem,2vw,1.8rem)] leading-tight',
                dark ? 'text-ivory' : 'text-navy',
              )}
            >
              {title}
            </span>
          </span>

          <span
            className={cn(
              'mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
              dark
                ? 'border-ivory/25 text-ivory group-hover:bg-ivory/10'
                : 'border-stone text-navy group-hover:bg-stone/40',
            )}
          >
            <Plus
              className={cn('size-3.5 transition-transform duration-500', open && 'rotate-45')}
              strokeWidth={1.5}
            />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className={cn('measure pb-8 pr-14', dark ? 'text-ivory/75' : 'text-slate')}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
