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
  const filteredOrder = ordersData
    .filter((value: prodOrder) => value.isfreesample)
    .sort(
      (a: prodOrder, b: prodOrder) =>
        new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime()
    );
  return (
    <Order
      title="Free Sample Orders"
      ordersData={filteredOrder}
      isfreesample
      orders={ordersData}
    />
  );
};

export default OrdersPage;
