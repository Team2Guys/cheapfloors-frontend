import { ReactNode } from 'react';

// Admin pages must always show live data. Their GraphQL fetches are POSTs, so
// they never land in the Data Cache and revalidateTag can't refresh them;
// without this every dashboard page is prerendered at build time and stays
// frozen on whatever the API returned then (e.g. an empty category list if the
// backend was down during the build).
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
