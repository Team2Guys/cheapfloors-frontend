'use client';

import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { TrendPoint } from 'utils/dashboard-analytics';

/**
 * Revenue (bars, left axis) and paid orders (line, right axis) per day or
 * month; without revenue access the orders show as the bars instead. Colours are the dashboard theme's CSS variables, so the chart
 * follows the theme picker and dark mode without re-rendering.
 */

// Admins who ask the OS for less motion get the chart without the grow-in.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const aed = (value: number) => `AED ${Math.round(value).toLocaleString('en-AE')}`;

const compact = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return String(Math.round(value));
};

type TooltipProps = {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
};

const TrendTooltip = ({ active, label, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const valueOf = (key: string) =>
    Number(payload.find((item) => item.dataKey === key)?.value ?? 0);
  const hasRevenue = payload.some((item) => item.dataKey === 'revenue');
  const hasOrders = payload.some((item) => item.dataKey === 'orders');

  return (
    <div className="rounded-lg border border-dash-line bg-dash-surface px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-dash-ink">{label}</p>
      {hasRevenue && (
        <p className="flex items-center gap-2 text-dash-muted">
          <span className="size-2 rounded-full bg-dash-accent" />
          Revenue
          <span className="ml-auto pl-3 font-medium text-dash-ink">
            {aed(valueOf('revenue'))}
          </span>
        </p>
      )}
      {hasOrders && (
        <p className="flex items-center gap-2 text-dash-muted">
          <span className="size-2 rounded-full bg-dash-muted" />
          Paid orders
          <span className="ml-auto pl-3 font-medium text-dash-ink">
            {valueOf('orders')}
          </span>
        </p>
      )}
    </div>
  );
};

export default function SalesTrend({
  data,
  showRevenue,
  showOrders
}: {
  data: TrendPoint[];
  showRevenue: boolean;
  showOrders: boolean;
}) {
  const tick = { fill: 'var(--dash-muted)', fontSize: 12 };
  const [animate] = React.useState(() => !prefersReducedMotion());

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid stroke="var(--dash-line)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={tick}
            tickLine={false}
            axisLine={{ stroke: 'var(--dash-line)' }}
            interval="preserveStartEnd"
            minTickGap={18}
          />
          {showRevenue && (
            <YAxis
              yAxisId="revenue"
              tick={tick}
              tickLine={false}
              axisLine={false}
              tickFormatter={compact}
              width={44}
            />
          )}
          {showOrders && (
            <YAxis
              yAxisId="orders"
              orientation={showRevenue ? 'right' : 'left'}
              tick={tick}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={showRevenue ? 28 : 36}
            />
          )}
          <Tooltip
            cursor={{ fill: 'var(--dash-sunken)' }}
            content={<TrendTooltip />}
          />
          {showRevenue && (
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="var(--dash-accent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
              isAnimationActive={animate}
            />
          )}
          {showOrders && !showRevenue && (
            <Bar
              yAxisId="orders"
              dataKey="orders"
              fill="var(--dash-accent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
              isAnimationActive={animate}
            />
          )}
          {showOrders && showRevenue && (
            <Line
              yAxisId="orders"
              type="linear"
              dataKey="orders"
              stroke="var(--dash-ink)"
              strokeOpacity={0.55}
              strokeWidth={1.5}
              dot={data.length <= 31 ? { r: 2, strokeWidth: 0, fill: 'var(--dash-ink)' } : false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--dash-ink)' }}
              isAnimationActive={animate}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
