"use client"
import AccessoriesPopup from 'components/AccessoriesPopup/AccessoriesPopup';
import { useState } from 'react';
import { PiQuestionMark } from 'react-icons/pi';
import { AreaCalculatorProps } from 'types/product-detail';
const AreaCalculator = ({
  setArea,
  setUnit,
  area,
  unit,
  accessories
}: AreaCalculatorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-3 my-4">
      <div className="flex sm:flex-col max-sm:items-center gap-4">
        <p className="text-sm sm:text-lg font-semibold">Area:</p>
        <div className="flex gap-4 items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="sqm"
              checked={unit === 'sqm'}
              onChange={() => setUnit('sqm')}
              min="0"
              className="hidden"
            />
            <span className="w-4 h-4 rounded-full border-2 flex_center border-primary">
              {unit === 'sqm' && (
                <span className="w-4 h-4 bg-primary rounded-full"></span>
              )}
            </span>
            <span className="text-15 sm:text-lg">m²</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="sqft"
              checked={unit === 'sqft'}
              min="0"
              onChange={() => setUnit('sqft')}
              className="hidden"
            />
            <span className="w-4 h-4 rounded-full border-2 flex_center border-primary">
              {unit === 'sqft' && (
                <span className="w-4 h-4 bg-primary rounded-full"></span>
              )}
            </span>
            <span className="text-15 sm:text-lg">ft²</span>
          </label>
        </div>
        <input
          type="number"
          placeholder={`Enter Area ${unit === 'sqm' ? 'm²' : 'ft²'}`}
          value={area}
          min="0"
          onChange={(e) => setArea(e.target.value)}
          className=" p-2 border border-[#9E9E9E] tetx-14 sm:text-lg focus:outline-none focus:ring-2 focus:ring-primary w-[120px] sm:w-[182px] h-[41px] sm:h-[60px] bg-[#D9D9D929] shadow-xl placeholder:text-black"
        />
      </div>
      <p className="text-16 2xl:text-20 font-light flex items-center gap-3 cursor-pointer w-fit" onClick={() => setIsOpen(true)}>
        Related Accessories
        <button
          className="border border-black rounded-full p-1"
        >
          <PiQuestionMark className="text-lg font-extralight" />
        </button>
      </p>
      <AccessoriesPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        products={accessories}
      />
    </div>
  );
};
export default AreaCalculator;
