import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { lazy, MouseEvent, useEffect, useState } from 'react';
import { FiEye, FiHeart } from 'react-icons/fi';
import { productCardProps } from 'types/PagesProps';
import { IProduct, ProductImage } from 'types/prod';
import { fetchAccessories, fetchSingeProduct } from 'config/fetch';
import { generateSlug } from 'data/data';
import { FIND_QUICK_VIEW_PRODUCT } from 'graphql/queries';
import { handleAddToStorage } from 'lib/carthelper';
import Collapsearrow from 'components/svg/collapse-arrow';
import Leftright from 'components/svg/leftright';
import TwoArrow from 'components/svg/twoarrow';
import { handleNavigate } from 'utils/helperFunctions';
import { showAlert } from 'utils/Alert';
const FreeSample = lazy(() => import('components/svg/free-sample'));
const ProductContainer = dynamic(
  () => import('components/ProdutDetailContainer/ProductContainer')
);
const AccessoriesContainer = dynamic(
  () => import('components/accessoriesDetailProduct/AccessoriesContainer')
);
const Card: React.FC<productCardProps> = ({
  product,
  features,
  sldier,
  categoryData,
  isAccessories,
  isSoldOut = false,
  subCategoryFlag
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaption, setShowCaption] = useState('');
  const [modalData, setModalData] = useState<IProduct | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ProductImage>();
  const handleModel = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      let productData;
      if (isAccessories) {
        const ProductInfo = await fetchAccessories();
        productData = ProductInfo.find(
          (prod: IProduct) =>
            prod?.custom_url?.trim() == product?.custom_url?.trim() &&
            prod?.category?.custom_url?.trim() === 'accessories'
        );
      } else {
        productData = await fetchSingeProduct(
          product.custom_url || '',
          generateSlug(
            (product as IProduct).category?.RecallUrl || categoryData.RecallUrl
          ),
          generateSlug(product.subcategory?.custom_url || ''),
          true,
          FIND_QUICK_VIEW_PRODUCT
        );
      }
      setModalData(productData || undefined);
      setIsModalOpen(true);
    } catch (error) {
      showAlert({
        title: 'Error fetching single product',
        icon: 'error'
      });

      throw error;
    }
  };
  useEffect(() => {
    const typedProduct = product as IProduct;

    if (
      typedProduct.__typename === 'Accessories' ||
      typedProduct.__typename === 'Accessory'
    ) {
      const uniqueFeatureImages =
        typedProduct.featureImages?.filter(
          (image, index, self) =>
            index === self.findIndex((img) => img.color === image.color)
        ) || [];

      if (uniqueFeatureImages.length > 0) {
        setSelectedColor(uniqueFeatureImages[0]);
        return;
      } else {
        const baseImage = typedProduct.posterImageUrl ?? {
          imageUrl: '',
          public_id: ''
        };
        setSelectedColor({
          ...baseImage,
          color: '1067',
          colorName: 'White'
        });
      }
    }
  }, [(product as IProduct)?.featureImages]);

  return (
    <div
      className={` group flex flex-col font-inter p-1 xsm:p-2 ${isAccessories ? 'hover:bg-[#FFF9F5]' : ''}`}
    >
      <div className="relative">
        <Link
          className={`outline-none block relative ${sldier ? 'h-[130px] sm:h-52' : 'h-[107px] md:h-[275px]'}`}
          href={
            isAccessories
              ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
              : handleNavigate(product as IProduct, categoryData)
          }
        >
          <Image
            src={product.posterImageUrl?.imageUrl ?? ''}
            alt={product.posterImageUrl?.altText ?? product.name}
            fill
            loading="lazy"
            className={`object-cover ${isAccessories ? 'border border-gray-700 ' : ' '}`}
            sizes="(max-width: 768px) 200px, 300px"
          />
        </Link>
        {isAccessories && isSoldOut && (
          <div className="bg-red-500 text-white text-xs absolute px-2 py-1 right-0 top-1">
            Sold Out
          </div>
        )}
        {!sldier && (
          <div className="flex absolute duration-300 gap-2 group-hover:opacity-100 opacity-0 right-2 top-2 transition-opacity">
            {!isAccessories && (
              <div className="relative card-icon-btn">
                <button
                  className="bg-white p-1 shadow transition free-sample-hover"
                  aria-label="Add to free sample"
                  onClick={() =>
                    handleAddToStorage(
                      product,
                      Number(product.price) *
                        (Number(product?.boxCoverage) || 1),
                      Number(product.price) *
                        (Number(product?.boxCoverage) || 1),
                      Number(product?.boxCoverage),
                      1,
                      product.subcategory?.custom_url || '',
                      'category' in product
                        ? (product.category?.RecallUrl ?? 'Accessories')
                        : 'Accessories',
                      'freeSample',
                      'productImages' in product
                        ? (product.productImages?.[0]?.imageUrl ??
                            product.posterImageUrl?.imageUrl)
                        : product.posterImageUrl?.imageUrl,
                      product?.boxCoverage,
                      'm',
                      selectedColor
                    )
                  }
                  onMouseEnter={() => setShowCaption('Add to Free Sample')}
                  onMouseLeave={() => setShowCaption('')}
                >
                  <FreeSample />
                </button>

                {/* Tooltip for Free Sample */}
                <span
                  className={`show-caption-btn absolute left-1/2 -translate-x-1/2 -bottom-6 bg-gray-800 text-white text-xs px-2 py-1 rounded transition whitespace-nowrap z-10 ${showCaption === 'Add to Free Sample' ? 'opacity-100' : 'opacity-0'}`}
                >
                  Add to Free Sample
                </span>
              </div>
            )}

            <div className="relative">
              <button
                className="bg-white p-1 shadow hover:bg-primary hover:text-white transition"
                id="AddToWishlist"
                aria-label="Add to wishlist"
                onClick={() => {
                  handleAddToStorage(
                    product,
                    Number(product.price),
                    Number(product.price) * (Number(product?.boxCoverage) || 1),
                    1,
                    1,
                    product.subcategory?.custom_url || '',
                    'category' in product
                      ? (product.category?.RecallUrl ?? 'Accessories')
                      : 'Accessories',
                    'wishlist',
                    'productImages' in product
                      ? (product.productImages?.[0]?.imageUrl ??
                          product.posterImageUrl?.imageUrl)
                      : product.posterImageUrl?.imageUrl,
                    product?.boxCoverage || '2.4',
                    'm',
                    selectedColor
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
        )}
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
            {isAccessories ? (
              <AccessoriesContainer productData={modalData as IProduct} />
            ) : (
              <ProductContainer
                className="2xl:gap-0 xl:px-0"
                MainCategory={categoryData?.name || ''}
                subCategory={product?.subcategory?.name || ''}
                ProductName={product?.name || ''}
                productData={(modalData as IProduct) || []}
                isQuickView
              />
            )}
          </div>
        </div>
      )}
      {product.sizes && product.sizes.length > 0 ? (
        <div
          className={`py-2 border-b border-gray-100 xsm:px-2 ${isAccessories ? 'py-3 justify-around' : 'justify-between'}`}
        >
          {product.sizes.map((feature, index) => (
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
        <div
          className={`flex gap-4 py-2 border-b border-gray-200 px-0 xsm:px-2 ${isAccessories ? 'py-3 justify-around' : 'justify-evenly'}`}
        >
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

      <div className="px-0 pt-2 xsm:p-2 lg:p-4">
        <Link
          href={
            isAccessories
              ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
              : handleNavigate(product as IProduct, categoryData)
          }
          className={`md:mt-0 mt-1 text-left font-semibold min-h-10 xsm:h-auto block ${
            isAccessories
              ? 'text-card-text xsm:text-xl leading-5'
              : subCategoryFlag
                ? 'leading-5 text-card-text text-13 sm:text-base'
                : 'text-card-text text-12 sm:text-base leading-4 xsm:leading-5'
          }`}
        >
          <h2>{isAccessories ? `${product.name}` : product.name}</h2>
        </Link>
      </div>

      <div className="px-0 xsm:p-2 lg:p-4">
        <div className="flex_between flex-col w-full gap-2 md:flex-row md:gap-4 md:items-start sm:py-2 max-sm:text-primary">
          {'price' in product && product.price && (
            <p className="text-12 w-full md:text-sm md:text-left md:w-full xl:text-base text-black">
              <span className="font-currency md:text-18 xl:text-20 font-normal">
                
              </span>{' '}
              <span>{product?.price}</span>
              {isAccessories ? '/m' : '/m²'}
            </p>
          )}

          <div className="w-full md:text-right">
            {isSoldOut ? (
              <button
                disabled
                className="bg-[#FC3D3D] border border-[#FC3D3D] text-[10px] text-white lg:text-sm md:px-1 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap xl:px-3 xl:py-2"
              >
                Sold Out
              </button>
            ) : (product as IProduct).stock === 0 && !isAccessories ? (
              <button
                disabled
                className="bg-black border border-black text-[10px] text-white lg:text-sm md:px-1 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap xl:px-3 xl:py-2"
              >
                Out of Stock
              </button>
            ) : (
              <Link
                href={
                  isAccessories
                    ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
                    : handleNavigate(product as IProduct, categoryData)
                }
                className="flex_center gap-2 border-2 border-primary text-[10px] text-nowrap text-black hover:bg-primary hover:text-white lg:text-sm md:px-3 md:py-2 md:text-[10px] px-3 py-1.5 transition whitespace-nowrap font-semibold hover:fill-white w-fit ms-auto"
              >
                Shop Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
