import ECommerce from 'components/Dashboard/E-commerce';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import { fetchOrders, get_all_records } from 'config/fetch';
import { cookies } from 'next/headers';
import { toDashboardOrders } from 'utils/dashboard-analytics';

async function DashboardMain() {
  const cookie = await cookies();
  const token = cookie.get('admin_access_token')?.value;
  const superAdmin = cookie.get('super_admin_access_token')?.value;
  const finaltoken = token || superAdmin || '';
  const [records, orders] = await Promise.all([
    get_all_records(finaltoken),
    fetchOrders(finaltoken)
  ]);

  return (
    <DefaultLayout>
      {/* Orders are trimmed on the server: no addresses, emails or phones
          reach the browser, only what the charts and lists show. */}
      <ECommerce records={records} orders={toDashboardOrders(orders ?? [])} />
    </DefaultLayout>
  );
}

export default DashboardMain;
