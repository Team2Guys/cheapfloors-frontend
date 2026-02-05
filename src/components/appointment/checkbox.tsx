'use client';
import { FieldProps } from 'formik';

interface CheckboxProps extends FieldProps {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ field, label }) => {
  return (
    <label className="flex items-center cursor-pointer space-x-2"
      onClick={() =>
        field.onChange({ target: { name: field.name, value: !field.value } })
      }
    >
      <div
        className={`w-5 h-5 border-2 flex_center transition-colors duration-200 ${field.value
          ? 'bg-primary border-primary text-white'
          : 'border-primary'
          }`}
      >
        {field.value && (
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
      </div>
      <span
        className={`text-black font-inter text-sm ${field.value ? 'font-medium' : 'font-normal'}`}
      >
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
