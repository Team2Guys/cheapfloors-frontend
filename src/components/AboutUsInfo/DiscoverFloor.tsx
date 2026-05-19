import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DiscoverFloor = () => {
  return (
    <section className="bg-primary w-full overflow-hidden mb-7">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch w-full">
        
        {/* Left Side: Content */}
        <div className="flex flex-col justify-center px-2 xs:px-4 py-12 lg:px-6 space-y-6 md:w-[70%]">
          <h2 className="text-2xl font-extrabold text-black leading-tight max-w-md">
            Discover your new favourite floor
          </h2>
          
          <p className="text-black text-base leading-relaxed max-w-lg xl:max-w-full">
            Need some advice? Request a callback to speak to one of our friendly flooring experts.
          </p>
          
          <div className="pt-2">
            <Link 
              href="/request-callback" 
              className="inline-block bg-white text-base text-black font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-300 active:scale-95"
            >
              Request a callback
            </Link>
          </div>
        </div>
        
        {/* Right Side: Image */}
       <div className="relative w-full h-[213px] md:h-[400px] 2xl:h-[430px] overflow-hidden shadow-sm">
        <Image
          src="/assets/images/aboutus/about4.webp"
          alt="Woman walking on a beautiful wooden floor"
          fill
          className="object-cover object-center 2xl:object-fill"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
       </div>
      </div>
    </section>
  );
};

export default DiscoverFloor;