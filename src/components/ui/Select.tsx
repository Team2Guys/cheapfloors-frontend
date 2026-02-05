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
        className="flex_between w-full px-3 py-2 max-lg:shadow lg:border lg:border-gray-300 rounded-md bg-white hover:border-primary transition text-12 lg:text-sm font-medium"
      >
        {selected}
        <span className="block lg:hidden">
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.32255 12.0478V6.38313H7.66021V12.0478H5.1667L8.49138 15.272L11.8161 12.0478H9.32255ZM3.50436 0.726562L0.179688 3.9508H2.67319V9.61545H4.33553V3.9508H6.82904L3.50436 0.726562ZM9.32255 12.0478V6.38313H7.66021V12.0478H5.1667L8.49138 15.272L11.8161 12.0478H9.32255ZM3.50436 0.726562L0.179688 3.9508H2.67319V9.61545H4.33553V3.9508H6.82904L3.50436 0.726562Z"
              fill="#232327"
            />
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
