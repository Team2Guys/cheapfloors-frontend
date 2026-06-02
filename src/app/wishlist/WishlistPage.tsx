'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { ICart } from 'types/prod';
import { fetchItems, handleAddToCart, handleRemoveItem, updateQuantity } from 'utils/cartutils';
import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';
import Image from 'next/image';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { generateSlug } from 'data/data';
import { formatAED } from 'utils/helperFunctions';

const Container = dynamic(() => import('components/common/container/Container'));
const Breadcrumb = dynamic(() => import('components/Reusable/breadcrumb'));
const Top = dynamic(() => import('components/top'));

const WishlistPage = () => {
  const [items, setItems] = useState<ICart[]>([]);
  
  useEffect(() => {
    fetchItems(false, setItems);
  }, []);

  const increment = (item: ICart) => {
    setItems((prevItems) => updateQuantity(item, 1, prevItems));
  };
  const decrement = (item: ICart) => {
    setItems((prevItems) => updateQuantity(item, -1, prevItems));
  };
  const handleQunatity = (e: any, item: ICart) => {
    // Basic quantity handle, can be left disabled or implement delta
  };

  const handleAddInstallation = (product: ICart) => {
    setItems?.((prevItems) =>
      prevItems.map((item) => {
        if (
          item.id === product.id &&
          item.selectedColor?.colorCode === product.selectedColor?.colorCode
        ) {
          const installationRate = item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25;
          const instCost = item.squareMeter * installationRate;
          const areaInSqm = item.unit === 'sqft' ? item.squareMeter / 10.764 : item.squareMeter;
          const totalPrice = areaInSqm * (item.price || 0) + instCost;

          return { ...item, addInstallation: true, installationCost: instCost, totalPrice };
        }
        return item;
      })
    );
  };

  const handleRemoveInstallation = (product: ICart) => {
    setItems?.((prevItems) =>
      prevItems.map((item) => {
        if (
          item.id === product.id &&
          item.selectedColor?.colorCode === product.selectedColor?.colorCode
        ) {
          const areaInSqm = item.unit === 'sqft' ? item.squareMeter / 10.764 : item.squareMeter;
          const totalPrice = areaInSqm * (item.price || 0);

          return { ...item, addInstallation: false, installationCost: 0, totalPrice };
        }
        return item;
      })
    );
  };

  const products = items.filter(
    (item) => item.category?.toLowerCase() !== 'accessories' && !item.isClearance
  );
  const accessories = items.filter(
    (item) => (item.category?.toLowerCase() === 'accessories' || item.category === 'Accessory') && !item.isClearance
  );
  const clearanceItems = items.filter((item) => item.isClearance);

  if (items.length === 0) {
    return (
      <Container>
        <Breadcrumb title="Wishlist" />
        <Top heading="Wishlist" Icon={CiHeart} />
        <div className="text-center pb-10 xsm:pb-20 pt-2">
          <p className="text-center text-[24px]">Wishlist is empty</p>
          <Link
            href="/collections"
            className="text-center text-[18px] bg-primary p-2 flex w-fit mx-auto items-center text-white gap-2 mt-4"
          >
            <FaArrowLeftLong /> Go Back to Shop
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb title="Wishlist" />
      <Container>
        <Top heading="Wishlist" Icon={CiHeart} />
        
        <div className="flex flex-col xl:flex-row gap-5 xl:gap-8 pb-6 xl:pt-6 xl:mb-10 w-full">
          <div className="w-full bg-white">
            
            {/* Main Products */}
            {products.length > 0 && (
              <div className="pr-1 md:pr-4">
                <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                  <div className="w-[150px] shrink-0">Product</div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-12 w-full gap-4">
                      <div className="col-span-5"></div>
                      <div className="col-span-3 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Unit price</div>
                      <div className="col-span-2 text-end">Action</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar">
                  {products.map((item, cartindex) => (
                    <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                      {/* Mobile Actions - Top Right */}
                      <div className="flex justify-end xl:hidden mb-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(item, setItems)}
                          className="bg-[#ffc341] text-black font-semibold rounded-full text-xs flex items-center px-3 py-1.5 hover:opacity-80 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-500 bg-[#f5f5f3] border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                          onClick={() => handleRemoveItem(item, setItems as any, false)}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="flex gap-3 md:gap-4 items-stretch relative">
                        {/* Image */}
                        <div className="w-[100px] md:w-[130px] xl:w-[150px] shrink-0 h-[100px] md:h-[130px] xl:h-[150px] relative rounded overflow-hidden">
                          <Image
                            fill
                            className="object-cover"
                            src={item.image ?? '/default-image.png'}
                            alt="wishlist item"
                          />
                        </div>

                        {/* Info Column */}
                        <div className="flex-grow flex flex-col justify-center">
                          <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                            <div className="col-span-12 xl:col-span-5">
                              <Link
                                href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                className="text-[15px] md:text-[16px] font-medium text-black hover:text-primary transition line-clamp-2"
                              >
                                {item.name}
                              </Link>

                              {/* Mobile Quantity and Price */}
                              <div className="flex justify-between items-center mt-3 xl:hidden pr-2">
                                <div className="flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-bold">
                                  <button
                                    className="hover:opacity-80 text-black bg-[#ffb81c] rounded-full h-6 w-6 flex items-center justify-center transition"
                                    onClick={() => decrement(item)}
                                  >
                                    <LuMinus className="size-3" />
                                  </button>
                                  <span className="text-black text-[15px] px-2 min-w-[32px] text-center">
                                    <input
                                      type="number"
                                      readOnly
                                      value={String(item.squareMeter).padStart(2, '0')}
                                      className="max-w-[30px] text-center no-spinner bg-transparent text-black focus:outline-none"
                                    />
                                  </span>
                                  <button
                                    className="hover:opacity-80 text-black bg-[#ffb81c] rounded-full h-6 w-6 flex items-center justify-center transition"
                                    onClick={() => increment(item)}
                                  >
                                    <LuPlus className="size-3" />
                                  </button>
                                </div>
                                <p className="text-[16px] font-bold text-black flex items-center gap-1">
                                  <span className="font-currency font-normal text-[20px]"></span>
                                  <span>{formatAED(item.price ?? 0)}</span>
                                </p>
                              </div>
                            </div>

                            {/* Quantity Desktop */}
                            <div className="col-span-3 mx-auto hidden xl:flex justify-center">
                              <div className="flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-semibold shadow-sm">
                                <button
                                  className="bg-[#ffb81c] text-black rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 transition"
                                  onClick={() => decrement(item)}
                                >
                                  <LuMinus className="size-3" />
                                </button>
                                <span className="text-black px-2 text-sm min-w-[32px] text-center">
                                  <input
                                    type="number"
                                    readOnly
                                    value={String(item.squareMeter).padStart(2, '0')}
                                    className="max-w-[40px] text-center no-spinner bg-transparent text-black text-sm focus:outline-none"
                                  />
                                </span>
                                <button
                                  className="bg-[#ffb81c] text-black rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 transition"
                                  onClick={() => increment(item)}
                                >
                                  <LuPlus className="size-3" />
                                </button>
                              </div>
                            </div>

                            {/* Price Desktop */}
                            <div className="col-span-2 text-center hidden xl:block">
                              <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                <span className="font-currency font-normal text-[20px]"></span>
                                <span>{formatAED(item.price ?? 0)}</span>
                              </p>
                            </div>

                            {/* Action Desktop */}
                            <div className="col-span-2 hidden xl:flex justify-end gap-2 items-center">
                              <button
                                onClick={() => handleAddToCart(item, setItems)}
                                className="bg-[#ffc341] text-black font-semibold rounded-full text-[13px] 2xl:text-sm flex items-center px-4 py-2 hover:opacity-80 transition h-fit"
                              >
                                Add to Cart
                              </button>
                              <button
                                className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center h-fit"
                                onClick={() => handleRemoveItem(item, setItems as any, false)}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Desktop Installation */}
                          <div className="mt-2 xl:mt-4 hidden xl:block">
                            <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-lg flex items-center justify-between p-2 md:p-3 w-[85%]`}>
                              <div className="flex items-center gap-2 md:gap-3">
                                <input
                                  type="checkbox"
                                  checked={item.addInstallation || false}
                                  onChange={(e) => {
                                    if (e.target.checked) handleAddInstallation(item);
                                    else handleRemoveInstallation(item);
                                  }}
                                  className="w-4 h-4 md:w-5 md:h-5 accent-[#ffb81c] cursor-pointer"
                                />
                                <span className="font-semibold text-[15px]">Installation Charges</span>
                              </div>
                              <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-[#ffb81c] text-black'} font-bold rounded-full px-4 py-1.5 text-[14px] shadow-sm flex items-center gap-1 transition`}>
                                <span className="font-currency font-normal text-[18px]"></span>
                                <span>{formatAED(item.installationCost || (item.squareMeter * (item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25)))}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Installation */}
                      <div className="mt-4 block xl:hidden w-full">
                        <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-md flex items-center justify-between p-3 w-full`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={item.addInstallation || false}
                              onChange={(e) => {
                                if (e.target.checked) handleAddInstallation(item);
                                else handleRemoveInstallation(item);
                              }}
                              className="w-[18px] h-[18px] accent-[#ffb81c] cursor-pointer"
                            />
                            <span className="font-medium text-[15px] text-black">Installation<br />Charges</span>
                          </div>
                          <div className={`bg-[#ffb81c] text-black font-bold rounded-full px-4 py-1.5 text-[15px] flex items-center gap-1 transition`}>
                            <span className="font-currency font-normal text-[18px]"></span>
                            <span>{formatAED(item.installationCost || (item.squareMeter * (item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25)))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clearance Products */}
            {clearanceItems.length > 0 && (
              <div className="pr-1 md:pr-4 mt-7">
                <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                  <div className="w-[150px] shrink-0">Clearance Product</div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-12 w-full gap-4">
                      <div className="col-span-5"></div>
                      <div className="col-span-3 text-center">Bundle</div>
                      <div className="col-span-2 text-center">Total Price</div>
                      <div className="col-span-2 text-end">Action</div>
                    </div>
                  </div>
                </div>
                <div className="overflow-y-auto pr-2 custom-scrollbar">
                  {clearanceItems.map((item, cartindex) => (
                    <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                      
                      {/* Mobile Action */}
                      <div className="flex justify-end xl:hidden mb-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(item, setItems)}
                          className="bg-[#ffc341] text-black font-semibold rounded-full text-xs flex items-center px-3 py-1.5 hover:opacity-80 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-500 bg-[#f5f5f3] border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                          onClick={() => handleRemoveItem(item, setItems as any, false)}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="flex gap-3 md:gap-4 items-stretch relative">
                        <div className="w-[100px] md:w-[130px] xl:w-[150px] shrink-0 h-[100px] md:h-[130px] xl:h-[150px] relative rounded overflow-hidden">
                          <Image fill className="object-cover" src={item.image ?? '/default-image.png'} alt="clearance item" />
                        </div>

                        <div className="flex-grow flex flex-col justify-center">
                          <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                            <div className="col-span-12 xl:col-span-5">
                              <Link
                                href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                className="text-[15px] md:text-[16px] font-medium text-black hover:text-primary transition line-clamp-2"
                              >
                                {item.name}
                              </Link>

                              <div className="mt-2 text-sm">
                                <p className="text-gray-600">
                                  Price: <span className="font-currency font-normal"></span> <span className="font-semibold text-black">{item.unit === 'sqft' ? ((item.price ?? 0) / 10.764).toFixed(2) : (item.price ?? 0).toFixed(2)}</span>/{item.unit === 'sqft' ? 'ft²' : 'm²'}
                                </p>
                                <p className="block xl:hidden mt-1 text-gray-600">
                                  Bundle: <span className="font-semibold text-black">{Number((Number(item.boxCoverage) * Number(item.requiredBoxes ?? 0)).toFixed(2))}</span>{item.unit === 'sqft' ? ' ft²' : ' SQM'}
                                </p>
                              </div>
                            </div>

                            <div className="col-span-3 hidden xl:block text-center text-sm font-semibold text-black">
                              {Number((Number(item.boxCoverage) * Number(item.requiredBoxes ?? 0)).toFixed(2))}
                              {item.unit === 'sqft' ? ' ft²' : ' SQM'}
                            </div>

                            <div className="col-span-2 text-center hidden xl:block">
                              <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                <span className="font-currency font-normal text-[20px]"></span>
                                <span>{formatAED(item.price ?? 0)}</span>
                              </p>
                            </div>

                            <div className="col-span-2 hidden xl:flex justify-end gap-2 items-center">
                              <button
                                onClick={() => handleAddToCart(item, setItems)}
                                className="bg-[#ffc341] text-black font-semibold rounded-full text-[13px] 2xl:text-sm flex items-center px-4 py-2 hover:opacity-80 transition h-fit"
                              >
                                Add to Cart
                              </button>
                              <button
                                className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center h-fit"
                                onClick={() => handleRemoveItem(item, setItems as any, false)}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>

                          {item.addInstallation && (
                            <div className="mt-2 xl:mt-4 hidden xl:block">
                              <div className="border border-[#ffc341] rounded-lg flex items-center justify-between p-2 md:p-3 w-[85%]">
                                <div className="flex items-center gap-2 md:gap-3">
                                  <input type="checkbox" checked={true} onChange={() => handleRemoveInstallation(item)} className="w-4 h-4 md:w-5 md:h-5 accent-[#ffc341] cursor-pointer" />
                                  <span className="font-semibold text-xs md:text-sm xl:text-[15px]">Installation Charges</span>
                                </div>
                                <div className="bg-[#ffc341] text-black font-bold rounded-full px-3 py-1 text-xs md:text-[14px] shadow-sm flex items-center gap-1 transition">
                                  <span className="font-currency font-normal"></span>
                                  <span>{formatAED(item.installationCost)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.addInstallation && (
                        <div className="mt-4 block xl:hidden w-full">
                          <div className="border border-[#ffc341] rounded-md flex items-center justify-between p-3 w-full">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" checked={true} onChange={() => handleRemoveInstallation(item)} className="w-[18px] h-[18px] accent-[#ffc341] cursor-pointer" />
                              <span className="font-medium text-[15px] text-black">Installation<br />Charges</span>
                            </div>
                            <div className="bg-[#ffc341] text-black font-bold rounded-full px-4 py-1.5 text-[15px] flex items-center gap-1 transition">
                              <span className="font-currency font-normal text-[18px]"></span>
                              <span>{formatAED(item.installationCost)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessories */}
            {accessories.length > 0 && (
              <div className="pr-1 md:pr-4 mt-7">
                <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                  <div className="w-[150px] shrink-0">Accessories</div>
                  <div className="flex-grow">
                    <div className="grid grid-cols-12 w-full gap-4">
                      <div className="col-span-5"></div>
                      <div className="col-span-3 text-center">Qty Piece</div>
                      <div className="col-span-2 text-center">Unit price</div>
                      <div className="col-span-2 text-end">Action</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar">
                  {accessories.map((item, cartindex) => (
                    <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                      {/* Mobile Delete Button */}
                      <div className="flex justify-end xl:hidden mb-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(item, setItems)}
                          className="bg-[#ffc341] text-black font-semibold rounded-full text-xs flex items-center px-3 py-1.5 hover:opacity-80 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-500 bg-[#f5f5f3] border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                          onClick={() => handleRemoveItem(item, setItems as any, false)}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>

                      <div className="flex gap-3 md:gap-4 items-stretch relative">
                        {/* Image */}
                        <div className="w-[100px] md:w-[130px] xl:w-[150px] shrink-0 h-[100px] md:h-[130px] xl:h-[150px] relative rounded overflow-hidden">
                          <Image
                            fill
                            className="object-cover"
                            src={item?.matchedProductImages?.imageUrl ?? item.image ?? '/default-image.png'}
                            alt="accessory"
                          />
                        </div>

                        <div className="flex-grow flex flex-col justify-center">
                          <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                            <div className="col-span-12 xl:col-span-5">
                              <Link
                                href={`/accessories/${item.custom_url}`}
                                className="text-[15px] md:text-[16px] font-medium text-black hover:text-primary transition line-clamp-2"
                              >
                                {item.name}
                              </Link>

                              <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <p>
                                  Color: <span className="font-semibold text-black">{item?.selectedColor?.colorName || item?.selectedColor?.colorCode || ''}</span>
                                </p>
                              </div>

                              <div className="flex justify-between items-center mt-3 xl:hidden pr-2">
                                <div className="flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-bold">
                                  <button className="hover:opacity-80 text-black bg-[#ffb81c] rounded-full h-6 w-6 flex items-center justify-center transition" onClick={() => decrement(item)}>
                                    <LuMinus className="size-3" />
                                  </button>
                                  <span className="text-black text-[15px] px-2 min-w-[32px] text-center">
                                    <input type="number" readOnly value={String(item.requiredBoxes).padStart(2, '0')} className="max-w-[30px] text-center no-spinner bg-transparent text-black focus:outline-none" />
                                  </span>
                                  <button className="hover:opacity-80 text-black bg-[#ffb81c] rounded-full h-6 w-6 flex items-center justify-center transition" onClick={() => increment(item)}>
                                    <LuPlus className="size-3" />
                                  </button>
                                </div>
                                <p className="text-[16px] font-bold text-black flex items-center gap-1">
                                  <span className="font-currency font-normal text-[20px]"></span>
                                  <span>{formatAED(item.price ?? 0)}</span>
                                </p>
                              </div>
                            </div>

                            <div className="col-span-3 hidden xl:flex justify-center">
                              <div className="flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-semibold shadow-sm">
                                <button className="bg-[#ffb81c] text-black rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 transition" onClick={() => decrement(item)}>
                                  <LuMinus className="size-3" />
                                </button>
                                <span className="text-black px-2 text-sm min-w-[32px] text-center">
                                  <input type="number" readOnly value={String(item.requiredBoxes).padStart(2, '0')} className="max-w-[40px] text-center no-spinner bg-transparent text-black text-sm focus:outline-none" />
                                </span>
                                <button className="bg-[#ffb81c] text-black rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 transition" onClick={() => increment(item)}>
                                  <LuPlus className="size-3" />
                                </button>
                              </div>
                            </div>

                            <div className="col-span-2 text-center hidden xl:block">
                              <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                <span className="font-currency text-lg font-normal"></span>{' '}
                                <span>{formatAED(item.price ?? 0)}</span>
                              </p>
                            </div>

                            <div className="col-span-2 hidden xl:flex justify-end gap-2 items-center">
                              <button
                                onClick={() => handleAddToCart(item, setItems)}
                                className="bg-[#ffc341] text-black font-semibold rounded-full text-[13px] 2xl:text-sm flex items-center px-4 py-2 hover:opacity-80 transition h-fit"
                              >
                                Add to Cart
                              </button>
                              <button
                                className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center h-fit"
                                onClick={() => handleRemoveItem(item, setItems as any, false)}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </Container>
    </>
  );
};

export default WishlistPage;
