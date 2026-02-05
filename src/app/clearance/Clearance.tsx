'use client';
import { useState, useMemo } from 'react';
import Container from 'components/common/container/Container';
import { FilterState, CLEATANCE_PAGES_PROPS } from 'types/cat';
import Select from 'components/ui/Select';
import Drawer from 'components/ui/drawer';
const SubCategory = dynamic(
  () => import('components/sub-category/sub-category-product')
);
import dynamic from 'next/dynamic';
import Filter from 'components/svg/filter';
import { productFilter } from 'utils/helperFunctions';
const Filters = dynamic(() => import('components/sub-category/filters'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 rounded animate-pulse" />
  )
});

const Clearance = ({
  catgories,
  products,
  description,
  name,
  slug
}: CLEATANCE_PAGES_PROPS) => {
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceValue, setPriceValue] = useState<[number, number]>([20, 149]);
  const [coverageArea, setcoverageArea] = useState<[number, number]>([0, 1000]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('Default');
  const { filtered, appliedFilters } = useMemo(
    () =>
      productFilter({
        products: products,
        priceValue,
        coverageArea,
        sortOption,
        selectedProductFilters,
        isWaterProof,
        subcategory: undefined,
        selectedTags,
        isClearance: true
      }),
    [
      products,
      priceValue,
      coverageArea,
      sortOption,
      selectedProductFilters,
      isWaterProof,
      selectedTags
    ]
  );

  return (
    <Container className="flex flex-wrap lg:flex-nowrap lg:gap-4 xl:gap-8 mt-4 lg:mt-10">
      <div className="lg:w-[20%] hidden lg:block">
        <Filters
          catgories={catgories}
          isWaterProof={isWaterProof}
          setIsWaterProof={setIsWaterProof}
          selectedProductFilters={selectedProductFilters}
          setSelectedProductFilters={setSelectedProductFilters}
          priceValue={priceValue}
          setPriceValue={setPriceValue}
          catSlug={slug}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setcoverageArea={setcoverageArea}
          coverageArea={coverageArea}
          isClearance
          products={products}
        />
      </div>

      <div className="lg:w-[80%] font-inter">
        <div className="space-y-4">
          <h1 className="text-34 font-bold">{name}</h1>
          <p
            className="text-sm md:text-base 2xl:text-lg lg:leading-[26px]"
            dangerouslySetInnerHTML={{ __html: description || '' }}
          >
          </p>
          <div className="flex_between lg:justify-end">
            <div className="block lg:hidden">
              <button
                onClick={() => setModalOpen(true)}
                className=" h-9 w-24 shadow text-black rounded-md flex_center gap-2"
              >
                Filter
                <span>
                  <Filter />
                </span>
              </button>
              <Drawer isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <Filters
                  catgories={catgories}
                  isWaterProof={isWaterProof}
                  setIsWaterProof={setIsWaterProof}
                  selectedProductFilters={selectedProductFilters}
                  setSelectedProductFilters={setSelectedProductFilters}
                  priceValue={priceValue}
                  setPriceValue={setPriceValue}
                  catSlug={slug}
                  setSelectedTags={setSelectedTags}
                  selectedTags={selectedTags}
                  setcoverageArea={setcoverageArea}
                  coverageArea={coverageArea}
                  isClearance
                  products={products}
                />
              </Drawer>
            </div>
            <div className="flex items-center justify-end gap-2 lg:pt-4">
              <span className="text-[#191C1F] text-sm hidden lg:block">
                Sort by:
              </span>
              <Select
                options={[
                  'Default',
                  'A to Z',
                  'Z to A',
                  'Low to High',
                  'High to Low'
                ]}
                onChange={setSortOption}
                sortOption={sortOption}
              />
            </div>
          </div>
        </div>

        <SubCategory
          filteredProducts={filtered}
          selectedFilters={appliedFilters}
          setIsWaterProof={setIsWaterProof}
          setSelectedProductFilters={setSelectedProductFilters}
          setSelectedTags={setSelectedTags}
          isClearence
        />
      </div>
    </Container>
  );
};

export default Clearance;
