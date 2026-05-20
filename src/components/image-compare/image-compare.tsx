'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Container from 'components/common/container/Container';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
}

const CompareSlider = ({
  beforeSrc,
  afterSrc,
  alt = 'Comparison Image'
}: CompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const handleDrag = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    setPosition(newPos);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDrag(e.clientX);
    const onMouseMove = (event: MouseEvent) => handleDrag(event.clientX);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleDrag(e.touches[0].clientX);

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault(); // 🚫 stop page scroll
      handleDrag(event.touches[0].clientX);
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, {
      passive: false // 🔥 REQUIRED for iOS
    });

    document.addEventListener('touchend', onTouchEnd);
  };

  return (
    <Container className="w-full flex flex-col items-center mt-10">
      <div
        ref={containerRef}
        className="relative w-full h-[150px] xs:h-[200px] xsm:h-[300px] xl:h-[400px] 2xl:h-[500px] overflow-hidden select-none"
      >
        {/* After image (always visible in background) */}
        <div className="absolute inset-0 z-0">
          <Image
            src={afterSrc}
            alt={`${alt} - After`}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
            priority={false}
          />
        </div>

        {/* Before image (clipped based on position) */}
        <div
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={`${alt} - Before`}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
            priority={false}
          />
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white z-10"
          style={{
            left: `${position}%`,
            transform: 'translateX(-1px)'
          }}
        />

        {/* Draggable Handle */}
        <div
          className="absolute top-1/2 z-30 cursor-ew-resize"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="w-16 h-16 bg-transparent border-4 border-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-center w-full h-full rounded-full relative">
              <FaCaretLeft size={24} className="text-white" />
              <FaCaretRight size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Labels */}
        {position > 5 && (
          <div className="absolute bottom-4 left-4 bg-primary text-black text-base font-medium px-6 py-2 rounded-full shadow z-20">
            Before
          </div>
        )}
        {position < 95 && (
          <div className="absolute bottom-4 right-4 bg-primary text-black text-base font-medium px-6 py-2 rounded-full shadow z-20">
            After
          </div>
        )}
      </div>
    </Container>
  );
};

export default CompareSlider;
