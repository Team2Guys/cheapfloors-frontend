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
    <Container className="relative bg-white w-full px-3 my-7 sm:mb-10 xl:mb-14 xl:mt-7 overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Navigation]}
        observer
        observeParents
        loop={featureItems.length > 4}
        speed={500}
        slidesPerView={2}
        slidesPerGroup={1}
        spaceBetween={6}
        breakpoints={{
          1280: { slidesPerView: 4 },
          1024: { slidesPerView: 3 },
          640: { slidesPerView: 3 }
        }}
        className="w-full p-2"
      >
        {featureItems.map((item, index) => {
          const isLastItem = index === featureItems.length - 1;

          return (
            <SwiperSlide
              key={index}
              className="!flex flex-nowrap sm:px-1 lg:px-2"
            >
              <div className="flex flex-col md:flex-row mx-1 items-center md:items-start text-center border border-[#0000001F] xl:border-none xl:border-l-0 xl:border-t-0 xl:border-b-0 p-2 md:p-4 h-[156px] xs:h-[140px] sm:h-[200px] md:h-[170px] xl:h-[200px] md:gap-3 xl:pr-4 2xl:pr-5">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={100}
                  height={100}
                  loading="lazy"
                  className="h-7 w-6 sm:h-8 sm:w-8 xl:w-[64px] xl:h-[64px] object-contain"
                />
                <div className="flex flex-col md:justify-start md:items-start font-inter">
                  <h3 className="text-sm lg:text-lg font-semibold md:font-bold mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs lg:text-sm 2xl:text-base font-light text-card-text sm:block mt-1 leading-3 text-justify">
                    {item.description}{' '}
                    {index < 3 && item.buttonLink && item.buttonText && (
                      <Link
                        className="text-primary font-semibold"
                        href={item.buttonLink}
                      >
                        {item.buttonText}
                      </Link>
                    )}
                  </p>
                </div>
              </div>
              {!isLastItem && (
                <div className="border-r border-black h-24 hidden xl:block" />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
      <button
        onClick={() => swiperRef.current?.swiper?.slidePrev()}
        className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 xl:hidden"
        aria-label="Previous slide"
      >
        <MdKeyboardArrowLeft className="h-6 w-6 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={() => swiperRef.current?.swiper?.slideNext()}
        className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 xl:hidden"
        aria-label="Next slide"
      >
        <MdKeyboardArrowRight className="h-6 w-6 sm:h-5 sm:w-5" />
      </button>
    </Container>
  );
};

export default Features;
