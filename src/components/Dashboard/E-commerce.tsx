'use client';
import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  LuBoxes,
  LuCalendarClock,
  LuFolderTree,
  LuLayers,
  LuMinus,
  LuPackageOpen,
  LuPercent,
  LuPuzzle,
  LuReceipt,
  LuRuler,
  LuShieldCheck,
  LuShoppingBag,
  LuShoppingCart,
  LuTrendingDown,
  LuTrendingUp,
  LuUsers,
  LuWallet,
  LuWrench
} from 'react-icons/lu';
import { useAppSelector } from 'components/Others/HelperRedux';
import { useAdminAuthInit } from 'hooks/useAuthInitializer';
import { RECORDS } from 'types/type';
import {
  DashboardOrder,
  PERIODS,
  PeriodKey,
  RankedRow,
  periodMetrics,
  periodRange,
  recentPaidOrders,
  salesByEmirate,
  topProducts,
  trend
} from 'utils/dashboard-analytics';
import { paidAt } from 'utils/abandoned-orders';

const SalesTrend = dynamic(() => import('./Charts/SalesTrend'), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse rounded-lg bg-dash-sunken" />
});

const aed = (value: number) => `AED ${Math.round(value).toLocaleString('en-AE')}`;
const count = (value: number) => value.toLocaleString('en-AE');
const percent = (value: number | null) =>
  value === null ? '—' : `${(value * 100).toFixed(value > 0 && value < 0.1 ? 1 : 0)}%`;

type Delta = { text: string; direction: -1 | 0 | 1; good: boolean | null };

/** Change against the previous period; `points` compares two rates. */
const changeOf = (
  current: number | null,
  previous: number | null | undefined,
  { goodWhenUp = true, points = false } = {}
): Delta | null => {
  if (previous === undefined || previous === null || current === null) return null;
  const diff = current - previous;
  const direction = diff > 0 ? 1 : diff < 0 ? -1 : 0;
  const good = direction === 0 ? null : direction > 0 === goodWhenUp;

  if (points) {
    const value = (diff * 100).toFixed(1);
    return { text: `${diff > 0 ? '+' : ''}${value} pts`, direction, good };
  }
  if (previous === 0) {
    return current === 0
      ? { text: '0%', direction: 0, good: null }
      : { text: 'New', direction: 1, good: goodWhenUp };
  }
  return {
    text: `${diff > 0 ? '+' : ''}${Math.round((diff / previous) * 100)}%`,
    direction,
    good
  };
};

const DeltaChip = ({ delta }: { delta: Delta }) => {
  const Icon =
    delta.direction > 0 ? LuTrendingUp : delta.direction < 0 ? LuTrendingDown : LuMinus;
  const tone =
    delta.good === null
      ? 'bg-dash-sunken text-dash-muted'
      : delta.good
        ? 'bg-dash-positive-soft text-dash-positive'
        : 'bg-dash-negative-soft text-dash-negative';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${tone}`}
    >
      <Icon className="size-3.5" />
      {delta.text}
    </span>
  );
};

const KpiTile = ({
  label,
  value,
  icon: Icon,
  delta,
  sub
}: {
  label: string;
  value: string;
  icon: IconType;
  delta?: Delta | null;
  sub?: string;
}) => (
  <div className="rounded-xl border border-dash-line bg-dash-surface p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-dash-muted">{label}</p>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-dash-accent-soft text-dash-accent-text">
        <Icon className="size-[18px]" />
      </span>
    </div>
    <p className="mt-1 text-[26px] font-semibold leading-tight tracking-tight tabular-nums text-dash-ink">
      {value}
    </p>
    <div className="mt-2 flex min-h-[22px] flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      {delta && <DeltaChip delta={delta} />}
      {sub && <span className="text-dash-muted">{sub}</span>}
    </div>
  </div>
);

const Panel = ({
  title,
  description,
  actions,
  className = '',
  children
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section className={`rounded-xl border border-dash-line bg-dash-surface ${className}`}>
    <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-dash-ink">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-dash-muted">{description}</p>}
      </div>
      {actions}
    </header>
    <div className="p-5 pt-4">{children}</div>
  </section>
);

const RankedList = ({
  rows,
  byRevenue,
  emptyText
}: {
  rows: RankedRow[];
  byRevenue: boolean;
  emptyText: string;
}) => {
  if (!rows.length) {
    return <p className="py-6 text-center text-sm text-dash-muted">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((row) => (byRevenue ? row.revenue : row.orders)), 1);
  return (
    <ul className="space-y-4">
      {rows.map((row) => {
        const value = byRevenue ? row.revenue : row.orders;
        return (
          <li key={row.name}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium text-dash-ink" title={row.name}>
                {row.name}
              </span>
              <span className="shrink-0 tabular-nums text-dash-ink">
                {byRevenue ? aed(row.revenue) : count(row.orders)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-dash-sunken">
              <div
                className="h-full rounded-full bg-dash-accent"
                style={{ width: `${Math.max(4, (value / max) * 100)}%` }}
              />
            </div>
            {byRevenue && (
              <p className="mt-1 text-xs text-dash-muted">
                {count(row.orders)} {row.orders === 1 ? 'order' : 'orders'}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const STATUS_TONE: Record<string, string> = {
  delivered: 'bg-dash-positive-soft text-dash-positive',
  shipped: 'bg-dash-accent-soft text-dash-accent-text',
  cancel: 'bg-dash-negative-soft text-dash-negative',
  canceled: 'bg-dash-negative-soft text-dash-negative'
};

const StatusPill = ({ status }: { status: string | null }) => {
  const key = (status || 'placed').toLowerCase();
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        STATUS_TONE[key] ?? 'bg-dash-sunken text-dash-muted'
      }`}
    >
      {key === 'cancel' ? 'cancelled' : key}
    </span>
  );
};

