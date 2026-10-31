/**
 * Collage piece layout.
 *
 * Each piece has two positions: `from`, a tight cluster off to one side, and
 * `to`, a point on a loose ring around the headline. Scrolling moves pieces
 * between the two at different rates, so the cluster appears to disperse.
 *
 * Positions are percentages of the section box. The ring deliberately leaves a
 * gap through the middle so nothing ever lands on the words.
 */
export interface CollagePiece {
  /** Placeholder fill until real photos arrive. */
  tone: 'navy' | 'sky' | 'stone'
  /** Index into the supplied photo list, when there are photos. */
  photo?: number
  w: number
  h: number
  from: { x: number; y: number }
  to: { x: number; y: number }
  /** 0.4 slow, 1.4 fast — what makes the pieces separate as they travel. */
  speed: number
  rotate: number
}

const TONES = ['stone', 'sky', 'navy', 'stone', 'sky', 'stone', 'navy', 'sky'] as const

/**
 * Builds a ring of pieces deterministically, so the layout is stable between
 * renders but still looks scattered. `side` decides which edge they start from.
 */
export function buildCollage(count: number, side: 'left' | 'right' = 'left'): CollagePiece[] {
  const pieces: CollagePiece[] = []
  const originX = side === 'left' ? 16 : 84

  for (let i = 0; i < count; i++) {
    // Even spread around the ring, nudged so it never looks like a clock face.
    const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.22
    const radiusX = 34 + ((i * 7) % 11)
    const radiusY = 30 + ((i * 5) % 13)

    // Sizes stay small, 2.2%-7% of width, as in the reference.
    const w = 2.6 + ((i * 13) % 5) * 1.1
    const h = w * (0.62 + ((i * 7) % 4) * 0.16)

    pieces.push({
      tone: TONES[i % TONES.length],
      photo: i,
      w,
      h,
      from: {
        x: originX + ((i * 11) % 13) - 6,
        y: 20 + ((i * 17) % 60),
      },
      to: {
        x: 50 + Math.cos(angle) * radiusX,
        y: 50 + Math.sin(angle) * radiusY,
      },
      speed: 0.5 + ((i * 3) % 7) * 0.14,
      rotate: (((i * 23) % 9) - 4) * 0.8,
    })
  }

  return pieces
}
