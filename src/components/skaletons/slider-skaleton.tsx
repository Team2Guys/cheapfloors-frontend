import React from 'react';

const SliderSkaleton = () => {
  return (
    <div className="pt-4 sm:pt-10 w-full overflow-x-auto transparentScroll">
      <div className="flex gap-4 overflow-x-auto w-full  px-4 transparentScroll">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="min-w-[250px] sm:w-3/12 h-[300px] animate-pulse rounded-md flex flex-col snap-start"
          >
            <div className="h-[200px] w-full bg-gray-300 rounded-t-md"></div>
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
    </div>
  );
};

export default SliderSkaleton;
