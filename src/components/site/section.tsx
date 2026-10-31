import { cn } from '@/lib/utils'

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

/**
 * A section band. Transparent by design: PageBackground paints the colour so
 * that tones blend into each other instead of switching at a hard edge.
 */
export function Band({
  id,
  children,
  className,
}: {
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('relative scroll-mt-4', className)}>
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">{children}</div>
    </section>
  )
}

export function Rule({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  return <hr className={cn(tone === 'light' ? 'hairline' : 'hairline-light', className)} />
}

/** Small-caps label, big serif number, quiet explanation — the findings list. */
export function Finding({
  label,
  figure,
  children,
  tone = 'light',
}: {
  label: string
  figure: React.ReactNode
  children: React.ReactNode
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <div className={cn('border-t py-8', dark ? 'border-ivory/15' : 'border-stone')}>
      <p className={cn('eyebrow', dark ? 'text-sky' : 'text-sky-deep')}>{label}</p>
      <p
        className={cn(
          'mt-4 font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none',
          dark ? 'text-ivory' : 'text-navy',
        )}
      >
        {figure}
      </p>
      <p className={cn('measure mt-4', dark ? 'text-ivory/70' : 'text-slate')}>{children}</p>
    </div>
  )
}
