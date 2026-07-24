'use client';
import { SwiperSlide } from 'swiper/react';
import Link from 'next/link';
const Card = dynamic(() => import('components/Card/Card'));
import { features } from 'data/data';
import { Category, ISUBCATEGORY } from 'types/cat';
import { IProduct } from 'types/prod';
import { getSubcategoryOrder } from 'data/home-category';
import dynamic from 'next/dynamic';
import SwiperSlider from 'components/common/swiper-slider/swiper-slider';
import { categoryBreakpoint } from 'data/slider';
import SliderArrow from 'components/common/slider-arrow/slider-arrow';
import { BsArrowRight } from 'react-icons/bs';
import Container from '../common/container/Container';
import { formatDisplayName } from 'utils/helperFunctions';

const getPrice = (cat: Category) => {
  if (cat.price) return cat.price;
  switch (cat.name.toUpperCase()) {
    case 'SPC FLOORING': return '150';
    case 'LVT FLOORING': return '180';
    case 'POLAR FLOORING': return '200';
    case 'RICHMOND FLOORING': return '220';
    default: return '';
  }
};

const CategorySlider = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="flex flex-col w-full gap-3 md:gap-14 my-10">
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

          // Floor Smart shows its individual products instead of subcategories.
          const isFloorSmart =
            category.name?.trim().toLowerCase() === 'floor smart';
          const floorSmartProducts = ((category.products as IProduct[]) || [])
            .filter((p) => (p.status ? p.status === 'PUBLISHED' : true))
            .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));

          const sliderItems: (ISUBCATEGORY | IProduct)[] = isFloorSmart
            ? floorSmartProducts
            : subcategories;

          const shouldEnablePagination = sliderItems.length >= 0;
          const seeAllLink = `/${category?.custom_url || category.name.toLowerCase().replace(/\s+/g, '-')}`;

          const isYellowBg = category.name.toUpperCase() === 'LVT FLOORING';
          // Only Floor Smart renders individual products, which can carry a
          // discountPrice; every other category renders subcategories that have
          // no discount. So apply the discounted price only for Floor Smart,
          // mirroring what each Card displays. Other categories keep the base
          // price.
          const itemPrices = sliderItems
            .map((item) => {
              if (isFloorSmart) {
                const discount = Number((item as IProduct).discountPrice);
                if (!isNaN(discount) && discount > 0) return discount;
              }
              return Number(item.price);
            })
            .filter((p) => !isNaN(p) && p > 0);
          const price = itemPrices.length
            ? String(Math.min(...itemPrices))
            : getPrice(category);

          const getArrowHiddenClasses = (length: number) => {
            if (length <= 1) return '!hidden';
            if (length === 2) return 'sm:!hidden';
            if (length === 3 || length === 4) return 'xl:!hidden';
            return '';
          };
          const arrowHiddenClass = getArrowHiddenClasses(sliderItems.length);

          console.log(categories,'sliderItems')

          return (
            <div className='bg-[#CDCDCD14]' key={index}>
              <Container key={index} className='relative overflow-hidden py-6'>
                {/* Desktop Arrows */}
                <div className={`hidden lg:flex justify-end gap-3 mb-4 ${arrowHiddenClass}`}>
                  <SliderArrow direction="left" className={`cat-prev-${index}`} />
                  <SliderArrow direction="right" className={`cat-next-${index}`} />
                </div>
                <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 relative">
                  {/* Category Info Box */}
                  <div className='w-full lg:w-[300px] 2xl:w-[355px] 3xl:w-[420px] shrink-0 border border-primary rounded-xl p-2 sm:p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-primary hover:border-primary group'>
                    <h2 className="text-2xl md:text-[28px] font-semibold text-black mb-1 sm:mb-4">
                      {formatDisplayName(category.name)}
                    </h2>
                    <p className="text-black mb-3 sm:mb-8 text-sm md:text-base lg:text-lg flex items-center gap-1">
                      Price Starting From:{' '}
                      <span className={`font-currency font-normal text-lg ml-1 ${isYellowBg ? 'text-black' : 'text-black'}`}></span>
                      <span className={`font-medium ${isYellowBg ? 'text-black' : 'text-black'}`}>
                        {price ? `${price}/m²` : ''}
                      </span>
                    </p>
                    <Link
                      href={seeAllLink}
                      className='px-6 py-2.5 bg-primary text-black group-hover:bg-white rounded-full font-semibold transition flex items-center justify-center gap-2 text-sm md:text-base'
                    >
                      See All <BsArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Slider Section */}
                  <div className="w-full lg:w-3/4 relative flex flex-col justify-center">
                    {/* Mobile Arrows */}
                    <div className={`flex lg:hidden justify-between gap-3 mb-4 mt-2 ${arrowHiddenClass}`}>
                      <SliderArrow direction="left" className={`cat-prev-${index}`} />
                      <SliderArrow direction="right" className={`cat-next-${index}`} />
                    </div>

                    <div className="w-full">
                      <SwiperSlider
                        enablePagination={false}
                        navigation={{
                          prevEl: `.cat-prev-${index}`,
                          nextEl: `.cat-next-${index}`,
                        }}
                        allowTouch={shouldEnablePagination}
                        breakpoints={categoryBreakpoint}
                        className="w-full"
                      >
                        {sliderItems?.map((item, idx: number) => (
                          <SwiperSlide key={idx} className="pb-2 lg:px-1">
                            <Card
                              product={item as IProduct}
                              categoryData={category}
                              features={features}
                              sldier
                              subCategoryFlag={!isFloorSmart}
                            />
                          </SwiperSlide>
                        ))}
                      </SwiperSlider>
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          );
        })}
    </div>
  );
};

export default CategorySlider;
