import { cookies } from 'next/headers';
import { fetchOrders } from 'config/fetch';
import Order from './Order';
import { Order as ProdOrder } from 'types/prod';

const Abandoned = async () => {
  const allCookies = await cookies();
  const token =
    allCookies.get('super_admin_access_token')?.value ||
    allCookies.get('admin_access_token')?.value;

  const ordersData = await fetchOrders(token);
  const abandonedOrder = ordersData
    .filter(
      (item: ProdOrder) =>
        item.paymentStatus === false &&
        item.checkout === true &&
        (item.isfreesample === false || item.isfreesample === null)
    )
    .sort(
      (a: ProdOrder, b: ProdOrder) =>
        new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime()
    );
  return (
    <Order
      title="Abandoned Order"
      ordersData={abandonedOrder}
      orders={ordersData}
    />
  );
};

export default Abandoned;
