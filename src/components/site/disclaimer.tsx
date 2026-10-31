import { cn } from '@/lib/utils'

export const DISCLAIMER =
  'Independent proposal by Sofia Mota. Not affiliated with or endorsed by White & Case LLP.'

/**
 * The disclaimer line, shown at the top of the page and again in the footer.
 * `tone` picks the text colour for ivory vs midnight backgrounds.
 */
export function Disclaimer({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <p
      className={cn(
        'eyebrow',
        tone === 'light' ? 'text-muted-ink' : 'text-ivory/70',
        className,
      )}
    >
      {DISCLAIMER}
    </p>
  )
}
