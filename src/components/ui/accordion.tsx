import React from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { AccordionProps } from 'types/types';

const Accordion = ({
  label,
  children,
  isOpen,
  onToggle,
  detailpage,
  showPlusMinus,
  isCheckout
}: AccordionProps) => {
  return (
    <div
      className={`py-2 ${showPlusMinus ? '' : detailpage ? 'border px-2' : 'border-b'}`}
    >
      <div className="flex_between">
        <h3
          onClick={onToggle}
          className={` flex items-center w-full text-left gap-2 cursor-pointer select-none
          ${showPlusMinus ? 'border-b pb-2' : ''} ${isCheckout ? 'text-gray-500' : 'text-sm lg:text-base font-semibold'}`}
        >
          {!isCheckout &&
            (isOpen ? (
              <AiOutlineMinus className="w-5 h-5 text-primary" />
            ) : (
              <AiOutlinePlus className="w-5 h-5" />
            ))}
          {label}
        </h3>
        {isCheckout && (
          <div onClick={onToggle} className="cursor-pointer">
            {' '}
            {isOpen ? (
              <AiOutlineMinus className="w-5 h-5 text-primary" />
            ) : (
              <AiOutlinePlus className="w-5 h-5" />
            )}
          </div>
        )}
      </div>
      {isOpen && (
        <div
          className={`mt-2 ${showPlusMinus ? '' : isCheckout ? '' : detailpage ? 'pl-9' : 'border-l pl-4'}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
