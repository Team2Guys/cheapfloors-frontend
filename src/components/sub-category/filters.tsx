import { useEffect, useMemo, useState } from 'react';
import Accordion from './component/accordion';
import PriceSlider from './component/price-slider';
import Checkbox from 'components/ui/checkbox';
import {
  CategoriesFilter,
  Category,
  FilterState,
  ISUBCATEGORY
} from 'types/cat';
import Link from 'next/link';
import { FIlterprops } from 'types/types';
import { usePathname } from 'next/navigation';
import { IfilterValues } from 'types/type';
import { getSubcategoryOrder } from 'data/home-category';
import { desiredCategoryOrder, filterTitles } from 'data/filter';
import {
  extractUniqueAttributes,
  filterProductsCountHanlder,
  getColorCount,
  handleClearFilter,
  handleFilterSelection
} from 'lib/filterhelper';

const Filters = ({
  catgories,
  category,
  setIsWaterProof,
  isWaterProof,
  selectedProductFilters,
  setSelectedProductFilters,
  setPriceValue,
  priceValue,
  catSlug,
  className,
  isColection,
  sortedSubcategories,
  selectedTags,
  setSelectedTags,
  setcoverageArea,
  coverageArea,
  isSubCategory,
  subcategory,
  isClearance,
  products
}: FIlterprops) => {
  const [uniqueFilters, setUniqueFilters] = useState({
    commercialWarranty: [] as string[],
    residentialWarranty: [] as string[],
    thicknesses: [] as string[],
    plankWidth: [] as string[],
    plankLength: [] as string[],
    Colours: [] as string[]
  });
  const [categoryState, setCategoryState] = useState<{
    polar?: Category;
    richmond?: Category;
  }>({});
  const [orderedCategories, setOrderedCategories] = useState<
    CategoriesFilter[]
  >([]);
  const path = usePathname();
  useEffect(() => {
    if (!catgories?.length) return;

    const sorted = [...catgories]
      .filter(
        (cat) => !(isColection && cat.name.toUpperCase() === 'ACCESSORIES')
      )
      .sort((a, b) => {
        return (
          desiredCategoryOrder.indexOf(a.name.toUpperCase()) -
          desiredCategoryOrder.indexOf(b.name.toUpperCase())
        );
      })
      .map((category) => {
        const reCallFlag =
          category.recalledSubCats && category.recalledSubCats.length > 0;
        let subcategories: ISUBCATEGORY[] =
          (reCallFlag ? category.recalledSubCats : category.subcategories) ||
          [];

        subcategories = [...subcategories].sort((a, b) => {
          const orderA = getSubcategoryOrder(a.name);
          const orderB = getSubcategoryOrder(b.name);
          if (orderA !== orderB) {
            return orderA - orderB;
          } else {
            return (Number(a.price) || 0) - (Number(b.price) || 0);
          }
        });

        return {
          ...category,
          sortedSubcategories: subcategories
        };
      });

    setOrderedCategories(sorted);
  }, [catgories, isColection]);

  useEffect(() => {
    if (!catgories?.length) return;
    const richmond = catgories.find(
      (cat: Category) =>
        cat.name.toLowerCase() === 'richmond flooring' &&
        cat.status === 'PUBLISHED'
    );
    const polar = catgories.find(
      (cat: Category) =>
        cat.name.toLowerCase() === 'polar flooring' &&
        cat.status === 'PUBLISHED'
    );
    setCategoryState({ polar, richmond });
  }, [catgories]);

  const uniqueAttributes = useMemo(() => {
    return extractUniqueAttributes(
      category,
      sortedSubcategories,
      isColection,
      subcategory,
      products
    );
  }, [category, sortedSubcategories, isColection, subcategory, products]);
  useEffect(() => {
    if (!uniqueAttributes) return;

    setUniqueFilters({
      commercialWarranty: [...uniqueAttributes.commercialWarrantySet],
      residentialWarranty: [...uniqueAttributes.residentialWarrantySet],
      thicknesses: [...uniqueAttributes.thicknessSet],
      plankWidth: [...uniqueAttributes.plankWidthSet],
      plankLength: [...uniqueAttributes.plankLengthSet],
      Colours: [...uniqueAttributes.colorSet]
    });
  }, [uniqueAttributes]);

  const currentCategory = useMemo(
    () => path.toLowerCase().replace('/', ''),
    [path]
  );
  const isSPCorLVT = useMemo(
    () => ['spc-flooring', 'lvt-flooring'].includes(currentCategory),
    [currentCategory]
  );
  const isRichmondOrPolar = useMemo(
    () => ['richmond-flooring', 'polar-flooring'].includes(currentCategory),
    [currentCategory]
  );

  const popularTags = useMemo(() => {
    if (isSPCorLVT) {
      return ['richmond', 'polar'];
    } else if (isRichmondOrPolar) {
      return ['spc', 'lvt'];
    }
    return [];
  }, [currentCategory]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      return isSelected ? prev.filter((t) => t !== tag) : [...prev, tag];
    });
  };

  return (
    <div className={`p-2 xl:p-4 w-full space-y-5 font-inter  ${className}`}>
      <div className="border-b-2 pb-5">
        <p className="font-medium uppercase pb-2 text-[#191C1F]">
          Filter by Category
        </p>
        {orderedCategories.map((category, index) => (
          <Accordion key={index} title={category.name}>
            <ul className="filter_accordion">
              {category.sortedSubcategories?.map((subCategory, i) => (
                <li key={i}>
                  <Link
                    href={`/${subCategory?.category?.RecallUrl || category.RecallUrl}/${subCategory.custom_url}`}
                    className="filter_Link"
                  >
                    {subCategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Accordion>
        ))}
        <Accordion title="Manufacturer">
          <ul className="filter_accordion">
            {categoryState &&
              Object.values(categoryState ?? {}).map((item) => {
                if (!item) return null;
                return (
                  <li key={item.custom_url}>
                    <Link
                      href={`/${item.custom_url ?? ''}`}
                      className="filter_Link capitalize"
                    >
                      {item.name.toLowerCase()}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </Accordion>

        <Accordion title="Style">
          <ul className="filter_accordion">
            {(catSlug === 'polar-flooring' ||
              catSlug === 'spc-flooring' ||
              catSlug === 'lvt-flooring' ||
              catSlug === 'richmond-flooring' ||
              catSlug === 'richmond') && (
              <li>
                <Link
                  href={`/${
                    catSlug === 'polar-flooring'
                      ? 'polar'
                      : catSlug === 'spc-flooring'
                        ? 'polar'
                        : 'richmond'
                  }/spc-eco`}
                  className="filter_Link capitalize"
                >
                  Eco
                </Link>
              </li>
            )}

            <li>
              <Link
                href={`/${
                  catSlug === 'spc-flooring' || catSlug === 'polar-flooring'
                    ? 'polar'
                    : 'richmond'
                }/spc-herringbone`}
                className="filter_Link capitalize"
              >
                Herringbone
              </Link>
            </li>

            {catSlug === 'polar-flooring' && (
              <li>
                <Link href="/polar/lvt" className="filter_Link capitalize">
                  Comfort
                </Link>
              </li>
            )}

            {(catSlug === 'richmond-flooring' ||
              catSlug === 'lvt-flooring' ||
              catSlug === 'spc-flooring' ||
              catSlug === 'richmond') && (
              <li>
                <Link
                  href="/richmond/spc-prime"
                  className="filter_Link capitalize"
                >
                  Prime
                </Link>
              </li>
            )}
          </ul>
        </Accordion>

        {!isColection && (
          <Accordion title="Waterproof">
            <ul className="pl-4 text-sm space-y-1">
              <li>
                <button
                  className={`cursor-pointer ${isWaterProof ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                  onClick={() =>
                    setIsWaterProof(isWaterProof === true ? null : true)
                  }
                >
                  Yes
                </button>
              </li>
              <li>
                <button
                  className={`cursor-pointer ${!isWaterProof && isWaterProof !== undefined && isWaterProof !== null ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                  onClick={() =>
                    setIsWaterProof(isWaterProof === false ? null : false)
                  }
                >
                  No
                </button>
              </li>
            </ul>
          </Accordion>
        )}

        {Object.entries(uniqueFilters).map(([filterKey, filterValues]) => {
          if (filterValues.length === 0) return null;

          return (
            <Accordion
              key={filterKey}
              title={filterTitles[filterKey as keyof typeof uniqueFilters]}
            >
              <ul className="filter_accordion">
                {filterValues.map((item, i) => {
                  let length;
                  let remaingCategory;
                  if (filterKey === 'Colours') {
                    length = getColorCount(
                      item,
                      category,
                      subcategory,
                      products
                    );
                  } else {
                    remaingCategory = filterProductsCountHanlder(
                      filterKey as keyof IfilterValues,
                      item,
                      category,
                      sortedSubcategories,
                      isColection,
                      subcategory,
                      products
                    );
                  }

                  return (
                    <li key={i}>
                      <button
                        className={`cursor-pointer ${
                          selectedProductFilters[
                            filterKey as keyof FilterState
                          ]?.some((val: string) => val === item)
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                        onClick={() =>
                          handleFilterSelection(
                            filterKey as keyof FilterState,
                            item,
                            setSelectedProductFilters
                          )
                        }
                      >
                        {item +
                          (length
                            ? ` (${length})`
                            : remaingCategory
                              ? ` (${remaingCategory})`
                              : '')}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Accordion>
          );
        })}
      </div>
      {coverageArea && setcoverageArea && (
        <div className="border-b-2 pb-5">
          <p className="font-medium uppercase pb-5 text-[#191C1F]">
            Coverage Area
          </p>
          <PriceSlider
            priceValue={coverageArea}
            setPriceValue={setcoverageArea}
            isArea
          />
        </div>
      )}

      <div className="border-b-2 pb-5">
        <p className="font-medium uppercase pb-5 text-[#191C1F]">Price Range</p>
        <PriceSlider
          priceValue={priceValue}
          setPriceValue={setPriceValue}
          isClearance={isClearance}
        />
        {(isWaterProof !== null ||
          selectedProductFilters?.Colours?.length > 0 ||
          selectedProductFilters.thicknesses.length > 0 ||
          selectedProductFilters.commercialWarranty.length > 0 ||
          selectedProductFilters.residentialWarranty.length > 0 ||
          selectedProductFilters.plankWidth.length > 0 ||
          (coverageArea && (coverageArea[0] > 0 || coverageArea[1] < 200)) ||
          (isClearance ? priceValue[0] > 20 : priceValue[0] > 55) ||
          priceValue[1] < 149) && (
          <div className="flex justify-center mt-4">
            <button
              className="border border-[#cc7644] text-[#cc7644] w-[106px] h-[40px] text-sm rounded-[3px] transition hover:bg-[#cc7644] hover:text-white"
              onClick={() =>
                handleClearFilter(
                  setPriceValue,
                  setSelectedProductFilters,
                  setIsWaterProof,
                  setcoverageArea
                )
              }
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {!isClearance && (
        <div className="border-b-2 pb-5">
          <p className="font-medium uppercase pb-5  text-[#191C1F]">
            popular Brands
          </p>
          <div className="flex gap-4 flex-wrap items-center">
            <ul className="space-y-3">
              {categoryState &&
                Object.values(categoryState ?? {}).map((item) => {
                  if (!item) return null;
                  return (
                    <li key={item.custom_url}>
                      <Link
                        href={`/${item.custom_url ?? ''}`}
                        className="filter_Link"
                      >
                        <Checkbox
                          checked={path === `/${item.custom_url}`}
                          required
                          name="terms"
                          className="custom-checkbox"
                        >
                          {item.name}
                        </Checkbox>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
      <div className="pb-5">
        <p className="font-medium uppercase pb-5 text-[#191C1F]">Popular Tag</p>
        <div className="flex flex-wrap gap-2 items-center">
          {isSubCategory || isClearance
            ? orderedCategories.map((option, index) => (
                <Link
                  href={`/${option.custom_url}`}
                  key={index}
                  className={`py-1 px-2 transition-colors duration-300 font-inter text-sm ${
                    path === `/${option.custom_url}`
                      ? 'bg-[#BF69330A] border border-primary text-[#191C1F]'
                      : 'bg-transparent text-[#475156] font-medium border border-gray-300'
                  }`}
                >
                  {option.name}
                </Link>
              ))
            : popularTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className={`py-1 px-2 transition-colors duration-300 font-inter text-sm border uppercase
          ${
            selectedTags.includes(tag)
              ? 'bg-[#BF69330A] border-primary text-[#191C1F]'
              : 'bg-transparent text-[#475156] font-medium border-gray-300'
          }`}
                >
                  {tag}
                </button>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
