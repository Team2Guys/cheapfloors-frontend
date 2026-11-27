import { cookies } from 'next/headers';
import { fetchOrders } from 'config/fetch';
import Order from '../abundant/Order';
import { FETCH_ALL_ORDERS } from 'graphql/queries';
import { Order as prodOrder } from 'types/prod';

const OrdersPage = async () => {
  const allCookies = await cookies();
  const token =
    allCookies.get('super_admin_access_token')?.value ||
    allCookies.get('admin_access_token')?.value;

  const ordersData = await fetchOrders(token, FETCH_ALL_ORDERS);
  // A free-sample row is a real order when its AED 15 shipping was paid, or
  // when it came from the old no-payment flow (plain numeric order id).
  // Unpaid rows from the paid flow are abandoned checkouts: every "Pay"
  // click makes a new row, so showing them here duplicated customers.
  const isLegacyFreeSample = (orderId: string) => /^\d+$/.test(String(orderId));
  const filteredOrder = ordersData
    .filter(
      (value: prodOrder) =>
        value.isfreesample &&
        (value.paymentStatus === true || isLegacyFreeSample(value.orderId))
    )
    .sort(
      (a: prodOrder, b: prodOrder) =>
        new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime()
    );
  return (
    <Order
      title="Free Sample Orders"
      ordersData={filteredOrder}
      isfreesample
    />
  );
};

export default OrdersPage;
