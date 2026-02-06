'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Card from 'components/Card/Card';
import Container from 'components/common/container/Container';
import { features } from 'data/data';
import 'swiper/css';
import 'swiper/css/pagination';
import { IProduct } from 'types/prod';
import { RelatedSliderProps } from 'types/types';
import SliderSkaleton from 'components/skaletons/slider-skaleton';
import { useState } from 'react';
import dynamic from 'next/dynamic';;
const AccessoriesContainer = dynamic(
  () => import('components/accessoriesDetailProduct/AccessoriesContainer')
);

const RelatedSlider = ({
  products,
  isAccessories = true
}: RelatedSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<IProduct | null>(null);

  return (
    <Container className="mt-5 sm:mt-10 font-inter w-full mb-10">
      <h2 className="text-18 sm:text-24 max-sm:font-semibold lg:text-30 2xl:text-[40px] text-center">
        Frequently Bought Together
      </h2>

      {products.length > 0 ? (
        <div className="slider-container pt-4 sm:pt-10 w-full overflow-hidden">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={2}
            slidesPerGroup={2}
            breakpoints={{
              1280: { slidesPerView: 4, slidesPerGroup: 2 },
              1024: { slidesPerView: 2.5, slidesPerGroup: 2 },
              320: { slidesPerView: 2, slidesPerGroup: 2 }
            }}
            className="related_slider"
          >
            {products.map((product: IProduct, index: number) => (
              <SwiperSlide key={index} className="pb-7">
                <Card
                  product={product}
                  features={features}
                  categoryData={product.category}
                  // sldier
                  isAccessories={isAccessories}
                  isSoldOut={(product.stock ?? 0) < 0}
                  setModalProduct={setModalProduct}
                  setIsOpen={setIsOpen}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <SliderSkaleton />
      )}

      {isOpen && (
        <div
          className="flex_center bg-black bg-opacity-50 px-1 py-4 xs:p-4 fixed inset-0 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full xs:max-w-[90vw] max-h-[90vh] md:max-w-[1400px] overflow-x-hidden overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="bg-gray-100 rounded-full text-4xl text-gray-700 -right-1 -top-1 absolute font-bold hover:text-red-500 px-2 py-0"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
              <AccessoriesContainer productData={modalProduct as IProduct} />
          </div>
        </div>
      )}
    </Container>
  );
};

export default RelatedSlider;
