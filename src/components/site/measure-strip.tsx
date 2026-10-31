import { useReducedMotion } from '@/hooks/use-reduced-motion'

const MEASURES = ['Attendance', 'Repeat rate', 'Follow-ups within 30 days', 'New matters']

/**
 * A slim strip: a fixed label, then the measures drifting right to left.
 *
 * The track holds two copies of the list and slides exactly one copy's width,
 * so the loop has no visible seam. It pauses on hover, and reduced motion
 * gets the same row standing still.
 */
export function MeasureStrip() {
  const reducedMotion = useReducedMotion()

  const items = (
    <>
      {MEASURES.map((measure) => (
        <span key={measure} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-[clamp(1.1rem,1.8vw,1.6rem)] text-navy">
            {measure}
          </span>
          <span aria-hidden="true" className="size-1 rounded-full bg-sky-deep" />
        </span>
      ))}
    </>
  )

  return (
    <div className="flex items-stretch border-y border-stone">
      <p className="eyebrow flex shrink-0 items-center border-r border-stone px-5 text-sky-deep md:px-7">
        I&apos;d measure
      </p>

      <div className="group relative flex-1 overflow-hidden">
        {reducedMotion ? (
          <div className="flex items-center gap-10 px-6 py-5">{items}</div>
        ) : (
          <div className="flex w-max animate-[marquee_26s_linear_infinite] items-center gap-10 py-5 pl-10 group-hover:[animation-play-state:paused]">
            {items}
            <span aria-hidden="true" className="flex items-center gap-10">
              {items}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
