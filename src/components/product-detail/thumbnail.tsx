'use client';
import Image from 'next/image';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { ExtendedThumbnailProps } from 'types/product-detail';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
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
  const combinedImages = useMemo(() => {
    if (hideThumnailBottom) return ThumnailImage;
    return [...ThumnailImage, ...(ThumnailBottom || [])];
  }, [ThumnailImage, ThumnailBottom, hideThumnailBottom]);
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
    'water-resistant',
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
          <MdKeyboardArrowUp className="block md:hidden bg-white" size={20} />
          <MdKeyboardArrowUp
            className="hidden md:block font-normal text-gray-600 bg-white"
            size={30}
          />
        </button>
      )}

      <div className="slider-container flex gap-2 sm:gap-4 overflow-hidden">
        <div className="w-2/12">
          {stickyside && ThumnailImage.length > 5 ? (
            <div className="relative h-full max-h-[280px] sm:max-h-[520px] xl:max-h-[700px] 2xl:max-h-[800px]">
              <Swiper
                direction="vertical"
                slidesPerView={6}
                spaceBetween={8}
                freeMode
                watchSlidesProgress
                slideToClickedSlide
                onSwiper={(swiper) => (thumbSwiperRef.current = swiper)}
                modules={[FreeMode]}
                className="h-full"
                breakpoints={{
                  320: { slidesPerView: 5, spaceBetween: 6 },
                  1024: { slidesPerView: 5, spaceBetween: 6 }, // use whole numbers here
                  1600: { slidesPerView: 6, spaceBetween: 6 }
                }}
              >
                {ThumnailImage.map((product, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <div
                      className={`cursor-pointer p-[2px] border-2 ${
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
                        className={`w-full ${
                          imageheight
                            ? 'h-[44px] sm:h-[90px] lg:h-[93px] xl:h-[126px] border border-black'
                            : 'border'
                        }`}
                        alt={product.altText || 'Thumbnail'}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {stickyside && ThumnailImage.length > 5 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    thumbSwiperRef.current?.slideNext();
                  }}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 p-1 "
                >
                  <MdKeyboardArrowDown
                    className="block md:hidden bg-white"
                    size={20}
                  />
                  <MdKeyboardArrowDown
                    className="hidden md:block font-normal text-gray-600 bg-white"
                    size={30}
                  />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1 sm:gap-2">
              {ThumnailImage.map((product, index) => (
                <div
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`cursor-pointer p-[2px] border-2 ${
                    index === currentSlide
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    width={150}
                    height={150}
                    src={product.imageUrl}
                    className={`w-full ${
                      imageheight
                        ? 'h-[44px] sm:h-[90px] lg:h-[93px] xl:h-[126px] 2xl:h-[150px]'
                        : 'h-auto 2xl:h-[140px]'
                    }`}
                    alt={product.altText || 'Thumbnail'}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-10/12">
          <Swiper
            onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.activeIndex);
              onImageChange?.(combinedImages[swiper.activeIndex]);
              const product = combinedImages[swiper.activeIndex];
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
            modules={[Navigation, Thumbs]}
          >
            {combinedImages.map((product, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`relative ${
                    imageheight
                      ? 'h-[273px] sm:h-[520px] lg:h-[535px] xl:h-[700px] 2xl:h-[810px]'
                      : 'h-[273px] sm:h-[520px] md:h-[530px] lg:h-[435px] xl:h-[530px] 2xl:h-[740px]'
                  } ${product.plankWidth && 'py-2 sm:py-0'}`}
                >
                  <Image
                    fill
                    priority
                    fetchPriority="high"
                    src={product.imageUrl}
                    className={`w-full px-1 ${selectedColor ? 'object-cover' : ''}`}
                    alt={product.altText || 'Thumbnail'}
                    sizes="30vw"
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
                  {!stickyside && index === 5 && (
                    <div className="absolute bottom-14 sm:bottom-36 2xl:bottom-56 left-2 flex flex-col gap-1 font-inter max-w-60 w-full text-12 md:text-base xl:text-20 font-semibold">
                      <p>Base layer</p>
                      <p>Backside detail</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {!hideThumnailBottom && ThumnailBottom && (
            <div className="grid grid-cols-6 gap-1 sm:gap-3 pt-2 sm:pt-6">
              {ThumnailBottom.map((array, index) => {
                const globalIndex = ThumnailImage.length + index;
                return (
                  <div
                    key={index}
                    className="text-center cursor-pointer"
                    onClick={() => handleThumbnailClick(globalIndex)}
                  >
                    <div className="w-full h-[39px] sm:h-20 md:h-28 lg:h-24 2xl:h-32 relative">
                      <Image
                        fill
                        src={array.imageUrl}
                        alt={array.altText}
                        className={`p-[2px] object-cover border-2 ${
                          globalIndex === currentSlide
                            ? 'border-primary'
                            : 'border-transparent'
                        }`}
                      />
                    </div>
                    <p className="font-semibold text-[8px] md:text-sm lg:text-xs xl:text-base capitalize">
                      {getStaticTitle(index)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;
