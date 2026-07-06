'use client';

import { SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PaymentMethod from 'components/product-detail/payment';
import { IProduct, IProductAccessories, ProductImage } from 'types/prod';
import { handleAddToStorage } from 'lib/carthelper';
import { LuHeart } from 'react-icons/lu';
import { formatAED } from 'utils/helperFunctions';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import Checkbox from 'components/ui/checkbox';
import TrustBadges from './trust-badges';

// Accessory installation is charged per piece.
const ACCESSORY_INSTALLATION_RATE = 35;

const SkirtingProductDetail = ({
  productData,
  MainCategory,
  image,
  selectedColor,
  setSelectedColor
}: {
  productData: IProductAccessories;
  MainCategory: string;
  image?: { imageUrl: string };
  setSelectedColor: React.Dispatch<SetStateAction<ProductImage | undefined>>;
  selectedColor: ProductImage | undefined;
}) => {
  const [length, setLength] = useState('');
  const [requiredBoxes, setRequiredBoxes] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [uniqueFeatureImages, setUniqueFeatureImages] = useState<
    ProductImage[]
  >([]);
  const [matchingColor, setMatchingColor] = useState<IProduct[]>([]);
  const [addInstallation, setAddInstallation] = useState(false);
  const [isInstallationModal, setIsInstallationModal] = useState(false);
  const installationRef = useRef<HTMLDivElement | null>(null);
  const boxCoverage = 2.4;
  const calculateSquareMeter = (boxes: number) => {
    return boxCoverage * boxes;
  };

  const squareMeter = calculateSquareMeter(requiredBoxes);
  const installationCost = addInstallation
    ? requiredBoxes * ACCESSORY_INSTALLATION_RATE
    : 0;

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

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLength(value);

    const meters = parseFloat(value);
    if (!isNaN(meters) && meters > 0) {
      const pieces = Math.ceil(meters);
      setRequiredBoxes(pieces);
      setTotalPrice(pieces * productData.price);
    } else {
      setRequiredBoxes(0);
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    const uniqueFeatureImages =
      productData?.featureImages?.filter(
        (image, index, self) =>
          index === self.findIndex((img) => img.color === image.color)
      ) || [];
    setUniqueFeatureImages(uniqueFeatureImages);
    if (uniqueFeatureImages.length > 0) {
      setSelectedColor(uniqueFeatureImages[0]);
    } else {
      const baseImage: ProductImage = productData?.productImages?.[0] ?? {
        imageUrl: '',
        public_id: ''
      };
      setSelectedColor({
        ...baseImage,
        color: '1067',
        colorName: 'White'
      });
    }
  }, [productData?.featureImages]);

  useEffect(() => {
    if (selectedColor?.color) {
      const filterColor =
        productData?.products?.filter((item: IProduct) =>
          item.colors?.some((col) => col.detail === selectedColor.color)
        ) || [];
      setMatchingColor(filterColor || []);
    }
  }, [selectedColor, productData]);

  const handleColorClick = (color: ProductImage) => {
    setSelectedColor(color);
  };
  return (
    <div className="p-1 lg:px-4 font-inter">
      <h1 className="text-xl sm:text-2xl lg:text-[28px] 2xl:text-[32px] font-bold text-primary mb-4">
        {productData.name}
      </h1>
      <div className="space-y-4 mt-5 lg:mt-0">
        <p className="text-sm xl:text-[23.6px] font-semibold">
          Price Per Piece:{' '}
          <span className="text-primary">
            <span className="font-currency font-normal text-lg xl:text-28">
              
            </span>{' '}
            {productData.price}
          </span>
        </p>
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
      </div>

      {uniqueFeatureImages && uniqueFeatureImages.length > 0 && (
        <div className="w-full h-full min-h-216 border border-[#D9D9D9] p-3 rounded-lg mt-6">
          <p className="font-semibold xl:text-xl">
            Colour:{' '}
            <span className="font-medium text-base">
              {selectedColor?.colorName || selectedColor?.altText}
            </span>
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            {uniqueFeatureImages.map((col, index) => (
              <div
                key={index}
                className={`text-center border-4 cursor-pointer w-12 ${selectedColor?.color === col.color ? 'border-primary' : 'border-transparent'}`}
                onClick={() => handleColorClick(col)}
              >
                <Image
                  alt="img"
                  src={col.imageUrl}
                  height={100}
                  width={100}
                  quality={70}
                  className="h-auto w-full lg:h-11"
                />
                <p className="text-[8px] sm:text-10  font-normal text-nowrap">
                  {col.color}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {matchingColor && matchingColor.length > 0 && (
        <div className="mt-6 p-3 border border-[#D9D9D9] rounded-lg">
          <p className="font-semibold text-base xl:text-xl">
            Matching with:
          </p>
          {matchingColor.map((item, index) => (
            <p className="text-sm xl:text-base font-medium" key={index}>
              {item.name}
            </p>
          ))}
        </div>
      )}
      {/* Length Input */}
      <div className="mt-6 p-3 border border-[#D9D9D9] rounded-lg">
        <div className="flex items-center gap-2 ">
          <p className="font-semibold xl:text-xl">Pieces:</p>
          <input
            type="number"
            value={length}
            onChange={handleLengthChange}
            placeholder="No. of Required Pieces"
            min="0"
            className="border px-2 py-1.5 bg-[#ECECEC] text-black placeholder:text-black w-full max-w-[190px] mt-1 border-primary text-xs xl:text-sm"
          />
        </div>
        <div className="mt-3 font-semibold lg:text-lg">
          <p>
            {productData.lengthPrice ? (
              <>
                Length Per Piece:{' '}
                <span className="font-medium text-base text-primary">
                  {productData.lengthPrice}
                </span>
              </>
            ) : (
              <span className="font-light text-sm xl:text-lg">
                Selling in fixed length of 240cm
              </span>
            )}
          </p>
          <p className="mt-2">
            Height: <span className="font-medium text-base text-primary">{(productData.sizes && productData.sizes[0]?.height) ? productData.sizes[0].height : '10 cm'}</span>
          </p>
          <p className="mt-2">
            Depth: <span className="font-medium text-base text-primary">1.6 cm</span>
          </p>
        </div>
      </div>
      <div className="mt-6 p-3 border border-[#D9D9D9] rounded-lg xl:text-lg font-semibold">
        <p>
          No. of Pieces:{' '}
          <span className="font-medium text-base text-primary">
            {requiredBoxes} Pieces
          </span>
        </p>
        <p>
          Price Per Piece:{' '}
          <span className="font-medium text-base text-primary">
            <span className="font-currency font-normal text-xl">
              
            </span>{' '}
            {productData.price}
          </span>
        </p>
        <p>
          Total Amount:{' '}
          <span className="font-medium text-base text-primary">
            <span className="font-currency font-normal text-xl">
              
            </span>{' '}
            {formatAED(totalPrice)} (
            {requiredBoxes < 1
              ? `${requiredBoxes} Piece`
              : `${requiredBoxes} Pieces`}{' '}
            *{' '}
            <span className="font-currency text-xl font-normal">
              
            </span>{' '}
            {productData.price})
          </span>
        </p>
      </div>

      <div className="relative mt-4">
        <Checkbox
          name="installation"
          checked={addInstallation}
          onChange={handleInstallationChange}
        >
          <span className="text-sm xsm:text-base font-semibold">
            Add Professional Installation (site survey required)
          </span>
        </Checkbox>

        {addInstallation && isInstallationModal && (
          <div
            className="absolute bottom-10 right-0 z-10 w-full max-w-[400px] bg-white py-4 px-2 drop-shadow-2xl"
            ref={installationRef}
          >
            <RxCross2
              className="rounded-full cursor-pointer bg-primary ms-auto mb-2"
              onClick={() => setIsInstallationModal(false)}
              size={20}
              color="black"
            />
            <ul className="list-disc ps-5">
              <li>
                <span className="flex justify-between pb-2 font-semibold">
                  Installation Charges{' '}
                  <span>AED {formatAED(installationCost)}</span>
                </span>
              </li>
              <li>Charged per piece.</li>
              <li>Survey will be conducted before installation.</li>
              <li>Our team will contact you to arrange an appt.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="my-6 flex w-full gap-1 items-center sm:gap-3">
        <button
          onClick={() =>
            handleAddToStorage(
              productData,
              totalPrice,
              productData.price,
              squareMeter,
              requiredBoxes,
              '',
              MainCategory ?? '',
              'cart',
              image?.imageUrl ?? '',
              boxCoverage.toString(),
              'm',
              selectedColor,
              undefined,
              false,
              installationCost,
              addInstallation
            )
          }
          className="flex_center bg-black text-11 xs:text-12 text-white w-6/12 2xl:text-22 gap-2 h-[64px] px-2 py-2 sm:py-3 sm:text-base"
          id="AddToCart"
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
        <button
          id="AddToWishlist"
          className="flex_center bg-primary text-11 xs:text-12 text-white w-6/12 2xl:text-22 gap-2 h-[64px] px-2 py-2 sm:py-3 sm:text-base"
          onClick={() =>
            handleAddToStorage(
              productData,
              totalPrice,
              productData.price,
              squareMeter,
              requiredBoxes,
              '',
              MainCategory ?? '',
              'wishlist',
              image?.imageUrl ?? '',
              boxCoverage.toString(),
              'm',
              selectedColor
            )
          }
        >
          <LuHeart size={25} />
          Add to Wishlist
        </button>
      </div>

      {/* <p className="text-lg xl:text-22 font-semibold text-center">
        Buy Now, Pay Later
      </p> */}
      <PaymentMethod installments={totalPrice / 4} compact />
      <div className="mt-2 space-y-2 text-center">
        {/* <p className="text-center mt-4 font-medium text-lg lg:text-[20.6px]">
          Guaranteed Safe Checkout
        </p>
        <div className="flex_between lg:justify-center gap-2 lg:gap-10">
          {paymentcard.map((array, index) => (
            <Image
              className=" w-16  md:w-14 2xl:w-[50px] h-auto shadow"
              key={index}
              width={90}
              height={60}
              src={array.image}
              alt="payment-card"
            />
          ))}
        </div> */}
        <TrustBadges />
      </div>
    </div>
  );
};

export default SkirtingProductDetail;
