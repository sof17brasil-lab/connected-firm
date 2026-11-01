import { describe, expect, it } from 'vitest'
import { SKYLINE } from '@/components/site/skyline'

/**
 * The skyline is drawn as separate paths, so nothing enforces that they line
 * up except these checks.
 */
describe('Skyline geometry', () => {
  const joined = SKYLINE.filter((s) => !s.detached)

  it('has a continuous roofline: every segment starts where the last ended', () => {
    for (let i = 1; i < joined.length; i++) {
      expect(joined[i].from).toEqual(joined[i - 1].to)
    }
  })

  it('runs the full width of the viewBox', () => {
    expect(joined[0].from[0]).toBe(0)
    expect(joined[joined.length - 1].to[0]).toBe(640)
  })

  it('declares a d that starts at its stated from point', () => {
    for (const segment of SKYLINE) {
      const m = segment.d.match(/^M\s+(-?[\d.]+)\s+(-?[\d.]+)/)
      expect(m).not.toBeNull()
      expect([Number(m![1]), Number(m![2])]).toEqual(segment.from)
    }
  })

  it('keeps every point inside the viewBox', () => {
    for (const segment of SKYLINE) {
      for (const [, x, y] of segment.d.matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g)) {
        expect(Number(x)).toBeGreaterThanOrEqual(0)
        expect(Number(x)).toBeLessThanOrEqual(640)
        expect(Number(y)).toBeGreaterThanOrEqual(0)
        expect(Number(y)).toBeLessThanOrEqual(160)
      }
    }
  })
})
