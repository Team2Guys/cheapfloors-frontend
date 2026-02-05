import Link from 'next/link';
import React from 'react';

interface TopLinkprops {
  className?: string;
}
const TopLink = ({ className }: TopLinkprops) => {
  return (
    <div
      className={`space-x-2 2xl:space-x-5 text-10 xs:text-12 xl:text-sm 2xl:text-base text-white flex font-medium items-center font-inter ${className}`}
    >
      <Link href="/shipping-policy">Shipping</Link>
      <Link href="/return-and-refund-policy">Returns</Link>
      <Link href="/faqs">FAQs</Link>
    </div>
  );
};

export default TopLink;
