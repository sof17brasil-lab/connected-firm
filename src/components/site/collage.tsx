import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CollagePiece } from '@/lib/collage'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TONE_CLASS = {
  navy: 'bg-navy',
  sky: 'bg-sky',
  stone: 'bg-stone',
} as const

const RAD = Math.PI / 180
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Decorative collage. Pieces orbit from a cluster on one side to an even ring
 * around the heading, scrubbed to scroll.
 *
 * Ornamental only: hidden from screen readers. Under reduced motion the
 * pieces are placed at their final ring positions and never move.
 */
export function Collage({
  pieces,
  photos,
  className,
}: {
  pieces: CollagePiece[]
  photos?: string[]
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const nodes = gsap.utils.toArray<HTMLElement>('[data-piece]', el)
      if (nodes.length === 0) return

      // The ring is sized from the box, so it stays clear of the heading on
      // small screens as well as large ones.
      const radius = () => {
        const { width, height } = el.getBoundingClientRect()
        return Math.min(Math.max(Math.min(width, height) * 0.42, 150), 460)
      }

      const place = (progress: number) => {
        const r = radius()
        nodes.forEach((node, i) => {
          const piece = pieces[i]
          if (!piece) return
          const local = easeOut(clamp01((progress - piece.delay) / piece.span))
          const angle = lerp(piece.a0, piece.a1, local) * RAD
          const dist = lerp(piece.r0, piece.r1, local) * r
          gsap.set(node, {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            scale: lerp(0.6, 1, local),
            opacity: Math.min(local * 3.5, 1),
          })
        })
      }

      if (reducedMotion) {
        place(1)
        return
      }

      place(0)

      // One scrubbed proxy drives every piece: a single trigger, and `scrub`
      // gives the whole group the same eased lag behind the scroll.
      const proxy = { p: 0 }
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => place(proxy.p),
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      const onResize = () => place(proxy.p)
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { scope: root, dependencies: [pieces, reducedMotion] },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {/* Centre anchor: every piece is offset from the middle of the box. */}
      <div className="absolute left-1/2 top-1/2">
        {pieces.map((piece, i) => {
          const photo = photos && piece.photo != null ? photos[piece.photo % photos.length] : undefined
          return (
            <div
              key={i}
              data-piece
              className="absolute"
              style={{
                width: piece.size,
                height: piece.size,
                marginLeft: -piece.size / 2,
                marginTop: -piece.size / 2,
                opacity: 0,
              }}
            >
              {photo ? (
                <img src={photo} alt="" className="size-full object-cover" />
              ) : (
                <div className={cn('size-full', TONE_CLASS[piece.tone])} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
