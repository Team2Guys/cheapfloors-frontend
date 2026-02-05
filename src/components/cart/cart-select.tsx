'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { CartSelectProps } from 'types/type';

const CartSelect = ({
  select,
  onSelect,
  selectedFee,
  selectedShipping
}: CartSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('Enter Emirate');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (state: string) => {
    setSelectedState(state);
    setIsOpen(false);

    let fee = 0;
    if (state === 'Dubai') {
      fee = selectedShipping === 'express' ? 150 : 0;
    } else {
      // Other Emirates - standard only
      fee = selectedFee > 1000 ? 0 : 150;
    }

    onSelect(state, fee);
    localStorage.setItem('selectedEmirate', JSON.stringify(state));
  };

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
  useEffect(() => {
    const savedState = localStorage.getItem('selectedEmirate');
    if (savedState) {
      setSelectedState(savedState.replaceAll('"', ''));
    }
  }, []);
  return (
    <div className="flex_between lg:text-20">
      <p>Select Emirate</p>
      <div className="relative">
        {' '}
        {/* Added relative positioning here */}
        <div className="w-full font-inter" ref={dropdownRef}>
          <div
            className="border bg-white 2xl:px-5 2xl:py-3 px-2 py-2 cursor-pointer flex_between text-12 xl:text-15 h-9 w-52"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedState}
            <span>{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </div>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-52 bg-white border shadow-lg max-h-[200px] overflow-y-auto">
              {select.map((state, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-12 xl:text-15"
                  onClick={() => handleSelect(state.value)}
                >
                  {state.value}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSelect;
