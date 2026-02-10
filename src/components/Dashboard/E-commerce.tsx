'use client';
import React, { useEffect, useState } from 'react';
const ChartTwo = dynamic(() => import('./Charts/ChartTwo'), { ssr: false });
const ChartOne = dynamic(() => import('./Charts/ChartOne'), { ssr: false });
import CardDataStats from './CardDataStats';
import { useAppSelector } from 'components/Others/HelperRedux';
import { PiUsersThreeFill } from 'react-icons/pi';
import { BiCategory } from 'react-icons/bi';
import { RECORDS } from 'types/type';
import dynamic from 'next/dynamic';
import { MONTHLYGRAPH, WEEKLYGRAPH } from 'types/general';
import { RiAdminLine, RiHomeGearLine } from 'react-icons/ri';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import {
  TbCalendarCancel,
  TbCategoryPlus,
  TbRulerMeasure2
} from 'react-icons/tb';
import { LiaCashRegisterSolid } from 'react-icons/lia';
import { BsBoxes } from 'react-icons/bs';
import { SiReactrouter } from 'react-icons/si';
import { FaInstalod } from 'react-icons/fa';
import { useAdminAuthInit } from 'hooks/useAuthInitializer';

const ECommerce = ({
  records,
  chartData,
  weeklyChart
}: {
  records: RECORDS;
  chartData: MONTHLYGRAPH;
  weeklyChart: WEEKLYGRAPH;
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGA4Data = async () => {
      try {
        const res = await fetch('/api/ga4-device-data');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json.results || []);
      } catch (err) {
        console.error('Error fetching GA4 data:', err);
      }
    };

    fetchGA4Data();
  }, []);

  console.log(data, 'datadatadata');
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);
  useAdminAuthInit();

  const canCheckProfit =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.canCheckProfit : true);
  const CanCheckRevnue =
    loggedInUser &&
    (loggedInUser.role == 'Admin' ? loggedInUser.CanCheckRevnue : true);
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-4 2xl:gap-10 dark:border-blue-50  ">
        {!canVeiwAdmins ? null : (
          <CardDataStats
            title="Admins"
            total={records?.totalAdmins ? records?.totalAdmins : '0'}
          >
            <RiAdminLine size={25} className="fill-white dark:fill-black" />
          </CardDataStats>
        )}

        {!canCheckProfit ? null : (
          <CardDataStats
            title="Total Sub Categories"
            total={
              records?.totalSubCategories ? records?.totalSubCategories : '0'
            }
          >
            <BiCategory size={25} className="text-white dark:text-black" />
          </CardDataStats>
        )}

        {!CanCheckRevnue ? null : (
          <CardDataStats
            title="Total Revenue"
            total={records?.totalRevenue ? records?.totalRevenue : '0'}
          >
            <LiaCashRegisterSolid
              size={25}
              className="text-white dark:text-black"
            />
          </CardDataStats>
        )}

        {!canViewSales ? null : (
          <CardDataStats
            title="Total Orders"
            total={records?.Orders ? records?.Orders : '0'}
          >
            <MdOutlineShoppingCartCheckout
              size={25}
              className="text-white dark:text-black"
            />
          </CardDataStats>
        )}
        {!canViewSales ? null : (
          <CardDataStats
            title="Abandoned Orders"
            total={records?.abdundantOrders ? records?.abdundantOrders : '0'}
          >
            <TbCalendarCancel
              size={25}
              className="text-white dark:text-black"
            />
          </CardDataStats>
        )}

        {!canVeiwTotalCategories ? null : (
          <CardDataStats
            title="Total Categories"
            total={records?.totalCategories ? records?.totalCategories : '0'}
          >
            <TbCategoryPlus size={25} className="text-white dark:text-black" />
          </CardDataStats>
        )}

        {!canVeiwTotalproducts ? null : (
          <CardDataStats
            title="Total Product"
            total={records?.totalProducts ? records?.totalProducts : '0'}
          >
            <BsBoxes size={25} className="text-white dark:text-black" />
          </CardDataStats>
        )}
        {!canViewUsers ? null : (
          <CardDataStats
            title="Total Users"
            total={records?.totalUsers ? records?.totalUsers : '0'}
          >
            <PiUsersThreeFill
              size={25}
              className="fill-white dark:fill-black"
            />
          </CardDataStats>
        )}
        {!canViewUsers ? null : (
          <CardDataStats
            title="Accessories"
            total={records?.totalAccessories ? records?.totalAccessories : '0'}
          >
            <RiHomeGearLine size={25} className="fill-white dark:fill-black" />
          </CardDataStats>
        )}
        {!canViewUsers ? null : (
          <CardDataStats
            title="Free Samples Orders"
            total={records?.freeSamples ? records?.freeSamples : '0'}
          >
            <SiReactrouter size={25} className="fill-white dark:fill-black" />
          </CardDataStats>
        )}

        {!canViewUsers ? null : (
          <CardDataStats
            title="Installation Appointments"
            total={
              records?.InstallationAppointments
                ? records?.InstallationAppointments
                : '0'
            }
          >
            <FaInstalod size={25} className="fill-white dark:fill-black" />
          </CardDataStats>
        )}
        {!canViewUsers ? null : (
          <CardDataStats
            title="Measure Appointments"
            total={
              records?.MeasureAppointments ? records?.MeasureAppointments : '0'
            }
          >
            <TbRulerMeasure2 size={25} className="text-white dark:text-black" />
          </CardDataStats>
        )}
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 2xl:mt-10 2xl:gap-6">
        <ChartOne chartData={chartData} />
        <ChartTwo chartData={weeklyChart} />
      </div>
    </>
  );
};

export default ECommerce;
