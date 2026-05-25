import React from 'react';
import Image from 'next/image';
import { measurementData } from 'data/data';

const RoomMeasurement: React.FC = () => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  const renderHTML = (text: string) => (
    <p
      className="text-sm md:text-base mb-4 leading-relaxed text-gray-700"
      dangerouslySetInnerHTML={{
        __html: text.replace(emailRegex, (match) => {
          return `<a href="mailto:${match}" class="text-primary underline font-semibold" target="_blank" rel="noopener noreferrer">${match}</a>`;
        }),
      }}
    />
  );

  return (
    <div className="container mx-auto font-inter px-4 py-8 text-black">
      {/* 1. Main Centered Header */}
      <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-10">
       How to Measure Your Room & Calculate Flooring Quantity
      </h1>

      {/* 2. Top Intro Sections (First two items) */}
      <div className="mb-10">
        {measurementData.slice(0, 2).map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-2">{section.title}</h2>
            {renderHTML(section.description || '')}
          </div>
        ))}
      </div>

      {/* 3. The Two-Column Comparison Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch border-t lg:border-t-0">
        {measurementData.slice(2, 4).map((section, index) => (
          <div 
            key={index} 
            className={`flex flex-col py-8 lg:py-0 ${index === 0 ? 'lg:border-r lg:pr-10' : 'lg:pl-10'}`}
          >
            {/* Orange Heading Bar */}
            <div className="bg-primary text-black py-3 px-2 text-center font-bold text-base md:text-lg mb-6">
              {section.stepsHeading}
            </div>

            {/* Intro Description for the specific room type */}
            {section.description && (
               <p className="text-sm md:text-base text-gray-700 mb-4">{section.description}</p>
            )}

            {/* Steps with yellow bold labels */}
            <div className="space-y-4 mb-10">
              {section.steps.map((step, sIdx) => (
                <div key={sIdx} className="text-sm md:text-base leading-relaxed">
                  <span className="text-primary font-bold">{step.title}</span>{' '}
                  <span className="text-gray-800">{step.content}</span>
                </div>
              ))}
            </div>

            {/* Diagram Image bottom aligned */}
            {section.image && (
              <div className="mt-auto pt-6">
                <Image
                  src={section.image}
                  alt={section.title}
                  width={500}
                  height={350}
                  className="w-full h-auto object-contain mx-auto max-w-[440px]"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4. Footer Sections (Last two items) */}
      <div className="mt-16 space-y-10">
        {measurementData.slice(4).map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg md:text-xl font-bold mb-2">{section.title}</h2>
            {renderHTML(section.description || '')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomMeasurement;