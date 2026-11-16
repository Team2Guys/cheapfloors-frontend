import { Order } from 'types/prod';
import {
  analyseAbandoned,
  customerKey,
  isFreeSample,
  isPaidPurchase,
  paidAt,
  toTime
} from './abandoned-orders';

/**
 * Sales analytics for the dashboard home. The page fetches every order on the
 * server, trims each one to what these figures need (no address, email or
 * phone), and the period maths runs in the browser so switching periods is
 * instant.
 */

export type PeriodKey = '7d' | '30d' | '90d' | '12m' | 'all';

export const PERIODS: { key: PeriodKey; label: string; long: string }[] = [
  { key: '7d', label: '7D', long: 'last 7 days' },
  { key: '30d', label: '30D', long: 'last 30 days' },
  { key: '90d', label: '90D', long: 'last 90 days' },
  { key: '12m', label: '12M', long: 'last 12 months' },
  { key: 'all', label: 'All', long: 'all time' }
];

export interface DashboardOrderProduct {
  name: string;
  totalPrice: number;
  addInstallation: boolean;
}

export interface DashboardOrder {
  orderId: string;
  /** Opaque per-customer id ("c1", "c2"…), so retries can be grouped. */
  customerId: string;
  /** Customer name, kept only on paid orders for the recent-orders list. */
  name: string;
  checkoutDate: string;
  transactionDate: string | null;
  paymentStatus: boolean;
  checkout: boolean;
  isfreesample: boolean;
  totalPrice: number;
  emirate: string;
  orderStatus: string | null;
  /** Only paid orders keep their lines (top products, installation rate). */
  products: DashboardOrderProduct[];
}

const titleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|[ -])([a-z])/g, (_match, gap: string, letter: string) => gap + letter.toUpperCase());

