import dynamic from 'next/dynamic';
const ECommerce = dynamic(() => import('components/Dashboard/E-commerce'));
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import { get_all_records } from 'config/fetch';
import { cookies } from 'next/headers';
import {
  GET_LAST_7_DAYS_STATSHANDLER,
  GET_MONTHLY_STATSHander
} from 'config/general';
import { GET_LAST_7_DAYS_STATS, GET_MONTHLY_STATS } from 'graphql/general';
import { STATUS } from 'types/general';

async function DashboardMain() {
  const cookie = await cookies();
  const token = cookie.get('admin_access_token')?.value;
  const superAdmin = cookie.get('super_admin_access_token')?.value;
  const finaltoken = token || superAdmin || '';
  const [records, monthly, weekly] = await Promise.all([
    get_all_records(finaltoken),
    GET_MONTHLY_STATSHander(GET_MONTHLY_STATS),
    GET_LAST_7_DAYS_STATSHANDLER(GET_LAST_7_DAYS_STATS)
  ]);

  const categories = monthly?.completeMonthlyData?.map(
    (item: { month: string; Revenue: number; Orders: number }) => item.month
  );
  const appointmentsData = monthly?.completeMonthlyData?.map(
    (item: { Appointments: string; Orders: number }) => item.Orders || 0
  );

  const MonthlyCharts = {
    categories,
    series: [{ name: 'Orders', data: appointmentsData }]
  };

  const defaultArray = [
    {
      name: 'Orders',
      data: weekly?.map((item: STATUS) => item.orders)
    }
  ];

  const weeklyChart = {
    categories: weekly?.map((item: STATUS) => item.day),
    series: defaultArray
  };
  console.log(records,'records')
  return (
    <DefaultLayout>
      <ECommerce
        records={records}
        chartData={MonthlyCharts}
        weeklyChart={weeklyChart}
      />
    </DefaultLayout>
  );
}

export default DashboardMain;
