'use client';
import { PostPaymentStatus } from 'types/OrdersProd';
import Container from 'components/common/container/Container';
import OrderSummary from 'components/ThankYou/OrderSummary';
import { BsTruck } from 'react-icons/bs';
import { formatDate, trackingOrder } from 'utils/helperFunctions';
import Link from 'next/link';
import { SiVisa } from 'react-icons/si';

export default function OrderTracking({ data }: { data: PostPaymentStatus }) {
  const NewDatas = {
    postpaymentStatus: data
  };

  const date = new Date(
    data?.transactionDate || data?.checkoutDate || Date.now()
  );
  const formatedDate = formatDate(date);

  const TrackingOrder = trackingOrder(data.shippingMethod.name, date);

  return (
    <Container className="w-full py-5 md:py-10 space-y-6 lg:space-y-10">
      <div className="text-center">
        <h1 className="md:text-[30px] 2xl:text-[40px] font-semibold leading-10 text-[#344054]">
          Order ID: <span>#{data.orderId}</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 justify-center items-center gap-3 xsm:gap-5">
        <div className="border-r-2 pr-3 xsm:pr-5 text-end">
          <p className="text-10 sm:text-sm md:text-base 2xl:text-[20px] font-semibold text-[#959BA7]">
            Order date: <span className="text-black">{formatedDate}</span>
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="inline-block">
            <BsTruck className="w-4 h-4 sm:w-7 sm:h-7 2xl:w-[42px] 2xl:h-[42px] text-primary" />
          </span>
          <p className="text-10 sm:text-sm md:text-base 2xl:text-[20px] font-semibold text-primary text-wrap">
            Estimated delivery:{' '}
            <span className="text-black">{TrackingOrder}</span>
          </p>
        </div>
      </div>

      <div className="w-full relative">
        <div className="w-full h-[2px] md:h-[4px] max-w-[90%] lg:max-w-[80%] 2xl:max-w-[70%] mx-auto bg-[#D0D5DD] relative">
          <div
            className={`h-full bg-primary transition-all duration-300 ${
              data.orderStatus === 'placed'
                ? 'w-0'
                : data.orderStatus === 'shipped'
                  ? 'w-1/2'
                  : data.orderStatus === 'delivered'
                    ? 'w-full'
                    : 'w-0'
            }`}
          />
        </div>

        <div className="flex justify-between w-full md:h-[4px] max-w-[90%] lg:max-w-[80%] 2xl:max-w-[70%] mx-auto absolute -top-2.5 2xl:-top-3.5 left-1/2 transform -translate-x-1/2">
          {['Confirmed', 'Shipped', 'Delivered'].map((stage, index) => (
            <div
              key={index}
              className={`flex flex-col relative w-full text-center items-${
                index === 0 ? 'start' : index === 1 ? 'center' : 'end'
              }`}
            >
              <div
                className={`flex justify-center items-center relative text-white text-xl 2xl:text-2xl size-6 2xl:size-8 rounded-full z-10  ${(stage == 'Confirmed' && (data.orderStatus === 'placed' || data.orderStatus === 'shipped' || data.orderStatus === 'delivered')) || (stage == 'Shipped' && (data.orderStatus === 'shipped' || data.orderStatus === 'delivered')) || (stage == 'Delivered' && data.orderStatus === 'delivered') ? 'bg-primary' : 'bg-[#D0D5DD]'} `}
              >
                <span className="pb-1">{index}</span>
              </div>
              <p
                className={`text-12 sm:text-sm md:text-20 2xl:text-[24px] py-1 text-primary font-semibold xsm:mt-2 transform ${
                  index === 0
                    ? '-translate-x-5 md:-translate-x-9'
                    : index === 1
                      ? 'translate-x-0'
                      : 'translate-x-4 md:translate-x-8'
                }`}
              >
                {stage}
              </p>
              {/* <p className="text-10 sm:text-sm md:text-18 2xl:text-[24px] font-semibold text-[#95989C] h-[30px]">
                {index === 2 ? `Expected by, ${TrackingOrder} ` : formatedDate}
              </p> */}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-5 pt-10 md:pt-20">
        <div className="w-full md:w-1/2 md:order-1 order-2">
          <h2 className="text-xl font-bold mb-6 text-[#616161]">
            Order details
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="w-full md:w-1/2 flex flex-col gap-6 md:order-1 order-2">
              <div className="text-base font-semibold">
                <h2 className="text-lg ">Contact Information</h2>
                <p className="font-semibold">
                  {data.firstName + ' ' + data.lastName}
                </p>
                <p>{data.email}</p>
              </div>

              <div className="text-base font-semibold">
                <h2 className="text-lg ">Shipping Address</h2>
                <p className="font-semibold">{data.address}</p>
                <p>{data.address}</p>
              </div>

              <Link
                href="/collections"
                className="bg-primary text-white text-center py-2 px-2 w-full"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6 md:order-2 order-1">
              <div className="text-base font-semibold">
                <h2 className="text-lg ">Payment</h2>
                <div className="flex items-center gap-2">
                  <SiVisa className="text-blue text-4xl shadow px-1 py-0 h-auto w-10" />
                  <p className="text-black">
                    ending with {data.cardLastDigits} -{' '}
                    <span className="font-currency text-17 font-normal"></span>
                    {data.totalPrice}
                  </p>
                </div>
              </div>

              <div className="text-base mt-4 font-semibold">
                <h2 className="text-lg ">Billing Address</h2>
                <p className="font-semibold">{data.address}</p>
                <p>{data.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:order-2 order-1">
          <OrderSummary data={NewDatas} trackingOrer />
        </div>
      </div>
    </Container>
  );
}
