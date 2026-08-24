'use client';
import CollectionCard from 'components/CollectionCard/CollectionCard';
import Container from 'components/common/container/Container';
import Filters from 'components/sub-category/filters';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { FilterState, ISUBCATEGORY } from 'types/cat';
import { ICategory } from 'types/type';
import { collectionFilter } from 'utils/helperFunctions';

const Collections = ({
  sortedSubcategories,
  categories,
  slug
}: {
  sortedSubcategories: ISUBCATEGORY[];
  categories: ICategory[];
  slug: string;
}) => {
  const [isWaterProof, setIsWaterProof] = useState<boolean | null | undefined>(
    null
  );
  const [selectedProductFilters, setSelectedProductFilters] =
    useState<FilterState>({
      Colours: [],
      commercialWarranty: [],
      residentialWarranty: [],
      thicknesses: [],
      plankWidth: [],
      plankLength: []
    });
  const [priceValue, setPriceValue] = useState<[number, number]>([55, 149]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { filtered, appliedFilters } = collectionFilter({
    products: sortedSubcategories,
    priceValue,
    selectedProductFilters,
    sortOption: '',
    isWaterProof: isWaterProof,
    selectedTags: selectedTags
  });

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
    <Container className="flex flex-wrap lg:flex-nowrap lg:gap-4 xl:gap-8 my-4 lg:my-10">
      <div className=" lg:w-[20%] ">
        <Filters
          className="hidden lg:block"
          catgories={categories}
          sortedSubcategories={sortedSubcategories}
          isWaterProof={isWaterProof}
          setIsWaterProof={setIsWaterProof}
          selectedProductFilters={selectedProductFilters}
          setSelectedProductFilters={setSelectedProductFilters}
          priceValue={priceValue}
          setPriceValue={setPriceValue}
          catSlug={slug}
          isColection
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          isSubCategory
        />
      </div>
      <div className="lg:w-[80%]">
        <div
          className={`flex mb-4 ${appliedFilters.length > 0 ? 'justify-between items-center' : 'justify-end items-center'}  bg-[#F2F4F5] p-2 md:p-3 rounded-md w-full min-h-14`}
        >
          {appliedFilters.length > 0 && (
            <div className="flex items-center md:gap-3">
              <span className="text-[#191C1F] text-12 md:text-13 text-nowrap">
                Active Filters:
              </span>
              <div className="flex items-center flex-wrap gap-x-1 gap-y-1 px-3 py-1  text-[#191C1F] text-10 md:text-sm">
                {appliedFilters.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 md:gap-2 flex-nowrap"
                  >
                    <span>
                      {item.value === true
                        ? 'Yes'
                        : item.value === false
                          ? 'No'
                          : item.value}
                    </span>
                    <FiX
                      className="text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveFilter(item)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[#191C1F] text-12 md:text-sm">
            {filtered.length}{' '}
            <span className="text-[#5F6C72]">
              {filtered.length === 1 ? 'Result' : 'Results'} found
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-6 gap-2">
          {filtered &&
            filtered.map((product, index) => (
              <div key={index}>
                <CollectionCard subcategory={product} />
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
};

export default Collections;
