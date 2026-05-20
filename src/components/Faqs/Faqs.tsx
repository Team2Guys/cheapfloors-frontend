'use client';
import Container from 'components/common/container/Container';
import { useState } from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { FAQItem } from 'types/type';

interface FaqsProps {
  data: FAQItem[];
  className?: string;
}

const Faqs: React.FC<FaqsProps> = ({ data, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container className={`bg-white py-10 md:mt-10 ${className || ''}`}>
      <h2 className="text-3xl md:text-[40px] font-bold font-inter text-black text-center md:mb-12 mb-8 uppercase">
        FAQ'S
      </h2>

      <div className="flex flex-col gap-[2px] md:gap-1 font-inter">
        {data.map((faq, index) => (
          <div key={faq.id || index} className="flex flex-col">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between bg-[#FAFAFA] hover:bg-gray-100 transition-colors duration-200 text-left focus:outline-none p-4 md:px-6 md:py-5"
            >
              <h3 className="text-sm md:text-base text-black font-normal pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] md:w-[26px] md:h-[26px] rounded-full bg-primary text-white">
                {openIndex === index ? (
                  <HiMinus size={16} />
                ) : (
                  <HiPlus size={16} />
                )}
              </div>
            </button>
            {openIndex === index && (
              <div
                className="p-4 md:px-6 md:py-5 bg-[#F0F0F0] text-gray-800 font-normal text-sm md:text-[15px] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Faqs;
