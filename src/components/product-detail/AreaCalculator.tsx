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
    <div className="space-y-3 pt-1">
      <div className="flex flex-col gap-4 pb-2">
        <p className="text-xl font-rubik font-bold text-black">Area:</p>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="sqm"
              checked={unit === 'sqm'}
              onChange={() => setUnit('sqm')}
              min="0"
              className="hidden"
            />
            <span
              className={`w-6 h-6 rounded-full border-[6px] flex_center ${
                unit === 'sqm' ? 'border-[#EFEFEF]' : 'border-[#EFEFEF]'
              }`}
            >
              {unit === 'sqm' && (
                <span className="w-full h-full bg-primary rounded-full"></span>
              )}
            </span>
            <span className="text-base font-medium text-black">m²</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="sqft"
              checked={unit === 'sqft'}
              min="0"
              onChange={() => setUnit('sqft')}
              className="hidden"
            />
            <span
              className={`w-6 h-6 rounded-full border-[6px] flex_center ${
                unit === 'sqft' ? 'border-[#EFEFEF]' : 'border-[#EFEFEF]'
              }`}
            >
              {unit === 'sqft' && (
                <span className="w-full h-full bg-primary rounded-full"></span>
              )}
            </span>
            <span className="text-base font-medium text-black">ft²</span>
          </label>
        </div>
      </div>
      <input
        type="number"
        placeholder={`Enter Area ${unit === 'sqm' ? 'm²' : 'ft²'}`}
        value={area}
        min="0"
        onChange={(e) => setArea(e.target.value)}
        className="w-[180px] p-3 border border-[#0000001F] text-xl focus:outline-none focus:ring-1 focus:ring-primary h-[60px] bg-[#FEB9073D] shadow-md placeholder:text-black"
      />
      <p
        className="text-xl pt-2 font-normal flex items-center gap-2 cursor-pointer w-fit text-black"
        onClick={() => setIsOpen(true)}
      >
        Related Accessories
        <span className="h-5 w-5 border border-primary bg-transparent rounded-full flex_center shrink-0">
          <PiQuestionMark className="text-sm text-primary font-bold" />
        </span>
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
