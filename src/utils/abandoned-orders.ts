/**
 * Abandoned checkouts, one row per customer.
 *
 * Every click on "Pay" creates a new order row, so a customer who retries a
 * failed payment shows up several times, and a customer who came back and
 * paid still has their earlier unpaid attempts. The dashboard groups those
 * attempts by customer, keeps the latest, and leaves out anyone who went on
 * to buy. The cheapblinds dashboard applies the same rule.
 */

// A paid order up to this long BEFORE an unpaid attempt still covers it: a
// double-clicked Pay, or a retry right after paying, leaves a stray row.
export const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;

export interface CheckoutLike {
  orderId: string;
  checkoutDate: string | Date;
  transactionDate?: string | Date | null;
  paymentStatus?: boolean | null;
  checkout?: boolean | null;
  isfreesample?: boolean | string | null;
  totalPrice?: number | null;
  email?: string | null;
  phone?: string | null;
  /** An opaque customer id, used when email and phone were stripped. */
  customerId?: string | null;
}

export type AbandonedGroup<T> = T & {
  /** How many unpaid checkouts this customer started. */
  attempts: number;
  /** Their order ids, newest first. */
  attemptOrderIds: string[];
};

export const toTime = (value: string | Date | null | undefined): number => {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const isFreeSample = (order: CheckoutLike): boolean =>
  order.isfreesample === true || order.isfreesample === 'true';

export const isPaidPurchase = (order: CheckoutLike): boolean =>
  order.paymentStatus === true && !isFreeSample(order);

export const isAbandonedCheckout = (order: CheckoutLike): boolean =>
  order.paymentStatus !== true && order.checkout === true && !isFreeSample(order);

/** When a paid order was paid; older rows may only have the checkout date. */
export const paidAt = (order: CheckoutLike): number =>
  toTime(order.transactionDate) || toTime(order.checkoutDate);

/** Email first, then the phone's digits, then the order itself. */
export const customerKey = (order: CheckoutLike): string => {
  if (order.customerId) return `id:${order.customerId}`;
  const email = (order.email ?? '').trim().toLowerCase();
  if (email) return `email:${email}`;
  const phone = (order.phone ?? '').replace(/[^0-9]/g, '');
  if (phone) return `phone:${phone}`;
  return `order:${order.orderId}`;
};

export interface AbandonedAnalysis<T> {
  /** One row per customer: their latest unpaid attempt. Newest first. */
  groups: AbandonedGroup<T>[];
  /** Unpaid attempts considered (inside the window, if one was given). */
  attemptCount: number;
  /** Attempts left out because the customer paid afterwards. */
  recoveredCount: number;
}

/**
 * Groups the abandoned checkouts in `orders`. With a window, only attempts
 * started in [from, to) count; a later payment hides an attempt whenever it
 * happened, since the customer did buy in the end.
 */
export function analyseAbandoned<T extends CheckoutLike>(
  orders: T[],
  window?: { from?: number; to?: number }
): AbandonedAnalysis<T> {
  const paidTimes = new Map<string, number[]>();
  for (const order of orders) {
    if (!isPaidPurchase(order)) continue;
    const key = customerKey(order);
    paidTimes.set(key, [...(paidTimes.get(key) ?? []), paidAt(order)]);
  }

  const attemptsByCustomer = new Map<string, T[]>();
  let attemptCount = 0;
  let recoveredCount = 0;

  for (const order of orders) {
    if (!isAbandonedCheckout(order)) continue;
    const startedAt = toTime(order.checkoutDate);
    if (window?.from !== undefined && startedAt < window.from) continue;
    if (window?.to !== undefined && startedAt >= window.to) continue;

    attemptCount += 1;
    const key = customerKey(order);
    const paidAfter = (paidTimes.get(key) ?? []).some(
      (paid) => paid >= startedAt - DUPLICATE_WINDOW_MS
    );
    if (paidAfter) {
      recoveredCount += 1;
      continue;
    }
    attemptsByCustomer.set(key, [...(attemptsByCustomer.get(key) ?? []), order]);
  }

  const groups = [...attemptsByCustomer.values()]
    .map((attempts) => {
      const newestFirst = [...attempts].sort(
        (a, b) => toTime(b.checkoutDate) - toTime(a.checkoutDate)
      );
      return {
        ...newestFirst[0],
        attempts: newestFirst.length,
        attemptOrderIds: newestFirst.map((attempt) => attempt.orderId)
      };
    })
    .sort((a, b) => toTime(b.checkoutDate) - toTime(a.checkoutDate));

  return { groups, attemptCount, recoveredCount };
}
