'use client';
import { useState, useMemo } from 'react';
import Container from 'components/common/container/Container';
import dynamic from 'next/dynamic';
import Select from 'components/ui/Select';
import Drawer from 'components/ui/drawer';
import Filter from 'components/svg/filter';
import { productFilter } from 'utils/helperFunctions';
import { Category, FilterState } from 'types/cat';
import { IProduct } from 'types/prod';

const SubCategory = dynamic(
  () => import('components/sub-category/sub-category-product')
);
const Filters = dynamic(() => import('components/sub-category/filters'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 rounded animate-pulse" />
  )
});

const FreeSampleProducts = ({
  products,
  accessories = [],
  categories
}: {
  products: IProduct[];
  accessories?: IProduct[];
  categories: Category[];
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceValue, setPriceValue] = useState<[number, number]>([55, 149]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('Default');

  // Synthetic category so the shared Filters/SubCategory components can render
  // every product in one grid (not scoped to a single category).
  const allProductsCategory = useMemo(
    () => ({ name: 'Free Samples', products } as Category),
    [products]
  );

  const { filtered, appliedFilters } = useMemo(() => {
    const { filtered, appliedFilters } = productFilter({
      products,
      priceValue,
      sortOption,
      selectedProductFilters,
      isWaterProof,
      selectedTags
    });

    const inStock = filtered.filter((product) => product.stock !== 0);
    const outOfStock = filtered.filter((product) => product.stock === 0);
    return { filtered: [...inStock, ...outOfStock], appliedFilters };
  }, [
    products,
    priceValue,
    sortOption,
    selectedProductFilters,
    isWaterProof,
    selectedTags
  ]);

  // Accessories are always shown as a group at the very end (in-stock first).
  const accessoryList = useMemo(() => {
    const published = accessories.filter(
      (item) => item.status === 'PUBLISHED'
    );
    const inStock = published.filter((item) => item.stock !== 0);
    const outOfStock = published.filter((item) => item.stock === 0);
    return [...inStock, ...outOfStock];
  }, [accessories]);

  const displayProducts = useMemo(
    () => [...filtered, ...accessoryList],
    [filtered, accessoryList]
  );

  return (
    <Container className="flex flex-wrap lg:flex-nowrap lg:gap-4 xl:gap-8 mt-4 lg:mt-10">
      <div className="lg:w-[20%] hidden lg:block">
        <Filters
          catgories={categories}
          category={allProductsCategory}
          products={products}
          isWaterProof={isWaterProof}
          setIsWaterProof={setIsWaterProof}
          selectedProductFilters={selectedProductFilters}
          setSelectedProductFilters={setSelectedProductFilters}
          priceValue={priceValue}
          setPriceValue={setPriceValue}
          catSlug=""
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
        />
      </div>

      <div className="lg:w-[80%] font-inter">
        <div className="flex_between lg:justify-end">
          <div className="block lg:hidden">
            <button
              onClick={() => setModalOpen(true)}
              className="h-9 w-24 bg-[#FAFAFA] text-black rounded-md text-base flex_center gap-2"
            >
              Filter
              <span>
                <Filter />
              </span>
            </button>
            <Drawer isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
              <Filters
                catgories={categories}
                category={allProductsCategory}
                products={products}
                isWaterProof={isWaterProof}
                setIsWaterProof={setIsWaterProof}
                selectedProductFilters={selectedProductFilters}
                setSelectedProductFilters={setSelectedProductFilters}
                priceValue={priceValue}
                setPriceValue={setPriceValue}
                catSlug=""
                setSelectedTags={setSelectedTags}
                selectedTags={selectedTags}
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

        <SubCategory
          filteredProducts={displayProducts}
          selectedFilters={appliedFilters}
          setIsWaterProof={setIsWaterProof}
          setSelectedProductFilters={setSelectedProductFilters}
          categoryData={allProductsCategory}
          setSelectedTags={setSelectedTags}
        />
      </div>
    </Container>
  );
};

export default FreeSampleProducts;
