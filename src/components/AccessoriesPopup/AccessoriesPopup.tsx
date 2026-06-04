'use client';

import Collapsearrow from 'components/svg/collapse-arrow';
import Leftright from 'components/svg/leftright';
import TwoArrow from 'components/svg/twoarrow';
import { handleAddToStorage } from 'lib/carthelper';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { LuHeart } from 'react-icons/lu';
import { AccessoriesPopupProps } from 'types/types';
import { IProduct } from 'types/prod';

const AccessoriesPopup = ({
  isOpen,
  onClose,
  products
}: AccessoriesPopupProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [requiredBoxes, setRequiredBoxes] = useState<{ [key: string]: number }>(
    {}
  );
  const [totalPrice, setTotalPrice] = useState<{ [key: string]: number }>({});

  if (!isOpen) return null;

  const boxCoverage = 1;
  const PublishAccessory = products.filter(
    (product) => product.status === 'PUBLISHED'
  );

  const getSelectedColor = (product: IProduct) => {
    if (product.selectedColor) return product.selectedColor;
    const baseImage = product.posterImageUrl ?? { imageUrl: '', public_id: '' };
    return {
      ...baseImage,
      color: '1067',
      colorName: 'White'
    };
  };

  const toggleSelect = (product: IProduct) => {
    const idStr = String(product.id);
    setSelectedProducts((prev) => {
      if (prev.includes(idStr)) {
        setRequiredBoxes((boxes) => {
          const next = { ...boxes };
          delete next[idStr];
          return next;
        });
        setTotalPrice((prices) => {
          const next = { ...prices };
          delete next[idStr];
          return next;
        });
        return prev.filter((productId) => productId !== idStr);
      }
      setRequiredBoxes((boxes) => ({ ...boxes, [idStr]: 1 }));
      setTotalPrice((prices) => ({
        ...prices,
        [idStr]: Number(product.price)
      }));
      return [...prev, idStr];
    });
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === 'popup-overlay') {
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedProducts([]);
    setRequiredBoxes({});
    setTotalPrice({});
  };

  const handleAddSelectedToCart = () => {
    selectedProducts.forEach((productId) => {
      const product = PublishAccessory.find((p) => String(p.id) === productId);
      if (product) {
        const squareMeter = boxCoverage * (requiredBoxes[productId] || 1);
        const selectedColor = getSelectedColor(product);

        handleAddToStorage(
          product,
          totalPrice[productId] || product.price,
          product.price,
          squareMeter,
          requiredBoxes[productId] || 1,
          'm',
          product.category?.name ??
            (product?.__typename?.toLowerCase().trim() === 'accessory'
              ? 'accessories'
              : product?.__typename),
          'cart',
          product.posterImageUrl.imageUrl ??
            product?.matchedProductImages?.[0]?.imageUrl,
          String(boxCoverage),
          'm',
          selectedColor,
          product.matchedProductImages?.[0] || product.posterImageUrl
        );
      }
    });
    resetForm();
    onClose();
  };

  const handleWishlist = (product: IProduct) => {
    const selectedColor = getSelectedColor(product);
    handleAddToStorage(
      product,
      Number(product.price),
      Number(product.price),
      1,
      1,
      product.subcategory?.custom_url || 'accessories',
      product.category?.RecallUrl ?? 'accessories',
      'wishlist',
      product?.matchedProductImages?.[0]?.imageUrl ??
        product.posterImageUrl?.imageUrl,
      product.boxCoverage || '2.4',
      'm',
      selectedColor,
      product.matchedProductImages?.[0] || product.posterImageUrl
    );
  };

  return (
    <div
      id="popup-overlay"
      className="fixed -inset-3 set-0 mt-0 flex_center bg-white/50 z-50 p-4"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-6xl relative pb-20">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-left">Accessories</h2>
        {PublishAccessory.length === 0 ? (
          <p className="text-center text-gray-700">No accessory available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 gap-3 xl:gap-4 overflow-y-auto max-h-[50vh] lg:max-h-[78vh] thin-scrollbar">
            {PublishAccessory.map((product) => {
              const isSelected = selectedProducts.includes(String(product.id));
              const inStock = Number(product.stock) > 0;
              const size = product.sizes?.[0];

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8E8E8] flex flex-col overflow-hidden"
                >
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => inStock && toggleSelect(product)}
                      disabled={!inStock}
                      className={`absolute top-2 left-2 z-10 w-5 h-5 flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-white/90 border-[#C4C4C4]'
                          : 'bg-white/70 border-[#C4C4C4]'
                      } ${inStock ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      aria-label={
                        isSelected ? 'Deselect accessory' : 'Select accessory'
                      }
                    >
                      {isSelected && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3.5 h-3.5 text-[#333]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    <Image
                      width={500}
                      height={500}
                      src={
                        product?.matchedProductImages?.[0]?.imageUrl ??
                        product.posterImageUrl.imageUrl
                      }
                      alt={product.name}
                      className="w-full h-[140px] sm:h-[160px] object-cover"
                    />
                  </div>

                  {size && (
                    <div className="flex justify-evenly items-center border-b border-[#E0E0E0] py-2 px-2 gap-1 text-[#8D8D8D]">
                      {size.width && (
                        <div className="flex items-center gap-1">
                          <span className="[&_path]:fill-[#8D8D8D] [&_line]:stroke-[#8D8D8D]">
                            <Leftright />
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-medium">
                            {size.width}
                          </span>
                        </div>
                      )}
                      {size.thickness && (
                        <div className="flex items-center gap-1">
                          <span className="[&_path]:fill-[#8D8D8D] [&_line]:stroke-[#8D8D8D]">
                            <Collapsearrow />
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-medium">
                            {size.thickness}
                          </span>
                        </div>
                      )}
                      {size.height && (
                        <div className="flex items-center gap-1">
                          <span className="[&_path]:fill-[#8D8D8D]">
                            <TwoArrow />
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-medium">
                            {size.height}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-3 py-2.5 flex-1">
                    <h3 className="text-[14px] font-bold text-black leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[13px] text-black mt-1">
                      Color : {product.selectedColor?.colorName ?? 'White'}
                    </p>
                    <p className="text-[13px] text-black mt-0.5">
                      Price Per piece:{' '}
                      <span className="font-currency font-normal"></span>{' '}
                      {product.price}/m²
                    </p>
                    <p className="text-[13px] text-black mt-0.5">
                      Length Per Piece: {product.boxCoverage || '2.4'}m
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-3 pb-3">
                    <Link
                      href={`/accessories/${product.custom_url?.toLowerCase() ?? ''}`}
                      onClick={onClose}
                      className="flex-1 text-center py-2 rounded-full border border-primary text-black bg-white text-[13px] font-bold hover:bg-primary hover:text-white transition-colors"
                    >
                      Shop now
                    </Link>
                    <button
                      type="button"
                      className="shrink-0 p-1 text-primary hover:opacity-80 transition-opacity"
                      aria-label="Add to wishlist"
                      onClick={() => handleWishlist(product)}
                    >
                      <LuHeart className="w-[22px] h-[22px] stroke-[1.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div>
          {/* <button
            id="AddToCart"
            type="button"
            className={`mt-2 w-fit px-2 xsm:px-5 sm:px-10 mx-auto py-3 font-semibold flex_center gap-2 fixed left-1/2 -translate-x-1/2 bottom-6 ${
              selectedProducts.length > 0
                ? 'bg-black text-white cursor-pointer'
                : 'bg-black text-white cursor-not-allowed opacity-70'
            }`}
            onClick={handleAddSelectedToCart}
            disabled={selectedProducts.length === 0}
          >
            <Image
              src="/assets/images/icon/cart.png"
              alt="cart"
              width={28}
              height={28}
            />
            Add to Cart
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AccessoriesPopup;
