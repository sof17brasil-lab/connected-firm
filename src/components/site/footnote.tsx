import { Link } from 'react-router-dom'
import { SOURCE_BY_ID, sourceYearLabel } from '@/lib/sources'
import { cn } from '@/lib/utils'

/**
 * Footnote markers, e.g. [3][4], linking to the matching Sources entry.
 * The title carries the publisher and year so the source is available on hover
 * without leaving the page.
 */
export function Footnote({
  ids,
  className,
  tone = 'light',
}: {
  ids: number[]
  className?: string
  tone?: 'light' | 'dark'
}) {
  return (
    <span className={cn('whitespace-nowrap', className)}>
      {ids.map((id) => {
        const source = SOURCE_BY_ID.get(id)
        return (
          <Link
            key={id}
            to={`/sources#s${id}`}
            title={source ? `${source.publisher}, ${sourceYearLabel(source)}` : undefined}
            className={cn(
              'align-super text-[0.68em] font-semibold underline-offset-2 hover:underline',
              tone === 'light' ? 'text-sky-deep' : 'text-sky',
            )}
          >
            [{id}]
          </Link>
        )
      })}
    </span>
  )
}

/** "My estimate" / "Illustrative" tag, sitting next to the figure it qualifies. */
export function EstimateTag({
  kind,
  tone = 'light',
  className,
}: {
  kind: 'estimate' | 'illustrative'
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <span
      className={cn(
        'eyebrow inline-block rounded-sm border px-1.5 py-0.5 text-[10px]',
        tone === 'light'
          ? 'border-stone text-muted-ink'
          : 'border-ivory/30 text-ivory/70',
        className,
      )}
    >
      {kind === 'estimate' ? 'My estimate' : 'Illustrative'}
    </span>
  )
}
