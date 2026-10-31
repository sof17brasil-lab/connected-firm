/**
 * Collage layout.
 *
 * Pieces are squares in four sizes. They begin gathered on one side and then
 * travel along a circular path until they sit evenly spaced around the
 * heading, like a slow orbit. Positions are polar — interpolating the angle is
 * what curves the path, rather than sliding in a straight line.
 */
export interface CollagePiece {
  tone: 'navy' | 'sky' | 'stone'
  photo?: number
  /** Square side in px. */
  size: number
  /** Start and end angle in degrees, swept in one direction. */
  a0: number
  a1: number
  /** Start and end distance from centre, as a fraction of the ring radius. */
  r0: number
  r1: number
  /** Where in the scroll this piece starts and how long it takes. */
  delay: number
  span: number
}

const SIZES = [110, 56, 72, 44, 88, 56, 110, 72, 44, 88, 56, 72]
const TONES = ['stone', 'sky', 'navy', 'stone', 'sky', 'stone', 'navy', 'sky'] as const

/**
 * `side` is where the cluster starts. Pieces always sweep in one direction so
 * they read as a single orbiting group rather than scattering.
 */
export function buildCollage(count = 10, side: 'left' | 'right' = 'left'): CollagePiece[] {
  const base = side === 'left' ? 180 : 0
  const pieces: CollagePiece[] = []

  for (let i = 0; i < count; i++) {
    // Evenly spaced final positions, offset so none lands straight above the
    // heading where it would crowd the first line.
    const step = 360 / count
    const a1 = base + 40 + i * step

    pieces.push({
      tone: TONES[i % TONES.length],
      photo: i,
      size: SIZES[i % SIZES.length],
      // The cluster is a narrow fan on one side, close to the centre.
      a0: base + (i % 4) * 7 - 10,
      a1,
      r0: 0.22 + (i % 3) * 0.05,
      r1: 0.92 + ((i * 7) % 5) * 0.04,
      delay: (i % 5) * 0.05,
      span: 0.62 + ((i * 3) % 4) * 0.08,
    })
  }

  return pieces
}
