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
                          className="text-gray-500 hover:text-red-500 bg-[#FEB9071F] rounded-full transition flex items-center justify-center"
                          onClick={() => handleRemoveItem(item, setItems as any, false)}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12"/>
                          <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778"/>
                          <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515"/>
                          <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515"/>
                          <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515"/>
                          <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515"/>
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
                                className="bg-[#FEB9071F] hover:bg-red-50  hover:text-red-500 rounded-full transition flex items-center justify-center h-fit"
                                onClick={() => handleRemoveItem(item, setItems as any, false)}
                              >
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12"/>
                                <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778"/>
                                <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515"/>
                                <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515"/>
                                <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515"/>
                                <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515"/>
                                </svg>

                              </button>
                            </div>
                          </div>

                          {/* Desktop Installation */}
                          <div className="mt-2 xl:mt-4 hidden xl:block">
                            <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-lg flex items-center justify-between p-2 md:p-3`}>
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
                              <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-gray-200 text-black'} font-bold rounded-full px-4 py-1.5 text-[14px] shadow-sm flex items-center gap-1 transition`}>
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
                          <div className="bg-[#ffb81c] text-black font-bold rounded-full px-4 py-1.5 text-[15px] flex items-center gap-1 transition">
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
                          className="text-gray-500 hover:text-red-500 bg-[#FEB9071F] rounded-full transition flex items-center justify-center"
                          onClick={() => handleRemoveItem(item, setItems as any, false)}
                        >
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12"/>
                        <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778"/>
                        <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515"/>
                        <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515"/>
                        <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515"/>
                        <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515"/>
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
                                  <input type="checkbox" checked onChange={() => handleRemoveInstallation(item)} className="w-4 h-4 md:w-5 md:h-5 accent-[#ffc341] cursor-pointer" />
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
                              <input type="checkbox" checked onChange={() => handleRemoveInstallation(item)} className="w-[18px] h-[18px] accent-[#ffc341] cursor-pointer" />
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
