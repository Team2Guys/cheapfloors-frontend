'use client';
import { SwiperSlide } from 'swiper/react';
import Link from 'next/link';
const Card = dynamic(() => import('components/Card/Card'));
import { features } from 'data/data';
import { Category, EDIT_CATEGORY, ISUBCATEGORY } from 'types/cat';
import { getSubcategoryOrder } from 'data/home-category';
import dynamic from 'next/dynamic';
import SwiperSlider from 'components/common/swiper-slider/swiper-slider';
import { categoryBreakpoint } from 'data/slider';

const CategorySlider = ({ categories }: { categories: Category[] }) => {
  
  return (
    <div className="space-y-8">
      {categories
        ?.filter((category) => category.name !== 'ACCESSORIES')
        .map((category: Category, index: number) => {
          const reCallFlag =
            category.recalledSubCats && category.recalledSubCats.length > 0;
          let subcategories: ISUBCATEGORY[] =
            ((reCallFlag
              ? category.recalledSubCats
              : category.subcategories) as ISUBCATEGORY[]) || [];
          subcategories = [...subcategories].sort((a, b) => {
            return getSubcategoryOrder(a.name) - getSubcategoryOrder(b.name);
          });
          subcategories = [...subcategories].sort((a, b) => {
            const orderA = getSubcategoryOrder(a.name);
            const orderB = getSubcategoryOrder(b.name);
            if (orderA !== orderB) {
              return orderA - orderB;
            } else {
              return (Number(a.price) || 0) - (Number(b.price) || 0);
            }
          });
          const shouldEnablePagination =
            subcategories && subcategories.length >= 0;
          const seeAllLink = `/${category?.custom_url || category.name.toLowerCase().replace(/\s+/g, '-')}`;
       
          return (
            <div
              key={index}
              className="md:flex block items-center md:text-black text-white w-full overflow-hidden md:bg-background bg-primary category_slider py-4"
            >
              <div className="p-4 text-center md:text-start w-full md:w-1/4 font-inter sm:pl-10 md:pl-6 lg:pl-10 xl:pl-24 space-y-3">
                <h2 className="text-lg lg:text-4xl font-semibold">
                  {category.name}
                </h2>
                <p className="md:text-black md:w-fit font-light">
                  Price Starting From:{' '}
                  <span className="font-currency font-normal text-22"></span>{' '}
                  {category.price + '/m²' ||
                    (category.name === 'SPC FLOORING' ? (
                      <p>
                        <span className="font-currency font-normal text-18">
                          
                        </span>{' '}
                        150m²
                      </p>
                    ) : category.name === 'LVT FLOORING' ? (
                      <p>
                        <span className="font-currency font-normal text-18">
                          
                        </span>{' '}
                        180m²
                      </p>
                    ) : category.name === 'POLAR FLOORING' ? (
                      <p>
                        <span className="font-currency font-normal text-18">
                          
                        </span>{' '}
                        200m²
                      </p>
                    ) : category.name === 'RICHMOND FLOORING' ? (
                      <p>
                        <span className="font-currency font-normal text-18">
                          
                        </span>{' '}
                        220m²
                      </p>
                    ) : (
                      ''
                    ))}
                </p>
                <div className="w-full md:w-60">
                  <Link
                    href={seeAllLink}
                    className="transition text-center md:text-black font-semibold text-white px-4 py-1 border md:border-primary border-white font-inter hover:text-white hover:bg-primary"
                  >
                    See All
                  </Link>
                </div>
              </div>
              <div className="md:w-3/4 w-full md:pr-10">
                <SwiperSlider
                  enablePagination={shouldEnablePagination}
                  allowTouch={shouldEnablePagination}
                  breakpoints={categoryBreakpoint}
                  className='bg-white'
                >
                  {subcategories?.map(
                    (product: EDIT_CATEGORY, index: number) => (
                      <SwiperSlide key={index} className="pb-7">
                        <Card
                          product={product}
                          categoryData={category}
                          features={features}
                          sldier
                          subCategoryFlag
                        />
                      </SwiperSlide>
                    )
                  )}
                </SwiperSlider>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CategorySlider;
