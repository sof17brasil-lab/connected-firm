import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { EASE } from '@/components/site/reveal'
import { GLASSDOOR_BARS, GLASSDOOR_SCALE_MAX } from '@/lib/data'
import { cn } from '@/lib/utils'

/**
 * Glassdoor category ratings as hairline-ruled bars, filling when scrolled to.
 * Hand-drawn rather than a chart library: five values read better as a list
 * with the number set large.
 */
export function GlassdoorBars({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLUListElement>()
  const dark = tone === 'dark'
  const grown = reducedMotion || inView

  return (
    <ul ref={ref} className="w-full">
      {GLASSDOOR_BARS.map((bar, i) => {
        const pct = (bar.value / GLASSDOOR_SCALE_MAX) * 100

        return (
          <li
            key={bar.label}
            className={cn(
              'border-t py-5 last:border-b',
              dark ? 'border-ivory/15' : 'border-stone',
            )}
          >
            <div className="flex items-baseline justify-between gap-6">
              <p className={cn('font-sans text-base md:text-lg', dark ? 'text-ivory/85' : 'text-slate')}>
                {bar.label}
              </p>
              <p className={cn('tabular font-display text-3xl md:text-4xl', dark ? 'text-ivory' : 'text-navy')}>
                {bar.value.toFixed(1)}
              </p>
            </div>

            <div className={cn('mt-3 h-[6px] w-full', dark ? 'bg-ivory/10' : 'bg-stone/60')}>
              <motion.div
                className="h-full bg-sky"
                initial={reducedMotion ? false : { width: 0 }}
                animate={{ width: grown ? `${pct}%` : 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: reducedMotion ? 0 : i * 0.09 }}
              />
            </div>

            {bar.note && (
              <p className={cn('text-caption mt-2', dark ? 'text-ivory/55' : 'text-muted-ink')}>
                {bar.note}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
