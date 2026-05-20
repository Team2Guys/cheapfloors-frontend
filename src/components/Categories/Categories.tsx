import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogCardProps } from 'types/type';
import { categoriesFeatures } from 'data/data';
import { CategoryFeatures } from 'types/types';

interface Props extends BlogCardProps {
  index: number;
}

const Categories: React.FC<Props> = ({ card, index }) => {
  const featureObj: CategoryFeatures | undefined = categoriesFeatures[index];

  return (
    <div className="group relative overflow-hidden shadow-lg md:h-96 xl:h-[420px] h-80  w-full text-center md:mb-0 mb-10 border-b mt-5">
      <div className="relative h-full w-full">
        <Image
          src={card?.homePageImage?.imageUrl || ''}
          alt={card?.homePageImage?.altText || 'easy Floor'}
          fill
          quality={80}
          loading="lazy"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />

        <div className="relative h-full flex items-center pt-3 xsm:pt-10 flex-col text-white">
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 md:pb-9 text-white text-center">
            <h3 className="md:mb-3 text-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] xs:px-4">
              <span className="block">I AM</span>
              <span className="block">{card.name}</span>
              {/* <span className="block">
                {card.name.split(' ')[0]}
              </span>
              <span className="block">
                {card.name.split(' ').slice(1).join(' ')}
              </span> */}
            </h3>

            <Link
              href={`what-am-i?flooring=${card.whatIamEndpoint}`}
              className="text-base font-normal hover:bg-primary transition duration-300 underline underline-offset-8 decoration- hover:no-underline hover:text-black p-2 rounded-full"
            >
              Click Me
            </Link>
          </div>
          {featureObj && (
            <div className="absolute bg-[#FEB907] text-black sm:top-3 sm:right-3 block right-1 top-1 md:text-sm md:p-4 p-2 m-2 sm:m-0 rounded-xl opacity-100 xsm:opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-fit whitespace-nowrap">
              <ul className="list-disc pl-5 text-left max-w-[220px]">
                {featureObj.features.map((feature, i) => (
                  <li
                    className="text-xs md:text-sm lg:text-11 xl:text-sm text-wrap break-words"
                    key={i}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
