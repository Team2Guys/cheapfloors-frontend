'use client';
import { FloorItemsData } from 'data/data';
import Container from 'components/common/container/Container';
import Image from 'next/image';
import { useState } from 'react';

const FloorItems = () => {
  const [hoverIndex, serHoverImage] = useState<number | null>(null);
  return (
    <Container className="grid grid-cols-3 lg:gap-16 gap-2 ">
      {FloorItemsData.map((item, index) => (
        <div
          key={index}
          className="font-inter text-center space-y-4 flex flex-col justify-between"
        >
          <h3 className="lg:text-3xl text-sm md:font-bold">{item.title}</h3>
          <div
            className="h-[100px] sm:h-full 2xl:h-auto w-full"
            onMouseEnter={() => serHoverImage(index)}
            onMouseLeave={() => serHoverImage(null)}
          >
            <Image
              src={hoverIndex === index ? item.hoverImage : item.imageUrl}
              alt={item.title}
              loading="lazy"
              fill
              className="!relative"
              sizes="(max-width: 768px) 100px, 600px"
            />
          </div>
        </div>
      ))}
    </Container>
  );
};

export default FloorItems;
