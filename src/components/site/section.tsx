import { cn } from '@/lib/utils'
import { Reveal } from '@/components/site/reveal'

/** Small-caps label: "01 — Why now". */
export function Eyebrow({
  children,
  tone = 'light',
  className,
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <p className={cn('eyebrow', tone === 'light' ? 'text-sky-deep' : 'text-sky', className)}>
      {children}
    </p>
  )
}

/** The italic one-liner that closes each section. */
export function WhatThisMeans({
  children,
  tone = 'light',
  className,
}: {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <Reveal className={className}>
      <p
        className={cn(
          'measure font-display text-2xl italic leading-snug md:text-3xl',
          tone === 'light' ? 'text-navy' : 'text-ivory',
        )}
      >
        <span className={tone === 'light' ? 'text-muted-ink' : 'text-ivory/60'}>
          What this means:{' '}
        </span>
        {children}
      </p>
    </Reveal>
  )
}

/** Full-bleed band with the standard page gutters and max width inside. */
export function Band({
  id,
  children,
  className,
  tone = 'ivory',
}: {
  id?: string
  children: React.ReactNode
  className?: string
  tone?: 'ivory' | 'midnight' | 'navy'
}) {
  const bg =
    tone === 'ivory' ? 'bg-ivory' : tone === 'midnight' ? 'bg-midnight' : 'bg-navy'
  return (
    <section id={id} className={cn('scroll-mt-20', bg, className)}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">{children}</div>
    </section>
  )
}

/** Hairline rule used instead of boxes and heavy borders. */
export function Rule({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <hr className={cn(tone === 'light' ? 'hairline' : 'hairline-light', className)} />
  )
}
