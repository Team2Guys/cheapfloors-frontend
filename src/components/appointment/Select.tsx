'use client';
import { useState, useRef, useEffect } from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import { FiChevronDown, FiX } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}
interface SelectProps {
  name: string;
  options: Option[];
  label?: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (_value: string) => void;
  allowOther?: boolean;
  className?: string;
}

const Select = ({
  name,
  options,
  label,
  required = false,
  placeholder = 'Select Location',
  initialValue,
  onChange,
  allowOther = false,
  className
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: string;
  }>();
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);
  const baseFiltered = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOptions: Option[] =
    allowOther && searchTerm.trim() && baseFiltered.length === 0
      ? [{ value: 'Other', label: 'Other Areas' }]
      : baseFiltered;

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
  };

  const handleOptionSelect = (opt: Option) => {
    setFieldValue(name, opt.value);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(opt.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };
  useEffect(() => {
    if (initialValue) setFieldValue(name, initialValue);
  }, [initialValue, name, setFieldValue]);

  const displayLabel = values[name]
    ? options.find((o) => o.value === values[name])?.label
    : placeholder;

  return (
    <div className="flex flex-col mb-1">
      {label && (
        <label htmlFor={name} className="text-20 font-medium font-inter">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div ref={dropdownRef} className="relative w-full mt-1">
        <div
          onClick={handleSelectClick}
          className={`${className ?  `${className} border-2 flex_between` : ' flex_between w-full px-3 h-11 border border-gray-300 bg-white text-12 font-medium cursor-pointer rounded-lg'}`}
        >
          {isOpen ? (
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={displayLabel}
              className="w-full flex-1 focus:outline-none placeholder:text-base"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`truncate flex-1 text-left text-base ${!values[name] && 'text-gray-400'}`}
            >
              {displayLabel}
            </span>
          )}
          <div className="flex items-center">
            {isOpen && searchTerm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearch();
                }}
                className="text-gray-400 hover:text-gray-600 mr-1"
              >
                <FiX size={16} />
              </button>
            )}
            <FiChevronDown
              className={`text-gray-500 transition ${isOpen && 'rotate-180'}`}
            />
          </div>
        </div>

        {/* ---- dropdown list ---- */}
        {isOpen && (
          <ul className="absolute left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-md z-20 max-h-60 overflow-y-auto">
            {filteredOptions.length ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleOptionSelect(opt)}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white text-base lg:text-sm"
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-12 text-gray-500">
                No options found
              </li>
            )}
          </ul>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default Select;
