import React from 'react';
interface CardSkeletonProps {
  length: number;
}
const CardSkeleton = ({ length }: CardSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[...Array(length)].map((_, i) => (
        <div
          key={i}
          className="w-full h-[200px] sm:h-[300px] animate-pulse rounded-md flex flex-col mt-3"
        >
          <div className="h-[150px] sm:h-[200px] w-full bg-gray-300 rounded-t-md"></div>
          <div className="p-3 flex flex-col gap-2">
            <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
              <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
