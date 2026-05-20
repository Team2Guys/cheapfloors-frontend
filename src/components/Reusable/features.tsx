'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import Container from 'components/common/container/Container';
import { featureItems } from 'data/data';

const Features = () => {
    const swiperRef = useRef<import('swiper/react').SwiperRef>(null);
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.update();
    }
  }, []);

  return (
    <Container className="relative bg-white w-full px-2 my-10 overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        speed={500}
        // Base setting for mobile: 2 slides
        slidesPerView={2} 
        spaceBetween={10}
        breakpoints={{
          // Tablet/Desktop settings
          768: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="w-full !pb-4 !pt-4"
      >
        {featureItems.map((item, index) => {
          const isYellowCard = index % 2 !== 0;

          return (
            <SwiperSlide key={index} className="!h-auto flex">
              <div
                className={`
                  flex flex-col items-center text-center p-3 sm:p-6 rounded-xl shadow-lg transition-all duration-300 w-full h-[320px] xs:h-[300px] md:h-[330px] lg:h-[290px]
                  ${isYellowCard ? 'bg-[#feb907] text-black' : 'bg-white text-black border border-gray-100'}
                `}
              >
                {/* Icon Circle */}
                <div 
                  className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-6 shadow-md shrink-0
                    ${isYellowCard ? 'bg-white' : 'bg-[#feb907]'}
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={35}
                    height={35}
                    className="object-contain w-6 h-6 sm:w-8 sm:h-8" 
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-grow font-inter">
                  <h3 className="text-base sm:text-xl font-bold sm:mb-3 leading-tight mb-3">
                    {item.title}
                  </h3>
                 <p className="text-sm sm:text-base font-medium leading-relaxed opacity-90">
                {item.description}{' '}

                {item.buttonLink && (
                  <Link
                    href={item.buttonLink}
                    className="mt-auto pt-2 sm:pt-4 text-[10px] text-sm sm:text-base font-bold underline"
                  >
                    Learn more...
                  </Link>
                    )}
                 </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Arrows: Visible ONLY on small screens (hidden on xl and above) */}
      <div className="xl:hidden flex justify-between absolute top-1/2 -translate-y-1/2 w-full left-0 px-1 pointer-events-none z-30">
        <button
          onClick={() => swiperRef.current?.swiper?.slidePrev()}
          className="pointer-events-auto bg-white/80 backdrop-blur-sm shadow-md rounded-full p-1 border border-gray-200"
        >
          <MdKeyboardArrowLeft size={24} className="text-black" />
        </button>
        <button
          onClick={() => swiperRef.current?.swiper?.slideNext()}
          className="pointer-events-auto bg-white/80 backdrop-blur-sm shadow-md rounded-full p-1 border border-gray-200"
        >
          <MdKeyboardArrowRight size={24} className="text-black" />
        </button>
      </div>
    </Container>
  );
};

export default Features;