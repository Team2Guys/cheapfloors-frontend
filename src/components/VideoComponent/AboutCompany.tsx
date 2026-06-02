import Image from 'next/image';
import React from 'react';
import { TAutoVideoProps } from 'types/types';

const VideoComponent: React.FC<TAutoVideoProps> = ({
  fallbackImage,
  className
}) => {
  return (
    <div className={`w-full mb-10 h-full ${className}`}>
      <video
        className="w-full h-[261px] sm:h-[500px] object-fill"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/assets/EF.mp4" type="video/mp4" />
        {fallbackImage && (
          <Image
            src={fallbackImage}
            alt="Fallback image"
            className="w-full h-auto object-fill"
          />
        )}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;
