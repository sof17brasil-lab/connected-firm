import { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollScrub } from '@/hooks/use-scroll-scrub'

/**
 * The skyline as one continuous pen line that leaves the "N" of New York.
 *
 * The line starts at the foot of the N's left stroke, drops below the
 * sentence, turns, and sketches the skyline left to right. It is a single
 * stroked path with `fill="none"` and exactly one `M`: a second subpath
 * would restart the line and leave that piece undrawn.
 *
 * The N's position is measured from the DOM rather than guessed, and
 * remeasured whenever the text rewraps, so the join holds at any width.
 */

/** Skyline in normalised units: x across the run, y up from the baseline. */
const SHAPE: Array<[number, number]> = [
  [0.00, 0.00], [0.07, 0.00], [0.07, 0.22], [0.11, 0.22], [0.11, 0.00],
  [0.15, 0.00], [0.15, 0.40], [0.168, 0.46], [0.186, 0.40], [0.186, 0.00],
  [0.22, 0.00], [0.22, 0.18], [0.28, 0.18], [0.28, 0.00],
  [0.31, 0.00], [0.31, 0.55], [0.322, 0.55], [0.322, 0.70], [0.328, 0.70],
  [0.328, 0.55], [0.34, 0.55], [0.34, 0.00],
  [0.38, 0.00], [0.38, 0.28], [0.43, 0.28], [0.43, 0.00],
  // Empire State: setbacks up, mast, setbacks down.
  [0.47, 0.00], [0.47, 0.40], [0.49, 0.40], [0.49, 0.60], [0.503, 0.60],
  [0.503, 0.74], [0.516, 0.74], [0.516, 0.90], [0.52, 0.90], [0.52, 1.00],
  [0.524, 1.00], [0.524, 0.90], [0.528, 0.90], [0.528, 0.74], [0.541, 0.74],
  [0.541, 0.60], [0.554, 0.60], [0.554, 0.40], [0.574, 0.40], [0.574, 0.00],
  [0.615, 0.00], [0.615, 0.24], [0.657, 0.24], [0.657, 0.00],
]

/** The Chrysler crown, as curves, then the right flank back to the baseline. */
const CROWN_START: [number, number] = [0.70, 0.00]
const RIGHT: Array<[number, number]> = [
  [0.79, 0.00], [0.79, 0.33], [0.85, 0.33], [0.85, 0.00],
  [0.885, 0.00], [0.885, 0.14], [0.915, 0.14], [0.915, 0.26],
  [0.947, 0.26], [0.947, 0.00], [1.00, 0.00],
]

export interface Anchor {
  /** Where the pen leaves the letter, in overlay pixels. */
  x: number
  y: number
}

export function buildPath(
  anchor: Anchor,
  baselineY: number,
  right: number,
  height: number,
): string {
  const startX = Math.max(anchor.x, 2)
  const run = Math.max(right - startX, 120)
  const px = (nx: number) => startX + nx * run
  const py = (ny: number) => baselineY - ny * height

  const parts = [`M ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)}`]
  // Down from the letter, then the turn onto the baseline.
  parts.push(`L ${startX.toFixed(1)} ${(baselineY - height * 0.06).toFixed(1)}`)
  parts.push(`Q ${startX.toFixed(1)} ${baselineY.toFixed(1)} ${(startX + height * 0.06).toFixed(1)} ${baselineY.toFixed(1)}`)

  for (const [nx, ny] of SHAPE) {
    parts.push(`L ${px(nx).toFixed(1)} ${py(ny).toFixed(1)}`)
  }

  // Chrysler: up the flank, stepped arcs to the needle, back down.
  const cx = px(CROWN_START[0])
  parts.push(`L ${cx.toFixed(1)} ${baselineY.toFixed(1)}`)
  parts.push(`L ${cx.toFixed(1)} ${py(0.42).toFixed(1)}`)
  parts.push(`Q ${px(0.705).toFixed(1)} ${py(0.56).toFixed(1)} ${px(0.722).toFixed(1)} ${py(0.64).toFixed(1)}`)
  parts.push(`Q ${px(0.732).toFixed(1)} ${py(0.74).toFixed(1)} ${px(0.742).toFixed(1)} ${py(0.82).toFixed(1)}`)
  parts.push(`L ${px(0.744).toFixed(1)} ${py(1.0).toFixed(1)}`)
  parts.push(`L ${px(0.747).toFixed(1)} ${py(1.0).toFixed(1)}`)
  parts.push(`L ${px(0.749).toFixed(1)} ${py(0.82).toFixed(1)}`)
  parts.push(`Q ${px(0.759).toFixed(1)} ${py(0.74).toFixed(1)} ${px(0.769).toFixed(1)} ${py(0.64).toFixed(1)}`)
  parts.push(`Q ${px(0.786).toFixed(1)} ${py(0.56).toFixed(1)} ${px(0.79).toFixed(1)} ${py(0.42).toFixed(1)}`)
  parts.push(`L ${px(0.79).toFixed(1)} ${baselineY.toFixed(1)}`)

  for (const [nx, ny] of RIGHT) {
    parts.push(`L ${px(nx).toFixed(1)} ${py(ny).toFixed(1)}`)
  }

  return parts.join(' ')
}

export function Skyline({
  /** Ref to the span wrapping the letter the line comes out of. */
  letterRef,
  /** Render it finished, with no animation, to check the shape. */
  still = false,
  className,
}: {
  letterRef: React.RefObject<HTMLElement | null>
  still?: boolean
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0, d: '' })

  const measure = useCallback(() => {
    const el = host.current
    const letter = letterRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const height = Math.max(Math.min(rect.width * 0.17, 230), 90)
    const baselineY = rect.height - 8

    // Where the letter sits, in this overlay's own coordinates.
    const anchor = letter
      ? (() => {
          const l = letter.getBoundingClientRect()
          return { x: l.left - rect.left + 1, y: l.bottom - rect.top - 2 }
        })()
      : { x: 2, y: 0 }

    setBox({
      w: rect.width,
      h: rect.height,
      d: buildPath(anchor, baselineY, rect.width, height),
    })
  }, [letterRef])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (host.current) ro.observe(host.current)
    window.addEventListener('resize', measure)
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useScrollScrub(
    host,
    (p) => {
      if (still) return
      pathRef.current?.setAttribute('stroke-dashoffset', String(1 - p))
    },
    { start: 'top 95%', end: 'bottom 62%', scrub: 0.7 },
  )

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {box.w > 0 && (
        <svg
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          className="overflow-visible"
          fill="none"
        >
          <path
            ref={pathRef}
            d={box.d}
            fill="none"
            stroke="var(--color-navy)"
            strokeOpacity={0.34}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={still ? 0 : 1}
          />
        </svg>
      )}
    </div>
  )
}
