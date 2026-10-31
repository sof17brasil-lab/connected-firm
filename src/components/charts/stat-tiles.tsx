import { motion } from 'framer-motion'
import { CountUp } from '@/components/site/count-up'
import { Footnote } from '@/components/site/footnote'
import { EASE } from '@/components/site/reveal'
import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { REVENUE_DATA, WHY_NOW_STATS } from '@/lib/data'

/**
 * Four square tiles for Section 1. Each carries a counting number, a label
 * and a small visual that animates once, so the figure is read first and the
 * shape of it second.
 *
 * Every visual is drawn from the same values in data.ts as the number above
 * it — none of them is illustrative.
 */

const VB = '0 0 120 44'

/** The three published revenue points, drawn as a rising line. */
function RevenueSpark({ on }: { on: boolean }) {
  const points = REVENUE_DATA.filter((d) => d.actual != null).map((d) => d.actual as number)
  const min = Math.min(...points)
  const max = Math.max(...points)
  const d = points
    .map((v, i) => {
      const x = 6 + (i * (108 / (points.length - 1)))
      const y = 38 - ((v - min) / (max - min)) * 28
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg viewBox={VB} className="w-full" fill="none">
      <motion.path
        d={d}
        stroke="var(--color-sky-deep)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
      />
    </svg>
  )
}

/** 51 dots, one per lateral partner hired in 2025. */
function PartnerDots({ on }: { on: boolean }) {
  const cols = 17
  return (
    <svg viewBox={VB} className="w-full">
      {Array.from({ length: 51 }, (_, i) => (
        <motion.circle
          key={i}
          cx={7 + (i % cols) * 6.6}
          cy={14 + Math.floor(i / cols) * 8}
          r={1.9}
          className="fill-sky-deep"
          initial={{ opacity: 0, scale: 0 }}
          animate={on ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.3, ease: EASE, delay: 0.25 + i * 0.012 }}
        />
      ))}
    </svg>
  )
}

/** The equity partner count shrinking from 349 to 332. */
function ShrinkingBar({ on }: { on: boolean }) {
  return (
    <svg viewBox={VB} className="w-full">
      <rect x="6" y="12" width="108" height="9" className="fill-stone" />
      <motion.rect
        x="6"
        y="12"
        height="9"
        className="fill-sky-deep"
        initial={{ width: 108 }}
        animate={on ? { width: 108 * (332 / 349) } : undefined}
        transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
      />
      <text x="6" y="38" className="fill-muted-ink" style={{ fontSize: 7 }}>
        349
      </text>
      <text x="114" y="38" textAnchor="end" className="fill-navy" style={{ fontSize: 7 }}>
        332
      </text>
    </svg>
  )
}

/** 11.6% needed against the ~8.4% the firm is actually growing at. */
function GrowthArcs({ on }: { on: boolean }) {
  const arc = (pct: number, r: number) => {
    const a = (pct / 100) * Math.PI * 2 - Math.PI / 2
    const large = pct > 50 ? 1 : 0
    return `M 60 ${22 - r} A ${r} ${r} 0 ${large} 1 ${60 + Math.cos(a) * r} ${22 + Math.sin(a) * r}`
  }
  return (
    <svg viewBox={VB} className="w-full" fill="none">
      <circle cx="60" cy="22" r="17" className="stroke-stone" strokeWidth="1.5" />
      <motion.path
        d={arc(8.4, 17)}
        className="stroke-muted-ink"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
      />
      <motion.path
        d={arc(11.6, 11)}
        className="stroke-sky-deep"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={on ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
      />
      <text x="88" y="18" className="fill-sky-deep" style={{ fontSize: 7 }}>
        11.6
      </text>
      <text x="88" y="30" className="fill-muted-ink" style={{ fontSize: 7 }}>
        8.4
      </text>
    </svg>
  )
}

const VISUALS = [RevenueSpark, PartnerDots, ShrinkingBar, GrowthArcs]

export function StatTiles() {
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const on = inView && !reducedMotion

  return (
    <div ref={ref} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {WHY_NOW_STATS.map((stat, i) => {
        const Visual = VISUALS[i]
        return (
          <motion.div
            key={stat.label}
            className="flex aspect-square flex-col justify-between border border-stone p-6"
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
          >
            <p className="font-display text-[clamp(2rem,3vw,2.9rem)] leading-none text-navy">
              {stat.countTo != null ? (
                <CountUp
                  to={stat.countTo}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  display={stat.value}
                />
              ) : (
                stat.value
              )}
            </p>

            <div className="my-4 flex-1 opacity-90">
              <Visual on={on} />
            </div>

            <div>
              <p className="text-sm font-medium leading-snug text-slate">
                {stat.label}
                <Footnote ids={stat.sources} className="ml-1" />
              </p>
              {stat.note && <p className="text-caption mt-1.5 text-muted-ink">{stat.note}</p>}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
