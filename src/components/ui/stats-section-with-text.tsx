import { MoveDownLeft, MoveUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'

export interface HeadlineStat {
  value: string
  caption: string
  /** Up where the number is a gain, down where it is a cost avoided. */
  direction?: 'up' | 'down'
  sources: number[]
  illustrative?: boolean
}

/**
 * Headline numbers with a badge and a short lead, rewritten from the demo to
 * take props. The demo's red "destructive" arrow is gone: nothing here is bad
 * news, so up is sky-deep and down is slate.
 */
export function StatsWithText({
  badge,
  heading,
  body,
  stats,
}: {
  badge: string
  heading: string
  body: string
  stats: HeadlineStat[]
}) {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <Reveal>
          <Badge>{badge}</Badge>
          <h3 className="mt-6 font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-tight text-navy">
            {heading}
          </h3>
          <p className="measure mt-5 text-slate">{body}</p>
        </Reveal>
      </div>

      <div className="grid gap-px bg-stone sm:grid-cols-2">
        {stats.map((stat, i) => {
          const Icon = stat.direction === 'down' ? MoveDownLeft : MoveUpRight
          return (
            <Reveal key={stat.caption} delay={i * 0.07} className="bg-ivory">
              <div className="flex h-full flex-col justify-between p-6">
                <Icon
                  className={cn(
                    'mb-8 size-4',
                    stat.direction === 'down' ? 'text-slate' : 'text-sky-deep',
                  )}
                  strokeWidth={1.5}
                />
                <p className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none text-navy">
                  {stat.value}
                </p>
                <p className="mt-4 text-sm text-slate">
                  {stat.caption}
                  <Footnote ids={stat.sources} className="ml-1" />
                </p>
                {stat.illustrative && <EstimateTag kind="illustrative" className="mt-3 self-start" />}
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}
