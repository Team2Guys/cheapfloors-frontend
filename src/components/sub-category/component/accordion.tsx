'use client';
import { useState, ReactNode } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        className="flex items-center justify-between w-full text-left text-[#191C1F] text-sm font-inter bg-[#F9FAFB] px-3 py-2.5 rounded-sm capitalize"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <FiMinus className="text-black text-lg" /> : <FiPlus className="text-black text-lg" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 text-sm ${isOpen ? 'max-h-[1000px] opacity-100 border-t border-l border-b border-r-0 border-[#0000001F] bg-white' : 'max-h-0 opacity-0'
          }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
