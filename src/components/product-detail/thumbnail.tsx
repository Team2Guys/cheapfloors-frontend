'use client';
import Image from 'next/image';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { ExtendedThumbnailProps } from 'types/product-detail';
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { Swiper as SwiperType } from 'swiper';

const Thumbnail = ({
  ThumnailImage,
  ThumnailBottom,
  hideThumnailBottom = false,
  imageheight,
  onImageChange,
  stickyside,
  selectedColor,
  setSelectedColor
}: ExtendedThumbnailProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const thumbSwiperRef = useRef<SwiperType | null>(null);
  const featureSwiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (selectedColor) {
      let idx: number = -1;
      if (selectedColor.imageUrl) {
        idx = ThumnailImage.findIndex(
          (img) => img.imageUrl === selectedColor.imageUrl
        );
      }
      if (idx === -1 && selectedColor.color) {
        idx = ThumnailImage.findIndex(
          (img) =>
            img.color?.toLowerCase() === selectedColor.color?.toLowerCase() ||
            img.colorCode?.toLowerCase() === selectedColor.color?.toLowerCase()
        );
      }
      if (idx === -1 && ThumnailImage.length > 0) {
        idx = 0;
      }
      if (idx !== -1) {
        setCurrentSlide(idx);
        onImageChange?.(ThumnailImage[idx]);

        mainSwiperRef.current?.slideTo(idx);
        if (stickyside) {
          thumbSwiperRef.current?.slideTo(idx);
        }
      }
    }
  }, [selectedColor, ThumnailImage, onImageChange, stickyside]);

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    onImageChange?.(ThumnailImage[index]);
    setSelectedColor?.({
      index,
      color: ThumnailImage[index].color || ThumnailImage[index].colorCode,
      colorCode: ThumnailImage[index].colorCode,
      altText: ThumnailImage[index].altText,
      imageUrl: ThumnailImage[index].imageUrl
    });
    mainSwiperRef.current?.slideTo(index);
    if (stickyside) {
      thumbSwiperRef.current?.slideTo(index);
    }
  };

  const staticTitles = [
    'Click lock system',
    'Layers of SPC or LVT',
    'Waterproof',
    'Easy to clean',
    'Scratch resistant',
    'The packaging'
  ];

  const getStaticTitle = (index: number) => staticTitles[index] || '';

  return (
    <div className="relative">
      {stickyside && ThumnailImage.length > 5 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            thumbSwiperRef.current?.slidePrev();
          }}
          className="absolute !-top-1 2xl:left-16 xl:left-11 lg:left-10 md:left-8 sm:left-8 left-4 z-30 p-1 max-w-max"
        >
          <FaAngleUp className="text-gray-600 bg-white" size={20} />
        </button>
      )}

      <div className="slider-container flex gap-2 sm:gap-3 overflow-hidden">
        <div className="w-[18%] sm:w-[15%] shrink-0">
          {stickyside && ThumnailImage.length > 5 ? (
            <div className="relative h-full max-h-[280px] sm:max-h-[520px] xl:max-h-[700px] 2xl:max-h-[800px]">
              <Swiper
                direction="vertical"
                slidesPerView={5}
                spaceBetween={6}
                freeMode
                watchSlidesProgress
                slideToClickedSlide
                onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
                modules={[FreeMode]}
                className="h-full"
              >
                {ThumnailImage.map((product, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <div
                      className={`cursor-pointer border-2 ${
                        index === currentSlide
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        width={150}
                        height={150}
                        priority
                        src={product.imageUrl}
                        className={`w-full aspect-square object-cover ${
                          imageheight ? 'border border-black' : 'border'
                        }`}
                        alt={product.altText || 'Thumbnail'}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  thumbSwiperRef.current?.slideNext();
                }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 p-1"
              >
                <FaAngleDown className="text-gray-600 bg-white" size={20} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {ThumnailImage.map((product, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`cursor-pointer border-2 ${
                    index === currentSlide
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    width={150}
                    height={150}
                    src={product.imageUrl}
                    className="w-full aspect-square object-cover"
                    alt={product.altText || 'Thumbnail'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-[82%] sm:w-[85%] flex-1">
          <Swiper
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.activeIndex);
              onImageChange?.(ThumnailImage[swiper.activeIndex]);
              const product = ThumnailImage[swiper.activeIndex];
              setSelectedColor?.({
                color: product.color || product.colorCode,
                colorCode: product.colorCode,
                altText: product.altText,
                imageUrl: product.imageUrl
              });

              if (stickyside) {
                thumbSwiperRef.current?.slideTo(swiper.activeIndex);
              }
            }}
            slidesPerView={1}
            modules={[Navigation]}
          >
            {ThumnailImage.map((product, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`relative aspect-square ${
                    product.plankWidth ? 'py-2 sm:py-0' : ''
                  }`}
                >
                  <Image
                    fill
                    priority={index === 0}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    src={product.imageUrl}
                    className={`object-cover ${selectedColor ? 'object-cover' : ''}`}
                    alt={product.altText || 'Product image'}
                    sizes="(max-width: 768px) 80vw, 40vw"
                  />
                  {product.plankHeight && (
                    <div className="absolute h-full top-0 flex flex-col justify-between py-4 sm:py-10 left-1/2 -translate-x-28 sm:-translate-x-36">
                      <span className="flex_center">
                        <FaAngleUp className="sm:text-20" />
                      </span>
                      <div className="flex-1 border w-[1px] mx-auto border-black"></div>
                      <span className="h-16 sm:h-28 flex_center font-semibold transform rotate-90 text-13 sm:text-base">
                        {product.plankHeight}
                      </span>
                      <div className="flex-1 border w-[1px] mx-auto border-black"></div>
                      <span className="flex_center">
                        <FaAngleDown className="sm:text-20" />
                      </span>
                    </div>
                  )}

                  {product.plankWidth && (
                    <div className="absolute w-[130px] sm:w-[92px] md:w-[121px] lg:w-[74px] xl:w-[80px] 2xl:w-[135px] top-[9px] sm:top-0 flex 2xl:justify-between items-center mx-auto xsm:left-[46%] left-[43%] xs:left-[44%] sm:left-[52%] lg:left-[51%] 2xl:left-1/2 sm:-translate-x-1/2">
                      <span className="flex_center transform -rotate-90">
                        <FaAngleUp className="text-10 md:text-base lg:text-12 2xl:text-20" />
                      </span>
                      <div className="flex border w-[9px] h-[0.2px] sm:h-[1px] my-auto border-black"></div>
                      <span className="flex_center text-[8px] sm:text-10 md:text-sm lg:text-10 2xl:text-base 2xl:font-semibold px-[2px] 2xl:px-2 max-sm:absolute max-sm:left-[1%] max-sm:-top-[10px]">
                        {product.plankWidth}
                      </span>
                      <div className="flex border w-[9px] h-[0.2px] sm:h-[1px] my-auto border-black"></div>
                      <span className="flex_center transform -rotate-90">
                        <FaAngleDown className="text-10 md:text-base lg:text-12 2xl:text-20" />
                      </span>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {!hideThumnailBottom && ThumnailBottom && ThumnailBottom.length > 0 && (
            <div className="relative mt-3 sm:mt-4">
              <button
                type="button"
                onClick={() => featureSwiperRef.current?.slidePrev()}
                className="absolute left-1 top-[42%] -translate-y-1/2 z-20 flex size-6 items-center justify-center bg-[#FFFFFF33] backdrop-blur-sm shadow-sm"
                aria-label="Previous feature"
              >
                <FaChevronLeft className="text-black text-xl" />
              </button>
              <button
                type="button"
                onClick={() => featureSwiperRef.current?.slideNext()}
                className="absolute right-3 top-[42%] -translate-y-1/2 z-20 flex size-6 items-center justify-center bg-[#FFFFFF33] backdrop-blur-sm shadow-sm"
                aria-label="Next feature"
              >
                <FaChevronRight className="text-black text-xl" />
              </button>
              <Swiper
                onSwiper={(swiper) => (featureSwiperRef.current = swiper)}
                slidesPerView={4.8}
                spaceBetween={4}
                freeMode
                modules={[FreeMode, Navigation]}
                className="feature-carousel"
              >
                {ThumnailBottom.map((array, index) => (
                  <SwiperSlide key={index}>
                    <div className="text-center px-0.5">
                      <div className="w-full aspect-square relative border border-[#E0E0E0] bg-white">
                        <Image
                          fill
                          src={array.imageUrl}
                          alt={array.altText || getStaticTitle(index)}
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-[10px] sm:text-[11px] font-medium text-black text-center leading-snug">
                        {getStaticTitle(index)}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;
