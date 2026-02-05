'use client';

import React, { useRef } from 'react';

const CustomPriceSlider = ({
  setPriceValue,
  priceValue,
  isArea,
  isClearance
}: {
  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  priceValue: [number, number];
  isArea?: boolean;
  isClearance?: boolean;
}) => {
  const min = isArea ? 0 : isClearance ? 20 : 49;
  const max = isArea ? 1000 : 149;
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleDrag = (clientX: number, thumbType: 'min' | 'max') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const sliderRect = slider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const offsetX = clientX - sliderRect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / sliderWidth));
    const newValue = Math.round(min + percentage * (max - min));

    if (thumbType === 'min') {
      if (newValue < priceValue[1]) {
        setPriceValue([newValue, priceValue[1]]);
      }
    } else {
      if (newValue > priceValue[0]) {
        setPriceValue([priceValue[0], newValue]);
      }
    }
  };

  const setupListeners = (
    e: React.MouseEvent | React.TouchEvent,
    thumbType: 'min' | 'max'
  ) => {
    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX =
        'touches' in moveEvent
          ? moveEvent.touches[0].clientX
          : (moveEvent as MouseEvent).clientX;
      handleDrag(clientX, thumbType);
    };

    const upHandler = () => {
      //eslint-disable-next-line
      document.removeEventListener('mousemove', moveHandler as any);
      document.removeEventListener('mouseup', upHandler);
      //eslint-disable-next-line
      document.removeEventListener('touchmove', moveHandler as any);
      document.removeEventListener('touchend', upHandler);
    };
    //eslint-disable-next-line
    document.addEventListener('mousemove', moveHandler as any);
    document.addEventListener('mouseup', upHandler);
    //eslint-disable-next-line
    document.addEventListener('touchmove', moveHandler as any);
    document.addEventListener('touchend', upHandler);
  };

  return (
    <div className="relative w-full flex flex-col items-center space-y-2 select-none touch-none">
      {/* Slider track */}
      <div
        ref={sliderRef}
        className="h-2 bg-gray-300 rounded-full w-full relative"
      >
        {/* Active range */}
        <div
          className="absolute bg-primary h-2 rounded-full"
          style={{
            left: `${getPercentage(priceValue[0])}%`,
            width: `${getPercentage(priceValue[1]) - getPercentage(priceValue[0])}%`
          }}
        />

        {/* Min thumb */}
        <div
          className="w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer absolute top-1/2 transform -translate-y-1/2 z-10 touch-none"
          style={{
            left: `${getPercentage(priceValue[0])}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={(e) => setupListeners(e, 'min')}
          onTouchStart={(e) => setupListeners(e, 'min')}
        />

        {/* Max thumb */}
        <div
          className="w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer absolute top-1/2 transform -translate-y-1/2 z-10 touch-none"
          style={{
            left: `${getPercentage(priceValue[1])}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={(e) => setupListeners(e, 'max')}
          onTouchStart={(e) => setupListeners(e, 'max')}
        />
      </div>

      {/* Price label */}
      <p className="text-sm xl:text-base pt-1 text-[#475156]">
        {isArea ? 'SQM' : 'Price'}:{' '}
        <span className="font-normal">
          <span className="font-currency font-normal text-18"></span>{' '}
          {priceValue[0]}
          {isArea ? '' : '/m²'} —{' '}
          <span className="font-currency font-normal text-18"></span>{' '}
          {priceValue[1]}
          {isArea ? '' : '/m²'}
        </span>
      </p>
    </div>
  );
};

export default CustomPriceSlider;
