'use client';

import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface InputProps {
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  className?: string;
}

const Input = ({
  label,
  name,
  placeholder,
  type = 'text',
  textarea = false,
  className
}: InputProps) => {
  return (
    <div className={`${className} w-full`}>
      <label className="block mb-3 text-sm font-medium text-black dark:text-white">
        {label}
      </label>

      {textarea ? (
        <Field
          as="textarea"
          name={name}
          placeholder={placeholder}
          className="dashboard_input min-h-[100px] resize-none"
        />
      ) : (
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          className="dashboard_input"
        />
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default Input;
