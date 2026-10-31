import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { CollagePiece } from '@/lib/collage'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const TONE_CLASS = {
  navy: 'bg-navy',
  sky: 'bg-sky',
  stone: 'bg-stone',
} as const

function Piece({
  piece,
  progress,
  photos,
}: {
  piece: CollagePiece
  progress: MotionValue<number>
  photos?: string[]
}) {
  // Faster pieces finish their journey earlier, which is what separates them.
  const end = Math.min(0.35 + piece.speed * 0.5, 0.95)
  const x = useTransform(progress, [0, end], [`${piece.from.x}%`, `${piece.to.x}%`])
  const y = useTransform(progress, [0, end], [`${piece.from.y}%`, `${piece.to.y}%`])
  const opacity = useTransform(progress, [0, 0.12, 0.85, 1], [0, 1, 1, 0.65])
  const scale = useTransform(progress, [0, end], [0.72, 1])

  const photo = photos && piece.photo != null ? photos[piece.photo % photos.length] : undefined

  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: `${piece.w}%`,
        aspectRatio: `${piece.w} / ${piece.h}`,
        opacity,
        scale,
        rotate: piece.rotate,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {photo ? (
        <img src={photo} alt="" aria-hidden="true" className="size-full object-cover" />
      ) : (
        <div className={cn('size-full', TONE_CLASS[piece.tone])} />
      )}
    </motion.div>
  )
}

/**
 * Decorative collage layer. Pieces gather and spread with scroll.
 *
 * Purely ornamental: hidden from screen readers, dropped entirely under
 * reduced motion, and never placed where it could sit over the headline.
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
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  if (reducedMotion) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {pieces.map((piece, i) => (
        <Piece key={i} piece={piece} progress={scrollYProgress} photos={photos} />
      ))}
    </div>
  )
}
