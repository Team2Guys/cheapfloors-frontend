import Image from 'next/image';
import React from 'react';
import { TAutoVideoProps } from 'types/types';

const VideoComponent: React.FC<TAutoVideoProps> = ({
  videoUrl,
  fallbackImage,
  className
}) => {
  return (
    <div className={`w-full mb-10 h-full ${className}`}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        {fallbackImage && (
          <Image
            src={fallbackImage}
            alt="Fallback image"
            className="w-full h-full object-cover"
          />
        )}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;