const CatalogueTile = ({
  label,
  value,
  icon: Icon,
  href
}: {
  label: string;
  value: string | number | undefined;
  icon: IconType;
  href?: string;
}) => {
  const body = (
    <>
      <Icon className="size-5 shrink-0 text-dash-faint" />
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-tight tabular-nums text-dash-ink">
          {Number(value ?? 0).toLocaleString('en-AE')}
        </p>
        <p className="truncate text-xs text-dash-muted">{label}</p>
      </div>
    </>
  );
  const className =
    'flex items-center gap-3 rounded-xl border border-dash-line bg-dash-surface px-4 py-3 transition-colors';
  return href ? (
    <Link href={href} className={`${className} hover:border-dash-accent`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
};

const ECommerce = ({
  records,
  orders
}: {
  records: RECORDS;
  orders: DashboardOrder[];
}) => {
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);
  useAdminAuthInit();

  const [period, setPeriod] = useState<PeriodKey>('30d');
  // Periods are worked out in the viewer's own time zone, so nothing is
  // computed until the page is in the browser.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);

  const canCheckProfit =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canCheckProfit : true);
  const CanCheckRevnue =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canCheckRevenue : true);
  const canViewUsers =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canViewUsers : true);
  const canViewSales =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canViewSales : true);
  const canVeiwAdmins =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canVeiwAdmins : true);
  const canVeiwTotalproducts =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canVeiwTotalproducts : true);
  const canVeiwTotalCategories =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canVeiwTotalCategories : true);

  const periodInfo = PERIODS.find((item) => item.key === period) ?? PERIODS[1];

  const analytics = useMemo(() => {
    if (now === null) return null;
    const range = periodRange(period, now, orders);
    const current = periodMetrics(orders, range.from, range.to);
    const previous =
      range.prevFrom === null ? null : periodMetrics(orders, range.prevFrom, range.from);
    return {
      current,
      previous,
      points: trend(orders, range),
      products: topProducts(orders, range.from, range.to),
      emirates: salesByEmirate(orders, range.from, range.to).slice(0, 6),
      recent: recentPaidOrders(orders)
    };
  }, [orders, period, now]);

  const showMoney = Boolean(CanCheckRevnue);
  const showSales = Boolean(canViewSales);
  const ready = Boolean(loggedInUser) && analytics !== null;
  const compareText =
    analytics?.previous === null ? undefined : `vs previous ${periodInfo.long.replace('last ', '')}`;

  const kpis: React.ComponentProps<typeof KpiTile>[] = [];
  if (analytics) {
    const { current, previous } = analytics;
    if (showMoney) {
      kpis.push({
        label: 'Revenue',
        value: aed(current.revenue),
        icon: LuWallet,
        delta: changeOf(current.revenue, previous?.revenue),
        sub: compareText
      });
    }
    if (showSales) {
      kpis.push({
        label: 'Paid orders',
        value: count(current.orders),
        icon: LuShoppingBag,
        delta: changeOf(current.orders, previous?.orders),
        sub: compareText
      });
    }
    if (showMoney) {
      kpis.push({
        label: 'Average order value',
        value: aed(current.averageOrderValue),
        icon: LuReceipt,
        delta: changeOf(current.averageOrderValue, previous?.averageOrderValue),
        sub: compareText
      });
    }
    if (showSales) {
      kpis.push({
        label: 'Checkout conversion',
        value: percent(current.conversion),
        icon: LuPercent,
        delta: changeOf(current.conversion, previous?.conversion, { points: true }),
        sub: 'paid ÷ checkouts started'
      });
      kpis.push({
        label: 'Abandoned carts',
        value: count(current.abandoned),
        icon: LuShoppingCart,
        delta: changeOf(current.abandoned, previous?.abandoned, { goodWhenUp: false }),
        sub: showMoney ? `${aed(current.abandonedValue)} at stake` : 'one per customer'
      });
    }
    if (canViewUsers) {
      kpis.push({
        label: 'Free samples',
        value: count(current.freeSamples),
        icon: LuPackageOpen,
        delta: changeOf(current.freeSamples, previous?.freeSamples),
        sub: compareText
      });
    }
  }

  const catalogue = [
    canVeiwAdmins && { label: 'Admins', value: records?.totalAdmins, icon: LuShieldCheck, href: '/dashboard/super-admin' },
    canVeiwTotalproducts && { label: 'Products', value: records?.totalProducts, icon: LuBoxes, href: '/dashboard/products' },
    canViewUsers && { label: 'Accessories', value: records?.totalAccessories, icon: LuPuzzle, href: '/dashboard/accessories' },
    canVeiwTotalCategories && { label: 'Categories', value: records?.totalCategories, icon: LuFolderTree, href: '/dashboard/category' },
    canCheckProfit && { label: 'Sub categories', value: records?.totalSubCategories, icon: LuLayers, href: '/dashboard/subcategory' },
    canViewUsers && { label: 'Users', value: records?.totalUsers, icon: LuUsers }
  ].filter(Boolean) as React.ComponentProps<typeof CatalogueTile>[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dash-ink">
            {loggedInUser?.fullname ? `Welcome back, ${loggedInUser.fullname}` : 'Overview'}
          </h1>
          <p className="mt-1 text-sm text-dash-muted">
            Sales and checkout activity for cheapfloors.ae, {periodInfo.long}.
          </p>
        </div>
        {(showSales || showMoney) && (
          <div
            role="tablist"
            aria-label="Period"
            className="inline-flex self-start rounded-lg border border-dash-line bg-dash-surface p-1 sm:self-auto"
          >
            {PERIODS.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={item.key === period}
                onClick={() => setPeriod(item.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  item.key === period
                    ? 'bg-dash-accent text-dash-accent-ink'
                    : 'text-dash-muted hover:text-dash-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!ready ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-[132px] animate-pulse rounded-xl border border-dash-line bg-dash-surface" />
          ))}
        </div>
      ) : (
        <>
          {kpis.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {kpis.map((kpi) => (
                <KpiTile key={kpi.label} {...kpi} />
              ))}
            </div>
          )}

          {(showSales || showMoney) && analytics && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Panel
                className="xl:col-span-8"
                title={showMoney ? 'Revenue & orders' : 'Paid orders'}
                description={`${periodInfo.long[0].toUpperCase()}${periodInfo.long.slice(1)}, paid purchases only`}
                actions={
                  <div className="flex items-center gap-4 text-xs text-dash-muted">
                    {showMoney && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-3 rounded-sm bg-dash-accent" /> Revenue
                      </span>
                    )}
                    {showSales && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className={
                            showMoney
                              ? 'h-0.5 w-3 rounded bg-dash-ink opacity-60'
                              : 'h-2 w-3 rounded-sm bg-dash-accent'
                          }
                        />{' '}
                        Orders
                      </span>
                    )}
                  </div>
                }
              >
                <SalesTrend data={analytics.points} showRevenue={showMoney} showOrders={showSales} />
              </Panel>

              <Panel className="xl:col-span-4" title="Checkout funnel" description="Customers, not attempts">
                <FunnelBody
                  started={analytics.current.orders + analytics.current.abandoned}
                  paid={analytics.current.orders}
                  abandoned={analytics.current.abandoned}
                  conversion={analytics.current.conversion}
                  installationRate={analytics.current.installationRate}
                  showSales={showSales}
                  appointments={
                    canViewUsers
                      ? {
                          installation: Number(records?.InstallationAppointments ?? 0),
                          measurement: Number(records?.MeasureAppointments ?? 0)
                        }
                      : null
                  }
                />
              </Panel>
            </div>
          )}

          {(showSales || showMoney) && analytics && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Panel title="Top products" description={showMoney ? 'By revenue' : 'By orders'}>
                <RankedList
                  rows={analytics.products}
                  byRevenue={showMoney}
                  emptyText="No paid orders in this period."
                />
              </Panel>
              <Panel title="Sales by emirate" description={showMoney ? 'By revenue' : 'By orders'}>
                <RankedList
                  rows={analytics.emirates}
                  byRevenue={showMoney}
                  emptyText="No paid orders in this period."
                />
              </Panel>
            </div>
          )}

          {showSales && analytics && (
            <Panel
              title="Recent orders"
              description="Latest paid purchases"
              actions={
                <Link href="/dashboard/orders" className="text-sm font-medium text-dash-accent-text hover:underline">
                  View all
                </Link>
              }
            >
              {analytics.recent.length === 0 ? (
                <p className="py-6 text-center text-sm text-dash-muted">No paid orders yet.</p>
              ) : (
                <ul className="-my-3 divide-y divide-dash-line">
                  {analytics.recent.map((order) => (
                    <li key={order.orderId} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-dash-ink">
                          {order.name || 'Customer'}
                        </p>
                        <p className="font-mono text-xs text-dash-muted">{order.orderId}</p>
                      </div>
                      <span className="text-xs text-dash-muted">
                        {new Date(paidAt(order)).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <StatusPill status={order.orderStatus} />
                      {showMoney && (
                        <span className="w-28 text-right text-sm font-semibold tabular-nums text-dash-ink">
                          {aed(order.totalPrice)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {catalogue.length > 0 && (
            <div>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-dash-faint">
                Catalogue & accounts
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {catalogue.map((tile) => (
                  <CatalogueTile key={tile.label} {...tile} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const FunnelBody = ({
  started,
  paid,
  abandoned,
  conversion,
  installationRate,
  showSales,
  appointments
}: {
  started: number;
  paid: number;
  abandoned: number;
  conversion: number | null;
  installationRate: number | null;
  showSales: boolean;
  appointments: { installation: number; measurement: number } | null;
}) => {
  const share = (value: number) => (started ? Math.max(3, (value / started) * 100) : 0);
  return (
    <div className="space-y-5">
      {showSales && (
        <div className="space-y-3">
          {[
            { label: 'Checkouts started', value: started, width: started ? 100 : 0, bar: 'bg-dash-faint opacity-50' },
            { label: 'Paid', value: paid, width: share(paid), bar: 'bg-dash-accent' },
            { label: 'Abandoned', value: abandoned, width: share(abandoned), bar: 'bg-dash-negative opacity-70' }
          ].map((step) => (
            <div key={step.label}>
              <div className="flex justify-between text-sm">
                <span className="text-dash-muted">{step.label}</span>
                <span className="font-medium tabular-nums text-dash-ink">{count(step.value)}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-dash-sunken">
                <div className={`h-full rounded-full ${step.bar}`} style={{ width: `${step.width}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-dash-muted">
            <span className="font-semibold text-dash-ink">{percent(conversion)}</span> of
            customers who started a checkout paid.
          </p>
        </div>
      )}

      <dl className="grid grid-cols-1 gap-3 border-t border-dash-line pt-4 text-sm">
        {showSales && (
          <div className="flex items-center gap-3">
            <LuWrench className="size-4 text-dash-faint" />
            <dt className="flex-1 text-dash-muted">Orders with installation</dt>
            <dd className="font-medium tabular-nums text-dash-ink">{percent(installationRate)}</dd>
          </div>
        )}
        {appointments && (
          <>
            <div className="flex items-center gap-3">
              <LuCalendarClock className="size-4 text-dash-faint" />
              <dt className="flex-1 text-dash-muted">Installation appointments</dt>
              <dd className="font-medium tabular-nums text-dash-ink">{count(appointments.installation)}</dd>
            </div>
            <div className="flex items-center gap-3">
              <LuRuler className="size-4 text-dash-faint" />
              <dt className="flex-1 text-dash-muted">Measurement appointments</dt>
              <dd className="font-medium tabular-nums text-dash-ink">{count(appointments.measurement)}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};

export default ECommerce;
