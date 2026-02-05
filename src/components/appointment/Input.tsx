import { Field, ErrorMessage } from 'formik';
import React from 'react';
import { TextInputProps } from 'types/types';

const Input: React.FC<TextInputProps> = ({
  label,
  name,
  required = false,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  min,
  onFocus
}) => {
  return (
    <div className="flex flex-col mb-1">
      <label htmlFor={name} className="text-13 font-medium font-inter">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-1">
        {type === 'number' && (
          <svg
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-7 h-7"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_8256_23905)">
              <path
                d="M13.1148 26.2297C20.3579 26.2297 26.2297 20.358 26.2297 13.1148C26.2297 5.87171 20.3579 0 13.1148 0C5.87171 0 0 5.87171 0 13.1148C0 20.358 5.87171 26.2297 13.1148 26.2297Z"
                fill="white"
              />
              <path
                d="M25.4793 8.74219H17.3984C17.7495 11.5439 17.7515 14.6309 17.4052 17.436H25.4965C25.9688 16.0827 26.2285 14.6294 26.2285 13.1152C26.2287 11.5811 25.963 10.11 25.4793 8.74219Z"
                fill="#EFECEC"
              />
              <path
                d="M17.3964 8.74333H25.4771C25.4758 8.73917 25.4746 8.73568 25.4729 8.73192C23.7945 3.99905 19.4767 0.516916 14.2891 0.0546875C16.2968 1.15513 16.8832 4.64164 17.3964 8.74333Z"
                fill="#429945"
              />
              <path
                d="M14.2969 26.1775C19.4939 25.7145 23.8176 22.2203 25.4896 17.4748C25.494 17.4621 25.4977 17.4497 25.5022 17.4375H17.4108C16.9016 21.5614 16.3126 25.0725 14.2969 26.1775Z"
                fill="#0B0B0B"
              />
              <path
                d="M0 13.1152C0 14.6297 0.260104 16.0827 0.732023 17.436H18.0822C18.4289 14.6307 18.4264 11.5439 18.0758 8.74219H0.749466C0.265697 10.11 0 11.5812 0 13.1152Z"
                fill="#EFEFEF"
              />
              <path
                d="M0.754153 8.73106C0.752935 8.73477 0.751661 8.73831 0.75 8.74246H18.0764C17.5628 4.64072 16.3012 1.15427 14.2938 0.053826C13.9055 0.0194372 13.5129 6.31174e-10 13.1157 6.31174e-10C7.4103 -5.53759e-05 2.55849 3.64378 0.754153 8.73106Z"
                fill="#49A948"
              />
              <path
                d="M18.0846 17.4375H0.734375C0.73875 17.4497 0.742848 17.4621 0.747001 17.4748C2.54414 22.5751 7.40293 26.2318 13.1175 26.2318C13.5147 26.2318 13.9073 26.2123 14.2955 26.1775C16.3115 25.0725 17.5753 21.5614 18.0846 17.4375Z"
                fill="#151515"
              />
              <path
                d="M0 13.1171C0 18.5764 3.33716 23.2558 8.08232 25.2299V1.00391C3.33716 2.97764 0 7.65696 0 13.1171Z"
                fill="#E73B36"
              />
            </g>
            <defs>
              <clipPath id="clip0_8256_23905">
                <rect width="26.2308" height="26.2308" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className={`p-2 border border-gray-300 h-11 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full placeholder:text-xs placeholder:font-medium placeholder:text-[#9FA3B2] ${
            type === 'number' ? ' pl-10 md:pl-14' : ''
          }`}
          value={value}
          min={min}
          onChange={onChange}
          onFocus={onFocus}
        />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
};

export default Input;
