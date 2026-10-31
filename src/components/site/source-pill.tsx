import { Link } from 'react-router-dom'
import { SOURCE_BY_ID, sourceYearLabel } from '@/lib/sources'
import { cn } from '@/lib/utils'

/**
 * A capsule set into a sentence, naming the source: "Our figures come from
 * [AM LAW 100] ...". It links to the Sources entry, so an attribution that
 * reads as design is still a working citation.
 */
export function SourcePill({
  id,
  label,
  tone = 'light',
}: {
  id: number
  label?: string
  tone?: 'light' | 'dark'
}) {
  const source = SOURCE_BY_ID.get(id)
  const text = label ?? source?.publisher ?? `Source ${id}`

  return (
    <Link
      to={`/sources#s${id}`}
      title={source ? `${source.publisher}, ${sourceYearLabel(source)}` : undefined}
      className={cn(
        'eyebrow mx-1 inline-flex -translate-y-[0.1em] items-center rounded-full px-3 py-1.5 align-middle text-[11px] transition-colors',
        tone === 'light'
          ? 'bg-navy text-ivory hover:bg-midnight'
          : 'bg-ivory text-navy hover:bg-sky',
      )}
    >
      {text}
    </Link>
  )
}
