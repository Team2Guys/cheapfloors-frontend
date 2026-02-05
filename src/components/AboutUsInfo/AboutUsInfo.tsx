'use client ';

import Image from 'next/image';
import { TAboutUsProps } from 'types/types';

const AboutUsInfo: React.FC<TAboutUsProps> = ({ sections }) => {
  return (
    <div className="space-y-5 sm:space-y-10 md:pt-8  font-inter ">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`flex flex-col md:flex-row items-center md:gap-16 gap-5 ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          <div className="relative w-full h-[150px] lg:h-[200px] xl:h-[280px] 2xl:h-[350px] md:w-1/2">
            <Image
              src={section.image}
              alt={section.alt}
              fill
              priority
              fetchPriority="high"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <h2 className="md:text-3xl text-xl font-bold">{section.heading}</h2>
            <p className="text-sm md:text-base font-normal">
              {section.paragraph}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUsInfo;
