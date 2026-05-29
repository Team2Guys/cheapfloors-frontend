'use client';

import React, { useState} from 'react';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { FAQsListProps } from 'types/types';

const FAQsList: React.FC<FAQsListProps> = ({ faqspage }) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // 1. Group FAQs by category
  const categories = Array.from(new Set(faqspage.map((faq) => faq.category || 'General')));

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  // 2. Smooth Scroll Function
  const scrollToSection = (category: string) => {
    const element = document.getElementById(`section-${category}`);
    if (element) {
      const offset = 100; // Adjust for sticky nav if you have one
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="font-inter">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Frequently Ask Questions</h1>

      {/* 3. Category Tabs/Navigation */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollToSection(cat)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. FAQ Sections */}
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category} id={`section-${category}`} className="scroll-mt-20">
            {/* Category Heading */}
            <h2 className="text-[#FFB800] text-xl font-bold mb-4">{category}</h2>

            <div className="space-y-3">
              {faqspage
                .filter((faq) => (faq.category || 'General') === category)
                .map((faq, index) => {
                  const uniqueId = `${category}-${index}`;
                  const isOpen = openIndex === uniqueId;

                  return (
                    <div
                      key={uniqueId}
                      className="bg-[#F8F9FA] rounded-md overflow-hidden transition-all border border-transparent"
                    >
                      <button
                        onClick={() => toggleFAQ(uniqueId)}
                        className="flex justify-between items-center w-full text-left p-4 md:p-5 focus:outline-none"
                      >
                        <span className="font-bold text-sm md:text-lg text-black pr-4">
                          {faq.question}
                        </span>
                        <span className="text-gray-600 flex-shrink-0">
                          {isOpen ? (
                            <HiMinus size={24} className="text-black" />
                          ) : (
                            <HiPlus size={24} className="text-black" />
                          )}
                        </span>
                      </button>

                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="p-4 md:p-5 pt-0 border-t border-gray-100">
                          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQsList;