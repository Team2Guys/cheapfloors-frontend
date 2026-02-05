import Breadcrumb from 'components/Reusable/breadcrumb';
import OrderTracking from 'components/TrackOrders/Order-Tracking';
import { fetchSingleOrder } from 'config/fetch';
import Link from 'next/link';
import React from 'react';

interface IParams {
  id: string;
}

const TrackOrder = async ({ params }: { params: Promise<IParams> }) => {
  const { id } = await params;
  const data = await fetchSingleOrder(id);

  if (!data || data.orderStatus === 'cancel') {
    return (
      <div className="flex_center min-h-[50vh]">
        <div>
          <p className="xsm:text-xl font-medium text-center">
            No order was found matching this Order ID {id}
          </p>
          <Link
            href="/"
            className="block w-fit mx-auto text-xs sm:text-sm md:text-base bg-primary text-white sm:ont-medium px-4 py-2 mt-6"
          >
            Back To Home
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <Breadcrumb title="Track Order" />
      <OrderTracking data={data} />
    </>
  );
};

export default TrackOrder;
