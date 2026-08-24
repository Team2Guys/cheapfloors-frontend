'use client';

import React, { useEffect, useRef, useState, memo } from 'react';

const VideoReelsSkeleton = () => (
  <div className="flex items-center justify-center gap-4 sm:h-[750px] h-[300px]">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="relative sm:w-[500px] sm:h-[670px] w-[150px] h-[280px] rounded-2xl bg-gray-100"
      />
    ))}
  </div>
);

const VideoReelsWrapper = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [VideoSliderComponent, setVideoSliderComponent] =
    useState<React.ComponentType | null>(null);

  // Lazy-load the slider only once it approaches the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      import('./VideoSlider').then((mod) => {
        setVideoSliderComponent(() => mod.default);
      });
    }
  }, [inView]);

  return (
    <div ref={ref} className="min-h-[300px]">
      {VideoSliderComponent ? <VideoSliderComponent /> : <VideoReelsSkeleton />}
    </div>
  );
});

VideoReelsWrapper.displayName = 'VideoReelsWrapper';

export default VideoReelsWrapper;
