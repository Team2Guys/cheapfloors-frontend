'use client';
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  TouchEvent,
  SyntheticEvent
} from 'react';
import Container from 'components/common/container/Container';
import { FaPlay } from 'react-icons/fa';
import { reelsData } from 'data/SellerSlider';

export default function VideoReelsSlider() {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(2, Math.max(0, reelsData.length - 1))
  );
  const [popupVideoIndex, setPopupVideoIndex] = useState<number | null>(null);
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const totalVideos = reelsData.length;
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  const goToPrevious = useCallback(
    () => setActiveIndex((prev) => (prev === 0 ? totalVideos - 1 : prev - 1)),
    [totalVideos]
  );

  const goToNext = useCallback(
    () => setActiveIndex((prev) => (prev === totalVideos - 1 ? 0 : prev + 1)),
    [totalVideos]
  );

  useEffect(() => {
    const node = sliderRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || popupVideoIndex !== null) return;
    const interval = setInterval(goToNext, 3000);
    return () => clearInterval(interval);
  }, [goToNext, popupVideoIndex, isVisible]);

  useEffect(() => {
    if (!isVisible || popupVideoIndex !== null) return;
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.play().catch(() => {});
    }
  }, [isVisible, activeIndex, popupVideoIndex]);

  useEffect(() => {
    document.body.style.overflow = popupVideoIndex !== null ? 'hidden' : '';
    if (popupVideoIndex === null) setVideoSize(null);
  }, [popupVideoIndex]);

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

  const getPositionClass = useCallback(
    (index: number) => {
      const left1 = (activeIndex - 1 + totalVideos) % totalVideos;
      const left2 = (activeIndex - 2 + totalVideos) % totalVideos;
      const right1 = (activeIndex + 1) % totalVideos;
      const right2 = (activeIndex + 2) % totalVideos;

      if (index === activeIndex) return 'z-30 scale-100 opacity-100';
      if (index === left1) return 'z-20 scale-[0.85] -translate-x-[60%]';
      if (index === left2) return 'z-10 scale-[0.75] -translate-x-[110%]';
      if (index === right1) return 'z-20 scale-[0.85] translate-x-[60%]';
      if (index === right2) return 'z-10 scale-[0.75] translate-x-[110%]';
      return 'hidden';
    },
    [activeIndex, totalVideos]
  );

  const handleLoadedMetadata = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;

      let width = video.videoWidth;
      let height = video.videoHeight;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height *= ratio;
      }
      if (height > maxHeight) {
        const ratio = maxHeight / height;
        height = maxHeight;
        width *= ratio;
      }
      setVideoSize({ width, height });
    },
    []
  );

  const videoElements = useMemo(
    () =>
      reelsData.map((item, index) => {
        const isNearActive = [
          activeIndex,
          (activeIndex - 1 + totalVideos) % totalVideos,
          (activeIndex - 2 + totalVideos) % totalVideos,
          (activeIndex + 1) % totalVideos,
          (activeIndex + 2) % totalVideos
        ].includes(index);

        return (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
              setTimeout(() => setPopupVideoIndex(index), 100);
            }}
            className={`absolute transition-all duration-500 ease-in-out cursor-pointer ${getPositionClass(
              index
            )}`}
          >
            <div className="relative sm:w-[420px] sm:h-[720px] w-[180px] h-[320px] rounded-2xl overflow-hidden shadow-lg bg-black">
              <div className="absolute top-2 right-2 z-40 bg-black/40 rounded-full p-1.5 sm:p-2.5">
                <FaPlay className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <video
                ref={(el) => {
                  if (el) videoRefs.current[index] = el;
                }}
                // Active reel plays from the start; the others load just their
                // first frame (#t=0.1 + metadata) so no black screen shows.
                src={
                  isNearActive
                    ? index === activeIndex
                      ? item.videoUrl
                      : `${item.videoUrl}#t=0.1`
                    : undefined
                }
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload={index === activeIndex ? 'auto' : 'metadata'}
                poster={item.videoPoster}
                autoPlay={
                  isVisible && index === activeIndex && popupVideoIndex === null
                }
              />
            </div>
          </div>
        );
      }),
    [getPositionClass, activeIndex, totalVideos, isVisible, popupVideoIndex]
  );

  if (totalVideos === 0) return null;

  return (
    <>
      <div className="relative mt-4 font-inter" ref={sliderRef}>
        <div className="sm:py-6 py-4 text-center">
          <p className="sm:text-4xl text-xl text-primary font-bold">
            Press Play on Our Flooring Reels!
          </p>
        </div>

        <Container>
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex items-center justify-center sm:h-[760px] h-[340px] overflow-hidden"
          >
            {videoElements}
          </div>
        </Container>
      </div>

      {popupVideoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setPopupVideoIndex(null)}
        >
          <div
            className="relative bg-black rounded-lg shadow-lg"
            style={{
              width: videoSize?.width ?? 'auto',
              height: videoSize?.height ?? 'auto',
              maxWidth: '90vw',
              maxHeight: '90vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPopupVideoIndex(null)}
              className="absolute top-3 right-3 z-50 text-black bg-primary rounded-full px-2.5 py-1 focus:outline-none"
              aria-label="Close video"
            >
              ✕
            </button>
            <video
              key={reelsData[popupVideoIndex].videoUrl}
              src={reelsData[popupVideoIndex].videoUrl}
              className="rounded-lg object-contain w-full h-full"
              controls
              autoPlay
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        </div>
      )}
    </>
  );
}
