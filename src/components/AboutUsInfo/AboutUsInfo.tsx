'use client ';

import Image from 'next/image';
import { TAboutUsProps } from 'types/types';

const AboutUsInfo: React.FC<TAboutUsProps> = ({ sections, isAboutUs }) => {
  return (
    <div className="space-y-5 sm:space-y-10 md:pt-8  font-inter ">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`flex flex-col md:flex-row items-center md:gap-16 gap-5 ${
            index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'
          }`}
        >
          <div className="relative w-full aspect-[16/11] md:w-1/2 overflow-hidden shadow-sm">
            <Image
              src={section.image}
              alt={section.alt || section.heading}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center" // This is the fix for stretching
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            {(isAboutUs && index === 0) ? (
              <h1 className="md:text-3xl text-xl font-bold text-primary">
                {section.heading}
              </h1>
            ) : (
              <h2 className="md:text-3xl text-xl font-bold text-primary">
                {section.heading}
              </h2>
            )}
            <p className="text-sm md:text-base font-normal text-left">
              {section.paragraph}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUsInfo;
