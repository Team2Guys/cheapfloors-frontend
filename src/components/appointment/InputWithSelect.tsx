import { ErrorMessage } from 'formik';
import React, { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { InputWithUnitProps } from 'types/types';

const InputWithUnit = ({
  label,
  name,
  required = false,
  placeholder = '',
  value,
  selectOptions = [], // Default to empty array
  setFieldValue
}: InputWithUnitProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [unit, setUnit] = useState<string>(selectOptions[0] || '');

  // Determine if we should show the unit dropdown
  const hasOptions = selectOptions && selectOptions.length > 0;

  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }

    if (hasOptions) {
      const parts = value.toString().trim().split(' ');
      const lastPart = parts[parts.length - 1];

      if (selectOptions.includes(lastPart)) {
        setInputValue(parts.slice(0, -1).join(' '));
        setUnit(lastPart);
      } else {
        setInputValue(value);
      }
    } else {
      setInputValue(value);
    }
  }, [value, selectOptions, hasOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    
    // If there are options, combine with unit. If not, just send the number.
    const finalValue = hasOptions && newVal ? `${newVal} ${unit}` : newVal;
    setFieldValue(name, finalValue);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    const finalValue = inputValue ? `${inputValue} ${newUnit}` : '';
    setFieldValue(name, finalValue);
  };

  return (
    <div className="flex flex-col mb-1 w-full">
      <label htmlFor={name} className="text-14 font-medium font-inter mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex w-full border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary relative rounded-lg overflow-hidden">
        <input
          type="number"
          placeholder={placeholder}
          className="p-2 h-[42px] w-full placeholder:text-xs placeholder:font-medium placeholder:text-[#0000003D] outline-none"
          min={0}
          value={inputValue}
          onChange={handleInputChange}
          // Remove limits by not setting a 'max'
        />
        
        {hasOptions && (
          <div className="relative border-l border-gray-300">
            <select
              value={unit}
              onChange={handleUnitChange}
              className="h-[42px] px-2 pr-6 bg-white outline-none appearance-none text-sm cursor-pointer"
            >
              {selectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-[#989DA6] text-xs">
              <FiChevronDown />
            </div>
          </div>
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

export default InputWithUnit;