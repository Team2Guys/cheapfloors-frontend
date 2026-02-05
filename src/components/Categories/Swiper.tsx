'use client';
import React from 'react';
import { ISUBCATEGORY } from 'types/cat';
import dynamic from 'next/dynamic';
const BlogCard = dynamic(() => import('components/Categories/Categories'));
import SwiperSlider from 'components/common/swiper-slider/swiper-slider';
import { SwiperSlide } from 'swiper/react';
import { whatamiBreakpoint } from 'data/slider';

const BlogSwiper = ({ subCategories }: { subCategories: ISUBCATEGORY[] }) => (
  <div className="sm:hidden">
    <SwiperSlider enablePagination allowTouch breakpoints={whatamiBreakpoint}>
      {subCategories.map((card, index) => (
        <SwiperSlide key={card.id}>
          <BlogCard card={card} index={index} />
        </SwiperSlide>
      ))}
    </SwiperSlider>
  </div>
);

export default BlogSwiper;
