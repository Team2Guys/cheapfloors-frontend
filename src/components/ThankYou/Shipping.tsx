import Link from 'next/link';
import React from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';

export default function Shipping() {
  return (
    <div className="flex flex-col items-center gap-4 my-8 sm:my-10 font-inter">
      <Link
        href="/collections"
        className="inline-flex items-center gap-3 bg-primary text-black font-bold text-[15px] sm:text-[16px] px-6 sm:px-10 py-3 rounded-md hover:opacity-95 transition-opacity"
      >
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
          <FaArrowLeftLong className="text-black text-sm" />
        </span>
        Continue Shopping
      </Link>
      <Link
        href="/return-and-refund-policy"
        className="text-[14px] sm:text-[15px] text-black underline underline-offset-2"
      >
        Read about our return policy.
      </Link>
    </div>
  );
}
