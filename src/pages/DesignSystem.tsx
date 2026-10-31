import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Disclaimer } from '@/components/site/disclaimer'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PALETTE = [
  { token: 'navy', hex: '#0E1E3A', use: 'Headings, nav, main chart colour' },
  { token: 'midnight', hex: '#081428', use: 'Dark full-width sections, footer' },
  { token: 'ivory', hex: '#F7F4EE', use: 'Page background' },
  { token: 'stone', hex: '#E6E1D6', use: 'Cards, dividers, secondary bars' },
  { token: 'slate', hex: '#2B3445', use: 'Body text' },
  { token: 'sky', hex: '#8DB4E2', use: 'Accent fills only' },
  { token: 'sky-deep', hex: '#3D6CA6', use: 'Accent text and links' },
  { token: 'muted-ink', hex: '#6A6F7A', use: 'Captions, footnotes' },
]

/**
 * Temporary specimen page for step (a). It exists so the palette, type scale,
 * hairlines and the Lenis + ScrollTrigger sync can be checked in a browser
 * before any real content is built. It is replaced by the real home page later.
 */
export default function DesignSystem() {
  const pinRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // A pinned strip is the thing that jitters when Lenis and ScrollTrigger are
  // not synced, so it is the honest test of the wiring in smooth-scroll.tsx.
  useGSAP(
    () => {
      if (reducedMotion || !pinRef.current) return

      const card = pinRef.current.querySelector('[data-pin-card]')
      if (!card) return

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: 'top top',
        end: '+=60%',
        pin: card,
        pinSpacing: false,
      })
    },
    { scope: pinRef, dependencies: [reducedMotion] },
  )

  return (
    <div className="min-h-screen bg-ivory">
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <Disclaimer />
      </header>

      <Separator className="mx-auto max-w-6xl" />

      {/* --- Hero crop + duotone treatment, for sign-off --- */}
      <section className="relative isolate overflow-hidden bg-midnight">
        <img
          src={`${import.meta.env.BASE_URL}images/nyc-hero.jpg`}
          alt="The New York skyline at dusk."
          className="absolute inset-0 size-full object-cover"
          width={2000}
          height={1125}
        />
        {/* Navy duotone: a multiply pass flattens the photo towards navy, then
            a gradient keeps the text edge dark enough for ivory type. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy/80 mix-blend-multiply"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-midnight/90 via-navy/60 to-sky/20"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <p className="eyebrow text-sky">Hero crop — for sign-off</p>
          <h2 className="text-hero mt-5 text-ivory">The Connected Firm</h2>
          <p className="mt-5 max-w-xl text-ivory/85">
            An events strategy for White &amp; Case&apos;s New York office
          </p>
          <p className="text-caption mt-6 text-ivory/70">
            Independent proposal by Sofia Mota · October 2026
          </p>
        </div>
      </section>

      {/* --- Type scale --- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow text-sky-deep">Step A — Design system</p>
        <h1 className="text-hero mt-6">The Connected Firm</h1>
        <p className="measure mt-6 text-slate">
          An events strategy for White &amp; Case&apos;s New York office. This page is a
          specimen, not the site: it shows the palette, the type scale and the motion
          wiring so they can be signed off before the real sections are built.
        </p>
        <p className="text-caption mt-4 text-muted-ink">
          Independent proposal by Sofia Mota · October 2026
        </p>

        <hr className="hairline my-16" />

        <h2 className="text-h2">A headline at H2, stating the point plainly.</h2>
        <p className="measure mt-5 text-slate">
          Body copy sits at 17px on phones and 18px from tablet up, capped at about 65
          characters so the eye never has to hunt for the start of the next line.
        </p>
        <p className="mt-8 font-display text-3xl italic text-navy">
          What this means: restraint is what makes it look expensive.
        </p>

        <hr className="hairline my-16" />

        <p className="eyebrow text-muted-ink">One big number</p>
        <p className="text-stat mt-4 text-navy">$3.594bn</p>
        <p className="text-caption mt-3 text-muted-ink">
          2025 revenue, up ~8.4% <span className="text-sky-deep">[1]</span>
        </p>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* --- Palette --- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow text-sky-deep">Palette</p>
        <h2 className="text-h2 mt-5">Eight colours, used sparingly.</h2>

        <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {PALETTE.map((c) => (
            <div key={c.token} className="flex items-start gap-4">
              <div
                className="mt-1 size-12 shrink-0 rounded-sm border border-stone"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <p className="font-sans font-semibold text-navy">{c.token}</p>
                <p className="text-caption tabular text-muted-ink">{c.hex}</p>
                <p className="text-caption text-slate">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* --- shadcn primitives in brand colours --- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="eyebrow text-sky-deep">Components</p>
        <h2 className="text-h2 mt-5">shadcn primitives, retinted.</h2>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Badge>Business case</Badge>
          <Badge variant="secondary">Illustrative</Badge>
          <Badge variant="outline">My estimate</Badge>
        </div>

        <div className="mt-12 max-w-md">
          <label htmlFor="specimen-slider" className="eyebrow text-muted-ink">
            Slider (the calculator uses five of these)
          </label>
          <Slider
            id="specimen-slider"
            defaultValue={[1950]}
            min={200}
            max={1950}
            step={50}
            className="mt-4"
          />
        </div>

        <table className="mt-14 w-full border-collapse text-left">
          <caption className="text-caption mb-3 text-left text-muted-ink">
            Tabular figures line up in columns.
          </caption>
          <thead>
            <tr className="border-b border-stone">
              <th className="eyebrow py-3 font-semibold text-navy">Program</th>
              <th className="eyebrow py-3 text-right font-semibold text-navy">Cost</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['First 90 Days', '$27,000'],
              ['Momentum Circles', '$19,200'],
              ['Global Table', '$9,000'],
              ['Client Roundtables', '$22,400'],
            ].map(([name, cost]) => (
              <tr key={name} className="border-b border-stone/70">
                <td className="py-3 text-slate">{name}</td>
                <td className="py-3 text-right text-slate">{cost}</td>
              </tr>
            ))}
            <tr>
              <td className="py-3 font-semibold text-navy">Total</td>
              <td className="py-3 text-right font-semibold text-navy">$77,600</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* --- Lenis + ScrollTrigger pin test --- */}
      <section ref={pinRef} className="relative bg-midnight">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
          <div data-pin-card>
            <p className="eyebrow text-sky">Motion test</p>
            <h2 className="text-h2 mt-5 text-ivory">
              A pinned panel, scrolled by Lenis.
            </h2>
            <p className="measure mt-5 text-ivory/80">
              This block is pinned with GSAP ScrollTrigger while Lenis owns the scroll
              position. If the two were not synced it would stutter as you scroll.
              {reducedMotion
                ? ' Reduced motion is on, so pinning and smooth scrolling are both off.'
                : ' Scroll slowly through it to check.'}
            </p>
          </div>
        </div>
        <div className="h-[60vh]" />
      </section>

      <footer className="bg-midnight px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <hr className="hairline-light mb-8" />
          <Disclaimer tone="dark" />
          <p className="text-caption mt-4 text-ivory/60">
            sofiamotaus@gmail.com
          </p>
        </div>
      </footer>
    </div>
  )
}
