import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AXIS_STYLE, ChartFrame, ChartTooltip, GRID_STROKE } from './chart-frame'
import { REVENUE_DATA, REVENUE_GOAL } from '@/lib/data'

/**
 * Revenue to 2025 as a solid navy line, the ~8.4% projection dotted in sky,
 * the $5bn goal as a dashed rule, and the shortfall between them shaded.
 */
export function RevenueChart() {
  return (
    <ChartFrame height={360}>
      {(animate) => (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={REVENUE_DATA}
            margin={{ top: 16, right: 16, bottom: 8, left: -8 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8DB4E2" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#8DB4E2" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis
              dataKey="year"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: GRID_STROKE }}
            />
            <YAxis
              domain={[2.5, 5.4]}
              ticks={[3, 3.5, 4, 4.5, 5]}
              tickFormatter={(v: number) => `$${v}bn`}
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={false}
              width={60}
            />

            {/* The gap between the projection and the goal in 2028. */}
            <ReferenceArea
              x1={2027}
              x2={2028}
              y1={4.578}
              y2={REVENUE_GOAL}
              fill="#8DB4E2"
              fillOpacity={0.14}
              stroke="none"
            />

            <ReferenceLine
              y={REVENUE_GOAL}
              stroke="#0E1E3A"
              strokeDasharray="6 4"
              strokeWidth={1}
              label={{
                value: '$5.0bn 2028 goal',
                position: 'insideTopLeft',
                fill: '#0E1E3A',
                fontSize: 12,
                fontFamily: AXIS_STYLE.fontFamily,
              }}
            />

            <Tooltip
              cursor={{ stroke: GRID_STROKE }}
              content={
                <ChartTooltip formatter={(value) => `$${value.toFixed(3)}bn`} />
              }
            />

            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="none"
              fill="url(#revenueFill)"
              isAnimationActive={animate}
              animationDuration={1100}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#0E1E3A"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0E1E3A', strokeWidth: 0 }}
              isAnimationActive={animate}
              animationDuration={1100}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="projected"
              name="Projected at ~8.4%"
              stroke="#3D6CA6"
              strokeWidth={2}
              strokeDasharray="3 4"
              dot={{ r: 3, fill: '#3D6CA6', strokeWidth: 0 }}
              isAnimationActive={animate}
              animationDuration={1100}
              animationBegin={animate ? 500 : 0}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </ChartFrame>
  )
}
