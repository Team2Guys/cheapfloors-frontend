import { authOptions } from 'auth/authOptions';
import OrderHistoryTable from 'components/OrderHistory/OrderHistory';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { fetchOrdersHistory } from 'config/fetch';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { Order } from 'types/prod';

const OrderHistory = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const email = session.user?.email;
  const allCookies = await cookies();
  const token =
    allCookies.get('super_admin_access_token')?.value ||
    allCookies.get('admin_access_token')?.value;
  const OrderHistory = await fetchOrdersHistory(token, email);
  const sortedOrderHistory = OrderHistory.sort(
    (a: Order, b: Order) =>
      new Date(b.checkoutDate).getTime() - new Date(a.checkoutDate).getTime()
  );
  return (
    <>
      <Breadcrumb title="Order History" />
      {sortedOrderHistory.length > 0 ? (
        <OrderHistoryTable OrderHistory={sortedOrderHistory} />
      ) : (
        <h1 className="text-center text-2xl font-semibold my-10">
          No Order History Found
        </h1>
      )}
    </>
  );
};

export default OrderHistory;
