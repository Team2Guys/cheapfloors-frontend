'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Container from 'components/common/container/Container';
import PaymentMethod from 'components/product-detail/payment';
import TrustBadges from 'components/product-detail/trust-badges';
import Image from 'next/image';
import { LuHeart } from 'react-icons/lu';
import { calculateProductDetails, handleAddToStorage } from 'lib/carthelper';
import { detailprops } from 'types/product-detail';
import Thumbnail from 'components/product-detail/thumbnail';
import AreaCalculator from 'components/product-detail/AreaCalculator';
import Checkbox from 'components/ui/checkbox';
import { formatAED } from 'utils/helperFunctions';
import { RxCross2 } from 'react-icons/rx';
import { IProduct } from 'types/prod';
import { FaRegCircleCheck } from 'react-icons/fa6';

const ProductContainer = ({
  MainCategory,
  subCategory,
  productData,
  className,
  isQuickView,
  isClearance
}: detailprops) => {
  const [unit, setUnit] = useState('sqm');
  const [area, setArea] = useState('');
  const [addInstallation, setAddInstallation] = useState(false);
  const [isInstallationModal, setIsInstallationModal] = useState(false);
  // const [totalInstallationPrice, setTotalInstallationPrice] = useState(0);
  const [installationCost, setInstallationCost] = useState(0);
  const installationRef = useRef<HTMLDivElement | null>(null);

  const {
    // convertedArea,
    requiredBoxes,
    pricePerBox,
    squareMeter,
    totalPrice,
    installments,
    boxCoverage
  } = useMemo(
    () => calculateProductDetails(area, unit, productData),
    [area, unit, productData]
  );

  const filteredProducts: IProduct[] = (productData?.acessories ?? []).map(
    (product) => {
      const selectedColor = product.featureImages?.find(
        (img) =>
          img.color === productData.productImages?.[0]?.colorCode
      );

      const matchedProductImages = product.productImages?.filter(
        (img) =>
          img.colorCode === productData.productImages?.[0]?.colorCode
      );

      return {
        ...product,
        selectedColor,
        matchedProductImages,
      };
    }
  );

  const selectedColor = useMemo(
    () =>
      productData?.featureImages?.find(
        (img) => img.color === productData?.productImages?.[0]?.colorCode
      ),
    [productData]
  );

  const matchedProductImages = useMemo(
    () =>
      productData.productImages?.find(
        (img) =>
          img.colorCode === productData.productImages?.[0]?.colorCode || ''
      ),
    [productData]
  );

  useEffect(() => {

    // base area always in sqm
    const totalSQM = isClearance
      ? Number(productData.bundle) * Number(productData.boxCoverage)
      : Number(squareMeter);


    const installationRate = productData?.name
      .toLowerCase()
      ?.includes('herringbone')
      ? 35
      : 25;
    const installationCost = addInstallation ? totalSQM * installationRate : 0;
    setInstallationCost(installationCost);
  }, [productData, addInstallation, squareMeter]);

  const handleInstallationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = e.target.checked;
    setAddInstallation(checked);
    setIsInstallationModal(checked);
  };



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        installationRef.current &&
        !installationRef.current.contains(event.target as Node)
      ) {
        setIsInstallationModal(false);
      }
    };

    if (isInstallationModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInstallationModal]);



  return (
    <Container
      className={`w-full mt-6 sm:mt-10 border-b pb-5 font-inter ${className}`}
    >
      <div
        className={`flex flex-wrap lg:flex-nowrap gap-5 w-full ${isQuickView ? '2xl:gap-10' : '2xl:gap-16 lg:gap-10'}`}
      >
        <div className='w-full lg:w-[50%]'>
          {productData?.name && (
            <h1 className="text-xl sm:text-2xl lg:text-[28px] 2xl:text-[32px] font-bold ps-0 lg:ps-[17%] text-primary mb-4">
              {productData.name}
            </h1>
          )}
          {productData?.productImages && (
            <Thumbnail
              ThumnailImage={productData.productImages}
              ThumnailBottom={productData.featureImages}
            />
          )}
        </div>
        <div
          className='w-full lg:w-[50%] mb-2 space-y-3 sm:space-y-4 lg:mt-12'
        >
          {/* {productData?.name && isQuickView && (
            <h1 className="text-lg sm:text-25 2xl:text-[32px] font-bold text-primary">
              {productData.name}
            </h1>
          )} */}
          {isClearance ? (
            <>
              <div>
                {'bundleDisPrice' in productData &&
                  productData.bundleDisPrice && (
                    <p className="text-12 w-full md:text-sm md:text-left md:w-full xl:text-xl text-black">
                      Was:{' '}
                      <span className="font-currency md:text-18 xl:text-24 font-normal">
                        
                      </span>{' '}
                      <span className="line-through">
                        {productData?.bundleDisPrice}/m²
                      </span>
                    </p>
                  )}
                {'bundlePrice' in productData && productData.bundlePrice && (
                  <p className="text-12 w-full font-semibold md:text-sm md:text-left md:w-full xl:text-xl text-black">
                    Now:{' '}
                    <span className="font-currency md:text-18 xl:text-24 font-normal">
                      
                    </span>{' '}
                    <span className="font-normal">
                      {productData?.bundlePrice}/m² Only
                    </span>
                  </p>
                )}
              </div>
              <div className="text-xs md:text-sm xl:text-16">
                <p>
                  Total Bundle:{' '}
                  {(
                    productData?.bundle &&
                    productData?.bundle * Number(productData?.boxCoverage)
                  )?.toFixed(2)}
                  m²
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-1">
                <p className="text-xl font-bold text-black">
                  Price Per {unit === 'sqm' ? 'Sqm' : 'Sq.ft'} :
                </p>
                <p className="text-xl font-bold text-primary">
                  <span className="font-currency font-normal text-2xl"> </span>
                  {unit === 'sqm'
                    ? productData?.price
                    : (productData?.price / 10.7639).toFixed(2)}
                  <span>{unit === 'sqm' ? '/m²' : '/ft²'}</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  {productData?.stock && productData?.stock > 0 ? (
                    <>
                      <FaRegCircleCheck className="text-[#008000] text-xl" />
                      <span className="text-xl font-bold text-[#008000]">
                        In Stock
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-red-500">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="border-b border-[#D9D9D9] pt-1" />
              </div>
            </>
          )}
          {isClearance ? (
            <>
              <div className="space-y-2">
                <p className="text-3xl font-black">Bundle Price</p>
                {productData.bundleDisPrice && (
                  <p className="w-full font-medium text-sm md:text-left md:w-full xl:text-xl text-black flex items-center gap-10 xl:gap-12">
                    Was:{' '}
                    <span>
                      <span className="font-currency text-18 xl:text-24 text-primary font-normal">
                        
                      </span>{' '}
                      <span className="line-through">
                        {formatAED(
                          productData?.bundle &&
                          productData?.bundle *
                          (Number(productData.bundleDisPrice) *
                            (Number(productData?.boxCoverage) || 1))
                        )}
                      </span>
                    </span>
                  </p>
                )}
                {'bundlePrice' in productData && productData.bundlePrice && (
                  <p className="w-full font-semibold text-xl md:text-left md:w-full xl:text-3xl text-black flex items-center gap-5">
                    Now:{' '}
                    <span>
                      <span className="font-currency text-24 xl:text-37 font-normal text-primary">
                        
                      </span>{' '}
                      <span className="font-black">
                        {formatAED(
                          productData?.bundle &&
                          productData?.bundle *
                          (Number(productData.bundlePrice) *
                            (Number(productData?.boxCoverage) || 1))
                        )}
                      </span>
                    </span>
                  </p>
                )}
                <p className="text-red-500 text-xs md:text-sm xl:text-base">
                  (Save{' '}
                  <span className="font-currency text-sm md:text-base xl:text-18  font-normal">
                    
                  </span>{' '}
                  {formatAED(
                    productData?.bundle &&
                    productData?.bundle *
                    (Number(productData.bundleDisPrice) *
                      (Number(productData?.boxCoverage) || 1)) -
                    productData?.bundle *
                    (Number(productData.bundlePrice) *
                      (Number(productData?.boxCoverage) || 1))
                  )}{' '}
                  on this bundle)
                </p>
              </div>
              <button
                id="AddToWishlist"
                className="flex justify-end items-center w-full text-11 xs:text-xs text-gray-700 gap-2"
                onClick={() =>
                  handleAddToStorage(
                    productData,
                    (
                      productData?.bundle &&
                      productData?.bundle *
                      (Number(productData.bundlePrice) *
                        (Number(productData?.boxCoverage) || 1))
                    )?.toFixed(2) || 1,
                    Number(productData.bundlePrice) *
                    (Number(productData?.boxCoverage) || 1),
                    Number(
                      productData?.bundle &&
                      productData?.bundle * Number(productData?.boxCoverage)
                    ) || 1,
                    productData?.bundle || 1,
                    productData.subcategory.custom_url ?? '',
                    productData.category.RecallUrl ?? '',
                    'wishlist',
                    productData?.productImages?.[0]?.imageUrl,
                    productData?.boxCoverage,
                    'sqm',
                    undefined,
                    undefined,
                    true,
                    installationCost,
                    addInstallation
                  )
                }
              >
                <LuHeart size={20} />
                Add to Wishlist
              </button>
              <div className="flex items-center gap-2 mt-3 relative">
                <Checkbox
                  name="installation"
                  checked={addInstallation}
                  onChange={handleInstallationChange}
                >
                  Add Professional Installation (Site survey required · Dubai only)
                </Checkbox>

                {addInstallation && isInstallationModal &&
                  <div className="absolute bottom-10 right-0 bg-background p-4 max-w-[400px] w-full drop-shadow-md" ref={installationRef}>
                    <RxCross2 className='rounded-full cursor-pointer bg-white ms-auto mb-2' onClick={() => setIsInstallationModal(false)} size={20} color='black' />
                    <ul className='list-disc ps-5'>
                      <li><span className='flex justify-between pb-2'>Installation Charges <span><span className="font-currency font-normal text-lg">  </span>{' '}{formatAED(installationCost)}</span></span></li>
                      <li>Charges based on floor being completely level.</li>
                      <li>Survey will be conducted before installation.</li>
                      <li>Our team will contact you to arrange an appt.</li>
                    </ul>
                  </div>
                }
              </div>

              <button
                id="AddToCart"
                onClick={() =>
                  handleAddToStorage(
                    productData,
                    (
                      productData?.bundle &&
                      productData?.bundle *
                      (Number(productData.bundlePrice) *
                        (Number(productData?.boxCoverage) || 1))
                    )?.toFixed(2) || 1,
                    Number(productData.bundlePrice) *
                    (Number(productData?.boxCoverage) || 1),
                    Number(
                      productData?.bundle &&
                      productData?.bundle * Number(productData?.boxCoverage)
                    ) || 1,
                    productData?.bundle || 1,
                    productData.subcategory.custom_url ?? '',
                    productData.category.RecallUrl ?? '',
                    'cart',
                    productData?.productImages?.[0]?.imageUrl,
                    productData?.boxCoverage,
                    'sqm',
                    undefined,
                    undefined,
                    true,
                    installationCost,
                    addInstallation
                  )
                }
                className="flex_center bg-black text-11 xs:text-xs text-white w-full 2xl:text-22 gap-2 max-sm:h-[40px] px-2 py-2 sm:py-3 sm:text-base"
              >
                <Image
                  src="/assets/images/icon/cart.png"
                  alt="box"
                  width={28}
                  height={28}
                  className="size-5 xs:size-7 text-11 xs:text-sm xl:text-20"
                />
                Add to Cart
              </button>
              <PaymentMethod
                installments={
                  (productData?.bundle &&
                    (productData?.bundle *
                      (Number(productData.bundlePrice) *
                        Number(productData?.boxCoverage))) /
                    4) ||
                  0
                }
                isClearance={isClearance}
              />
            </>
          ) : (
            <>
              <AreaCalculator
                area={area}
                unit={unit}
                setArea={setArea}
                setUnit={setUnit}
                accessories={filteredProducts}
              />
              <div className="flex flex-col">
                <p className="text-2xl font-black text-primary">
                  Total :{' '}
                  <span className="font-currency font-normal text-3xl"></span>{' '}
                  <span>{formatAED(totalPrice)}</span>
                </p>
              </div>
              <div className="relative pt-2">
                <Checkbox
                  name="installation"
                  checked={addInstallation}
                  onChange={handleInstallationChange}
                  className="text-2xl font-bold"
                >
                  <span className="text-sm xsm:text-base xl:text-xl font-semibold">Add Professional Installation (site survey required)</span>
                </Checkbox>


                {addInstallation && isInstallationModal &&
                  <div className="absolute bottom-10 right-0 py-4 px-2 bg-white max-w-[400px] w-full drop-shadow-2xl" ref={installationRef}>
                    <RxCross2 className='rounded-full cursor-pointer bg-primary ms-auto mb-2' onClick={() => setIsInstallationModal(false)} size={20} color='black' />
                    <ul className='list-disc ps-5'>
                      <li><span className='flex justify-between pb-2 font-semibold'>Installation Charges <span><span className="font-currency font-normal text-lg">  </span>{' '}{formatAED(installationCost)}</span></span></li>
                      <li>Charges based on floor being completely level.</li>
                      <li>Survey will be conducted before installation.</li>
                      <li>Our team will contact you to arrange an appt.</li>
                    </ul>
                  </div>
                }
              </div>


              <div className="flex flex-col xsm:flex-row w-full gap-2 pt-2">
                <button
                  id="OrderFreeSample"
                  className="flex_center flex-1 bg-primary hover:bg-secondary text-base xl:text-xl text-white font-semibold gap-1.5 h-[64px] px-2 py-2"
                  onClick={() =>
                    handleAddToStorage(
                      productData,
                      totalPrice,
                      pricePerBox,
                      squareMeter,
                      requiredBoxes,
                      subCategory ?? '',
                      MainCategory ?? '',
                      'freeSample',
                      productData?.productImages?.[0]?.imageUrl,
                      boxCoverage,
                      unit,
                      selectedColor,
                      matchedProductImages
                    )
                  }
                >
                  <Image
                    src="/assets/images/icon/measure.png"
                    alt="box"
                    width={30}
                    height={30}
                    className="size-7 shrink-0"
                  />
                  <span className="whitespace-nowrap leading-tight">Order Now Free Sample</span>
                </button>
                <button
                  id="AddToCart"
                  onClick={() =>
                    handleAddToStorage(
                      productData,
                      totalPrice,
                      pricePerBox,
                      squareMeter,
                      requiredBoxes,
                      subCategory ?? '',
                      MainCategory ?? '',
                      'cart',
                      productData?.productImages?.[0]?.imageUrl,
                      boxCoverage,
                      unit,
                      selectedColor,
                      undefined,
                      false,
                      installationCost,
                      addInstallation
                    )
                  }
                  className="flex_center flex-1 bg-black text-base xl:text-xl text-white font-bold gap-1.5 h-[64px] px-2 py-2"
                >
                  <Image
                    src="/assets/images/icon/cart.png"
                    alt="box"
                    width={28}
                    height={28}
                    className="size-7 shrink-0"
                  />
                  Add to Cart
                </button>
              </div>
              <button
                id="AddToWishlist"
                className="w-fit flex items-center justify-start text-base font-semibold text-black gap-2 py-1.5"
                onClick={() =>
                  handleAddToStorage(
                    productData,
                    totalPrice,
                    pricePerBox,
                    squareMeter || 1,
                    requiredBoxes,
                    subCategory ?? '',
                    MainCategory ?? '',
                    'wishlist',
                    productData?.productImages?.[0]?.imageUrl,
                    boxCoverage,
                    unit,
                    selectedColor,
                    matchedProductImages,
                    false,
                    installationCost,
                    addInstallation
                  )
                }
              >
                <LuHeart className="text-primary text-xl stroke-[1.5]" />
                Add to Wishlist
              </button>
              <div className="space-y-2.5">
                <PaymentMethod installments={installments} compact />
                <TrustBadges />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};
export default ProductContainer;
