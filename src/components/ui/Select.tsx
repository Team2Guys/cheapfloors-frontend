'use client';
import { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = ({
  options,
  sortOption,
  onChange
}: {
  options: string[];
  sortOption: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selected, setSelected] = useState(sortOption);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-28 lg:w-40 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex_between w-full px-3 py-2 bg-[#F9FAFB] text-16 lg:text-sm font-medium"
      >
        {selected}
        <span className="block lg:hidden">
          <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              {/* <!-- Left downward zig --> */}
              <path d="M22 10 L4 30" />
              <path d="M22 10 L22 54" />

              {/* <!-- Right upward zig --> */}
              <path d="M42 54 L60 30" />
              <path d="M42 10 L42 54" />
            </g>
          </svg>
        </span>

        {/* Desktop View: Chevron Down Icon */}
        <span className="hidden lg:block">
          <FiChevronDown
            className={`text-gray-500 transition ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute left-0 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-md">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition text-12 lg:text-sm"
              onClick={() => {
                setSelected(option);
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
