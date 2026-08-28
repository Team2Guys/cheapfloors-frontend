import Link from 'next/link';

interface TopLinkprops {
  className?: string;
}
const TopLink = ({ className }: TopLinkprops) => {

  return (
    <div
      className={`space-x-2 2xl:space-x-5 text-10 xs:text-12 xl:text-sm 2xl:text-base text-white flex font-medium items-center font-inter ${className}`}
    >
      <Link href="/about-us" className='hidden min-[500px]:block lg:text-black '>About Us</Link>
      <Link href="/contact-us" className='hidden min-[500px]:block lg:text-black '>Contact Us</Link>
      <Link href="/shipping-policy" className='lg:text-black '>Shipping</Link>
      <Link href="/return-and-refund-policy" className='lg:text-black '>Returns</Link>
      <Link href="/faqs" className='lg:text-black '>FAQs</Link>
      <Link href="/blogs" className='lg:text-black '>Blogs</Link>
    </div>
  );
};

export default TopLink;
