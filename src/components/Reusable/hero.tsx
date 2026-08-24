'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const heroBanners = [
  { src: '/assets/images/Home/Hero-Banner-2.webp', alt: 'Easy Floors hero banner 1' },
  { src: '/assets/images/Home/Hero-Banner-1.webp', alt: 'Easy Floors hero banner 2' }
];

const HeroMain = () => {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        loop
        speed={600}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: '.hero-pagination' }}
        slidesPerView={1}
        className="w-full"
      >
        {heroBanners.map((banner, index) => (
          <SwiperSlide key={index}>
            <Link href={`${index === 1 ? '/collections' : '/clearance'}`} className="relative block aspect-[1440/784] w-full">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority={index === 0}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes="100vw"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom pill pagination, rendered below the slider */}
      <div className="hero-pagination w-full flex justify-center items-center mt-4 md:mt-5" />

      <style>{`
        .hero-pagination {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }
        .hero-pagination .swiper-pagination-bullet {
          width: 32px !important;
          height: 10px !important;
          border-radius: 999px !important;
          background: transparent !important;
          border: 1.5px solid #555 !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          background: #FEB907 !important;
          border-color: #FEB907 !important;
        }
      `}</style>
    </div>
  );
};

export default HeroMain;
