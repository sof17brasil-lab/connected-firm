import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { EASE } from '@/components/site/reveal'
import { useInViewOnce } from '@/hooks/use-in-view-once'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import {
  BOUNDS,
  DEFAULTS,
  type CalculatorInputs,
  calculate,
  money,
  round,
  verdict,
} from '@/lib/calculator'

interface Field {
  key: keyof CalculatorInputs
  label: string
  format: (v: number) => string
}

const FIELDS: Field[] = [
  { key: 'lawyers', label: 'Non-partner lawyers in scope', format: (v) => v.toLocaleString('en-US') },
  { key: 'attrition', label: 'Annual attrition rate', format: (v) => `${v}%` },
  { key: 'costPerDeparture', label: 'Cost of one departure', format: (v) => money(v) },
  { key: 'reduction', label: 'Turnover reduction', format: (v) => `${v} points` },
  { key: 'pilotCost', label: 'Pilot cost', format: (v) => money(v) },
]

/**
 * The interactive model. Every figure on screen comes from calculate(), which
 * is tested separately, so the display and the arithmetic cannot drift apart.
 */
export function Calculator() {
  const [input, setInput] = useState<CalculatorInputs>(DEFAULTS)
  const out = calculate(input)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const { ref, inView } = useInViewOnce<HTMLDivElement>()

  const set = (key: keyof CalculatorInputs) => (value: number[]) =>
    setInput((prev) => ({ ...prev, [key]: value[0] }))

  // Two bars, scaled against whichever is larger.
  const peak = Math.max(out.savings, input.pilotCost, 1)
  const costPct = (input.pilotCost / peak) * 100
  const savePct = (out.savings / peak) * 100

  return (
    <div ref={ref} className="border border-stone bg-ivory/60">
      <div className="grid gap-10 p-6 md:grid-cols-[1fr_1.1fr] md:gap-14 md:p-10">
        {/* Inputs */}
        <div>
          <p className="eyebrow text-sky-deep">Adjust the assumptions</p>

          <div className="mt-8 flex flex-col gap-7">
            {FIELDS.map((field) => {
              const bounds = BOUNDS[field.key]
              const fieldId = `${id}-${field.key}`
              return (
                <div key={field.key}>
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor={fieldId} className="text-sm font-medium text-slate">
                      {field.label}
                    </label>
                    <span className="tabular font-display text-xl text-navy">
                      {field.format(input[field.key])}
                    </span>
                  </div>
                  <Slider
                    id={fieldId}
                    className="mt-3"
                    value={[input[field.key]]}
                    min={bounds.min}
                    max={bounds.max}
                    step={bounds.step}
                    onValueChange={set(field.key)}
                    aria-label={field.label}
                  />
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setInput(DEFAULTS)}
            className="eyebrow mt-9 inline-flex items-center gap-2 border border-stone px-4 py-2.5 text-navy transition-colors hover:bg-stone/40"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.5} />
            Reset
          </button>
        </div>

        {/* Outputs */}
        <div className="flex flex-col">
          <p className="eyebrow text-sky-deep">Result</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
            {[
              ['Baseline departures', round(out.baselineDepartures)],
              ['Departures avoided', round(out.departuresAvoided)],
              ['Savings', money(out.savings)],
              ['Return per $1', `${out.returnPerDollar.toFixed(1)}×`],
              ['Break-even lawyers kept', round(out.breakEvenLawyers)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-caption text-muted-ink">{label}</dt>
                <dd className="tabular mt-1 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none text-navy">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Pilot cost against savings. */}
          <div className="mt-10 flex flex-col gap-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-caption text-muted-ink">Pilot cost</span>
                <span className="tabular text-caption text-slate">{money(input.pilotCost)}</span>
              </div>
              <div className="mt-2 h-3 w-full bg-stone/50">
                <motion.div
                  className="h-full bg-muted-ink"
                  animate={{ width: `${inView || reducedMotion ? costPct : 0}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-caption text-muted-ink">Savings</span>
                <span className="tabular text-caption text-slate">{money(out.savings)}</span>
              </div>
              <div className="mt-2 h-3 w-full bg-stone/50">
                <motion.div
                  className="h-full bg-sky"
                  animate={{ width: `${inView || reducedMotion ? savePct : 0}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </div>
            </div>
          </div>

          <p
            aria-live="polite"
            className="measure mt-8 font-display text-xl italic leading-snug text-navy"
          >
            {verdict(input, out)}
          </p>

          <p className="text-caption mt-auto pt-8 text-muted-ink">
            Illustrative model using public industry figures. White &amp; Case&apos;s own
            attrition rate is not public.
          </p>
        </div>
      </div>
    </div>
  )
}
