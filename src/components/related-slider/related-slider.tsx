'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Card from 'components/Card/Card';
import Container from 'components/common/container/Container';
import { features } from 'data/data';
import 'swiper/css';
import 'swiper/css/pagination';
import { IProduct } from 'types/prod';
import { RelatedSliderProps } from 'types/types';
import SliderSkaleton from 'components/skaletons/slider-skaleton';

const RelatedSlider = ({ products, isAccessories }: RelatedSliderProps) => {
  return (
    <Container className="mt-5 sm:mt-10 font-inter w-full mb-10">
      <h2 className="text-18 sm:text-24 max-sm:font-semibold lg:text-30 2xl:text-[40px] text-center">
        Frequently Bought Together
      </h2>

      {products.length > 0 ? (
        <div className="slider-container pt-4 sm:pt-10 w-full overflow-hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={2}
            slidesPerGroup={2}
            breakpoints={{
              1280: { slidesPerView: 4, slidesPerGroup: 2 },
              1024: { slidesPerView: 2.5, slidesPerGroup: 2 },
              320: { slidesPerView: 2, slidesPerGroup: 2 }
            }}
            className="related_slider"
          >
            {products.map((product: IProduct, index: number) => (
              <SwiperSlide key={index} className="pb-7">
                <Card
                  product={product}
                  features={features}
                  sldier
                  isAccessories={isAccessories}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <SliderSkaleton />
      )}
    </Container>
  );
};

export default RelatedSlider;
