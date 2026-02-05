import React from 'react';

interface TopProps {
  heading: string;
  Icon: React.ElementType;
}

const Top: React.FC<TopProps> = ({ heading, Icon }) => {
  return (
    <div className="flex_center flex-col h-[100px] lg:h-[200px]">
      <div className="text-3xl transition-colors duration-300">
        <Icon className="h-10 w-10 lg:h-14 lg:w-14" />
      </div>
      <h1 className="mt-1 lg:mt-6 text-xl font-semibold font-inter lg:text-[48px] text-black">
        {heading}
      </h1>
    </div>
  );
};

export default Top;
