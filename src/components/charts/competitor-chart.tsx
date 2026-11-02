import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS_STYLE, ChartFrame } from './chart-frame'
import { BIG_LAW_AVERAGE, BIG_LAW_AVERAGE_LABEL, COMPETITOR_DATA } from '@/lib/data'
import { COMPETITOR_MEDIAN, COMPETITOR_MEDIAN_LABEL } from '@/lib/figures'

/**
 * 2025 revenue growth across comparable firms, sorted descending.
 * White & Case is the one sky bar; everything else is stone.
 */
export function CompetitorChart() {
  const data = [...COMPETITOR_DATA].sort((a, b) => b.growth - a.growth)

  return (
    <ChartFrame height={420}>
      {(animate) => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            // Room at the top for the aggregate label and at the bottom for
            // the median one. At 8px the lower label was clipped in half.
            margin={{ top: 24, right: 48, bottom: 30, left: 8 }}
            barCategoryGap={8}
          >
            <XAxis type="number" domain={[0, 24]} hide />
            <YAxis
              type="category"
              dataKey="firm"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={false}
              width={128}
            />

            <ReferenceLine
              x={BIG_LAW_AVERAGE}
              stroke="#0E1E3A"
              strokeDasharray="6 4"
              label={{
                value: BIG_LAW_AVERAGE_LABEL,
                position: 'top',
                fill: '#0E1E3A',
                fontSize: 12,
                fontFamily: AXIS_STYLE.fontFamily,
              }}
            />

            {/* The aggregate alone reads as a benchmark these nine missed.
                The median of the nine is the like-for-like comparison. */}
            <ReferenceLine
              x={COMPETITOR_MEDIAN}
              stroke="#6B7280"
              strokeDasharray="3 4"
              label={{
                value: COMPETITOR_MEDIAN_LABEL,
                position: 'bottom',
                fill: '#6B7280',
                fontSize: 12,
                fontFamily: AXIS_STYLE.fontFamily,
              }}
            />

            <Bar
              dataKey="growth"
              isAnimationActive={animate}
              animationDuration={900}
              radius={[0, 2, 2, 0]}
            >
              {data.map((row) => (
                <Cell key={row.firm} fill={row.isWhiteCase ? '#8DB4E2' : '#E6E1D6'} />
              ))}
              <LabelList
                dataKey="growth"
                position="right"
                formatter={(value) => `${Number(value).toFixed(2)}%`}
                style={{
                  fill: '#2B3445',
                  fontSize: 12,
                  fontFamily: AXIS_STYLE.fontFamily,
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  )
}
