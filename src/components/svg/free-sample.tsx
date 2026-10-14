import React from 'react';

// The artwork is a traced bitmap (37 paths, ~80 KB of path data). It lives
// once in /public/assets/icons/free-sample.svg and is referenced with <use>,
// so a listing with 80 cards embeds it once (and cached) instead of 80 times.
// Paths in the sprite carry no fill, so they inherit the fill set here.
const FreeSample = ({isCard, className}: {isCard?: boolean, className?: string}) => {
  return (
    <svg
      className={`${isCard ? (className ?? 'size-5') : 'size-3.5 min-[1150px]:size-4 xl:size-5'}`}
      fill={isCard ? 'currentColor' : undefined}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href="/assets/icons/free-sample.svg#free-sample" />
    </svg>
  );
};

export default FreeSample;
