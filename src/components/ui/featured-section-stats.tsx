'use client'

import { CountUp } from '@/components/site/count-up'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import type { StatTile } from '@/lib/data'
import { cn } from '@/lib/utils'

interface FeaturedSectionStatsProps {
  heading: string
  subheading?: string
  stats: StatTile[]
  /** The chart that sits under the stat row. */
  chart?: React.ReactNode
  chartCaption?: React.ReactNode
  className?: string
}

/**
 * Headline, a row of stat tiles and a chart beneath.
 *
 * Rewritten from the demo to take props: the hard-coded copy, the blue palette,
 * the dark-mode classes and the demo area chart are all gone. Tiles are divided
 * by hairlines rather than boxed in cards.
 */
export default function FeaturedSectionStats({
  heading,
  subheading,
  stats,
  chart,
  chartCaption,
  className,
}: FeaturedSectionStatsProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">{heading}</h2>
        </Reveal>
        {subheading && (
          <Reveal delay={0.08}>
            <p className="measure self-end text-lg text-slate">{subheading}</p>
          </Reveal>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-px border-t border-stone bg-stone sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.07} className="bg-ivory">
            <div className="flex h-full flex-col px-0 py-8 sm:px-6 sm:first:pl-0">
              <p className="font-display text-[clamp(2.25rem,3.4vw,3.25rem)] leading-none text-navy">
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
              <p className="mt-4 text-base font-medium text-slate">
                {stat.label}
                <Footnote ids={stat.sources} className="ml-1" />
              </p>
              {stat.note && (
                <p className="text-caption mt-2 text-muted-ink">{stat.note}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {chart && (
        <Reveal className="mt-20">
          <div>
            {chart}
            {chartCaption && (
              <div className="text-caption mt-4 text-muted-ink">{chartCaption}</div>
            )}
          </div>
        </Reveal>
      )}
    </div>
  )
}
