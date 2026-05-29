import React from 'react';
import { boxData } from 'data/data';
import Link from 'next/link';
import Image from 'next/image';

const NeedHelp = () => {
  return (
    <div className="container mx-auto px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-14">
      {boxData.map((box, index) => (
        <div
          className="border-2 border-[#CCCCCC] font-inter relative min-h-[250px] md:min-h-[410px]"
          key={index}
        >
          <Image
            src={box.bgImage}
            alt={box.title}
            fill
            className="object-cover"
          />
          <div className='bg-black/50 w-full h-full absolute top-0 left-0 px-4 py-8 xs:py-10 gap-2 sm:gap-4 flex flex-col justify-between text-center text-white'>
            <div>
              <div className="relative size-8 xsm:size-12 md:size-16 mb-2 mx-auto">
                <Image
                  src={box.icon}
                  alt={box.title}
                  fill
                  className="object-contain invert"
                />
              </div>
              <h2 className="text-xs sm:text-base md:text-2xl lg:text-3xl font-semibold">
                {box.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-[15px] lg:text-lg text-center max-w-xl mx-auto">
              {box.description}
            </p>
            <Link
              href={box.link}
              aria-label="Book appointment"
              className="w-full max-w-xl mx-auto block text-xs sm:text-sm md:text-base bg-primary hover:bg-secondary text-black sm:ont-medium px-4 py-2 rounded-full"
            >
              {box.buttonText}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NeedHelp;
