'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { WEEKLYGRAPH } from 'types/general';

const baseColorArray = ['#80CAEE', '#3C50E0'];

export default function ChartTwo({ chartData }: { chartData: WEEKLYGRAPH }) {
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
    return cats.map((cat, idx) => {
      const maybeDate = new Date(cat);
      const label = isNaN(maybeDate.getTime())
        ? cat
        : maybeDate.toLocaleDateString('en-US', { weekday: 'short' });
      //eslint-disable-next-line
      const row: any = { name: label };
      chartData.series.forEach((s) => {
        row[s.name] = s.data[idx] ?? 0;
      });
      return row;
    });
  }, [chartData]);

  const tickColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? '#333' : '#e0e0e0';
  const tooltipBg = isDark ? '#1f2937' : '#ffffff';

  return (
    <div className="col-span-12 rounded-xl border p-5 shadow xl:col-span-4 space-y-4 bg-white dark:bg-black">
      <p className="font-semibold dark:text-white">Weekly Statistics</p>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            barCategoryGap="25%" // similar to columnWidth: '25%'
          >
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: tickColor, fontSize: 14 }} // small weekday text
              axisLine={false}
              tickLine={false}
            />
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
              <Bar
                key={s.name}
                dataKey={s.name}
                stackId="a"
                fill={baseColorArray[idx % baseColorArray.length]}
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
