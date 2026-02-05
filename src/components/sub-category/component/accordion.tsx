'use client';
import { useState, ReactNode } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-1">
      <button
        className="flex items-center gap-2 w-full text-left text-black  text-sm font-inter"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronRight /> : <FiChevronDown />}
        {title}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 text-sm px-2 ${
          isOpen ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
