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
  selectOptions,
  setFieldValue
}: InputWithUnitProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [unit, setUnit] = useState<string>(selectOptions[0]);

  useEffect(() => {
    if (!value) {
      setInputValue('');
      setUnit(selectOptions[0]);
      return;
    }

    const parts = value.trim().split(' ');
    const lastPart = parts[parts.length - 1];

    if (selectOptions.includes(lastPart)) {
      const val = parts.slice(0, -1).join(' ');
      setInputValue(val);
      setUnit(lastPart);
    } else {
      setInputValue(value);
      setUnit(selectOptions[0]);
    }
  }, [value, selectOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    const combined = newVal ? `${newVal} ${unit}` : '';
    setFieldValue(name, combined);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    const combined = inputValue ? `${inputValue} ${newUnit}` : newUnit;
    setFieldValue(name, combined);
  };

  return (
    <div className="flex flex-col mb-1 w-full">
      <label htmlFor={name} className="text-13 font-medium font-inter mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex w-full border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary relative rounded-lg">
        <input
          type="number"
          placeholder={placeholder}
          className="p-2 h-[42px] w-full placeholder:text-xs placeholder:font-medium placeholder:text-[#0000003D] outline-none"
          min={0}
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="relative">
          <select
            value={unit}
            onChange={handleUnitChange}
            className="h-[42px] px-2 pr-6 bg-white border-l border-gray-300 outline-none appearance-none text-sm "
          >
            {selectOptions.map((option) => (
              <option key={option} value={option} label={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-[#989DA6] text-xs">
            <FiChevronDown />
          </div>
        </div>
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
