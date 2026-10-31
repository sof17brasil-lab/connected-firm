import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

/**
 * Holds a chart's height from first paint and only mounts the chart once it is
 * on screen, which is what makes Recharts draw itself in. The fixed height
 * means nothing on the page shifts when it arrives.
 */
export function ChartFrame({
  height,
  className,
  children,
}: {
  height: number
  className?: string
  children: (animate: boolean) => React.ReactNode
}) {
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const show = inView || reducedMotion

  return (
    <div ref={ref} className={cn('w-full', className)} style={{ height }}>
      {show ? children(!reducedMotion) : null}
    </div>
  )
}

/** Shared Recharts styling so every chart on the site reads as one system. */
export const AXIS_STYLE = {
  stroke: '#6A6F7A',
  fontSize: 12,
  fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
} as const

export const GRID_STROKE = '#E6E1D6'

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string; dataKey?: string }>
  label?: string | number
  formatter: (value: number, key: string) => string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-sm border border-stone bg-ivory px-3 py-2 shadow-sm">
      <p className="eyebrow text-muted-ink">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {payload
          .filter((row) => row.value != null)
          .map((row) => (
            <li key={row.dataKey} className="tabular text-sm text-navy">
              <span className="text-muted-ink">{row.name}: </span>
              {formatter(row.value as number, row.dataKey ?? '')}
            </li>
          ))}
      </ul>
    </div>
  )
}
