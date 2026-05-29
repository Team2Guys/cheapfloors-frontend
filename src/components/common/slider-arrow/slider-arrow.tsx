import React from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

interface SliderArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: 'left' | 'right';
}

const SliderArrow = ({ direction, className = '', ...props }: SliderArrowProps) => {
  const isLeft = direction === 'left';
  const baseClasses =
    'flex items-center justify-center rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed z-10 w-8 h-8 sm:w-10 sm:h-10 shrink-0';
  const directionClasses = isLeft
    ? 'border border-[#0000001F] bg-[#FEB9071F] hover:bg-primary text-black'
    : 'border border-[#0000001F] bg-[#FEB9071F] hover:bg-primary text-black shadow-sm';

  return (
    <button className={`${baseClasses} ${directionClasses} ${className}`} {...props}>
      {isLeft ? (
        <BsArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
};

export default SliderArrow;
