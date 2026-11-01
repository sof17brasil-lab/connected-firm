import { describe, expect, it } from 'vitest'
import { buildPath } from '@/components/site/skyline'

/**
 * The line has to stay one continuous stroke from the letter to the right
 * edge: a second `M` would restart it and leave that piece undrawn.
 */
describe('Skyline path', () => {
  const d = buildPath({ x: 12, y: 40 }, 300, 1100, 180)

  it('is a single subpath starting at the letter', () => {
    expect(d.match(/M/g)).toHaveLength(1)
    expect(d.startsWith('M 12.0 40.0')).toBe(true)
  })

  it('uses only commands a stroke animation can draw', () => {
    expect(d).not.toMatch(/[Zz]/)
    expect(d.replace(/[^A-Za-z]/g, '')).toMatch(/^M[LQ]+$/)
  })

  it('runs all the way to the right edge and ends on the baseline', () => {
    expect(d.trimEnd().endsWith('1100.0 300.0')).toBe(true)
  })

  it('keeps the skyline itself inside its band, below the letter it leaves', () => {
    // The first point is the letter, deliberately above the band; everything
    // after the turn belongs to the drawing.
    const points = [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].slice(1)
    for (const [, , y] of points) {
      expect(Number(y)).toBeGreaterThanOrEqual(300 - 180 - 1)
      expect(Number(y)).toBeLessThanOrEqual(300 + 1)
    }
  })

  it('starts the pen at the letter, above where the drawing sits', () => {
    const [, , firstY] = [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)][0]
    expect(Number(firstY)).toBeLessThan(300 - 180)
  })

  it('adapts when the letter moves, as it does when the text rewraps', () => {
    const moved = buildPath({ x: 200, y: 40 }, 300, 1100, 180)
    expect(moved.startsWith('M 200.0 40.0')).toBe(true)
    expect(moved).not.toBe(d)
  })
})
