'use client';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  TouchEvent
} from 'react';
import Container from 'components/common/container/Container';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { reelsData } from 'data/SellerSlider';

const getEmbedUrl = (url: string) =>
  `${url.endsWith('/') ? url : `${url}/`}embed`;

export default function VideoReelsSlider() {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(2, Math.max(0, reelsData.length - 1))
  );
  const [isVisible, setIsVisible] = useState(false);
  // Load each embed once (never unload) so navigating doesn't reload iframes.
  const [loaded, setLoaded] = useState<number[]>([]);

  const total = reelsData.length;
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const goToPrevious = useCallback(
    () => setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1)),
    [total]
  );
  const goToNext = useCallback(
    () => setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1)),
    [total]
  );

  useEffect(() => {
    const node = sliderRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  // Only load the ~5 reels around the active one, and keep them loaded.
  useEffect(() => {
    if (!isVisible) return;
    const near = [
      activeIndex,
      (activeIndex - 1 + total) % total,
      (activeIndex - 2 + total) % total,
      (activeIndex + 1) % total,
      (activeIndex + 2) % total
    ];
    setLoaded((prev) => Array.from(new Set([...prev, ...near])));
  }, [isVisible, activeIndex, total]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      if (distance > minSwipeDistance) goToNext();
      else if (distance < -minSwipeDistance) goToPrevious();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getPositionClass = (index: number) => {
    const left1 = (activeIndex - 1 + total) % total;
    const left2 = (activeIndex - 2 + total) % total;
    const right1 = (activeIndex + 1) % total;
    const right2 = (activeIndex + 2) % total;

    if (index === activeIndex) return 'z-30 scale-100 opacity-100';
    if (index === left1) return 'z-20 scale-[0.85] -translate-x-[60%]';
    if (index === left2) return 'z-10 scale-[0.75] -translate-x-[110%]';
    if (index === right1) return 'z-20 scale-[0.85] translate-x-[60%]';
    if (index === right2) return 'z-10 scale-[0.75] translate-x-[110%]';
    return 'hidden';
  };

  if (total === 0) return null;

  return (
    <div className="relative mt-4 font-inter" ref={sliderRef}>
      <div className="sm:py-6 py-4 text-center">
        <p className="sm:text-4xl text-xl text-primary font-bold">
          Press Play on Our Flooring Reels!
        </p>
      </div>

      <Container>
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous reel"
            className="absolute left-1 sm:left-4 z-40 flex size-9 sm:size-11 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition"
          >
            <FaChevronLeft />
          </button>

          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex items-center justify-center sm:h-[760px] h-[340px] w-full overflow-hidden"
          >
            {reelsData.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${getPositionClass(
                  index
                )}`}
              >
                <div className="relative sm:w-[420px] sm:h-[720px] w-[180px] h-[320px] rounded-2xl overflow-hidden shadow-lg bg-black">
                  {loaded.includes(index) ? (
                    <iframe
                      src={getEmbedUrl(item.url)}
                      className="w-full h-full"
                      loading="lazy"
                      scrolling="no"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      allowFullScreen
                      title={`Instagram reel ${index + 1}`}
                    />
                  ) : (
                    <div className="w-full h-full animate-pulse bg-gray-200" />
                  )}
                  {/* Non-active cards: overlay so a click selects the card
                      instead of interacting with the embedded reel. */}
                  {index !== activeIndex && (
                    <div className="absolute inset-0 z-10" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next reel"
            className="absolute right-1 sm:right-4 z-40 flex size-9 sm:size-11 items-center justify-center rounded-full bg-white shadow-md hover:bg-primary hover:text-white transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </Container>
    </div>
  );
}
