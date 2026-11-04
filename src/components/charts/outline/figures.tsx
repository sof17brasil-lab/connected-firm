import XScroll from '@/components/ui/x-scroll'
import { Drawn } from './drawn'
import { OutlineLines, SplitBar, StepFlow, WideBars } from './charts'
import { EstimateTag, Footnote } from '@/components/site/footnote'
import { REVENUE_GOAL } from '@/lib/data'
import {
  COMPETITOR_BARS,
  COMPETITOR_COUNT,
  COMPETITOR_MEDIAN,
  COMPETITOR_MEDIAN_LABEL,
  COMPETITOR_REFERENCE,
  COMPETITOR_REFERENCE_LABEL,
  PER_LAWYER_NOTE,
  WHITE_CASE_RANK,
  LATERAL_STEPS,
  PROGRAM_SPLIT,
  PROGRAM_SPLIT_TOTAL,
  REVENUE_ACTUAL,
  REVENUE_GAP_DISPLAY,
  REVENUE_PROJECTED,
  SENSITIVITY,
  SENSITIVITY_REFERENCE,
  SENSITIVITY_REFERENCE_LABEL,
} from '@/lib/figures'

/**
 * The five charts that sit above the calculator.
 *
 * Each one is the same shape: what it shows in a sentence, then the drawing,
 * then where the numbers came from. They share the outline language — solid
 * stroke for the figure that matters, dashed for the context around it,
 * values in a pill on the mark, no gridlines and no legend — and each draws
 * itself as it scrolls through the screen.
 *
 * Every value is imported from lib/figures.ts, which derives them from
 * data.ts and the tested calculator functions.
 *
 * All five use a wide viewBox. Scaled to fit a phone that would put the
 * axis labels at about five pixels, so below the large breakpoint they keep
 * a readable width and scroll sideways instead, the same way the tables on
 * this page do.
 */
function Figure({
  takeaway,
  children,
  source,
}: {
  takeaway: React.ReactNode
  children: React.ReactNode
  source: React.ReactNode
}) {
  return (
    <figure className="border-t border-stone pt-10 text-navy">
      <figcaption className="measure font-display text-[clamp(1.25rem,2vw,1.7rem)] leading-snug text-navy">
        {takeaway}
      </figcaption>
      {/* One copy only: drawChart staggers across every [data-draw] it can
          find, so a second hidden copy would halve each stroke's slice and
          leave the visible chart half drawn. */}
      <Drawn className="mt-9">
        <XScroll>
          <div className="min-w-[700px] pb-3 lg:min-w-0 lg:pb-0">{children}</div>
        </XScroll>
      </Drawn>
      <p className="text-caption mt-6 text-muted-ink">{source}</p>
    </figure>
  )
}

export function RevenueGapFigure() {
  return (
    <Figure
      takeaway={
        <>
          At the pace of the last two years, 2028 lands {REVENUE_GAP_DISPLAY} of the $
          {REVENUE_GOAL}bn goal.
        </>
      }
      source={
        <>
          Revenue 2023&ndash;2025 as published; 2026&ndash;2028 projected at the ~8.4% the firm
          grew in 2025.
          <Footnote ids={[1, 2, 3]} className="ml-1" />
          <EstimateTag kind="estimate" className="ml-2" />
        </>
      }
    >
      <OutlineLines
        solid={REVENUE_ACTUAL}
        dashed={REVENUE_PROJECTED}
        reference={REVENUE_GOAL}
        referenceLabel={`$${REVENUE_GOAL}bn goal`}
        gapLabel={REVENUE_GAP_DISPLAY}
        domain={[2023, 2028]}
        range={[2.6, 5.4]}
        format={(y) => `$${y.toFixed(3)}bn`}
      />
    </Figure>
  )
}

export function CompetitorFigure() {
  return (
    <Figure
      takeaway={`White & Case grew ${COMPETITOR_BARS.find((b) => b.highlight)?.display} in 2025, ${WHITE_CASE_RANK}th of these ${COMPETITOR_COUNT} and a little under their median — not far off the pack, and not fast enough for 2028.`}
      source={
        <>
          2025 revenue growth for the Am Law top ten by revenue. The 13.0% line is the Am
          Law 100 aggregate, weighted across all hundred firms, not an average of these{' '}
          {COMPETITOR_COUNT}. {PER_LAWYER_NOTE}
          <Footnote ids={[4, 31]} className="ml-1" />
        </>
      }
    >
      <WideBars
        data={COMPETITOR_BARS}
        max={26}
        reference={COMPETITOR_REFERENCE}
        referenceLabel={COMPETITOR_REFERENCE_LABEL}
        second={COMPETITOR_MEDIAN}
        secondLabel={COMPETITOR_MEDIAN_LABEL}
      />
    </Figure>
  )
}

export function PilotSplitFigure() {
  return (
    <Figure
      takeaway="The whole pilot is four line items, and the largest of them is the one aimed at laterals."
      source={
        <>
          Each programme costed from its own calculation; the four add to $
          {PROGRAM_SPLIT_TOTAL.toLocaleString('en-US')}.
          <Footnote ids={[19, 23, 28]} className="ml-1" />
          <EstimateTag kind="estimate" className="ml-2" />
        </>
      }
    >
      <SplitBar parts={PROGRAM_SPLIT} total={PROGRAM_SPLIT_TOTAL} />
    </Figure>
  )
}

export function LateralFlowFigure() {
  return (
    <Figure
      takeaway="One year of lateral hiring, carried through at the published failure rate, is tens of millions of dollars of exposure."
      source={
        <>
          51 laterals at the published 30&ndash;38% five-year departure rate, each at
          $4,039,200.
          <Footnote ids={[5, 6, 7]} className="ml-1" />
          <EstimateTag kind="illustrative" className="ml-2" />
        </>
      }
    >
      <StepFlow steps={LATERAL_STEPS} />
    </Figure>
  )
}

export function SensitivityFigure() {
  return (
    <Figure
      takeaway="Even at a quarter of a point of reduced attrition, the model clears the cost of the pilot."
      source={
        <>
          1,950 non-partner lawyers, $200,000 per departure, against the $77,600 pilot. The
          1-point case is the calculator&rsquo;s default.
          <Footnote ids={[14]} className="ml-1" />
          <EstimateTag kind="illustrative" className="ml-2" />
        </>
      }
    >
      <WideBars
        data={SENSITIVITY}
        reference={SENSITIVITY_REFERENCE}
        referenceLabel={SENSITIVITY_REFERENCE_LABEL}
        height={360}
      />
    </Figure>
  )
}
