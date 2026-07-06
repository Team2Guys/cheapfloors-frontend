'use client';
import Card from 'components/Card/Card';
import ClearanceCard from 'components/Card/ClearanceCard';
import { features } from 'data/data';
import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { FilterState } from 'types/cat';
import { SubCategoryProps } from 'types/types';

const SubCategory = ({
  filteredProducts,
  selectedFilters,
  setSelectedProductFilters,
  setIsWaterProof,
  categoryData,
  setSelectedTags,
  isClearence
}: SubCategoryProps) => {
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);

  useEffect(() => {
    if (filteredProducts.length === 0) {
      const timer = setTimeout(() => {
        setShowNoProductsMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowNoProductsMessage(false);
    }
  }, [filteredProducts]);

  const handleRemoveFilter = (
    item:
      | { name: 'isWaterProof'; value: boolean }
      | { name: 'Tag'; value: string }
      | { name: keyof FilterState; value: string }
  ) => {
    if (item.name === 'isWaterProof') {
      setIsWaterProof(null);
    } else if (item.name === 'Tag') {
      setSelectedTags((prev) => prev.filter((tag) => tag !== item.value));
    } else {
      setSelectedProductFilters((prevFilters) => ({
        ...prevFilters,
        [item.name]: (prevFilters[item.name] as string[]).filter(
          (val) => val !== item.value
        )
      }));
    }
  };

  return (
    <div className="pt-5 lg:mb-20">
      <div
        className={`flex flex-col md:flex-row ${selectedFilters.length > 0 ? 'md:justify-between md:items-center items-start gap-3 md:gap-0' : 'justify-end items-center'} bg-[#F9FAFB] mb-4 p-3 rounded-md w-full min-h-14`}
      >
        {selectedFilters.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-black text-base">
              <span className="text-black text-base font-semibold text-nowrap">
                Active Filters:
              </span>
              {selectedFilters.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center flex-nowrap capitalize"
                >
                  <span className="mr-2">
                    {item.value === true
                      ? 'Yes'
                      : item.value === false
                        ? 'No'
                        : item.value}
                  </span>
                  <div
                    className="border border-[#00000033] p-0.5 cursor-pointer hover:border-red-500 group transition-colors"
                    onClick={() => handleRemoveFilter(item)}
                  >
                    <FiX
                      className="text-black text-lg group-hover:text-red-500 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[#191C1F] text-sm self-end md:self-auto">
          {filteredProducts.length}{' '}
          <span className="text-[#191C1F]">
            {filteredProducts.length === 1 ? 'Result' : 'Results'} found.
          </span>
        </p>
      </div>

      {/* Products Grid - Key optimization area */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 mb-4 ${isClearence ? 'gap-2 sm:gap-4 2xl:grid-cols-4' : 'gap-2 sm:gap-4'}`}
      >
        {filteredProducts.length > 0 ? (
          isClearence ? (
            filteredProducts.map((product, index) => (
              <ClearanceCard
                key={product.id || index}
                product={product}
                isSoldOut={false}
              />
            ))
          ) : (
            filteredProducts.map((product, index) => (
              <Card
                key={product.id || index} // Use product.id if available for stable keys
                product={product}
                features={features}
                categoryData={categoryData}
                isSoldOut={false}
                isAccessories={false}
                priority={index < 3} // Add priority loading for first 3 images (LCP improvement)
              />
            ))
          )
        ) : !showNoProductsMessage ? (
          // Optimized skeleton loading with fewer elements
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full aspect-[3/4] animate-pulse rounded-md flex flex-col mt-3"
              aria-label="Loading product"
            >
              <div className="h-3/4 w-full bg-gray-300 rounded-t-md"></div>
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                  <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategory;
