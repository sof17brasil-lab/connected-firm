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
        <span key={measure} className="flex items-center gap-14 whitespace-nowrap">
          <span className="font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-none text-navy">
            {measure}
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sky-deep" />
        </span>
      ))}
    </>
  )

  return (
    <div className="flex items-stretch border-y border-stone">
      <p className="flex shrink-0 items-center border-r border-stone px-5 font-display text-[clamp(1.2rem,2.2vw,1.9rem)] text-sky-deep md:px-10">
        I&apos;d measure
      </p>

      <div className="group relative flex-1 overflow-hidden">
        {reducedMotion ? (
          <div className="flex items-center gap-14 px-8 py-9">{items}</div>
        ) : (
          <div className="flex w-max animate-[marquee_34s_linear_infinite] items-center gap-14 py-9 pl-14 group-hover:[animation-play-state:paused]">
            {items}
            <span aria-hidden="true" className="flex items-center gap-14">
              {items}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
