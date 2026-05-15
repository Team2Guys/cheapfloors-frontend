'use client';
import { ISUBCATEGORY } from 'types/cat';
import dynamic from 'next/dynamic';
const BlogCard = dynamic(() => import('components/Categories/Categories'));
import SwiperSlider from 'components/common/swiper-slider/swiper-slider';
import { SwiperSlide } from 'swiper/react';
import { whatamiBreakpoint } from 'data/slider';
import { Navigation, Pagination } from 'swiper/modules'; 
import { HiArrowSmallLeft, HiArrowSmallRight } from 'react-icons/hi2';

const BlogSwiper = ({ subCategories }: { subCategories: ISUBCATEGORY[] }) => (
  <div className="relative">
    {/* --- 1. NAVIGATION ARROWS --- */}
    <div className="flex justify-end items-center gap-2 lg:mb-3 xl:mb-6">
      <button className="prev-arrow w-6 h-6 md:w-11 md:h-11 rounded-full bg-[#F5F2E9] flex items-center justify-center transition hover:bg-gray-200 shadow-sm">
       <HiArrowSmallLeft className='text-lg md:text-xl text-black' />
      </button>

      <button className="next-arrow w-6 h-6 md:w-11 md:h-11 rounded-full bg-[#FEB907] flex items-center justify-center transition hover:brightness-105 shadow-sm">
        <HiArrowSmallRight className='text-lg md:text-xl text-black' />
      </button>
    </div>

    {/* --- 2. THE SLIDER (With Loop enabled) --- */}
    <SwiperSlider 
      allowTouch 
      loop // <--- THIS ENABLES INFINITE SCROLL
      breakpoints={whatamiBreakpoint}
      navigation={{
        nextEl: '.next-arrow',
        prevEl: '.prev-arrow',
      }}
      pagination={{
        clickable: true,
        el: '.custom-pagination'
      }}
      modules={[Navigation, Pagination]}
    >
      {subCategories.map((card, index) => (
        <SwiperSlide key={card.id}>
          <BlogCard card={card} index={index} />
        </SwiperSlide>
      ))}
    </SwiperSlider>

    {/* --- 3. CUSTOM PAGINATION (CENTERED) --- */}
    <div className="custom-pagination w-full flex justify-center items-center md:mt-5 xl:mt-9" />

    {/* --- CSS FOR PILL-SHAPED DOTS & LIMITING TO 3 --- */}
    <style>{`
      /* Ensures container is centered */
      .custom-pagination {
        width: 100% !important;
        display: flex !important;
        justify-content: center !important;
      }

      .custom-pagination .swiper-pagination-bullet {
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

      .custom-pagination .swiper-pagination-bullet-active {
        background: #FEB907 !important;
        border-color: #FEB907 !important;
      }

      /* STRICTLY HIDE EVERYTHING AFTER THE 3RD DOT */
      .custom-pagination .swiper-pagination-bullet:nth-child(n+4) {
        display: none !important;
      }
    `}
    </style>
  </div>
);

export default BlogSwiper;