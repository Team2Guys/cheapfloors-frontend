'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TopLinkprops {
  className?: string;
}
const TopLink = ({ className }: TopLinkprops) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1470 && window.innerWidth > 500) {
        setIsShow(true);
      } else if (window.innerWidth < 500) {
        setIsShow(false);
      } else {
        setIsShow(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div
      className={`space-x-2 2xl:space-x-5 text-10 xs:text-12 xl:text-sm 2xl:text-base text-white flex font-medium items-center font-inter ${className}`}
    >
      {isShow && (
        <>
          <Link href="/about-us">About Us</Link>
          <Link href="/contact-us">Contact Us</Link>
        </>
      )}

      <Link href="/shipping-policy">Shipping</Link>
      <Link href="/return-and-refund-policy">Returns</Link>
      <Link href="/faqs">FAQs</Link>
    </div>
  );
};

export default TopLink;
