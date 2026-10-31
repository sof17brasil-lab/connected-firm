import { FlowSection } from '@/components/ui/story-scroll'
import { cn } from '@/lib/utils'

export interface ChapterOpenerProps {
  /** Matches the section it introduces: 01, 02, 05, 06. */
  number: string
  label: string
  headline: string
  sentence: string
  figure: string
  figureCaption: string
  tone: 'midnight' | 'ivory' | 'navy'
}

/**
 * Full-screen chapter opener. These are the only full-height panels on the
 * site; everything else flows at its natural height.
 */
export function ChapterOpener({
  number,
  label,
  headline,
  sentence,
  figure,
  figureCaption,
  tone,
}: ChapterOpenerProps) {
  const dark = tone !== 'ivory'
  const bg = tone === 'midnight' ? 'bg-midnight' : tone === 'navy' ? 'bg-navy' : 'bg-ivory'

  return (
    <FlowSection aria-label={`${number} ${label}`} className={bg}>
      <p className={cn('eyebrow', dark ? 'text-sky' : 'text-sky-deep')}>
        {number} — {label}
      </p>

      <hr className={dark ? 'hairline-light' : 'hairline'} />

      <div className="flex flex-1 flex-col justify-center py-[4vh]">
        <h2
          className={cn(
            'text-[clamp(3rem,9vw,8rem)] leading-[0.95]',
            dark ? 'text-ivory' : 'text-navy',
          )}
        >
          {headline}
        </h2>
      </div>

      <hr className={dark ? 'hairline-light' : 'hairline'} />

      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <p
          className={cn(
            'measure text-lg md:text-xl',
            dark ? 'text-ivory/80' : 'text-slate',
          )}
        >
          {sentence}
        </p>
        <div className="md:text-right">
          <p className={cn('text-stat', dark ? 'text-ivory' : 'text-navy')}>{figure}</p>
          <p className={cn('text-caption mt-2', dark ? 'text-ivory/60' : 'text-muted-ink')}>
            {figureCaption}
          </p>
        </div>
      </div>
    </FlowSection>
  )
}
