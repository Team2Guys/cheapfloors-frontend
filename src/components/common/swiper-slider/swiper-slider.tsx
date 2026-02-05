'use client';
import React, { useEffect, useRef } from 'react';
import { Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { CommonSwiperProps } from 'types/types';

const SwiperSlider = ({
  children,
  enablePagination = true,
  allowTouch = true,
  spaceBetween = 20,
  breakpoints,
  ...rest
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
      modules={[Pagination]}
      observer
      observeParents
      spaceBetween={spaceBetween}
      pagination={enablePagination ? { clickable: true } : false}
      allowTouchMove={allowTouch}
      breakpoints={breakpoints}
      {...rest}
    >
      {children}
    </Swiper>
  );
};

export default SwiperSlider;
