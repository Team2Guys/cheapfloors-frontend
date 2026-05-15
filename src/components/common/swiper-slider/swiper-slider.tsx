'use client';
import React, { useEffect, useRef } from 'react';
import { Swiper } from 'swiper/react';
// 1. Import Navigation and Autoplay modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
// 2. Import required Swiper CSS
import 'swiper/css/pagination';
import 'swiper/css/navigation'; 

import { CommonSwiperProps } from 'types/types';

const SwiperSlider = ({
  children,
  enablePagination = true,
  allowTouch = true,
  spaceBetween = 20,
  breakpoints, // This is already a prop
  ...rest      // This will catch 'loop', 'navigation', etc., from BlogSwiper
}: CommonSwiperProps) => {
  const swiperRef = useRef<import('swiper/react').SwiperRef>(null);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.update();
    }
  }, []);

  return (
    <Swiper
      ref={swiperRef}
      // 3. Add Navigation and Autoplay to the modules array
      modules={[Pagination, Navigation, Autoplay]}
      observer
      observeParents
      spaceBetween={spaceBetween}
      // 4. Ensure pagination uses the config passed from parent (like our custom-pagination)
      pagination={enablePagination ? (rest.pagination || { clickable: true }) : false}
      allowTouchMove={allowTouch}
      // 5. Explicitly pass breakpoints
      breakpoints={breakpoints}
      // 6. Spread the rest to catch 'loop={true}' and 'navigation={...}'
      {...rest}
    >
      {children}
    </Swiper>
  );
};

export default SwiperSlider;