/** Server-side: strips each order down to what the dashboard home shows. */
export function toDashboardOrders(orders: Order[]): DashboardOrder[] {
  const ids = new Map<string, string>();
  const idFor = (order: Order) => {
    const key = customerKey(order);
    if (!ids.has(key)) ids.set(key, `c${ids.size + 1}`);
    return ids.get(key) as string;
  };

  return orders.map((order) => {
    const paid = isPaidPurchase(order);
    return {
      orderId: order.orderId,
      customerId: idFor(order),
      name: paid ? `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim() : '',
      checkoutDate: order.checkoutDate,
      transactionDate: order.transactionDate ?? null,
      paymentStatus: order.paymentStatus === true,
      checkout: order.checkout === true,
      isfreesample: isFreeSample(order),
      totalPrice: Number(order.totalPrice) || 0,
      emirate: order.emirate ? titleCase(order.emirate) : '',
      orderStatus: order.orderStatus ?? null,
      products: paid
        ? (order.products ?? []).map((product) => ({
            name: product.name,
            totalPrice: Number(product.totalPrice) || 0,
            addInstallation: product.addInstallation === true
          }))
        : []
    };
  });
}

const startOfDay = (time: number) => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const startOfMonth = (time: number, offsetMonths = 0) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth() + offsetMonths, 1).getTime();
};

const addDays = (time: number, days: number) => {
  const date = new Date(time);
  date.setDate(date.getDate() + days);
  return date.getTime();
};

export interface PeriodRange {
  from: number;
  to: number;
  /** Start of the equal period before; null for "all time". */
  prevFrom: number | null;
  bucket: 'day' | 'month';
}

export function periodRange(
  key: PeriodKey,
  now: number,
  orders: DashboardOrder[]
): PeriodRange {
  const tomorrow = addDays(startOfDay(now), 1);

  if (key === '12m' || key === 'all') {
    const to = startOfMonth(now, 1);
    if (key === '12m') {
      const from = startOfMonth(now, -11);
      return { from, to, prevFrom: startOfMonth(now, -23), bucket: 'month' };
    }
    const earliest = orders.reduce(
      (min, order) => Math.min(min, toTime(order.checkoutDate) || min),
      now
    );
    return { from: startOfMonth(earliest), to, prevFrom: null, bucket: 'month' };
  }

  const days = key === '7d' ? 7 : key === '30d' ? 30 : 90;
  const from = addDays(tomorrow, -days);
  return { from, to: tomorrow, prevFrom: addDays(from, -days), bucket: 'day' };
}

export interface PeriodMetrics {
  revenue: number;
  orders: number;
  averageOrderValue: number;
  /** Paid ÷ (paid + abandoned customers); null when nobody checked out. */
  conversion: number | null;
  abandoned: number;
  abandonedValue: number;
  freeSamples: number;
  /** Share of paid orders with installation on any line. */
  installationRate: number | null;
}

const within = (time: number, from: number, to: number) =>
  time >= from && time < to;

// A cancelled order was paid but is not a sale (same rule as cheapblinds).
const isCancelled = (order: DashboardOrder) =>
  ['cancel', 'canceled', 'cancelled'].includes((order.orderStatus ?? '').toLowerCase());

const paidIn = (orders: DashboardOrder[], from: number, to: number) =>
  orders.filter(
    (order) => isPaidPurchase(order) && !isCancelled(order) && within(paidAt(order), from, to)
  );

export function periodMetrics(
  orders: DashboardOrder[],
  from: number,
  to: number
): PeriodMetrics {
  const paid = paidIn(orders, from, to);
  const revenue = paid.reduce((sum, order) => sum + order.totalPrice, 0);
  const { groups } = analyseAbandoned(orders, { from, to });
  const abandonedValue = groups.reduce((sum, group) => sum + group.totalPrice, 0);
  const started = paid.length + groups.length;
  const withInstallation = paid.filter((order) =>
    order.products.some((product) => product.addInstallation)
  ).length;

  return {
    revenue,
    orders: paid.length,
    averageOrderValue: paid.length ? revenue / paid.length : 0,
    conversion: started ? paid.length / started : null,
    abandoned: groups.length,
    abandonedValue,
    freeSamples: orders.filter(
      (order) => order.isfreesample && within(toTime(order.checkoutDate), from, to)
    ).length,
    installationRate: paid.length ? withInstallation / paid.length : null
  };
}

export interface TrendPoint {
  label: string;
  revenue: number;
  orders: number;
}

const bucketKey = (time: number, bucket: 'day' | 'month') => {
  const date = new Date(time);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  if (bucket === 'month') return `${date.getFullYear()}-${month}`;
  return `${date.getFullYear()}-${month}-${String(date.getDate()).padStart(2, '0')}`;
};

export function trend(orders: DashboardOrder[], range: PeriodRange): TrendPoint[] {
  const points = new Map<string, TrendPoint>();
  let cursor = range.from;
  while (cursor < range.to) {
    const date = new Date(cursor);
    points.set(bucketKey(cursor, range.bucket), {
      label:
        range.bucket === 'month'
          ? date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
          : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      revenue: 0,
      orders: 0
    });
    cursor = range.bucket === 'month' ? startOfMonth(cursor, 1) : addDays(cursor, 1);
  }

  for (const order of paidIn(orders, range.from, range.to)) {
    const point = points.get(bucketKey(paidAt(order), range.bucket));
    if (!point) continue;
    point.revenue += order.totalPrice;
    point.orders += 1;
  }

  return [...points.values()];
}

export interface RankedRow {
  name: string;
  revenue: number;
  orders: number;
}

export function topProducts(
  orders: DashboardOrder[],
  from: number,
  to: number,
  limit = 5
): RankedRow[] {
  const rows = new Map<string, RankedRow>();
  for (const order of paidIn(orders, from, to)) {
    const seen = new Set<string>();
    for (const product of order.products) {
      const name = product.name?.trim() || 'Unnamed product';
      const row = rows.get(name) ?? { name, revenue: 0, orders: 0 };
      row.revenue += product.totalPrice;
      if (!seen.has(name)) row.orders += 1;
      seen.add(name);
      rows.set(name, row);
    }
  }
  return [...rows.values()]
    .sort((a, b) => b.revenue - a.revenue || b.orders - a.orders)
    .slice(0, limit);
}

export function salesByEmirate(
  orders: DashboardOrder[],
  from: number,
  to: number
): RankedRow[] {
  const rows = new Map<string, RankedRow>();
  for (const order of paidIn(orders, from, to)) {
    const name = order.emirate || 'Not given';
    const row = rows.get(name) ?? { name, revenue: 0, orders: 0 };
    row.revenue += order.totalPrice;
    row.orders += 1;
    rows.set(name, row);
  }
  return [...rows.values()].sort((a, b) => b.revenue - a.revenue || b.orders - a.orders);
}

export function recentPaidOrders(orders: DashboardOrder[], limit = 5): DashboardOrder[] {
  return orders
    .filter(isPaidPurchase)
    .sort((a, b) => paidAt(b) - paidAt(a))
    .slice(0, limit);
}
