import { cookies } from 'next/headers';
import { fetchOrders } from 'config/fetch';
import Order from './Order';
import { Order as ProdOrder } from 'types/prod';
import { analyseAbandoned } from 'utils/abandoned-orders';

const Abandoned = async () => {
  const allCookies = await cookies();
  const token =
    allCookies.get('super_admin_access_token')?.value ||
    allCookies.get('admin_access_token')?.value;

  const ordersData: ProdOrder[] = await fetchOrders(token);

  // Every "Pay" click makes a new order, so one customer's retries are grouped
  // into a single row and customers who went on to pay are left out.
  const { groups, attemptCount, recoveredCount } = analyseAbandoned(ordersData);
  const groupedRepeats = attemptCount - recoveredCount - groups.length;

  const notes = [
    groupedRepeats > 0 &&
      `${groupedRepeats} repeat ${groupedRepeats === 1 ? 'attempt is' : 'attempts are'} grouped under the customer's latest checkout`,
    recoveredCount > 0 &&
      `${recoveredCount} ${recoveredCount === 1 ? 'checkout is' : 'checkouts are'} hidden because the customer paid afterwards`
  ].filter(Boolean);

  const description = `One row per customer who started a checkout and never paid.${
    notes.length ? ` ${notes.join('; ')}.` : ''
  }`;

  return (
    <Order
      title="Abandoned Orders"
      ordersData={groups}
      description={description}
      noun={groups.length === 1 ? 'customer' : 'customers'}
    />
  );
};

export default Abandoned;
