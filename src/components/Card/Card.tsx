import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MouseEvent, useEffect, useState } from 'react';
import { FiEye, FiHeart } from 'react-icons/fi';
import FreeSample from 'components/svg/free-sample';
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
  // subCategoryFlag,
  setModalProduct,
  setIsOpen,
  isFreeSample = false
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
      if (setModalProduct && setIsOpen) {
        setModalProduct(productData || undefined);
        setIsOpen(true);
      } else {
        setModalData(productData || undefined);
        setIsModalOpen(true);
      }
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

  const discountedPrice = (product as IProduct).discountPrice;
  const hasDiscount = !!discountedPrice && discountedPrice > 0;
  const originalPrice = Number((product as IProduct).price);
  const discountPercentage =
    hasDiscount && originalPrice > 0
      ? Math.round(
          ((originalPrice - Number(discountedPrice)) / originalPrice) * 100
        )
      : 0;

  const isOutOfStock =
    isSoldOut || ((product as IProduct).stock === 0 && !isAccessories);
  // On the main product card, the price lives on the (filled) "View product"
  // button instead of a separate box above the actions.
  const showPriceOnButton =
    !sldier && !isAccessories && !isFreeSample && !isOutOfStock;

  const handleAddSample = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToStorage(
      product,
      Number(hasDiscount ? discountedPrice : product.price),
      Number(hasDiscount ? discountedPrice : product.price) *
        (Number(product?.boxCoverage) || 1),
      1,
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
      product?.boxCoverage || '2.4',
      'm',
      selectedColor
    );
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const unitPrice = Number(hasDiscount ? discountedPrice : product.price);
    const coverage = Number(product?.boxCoverage) || 1;
    handleAddToStorage(
      product,
      unitPrice * coverage,
      unitPrice * coverage,
      coverage,
      1,
      product.subcategory?.custom_url || '',
      'category' in product
        ? (product.category?.RecallUrl ?? 'Accessories')
        : 'Accessories',
      'cart',
      'productImages' in product
        ? (product.productImages?.[0]?.imageUrl ??
            product.posterImageUrl?.imageUrl)
        : product.posterImageUrl?.imageUrl,
      product?.boxCoverage || '2.4',
      'm',
      selectedColor
    );
  };

  return (
    <div
      className={`group flex flex-col h-full font-inter p-1 xsm:p-3 group transition-shadow hover:shadow-md overflow-hidden ${isAccessories ? 'bg-[#FAFAFA] border border-gray-200' : sldier ? 'bg-white' : 'bg-[#FAFAFA] border border-gray-200'}`}
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
            // sizes="(max-width: 768px) 200px, 300px"
            quality={90}
          />
        </Link>
        {isAccessories && isSoldOut && (
          <div className="bg-red-500 text-white text-xs absolute px-2 py-1 right-0 top-1 z-10">
            Sold Out
          </div>
        )}
        {hasDiscount && discountPercentage > 0 && (
          <div className="bg-primary text-white text-[10px] xsm:text-xs font-semibold absolute px-2 py-1 left-0 top-1 z-10">
            {discountPercentage}% OFF
          </div>
        )}
        {!sldier && (
          <div className="absolute top-2 right-2 xsm:-right-40 xsm:group-hover:right-2 z-10 flex flex-col gap-2 items-end">
            <div className="relative">
              <button
                className="bg-white p-1 xsm:p-2 shadow-sm rounded-sm hover:text-primary transition"
                aria-label="open quick view"
                onClick={(e) => handleModel(e)}
                onMouseEnter={() => setShowCaption('Quick View')}
                onMouseLeave={() => setShowCaption('')}
              >
                <FiEye className="text-black text-base xsm:text-lg" />
              </button>
              <span
                className={`absolute right-10 top-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded transition whitespace-nowrap z-10 pointer-events-none ${showCaption === 'Quick View' ? 'opacity-100' : 'opacity-0'}`}
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
              className="bg-gray-100 rounded-sm text-2xl sm:text-4xl m-2 xs:m-4 text-gray-700 -right-1 -top-1 absolute  hover:text-red-500 px-2 py-0"
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
          className={`py-3 border-b border-gray-200 ${isAccessories ? 'justify-around' : 'justify-between'}`}
        >
          {product.sizes.map((feature, index) => (
            <div
              key={index}
              className="flex gap-2 w-full justify-between items-center"
            >
              {[
                { key: 'width', Icon: Leftright },
                { key: 'thickness', Icon: Collapsearrow },
                { key: 'height', Icon: TwoArrow }
              ].map(({ key, Icon }) =>
                feature[key as keyof typeof feature] ? (
                  <div key={key} className="flex items-center gap-0.5">
                    <Icon />
                    <span className="text-[8px] sm:text-xs xl:text-sm font-medium text-gray-500">
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
          className={`flex gap-4 py-3 border-b border-gray-200 ${isAccessories ? 'justify-around' : 'justify-between'}`}
        >
          {features.map((feature, index) => (
            <div className="flex gap-0.5 items-center" key={index}>
              <Image
                src={feature.icon}
                alt="Icon"
                width={feature.width}
                height={feature.height}
                className="text-gray-500 cursor-pointer hover:text-red-500"
              />
              <span className="text-[8px] sm:text-xs xl:text-sm font-medium text-gray-500">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-3 pb-1 flex-grow">
        <Link
          href={
            isAccessories
              ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
              : handleNavigate(product as IProduct, categoryData)
          }
          className="block font-semibold text-black text-sm md:text-base leading-snug hover:text-primary transition line-clamp-2 min-h-[2.5rem]"
        >
          <h2 className="line-clamp-2">
            {isAccessories ? `${product.name}` : product.name}
          </h2>
        </Link>
      </div>

      {!showPriceOnButton && (
        <div className="pb-2">
          {'price' in product && product.price && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {hasDiscount && (
                <p className="text-sm font-normal text-gray-500 flex items-center">
                  <span className="mr-1">Was:</span>
                  <span className="line-through flex items-center">
                    <span className="font-currency font-normal text-xl mr-1 mb-0.5">
                      
                    </span>
                    {product?.price}
                    <span className="line-through">
                      {isAccessories ? 'Per Piece' : '/m²'}
                    </span>
                  </span>
                </p>
              )}
              <p className="text-red-500 flex items-center font-semibold">
                {hasDiscount && (
                  <span className="text-sm md:text-base xl:text-lg mr-1">
                    Now:
                  </span>
                )}
                <span className="font-currency text-xl mr-1 mb-0.5"></span>
                {hasDiscount ? discountedPrice : product?.price}
                <span className="text-sm md:text-base xl:text-lg ml-1">
                  {isAccessories ? 'Per Piece' : '/m²'}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <div
        className={`mt-auto flex items-center sm:gap-4 gap-1 pt-2 ${sldier ? 'justify-start' : 'justify-between'}`}
      >
        {isSoldOut || ((product as IProduct).stock === 0 && !isAccessories) ? (
          <button
            disabled
            className={`${sldier ? 'px-8 w-fit' : 'flex-1'} py-2 md:py-2.5 rounded-full border border-gray-400 bg-gray-100 text-gray-500 font-semibold text-xs xs:text-sm md:text-base cursor-not-allowed text-center`}
          >
            {isSoldOut ? 'Sold Out' : 'Out of Stock'}
          </button>
        ) : sldier ? (
          <Link
            href={
              isAccessories
                ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
                : handleNavigate(product as IProduct, categoryData)
            }
            className="px-8 block text-center py-2 md:py-2.5 rounded-[30px] border border-primary text-black bg-transparent font-medium text-sm md:text-base hover:bg-primary hover:text-white transition w-full xsm:w-fit"
          >
            Shop Now
          </Link>
        ) : !isAccessories ? (
          // <button
          //   className="flex-1 py-1.5 xsm:py-2 md:py-2.5 rounded-[30px] border border-primary text-black bg-transparent font-medium text-xs xs:text-sm md:text-base hover:bg-primary transition text-center"
          //   onClick={(e) => {
          //     e.preventDefault();
          //     handleAddToStorage(
          //       product,
          //       Number(product.price) * (Number(product?.boxCoverage) || 1),
          //       Number(product.price) * (Number(product?.boxCoverage) || 1),
          //       Number(product?.boxCoverage),
          //       1,
          //       product.subcategory?.custom_url || '',
          //       'category' in product
          //         ? (product.category?.RecallUrl ?? 'Accessories')
          //         : 'Accessories',
          //       'freeSample',
          //       'productImages' in product
          //         ? (product.productImages?.[0]?.imageUrl ?? product.posterImageUrl?.imageUrl)
          //         : product.posterImageUrl?.imageUrl,
          //       product?.boxCoverage,
          //       'm',
          //       selectedColor
          //     );
          //   }}
          // >
          //   Free sample
          // </button>
          isFreeSample ? (
            <button
              className="flex-1 py-1.5 xsm:py-2 md:py-2.5 rounded-[30px] border border-primary text-black bg-transparent font-medium text-xs xs:text-sm md:text-base hover:bg-primary hover:text-white transition text-center"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          ) : (
            <Link
              href={handleNavigate(product as IProduct, categoryData)}
              aria-label={`View product ${product.name}`}
              className="flex-1 py-1.5 xsm:py-2 md:py-2.5 rounded-[30px] border border-primary bg-primary font-bold text-xs xs:text-sm md:text-base hover:bg-primary/90 transition text-center flex items-center justify-center"
            >
              {hasDiscount && (
                <span className="flex items-center gap-1 mr-2 font-normal text-black">
                  Was:{' '}
                  <span className="line-through flex items-center">
                    <span className="font-currency text-base mr-0.5"></span>
                    {product?.price}
                    <span className="text-xs xs:text-sm md:text-base font-medium ml-1">
                      /m²
                    </span>
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1 mr-2 font-semibold text-sm md:text-base xl:text-lg text-red-500">
                {hasDiscount ? `Now:` : null}
                <span className="flex items-center">
                  <span className="font-currency text-lg mr-1 mb-0.5"></span>
                  {hasDiscount ? discountedPrice : product?.price}
                  <span className="text-xs xs:text-sm md:text-base font-medium ml-1">
                    /m²
                  </span>
                </span>
              </span>
            </Link>
          )
        ) : (
          <Link
            href={
              isAccessories
                ? `/accessories/${product.custom_url?.toLowerCase() ?? ''}`
                : handleNavigate(product as IProduct, categoryData)
            }
            className="flex-1 block px-1 text-center py-2 md:py-2.5 rounded-[30px] border border-primary text-black bg-transparent font-medium text-sm md:text-base hover:bg-primary hover:text-white transition"
          >
            Shop Now
          </Link>
        )}

        {!sldier && !isAccessories && (
          <button
            className="w-[42px] h-[42px] md:w-[46px] md:h-[46px] flex-shrink-0 flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition bg-white"
            aria-label="Add free sample"
            onClick={handleAddSample}
          >
            <FreeSample
              isCard
              className="size-3.5 min-[1150px]:size-4 xl:size-5"
            />
          </button>
        )}

        {!sldier && (
          <button
            className="w-[42px] h-[42px] md:w-[46px] md:h-[46px] flex-shrink-0 flex items-center justify-center rounded-xl text-primary hover:bg-primary hover:text-white transition bg-white"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              handleAddToStorage(
                product,
                Number(hasDiscount ? discountedPrice : product.price),
                Number(hasDiscount ? discountedPrice : product.price) *
                  (Number(product?.boxCoverage) || 1),
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
          >
            <FiHeart size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
