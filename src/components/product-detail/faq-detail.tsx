'use client';
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';


interface CategoryFaqsProps {
  faqs?: { name: string; detail: string }[];
  className?: string;
}

const Faqs: React.FC<CategoryFaqsProps> = ({ faqs = [], className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`mb-10 font-inter max-w-[1100px] mx-auto px-2 xs:px-4 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
        FAQ&apos;S
      </h2>

      <div className="space-y-2 md:space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-[#FAFAFA] rounded-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 md:px-6 md:py-5 text-left focus:outline-none"
              >
                <span className={`font-semibold text-sm md:text-base ${isOpen ? 'text-black' : 'text-gray-800'}`}>
                  {isOpen ? `Q. ${faq.name}` : faq.name}
                </span>
                <span className="ml-4 flex-shrink-0">
                  {isOpen ? (
                    <FiMinus className="text-black text-xl" />
                  ) : (
                    <FiPlus className="text-black text-xl" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 md:px-6 pb-5">
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                    {faq.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faqs;
