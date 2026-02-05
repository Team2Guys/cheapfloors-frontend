'use client';

import ProductContainer from 'components/ProdutDetailContainer/ProductContainer';
import CartIcon from 'components/svg/cart-icon';
import Collapsearrow from 'components/svg/collapse-arrow';
import Leftright from 'components/svg/leftright';
import TwoArrow from 'components/svg/twoarrow';
import { fetchSingeProduct } from 'config/fetch';
import { clearanceProducts } from 'data/clearance';
import { features, generateSlug } from 'data/data';
import { FIND_QUICK_VIEW_PRODUCT } from 'graphql/queries';
import { handleAddToStorage } from 'lib/carthelper';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import { FiEye, FiHeart } from 'react-icons/fi';
import { Category } from 'types/cat';
import { IProduct, Sizes } from 'types/prod';
import { showAlert } from 'utils/Alert';
import { formatAED, handleNavigate } from 'utils/helperFunctions';

const ClearenceCard = ({
  product,
  isSoldOut = false
}: {
  product: IProduct;
  isSoldOut?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaption, setShowCaption] = useState('');
  const [modalData, setModalData] = useState<IProduct | undefined>(undefined);

  const handleModel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      const productData = await fetchSingeProduct(
        product.custom_url || '',
        generateSlug((product as IProduct).category?.RecallUrl || ''),
        generateSlug(product.subcategory?.custom_url || ''),
        true,
        FIND_QUICK_VIEW_PRODUCT
      );
      if (productData) {
        const findProduct = clearanceProducts.find(
          (r) => r.name.toLowerCase() === productData.name.toLowerCase()
        );

        const clearance = findProduct
          ? { ...findProduct, ...productData }
          : null;
        setModalData(clearance || undefined);
      }
      setIsModalOpen(true);
    } catch (error) {
      showAlert({
        title: 'Error fetching single product',
        icon: 'error'
      });

      throw error;
    }
  };
  return (
    <div className="group flex flex-col font-inter bg-[#FFF9F5] xs:p-2 ">
      <div className="relative">
        <Link
          className="outline-none block relative h-[107px] md:h-[200px]"
          href={`/clearance${handleNavigate(product as IProduct, product.category as Category)}`}
        >
          <Image
            src={product.posterImageUrl?.imageUrl ?? ''}
            alt={product.posterImageUrl?.altText ?? product.name}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 200px, 300px"
          />
        </Link>
        {isSoldOut && (
          <div className="bg-red-500 text-white text-xs absolute px-2 py-1 right-0 top-1">
            Sold Out
          </div>
        )}
        <div className="absolute right-0 top-0 w-8 xs:w-16 h-8 xs:h-16 flex justify-center items-center rounded-full bg-[#FF0000] text-white text-10 xs:text-11 font-semibold text-center">
          TAKE IT ALL DEAL
        </div>
        <div className="flex absolute duration-300 gap-2 left-2 top-2 transition-opacity">
          <div className="relative">
            <button
              className="bg-white p-1 shadow hover:bg-primary hover:text-white transition"
              id="AddToWishlist"
              aria-label="Add to wishlist"
              onClick={() => {
                handleAddToStorage(
                  product,
                  (
                    product?.bundle &&
                    product?.bundle *
                      (Number(product.bundlePrice) *
                        (Number(product?.boxCoverage) || 1))
                  )?.toFixed(2) || 1,
                  Number(product.bundlePrice) *
                    (Number(product?.boxCoverage) || 1),
                  Number(
                    product?.bundle &&
                      product?.bundle * Number(product?.boxCoverage)
                  ) || 1,
                  product?.bundle || 1,
                  product.subcategory.custom_url ?? '',
                  product.category.RecallUrl ?? '',
                  'wishlist',
                  product?.productImages?.[0]?.imageUrl,
                  product?.boxCoverage,
                  'sqm',
                  undefined,
                  undefined,
                  true
                );
              }}
              onMouseEnter={() => setShowCaption('Add to Wishlist')}
              onMouseLeave={() => setShowCaption('')}
            >
              <FiHeart size={20} />
            </button>

            {/* Tooltip for Wishlist */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-6 bg-gray-800 text-white text-xs px-2 py-1 rounded transition whitespace-nowrap z-10 ${showCaption === 'Add to Wishlist' ? 'opacity-100' : 'opacity-0'}`}
            >
              Add to Wishlist
            </span>
          </div>

          <div className="relative">
            <button
              className="bg-white p-1 shadow hover:bg-primary hover:text-white transition"
              aria-label="open quick view"
              onClick={(e) => handleModel(e)}
              onMouseEnter={() => setShowCaption('Quick View')}
              onMouseLeave={() => setShowCaption('')}
            >
              <FiEye size={20} />
            </button>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-6 bg-gray-800 text-white text-[10px] p-1 rounded transition whitespace-nowrap z-10 ${showCaption === 'Quick View' ? 'opacity-100' : 'opacity-0'}`}
            >
              Quick View
            </span>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="flex_center bg-black bg-opacity-50 px-1 py-4 xs:p-4 fixed inset-0 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full xs:max-w-[90vw] max-h-[90vh] md:max-w-[1400px] overflow-x-hidden overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="bg-gray-100 rounded-full text-4xl text-gray-700 -right-1 -top-1 absolute font-bold hover:text-red-500 px-2 py-0"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <ProductContainer
              className="2xl:gap-0 xl:px-0"
              MainCategory={product?.category?.name || ''}
              subCategory={product?.subcategory?.name || ''}
              ProductName={product?.name || ''}
              productData={(modalData as IProduct) || []}
              isQuickView
              isClearance
            />
          </div>
        </div>
      )}
      {product.sizes && product.sizes.length > 0 ? (
        <div className="flex py-2 border-b border-gray-100 xsm:px-2 justify-between">
          {product.sizes.map((feature: Sizes, index: number) => (
            <div
              key={index}
              className="flex gap-1 xsm:gap-4 w-full justify-between"
            >
              {[
                { key: 'width', Icon: Leftright },
                { key: 'thickness', Icon: Collapsearrow },
                { key: 'height', Icon: TwoArrow }
              ].map(({ key, Icon }) =>
                feature[key as keyof typeof feature] ? (
                  <div key={key} className="flex_between gap-1 ">
                    <Icon />
                    <span className="text-[7px] xs:text-[9px] xsm:text-[10px] text-black md:text-[12px]">
                      {feature[key as keyof typeof feature]}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 py-2 border-b border-gray-100 px-0 xsm:px-2 justify-evenly">
          {features.map((feature, index) => (
            <div className="flex gap-1 items-center" key={index}>
              <Image
                src={feature.icon}
                alt="Icon"
                width={feature.width}
                height={feature.height}
                className="text-gray-500 cursor-pointer hover:text-red-500"
              />
              <span className="text-[7px] text-black md:text-[12px]">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="px-2 pt-2 xsm:p-2 lg:p-4">
        <Link
          href={`/clearance${handleNavigate(product as IProduct, product.category as Category)}`}
          className="md:mt-0 mt-1 text-left font-semibold min-h-10 xsm:h-auto block text-[#594F55] text-sm sm:text-xl leading-4 xsm:leading-5"
        >
          <h2>{product.name}</h2>
        </Link>
      </div>

      <div className="px-2 xsm:p-2 lg:p-4 flex flex-col gap-4 justify-between flex-grow">
        <div className="space-y-4">
          <div>
            {'bundleDisPrice' in product && product.bundleDisPrice && (
              <p className="text-12 w-full font-medium md:text-sm md:text-left md:w-full xl:text-xl text-black">
                Was:{' '}
                <span className="font-currency md:text-18 xl:text-24 font-normal">
                  
                </span>{' '}
                <span className="line-through">
                  {product?.bundleDisPrice}/m²
                </span>
              </p>
            )}
            {'bundlePrice' in product && product.bundlePrice && (
              <p className="text-12 w-full font-semibold md:text-sm md:text-left md:w-full xl:text-xl text-black">
                Now:{' '}
                <span className="font-currency md:text-18 xl:text-24 font-normal">
                  
                </span>{' '}
                <span>{product?.bundlePrice}/m² Only</span>
              </p>
            )}
          </div>
          <div className="text-[#594F55] font-semibold text-xs md:text-sm xl:text-16">
            <p>
              Total Bundle:{' '}
              <span>
                {(
                  product?.bundle &&
                  product?.bundle * Number(product?.boxCoverage)
                )?.toFixed(2)}
                m²
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p>Bundle Price:</p>
            {product.bundleDisPrice && (
              <p className="text-12 w-full font-medium md:text-sm md:text-left md:w-full xl:text-xl text-black">
                Was:{' '}
                <span className="font-currency md:text-18 xl:text-24 font-normal">
                  
                </span>{' '}
                <span className="line-through">
                  {formatAED(
                    product?.bundle &&
                      product?.bundle *
                        (Number(product.bundleDisPrice) *
                          (Number(product?.boxCoverage) || 1))
                  )}
                </span>
              </p>
            )}
            {'bundlePrice' in product && product.bundlePrice && (
              <p className="text-12 w-full font-semibold md:text-sm md:text-left md:w-full xl:text-xl text-black">
                Now:{' '}
                <span className="font-currency md:text-18 xl:text-24 font-normal text-primary">
                  
                </span>{' '}
                <span className="text-primary font-black">
                  {formatAED(
                    product?.bundle &&
                      product?.bundle *
                        (Number(product.bundlePrice) *
                          (Number(product?.boxCoverage) || 1))
                  )}
                </span>
              </p>
            )}
            <p className="text-red-500 text-xs md:text-sm xl:text-base">
              (Save{' '}
              <span className="font-currency text-sm md:text-base xl:text-18  font-normal">
                
              </span>{' '}
              {formatAED(
                product?.bundle &&
                  product?.bundle *
                    (Number(product.bundleDisPrice) *
                      (Number(product?.boxCoverage) || 1)) -
                    product?.bundle *
                      (Number(product.bundlePrice) *
                        (Number(product?.boxCoverage) || 1))
              )}{' '}
              on this bundle)
            </p>
          </div>
        </div>
        <div className="w-full md:text-right">
          {isSoldOut ? (
            <button
              disabled
              className="bg-[#FC3D3D] border border-[#FC3D3D] text-[10px] text-white lg:text-sm md:px-1 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap xl:px-3 xl:py-2"
            >
              Sold Out
            </button>
          ) : (product as IProduct).stock === 0 ? (
            <button
              disabled
              className="bg-black border border-black text-[10px] text-white lg:text-sm md:px-1 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap xl:px-3 xl:py-2"
            >
              Out of Stock
            </button>
          ) : (
            <button
              className="flex_center w-full gap-2 border-2 border-primary text-[10px] text-nowrap text-black hover:bg-primary hover:text-white lg:text-sm md:px-3 md:py-2 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap font-semibold hover:fill-white"
              onClick={() =>
                handleAddToStorage(
                  product,
                  (
                    product?.bundle &&
                    product?.bundle *
                      (Number(product.bundlePrice) *
                        (Number(product?.boxCoverage) || 1))
                  )?.toFixed(2) || 1,
                  Number(product.bundlePrice) *
                    (Number(product?.boxCoverage) || 1),
                  Number(
                    product?.bundle &&
                      product?.bundle * Number(product?.boxCoverage)
                  ) || 1,
                  product?.bundle || 1,
                  product.subcategory.custom_url ?? '',
                  product.category.RecallUrl ?? '',
                  'cart',
                  product?.productImages?.[0]?.imageUrl,
                  product?.boxCoverage,
                  'sqm',
                  undefined,
                  undefined,
                  true
                )
              }
            >
              <CartIcon /> Add To Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClearenceCard;
