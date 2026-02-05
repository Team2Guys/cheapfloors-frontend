'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { MONTHLYGRAPH } from 'types/general';

const baseColorArray = ['#80CAEE', '#3C50E0'];

export default function ChartOne({ chartData }: { chartData: MONTHLYGRAPH }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    setIsDark(checkDark());
    const obs = new MutationObserver(() => setIsDark(checkDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => obs.disconnect();
  }, []);
  const data = useMemo(() => {
    if (!chartData) return [];

    const cats = chartData.categories || [];
    const points = cats.map((cat, idx) => {
      const d = new Date(cat);
      const label = isNaN(d.getTime())
        ? cat
        : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      //eslint-disable-next-line
      const row: any = { name: label };
      chartData.series.forEach((s) => {
        row[s.name] = s.data[idx] ?? 0;
      });
      return row;
    });
    return points;
  }, [chartData]);

  const tickColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? '#333' : '#e0e0e0';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';

  return (
    <div className="col-span-12 border p-3 shadow rounded-xl sm:px-7 xl:col-span-8 space-y-4 bg-white dark:bg-black">
      <p className="font-semibold dark:text-white">Monthly Statistics</p>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 14 }} />
            <YAxis tick={{ fill: tickColor, fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderRadius: '0.5rem',
                color: tickColor
              }}
            />
            <Legend wrapperStyle={{ color: tickColor }} />
            {chartData.series.map((s, idx) => (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={baseColorArray[idx % baseColorArray.length]}
                fill={baseColorArray[idx % baseColorArray.length]}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
