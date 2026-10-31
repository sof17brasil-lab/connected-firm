import { describe, expect, it } from 'vitest'
import { SKYLINE_PATH } from '@/components/site/skyline'

/**
 * The skyline has to stay one continuous stroke: a second `M` would restart
 * the line and leave that piece undrawn by the dash animation.
 */
describe('Skyline path', () => {
  it('is a single subpath', () => {
    expect(SKYLINE_PATH.match(/M/g)).toHaveLength(1)
    expect(SKYLINE_PATH.startsWith('M 0 150')).toBe(true)
  })

  it('spans the full width and returns to the baseline', () => {
    expect(SKYLINE_PATH.endsWith('L 640 150')).toBe(true)
  })

  it('uses no shape that a stroke animation cannot draw', () => {
    // Only move, line and quadratic commands; nothing closed or filled.
    expect(SKYLINE_PATH).not.toMatch(/[Zz]/)
    expect(SKYLINE_PATH.replace(/[^A-Za-z]/g, '')).toMatch(/^M[LQ]+$/)
  })

  it('keeps every point inside the viewBox', () => {
    for (const [, x, y] of SKYLINE_PATH.matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g)) {
      expect(Number(x)).toBeGreaterThanOrEqual(0)
      expect(Number(x)).toBeLessThanOrEqual(640)
      expect(Number(y)).toBeGreaterThanOrEqual(0)
      expect(Number(y)).toBeLessThanOrEqual(158)
    }
  })

  it('never leaves the baseline hanging: it starts and ends at y=150', () => {
    expect(SKYLINE_PATH).toMatch(/^M 0 150/)
    expect(SKYLINE_PATH).toMatch(/L 640 150$/)
  })
})
