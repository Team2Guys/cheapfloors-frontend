'use client';
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import Container from '../common/container/Container';

interface FAQItem {
  id: string | number;
  question: string;
  answer: string;
}

interface CategoryFaqsProps {
  faqs?: FAQItem[];
  className?: string;
}

// Dummy data to match the image exactly if no data is provided
const DUMMY_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What makes vinyl flooring a good choice for high-traffic areas?",
    answer: "Vinyl flooring Abu Dhabi is highly durable and resistant to wear and tear, making it ideal for high-traffic areas. Its water-resistant and scratch-resistant properties ensure it maintains its appearance and functionality even in busy environments."
  },
  {
    id: 2,
    question: "How long until we deliver your first blog post?",
    answer: "Our typical delivery time for the first blog post is 3-5 business days after the initial consultation and content strategy approval."
  },
  {
    id: 3,
    question: "How long until we deliver your first blog post?",
    answer: "Our typical delivery time for the first blog post is 3-5 business days after the initial consultation and content strategy approval."
  },
  {
    id: 4,
    question: "How long until we deliver your first blog post?",
    answer: "Our typical delivery time for the first blog post is 3-5 business days after the initial consultation and content strategy approval."
  }
];

const CategoryFaqs: React.FC<CategoryFaqsProps> = ({ faqs = DUMMY_FAQS, className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`mb-10 font-inter max-w-[1100px] mx-auto px-2 xs:px-4 ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
        FAQ'S
      </h2>

      <div className="space-y-2 md:space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id}
              className="bg-[#FAFAFA] rounded-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 md:px-6 md:py-5 text-left focus:outline-none"
              >
                <span className={`font-semibold text-sm md:text-base ${isOpen ? 'text-black' : 'text-gray-800'}`}>
                  {isOpen ? `Q. ${faq.question}` : faq.question}
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
                    {faq.answer}
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

export default CategoryFaqs;
