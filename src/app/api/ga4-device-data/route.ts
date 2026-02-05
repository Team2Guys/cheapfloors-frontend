import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
const keyFilePath = path.join(
  process.cwd(),
  'public',
  'assets',
  'ga4-analytics.json'
);
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const credentials = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/500503918`,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }]
    });

    return NextResponse.json({ results: response.rows });
  } catch (err: unknown) {
    console.error('GA4 API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
