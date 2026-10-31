import { Collage } from '@/components/site/collage'
import { Reveal } from '@/components/site/reveal'
import { buildCollage } from '@/lib/collage'
import { cn } from '@/lib/utils'

export interface ChapterOpenerProps {
  /** Matches the section it introduces: 01, 02, 05, 06. */
  number: string
  /** The question, with the emphasised word wrapped in asterisks. */
  question: string
  side?: 'left' | 'right'
  dark?: boolean
  id?: string
  /** Opener 06 is deliberately quiet, with no collage. */
  collage?: boolean
  /** A shorter opener, for the ones that are not act breaks. */
  compact?: boolean
}

/**
 * Renders "What keeps *people* at a firm?" with the starred word in italic.
 */
function Question({ text, dark, compact }: { text: string; dark: boolean; compact?: boolean }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <h2
      className={cn(
        'text-center font-display leading-[1.12]',
        compact ? 'text-[clamp(1.7rem,3.2vw,2.6rem)]' : 'text-[clamp(2rem,4.6vw,4rem)]',
      dark ? 'text-ivory' : 'text-navy',
      )}
    >
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="italic">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </h2>
  )
}

/**
 * Full-screen chapter opener: a bracketed number over a centred question,
 * with the collage gathering and spreading around it as you scroll.
 */
export function ChapterOpener({
  number,
  question,
  side = 'left',
  dark = false,
  id,
  collage = true,
  compact = false,
}: ChapterOpenerProps) {
  const pieces = buildCollage(11, side)

  return (
    <section
      id={id}
      aria-label={`Chapter ${number}`}
      className={cn(
        'relative isolate flex items-center overflow-hidden',
        compact ? 'min-h-[34vh] pt-10' : 'min-h-screen',
      )}
    >
      {collage && <Collage pieces={pieces} />}

      <div className="relative mx-auto w-full max-w-3xl px-6">
        <Reveal>
          <p
            className={cn(
              'mb-7 text-center font-display tracking-[0.08em]',
              compact ? 'text-base' : 'text-lg',
              dark ? 'text-ivory/70' : 'text-muted-ink',
            )}
          >
            [{number}]
          </p>
          <Question text={question} dark={dark} compact={compact} />
        </Reveal>
      </div>
    </section>
  )
}
