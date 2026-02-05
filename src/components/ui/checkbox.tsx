'use client';

import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

interface CheckboxProps {
  name?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; //eslint-disable-line
  children?: ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const Checkbox = ({
  name,
  checked,
  onChange,
  children,
  className,
  required,
  disabled
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked || false);

  useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);


  return (
    <label
      className={`flex items-center cursor-pointer gap-2 ${className || ''} text-sm ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        onChange={onChange}
        required={required}
        className="hidden"
        disabled={disabled}
      />
      <div
        className={`w-5 h-5 border-2 flex_center transition-colors duration-200 ${
          isChecked
            ? 'bg-primary border-primary text-white'
            : 'border-primary'
        }`}
      >
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {/* {!isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )} */}
      </div>
      {children && (
        <span
          className={`text-black font-inter ${
            isChecked ? 'font-medium' : 'font-normal'
          }`}
        >
          {children}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
