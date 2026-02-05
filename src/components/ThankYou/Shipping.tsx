import Link from 'next/link';
import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';

export default function Shipping({ orderid }: { orderid?: string }) {
  return (
    <div className="flex_center flex-col gap-4 md:my-16 my-6 font-inter">
      <Link
        href="/collections"
        className="bg-primary text-white max-w-fit md:px-28 px-8 md:py-4 py-2 flex items-center md:text-lg text-sm font-light md:gap-3 gap-1"
      >
        {' '}
        <IoIosArrowRoundBack className="text-32" /> Back to Shopping
      </Link>
      <Link
        href={`/track-order/${orderid}`}
        className=" max-w-fit text-black border-black text-lg md:mt-4 border-b"
      >
        View Your Order
      </Link>
    </div>
  );
}
