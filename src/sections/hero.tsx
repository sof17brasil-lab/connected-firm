import { DISCLAIMER } from '@/components/site/disclaimer'

/**
 * Sized to its content rather than 100vh, so the thesis line is already
 * promised below the fold instead of the page opening on a blank slab.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight">
      <img
        src={`${import.meta.env.BASE_URL}images/nyc-hero.jpg`}
        alt="The New York skyline."
        width={2000}
        height={1125}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Navy duotone: multiply flattens the photo toward navy, the gradient
          keeps the text edge dark enough for ivory type to hold contrast. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-midnight/95 via-navy/65 to-sky/20"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-44">
        <p className="eyebrow max-w-2xl text-ivory/60">{DISCLAIMER}</p>

        <h1 className="text-hero mt-10 text-ivory">The Connected Firm</h1>

        <p className="mt-8 max-w-2xl text-xl text-ivory/85 md:text-2xl">
          An events strategy for White &amp; Case&apos;s New York office
        </p>

        <p className="text-caption mt-10 text-ivory/65">
          Independent proposal by Sofia Mota · October 2026
        </p>
      </div>
    </section>
  )
}
