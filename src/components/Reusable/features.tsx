'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
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
    <Container className="relative w-full px-3 my-7 sm:mb-10 xl:mb-14 xl:mt-7 overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        observer
        observeParents
        loop={false}
        speed={500}
        slidesPerView={1.2}
        spaceBetween={16}
        pagination={{
          clickable: true,
          el: '.features-pagination',
        }}
        breakpoints={{
          1280: { slidesPerView: 4, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 16 },
          0: { slidesPerView: 1.2, spaceBetween: 16 },
        }}
        className="w-full features-swiper"
      >
        {featureItems.map((item, index) => {
          return (
            <SwiperSlide key={index} className="h-auto !flex pb-2">
              <div
                className={`flex flex-col items-center text-center p-4 sm:px-8 py-4 h-full rounded-xl w-full drop-shadow-md ${index % 2 !== 0
                  ? 'bg-primary'
                  : 'bg-[#FBFBFB] border border-gray-100'
                  }`}
              >
                <div className={`mb-4 flex justify-center items-center size-16 rounded-full ${index % 2 !== 0 ? 'bg-white' : 'bg-primary'}`}>
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="size-12 object-contain"
                  />
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-3 text-black">
                  {item.title}
                </h3>
                <p className="text-sm lg:text-base font-normal text-black leading-snug">
                  {item.description}{' '}
                  {index < 3 && item.buttonLink && item.buttonText && (
                    <Link
                      className="font-semibold text-black hover:underline whitespace-nowrap"
                      href={item.buttonLink}
                    >
                      {item.buttonText}...
                    </Link>
                  )}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Custom Pagination Container */}
      <div className="features-pagination flex justify-center items-center gap-2 mt-6 xl:hidden"></div>
    </Container>
  );
};

export default Features;

