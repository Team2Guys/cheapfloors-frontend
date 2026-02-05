'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMinus } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';
import {
  handleAddToCart,
  handleRemoveItem,
  updateQuantity
} from 'utils/cartutils';
import { ProductTableProps } from 'types/type';
import { generateSlug } from 'data/data';

const ProductTable: React.FC<ProductTableProps> = ({
  columns,
  isSamplePage = false,
  items = [],
  setItems,
  isClearance
}) => {
  const pathname = usePathname();
  return (
    <div
      className={`overflow-x-auto px-4 font-inter ${!isSamplePage ? 'max-h-[950px] overflow-y-auto' : ''}`}
    >
      {items.length === 0 && pathname === '/freesample' ? (
        <div className="text-center">
          <p className="text-center text-[24px] ">
            {isSamplePage ? 'Free Sample list is empty' : 'Wishlist is empty'}
          </p>
          <Link
            href="/collections"
            className="text-center text-[18px] bg-primary p-2 flex w-fit mx-auto items-center text-white gap-2 mt-4"
          >
            <FaArrowLeftLong /> Go Back to Shop
          </Link>
        </div>
      ) : (
        <table className="min-w-full border-b border-gray-300 bg-white">
          <thead>
            <tr className="text-xs font-semibold text-left border-b">
              {(columns ?? [])
                .filter((col) =>
                  pathname === '/freesample' ? col !== 'QTY (m/m²)' : true
                )
                .map((col, index) => (
                  <th
                    key={index}
                    className={`${isSamplePage ? 'xl:text-16 2xl:text-18 p-2 text-left whitespace-nowrap ' : 'md:text-xs md:text-nowrap lg:text-sm xl:text-18 2xl:text-24 p-3 md:p-2 lg:p-3 2xl:p-4 justify-start text-left '} ${index == 0 ? ' w-[70%] lg:w-[60%] 2xl:w-[35%] 3xl:w-[35%]' : 'w-[20%] lg:w-[20%] 2xl:w-[22%] 3xl:w-[25%]'} ${index == 3 ? 'text-center' : ''} ${index == 4 ? 'text-center' : ''} ${pathname === '/freesample' && col == 'Stock Status' ? 'text-center' : ''}`}
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {items.map((product, index) => {
              return (
                <tr key={index} className="border-t w-full">
                  <td
                    className={`${isSamplePage ? 'p-2 xl:min-w-[400px]' : 'p-3 '} flex items-center justify-start gap-3`}
                  >
                    <Image
                      height={64}
                      width={64}
                      src={
                        product.image ||
                        product.matchedProductImages.imageUrl ||
                        '/assets/images/default.png'
                      }
                      alt={product.name}
                      className={`${isSamplePage ? 'lg:h-[80px] lg:w-[80px] 2xl:h-[100px] 2xl:w-[100px]' : 'lg:h-[100px] lg:w-[100px] 2xl:h-[151px] 2xl:w-[194px]'} object-cover`}
                    />
                    <div className="font-normal w-10/12 space-y-1">
                      <Link
                        href={`${product.category?.toLowerCase().trim() === 'accessories' ? `/accessories` : `/${generateSlug(product.category)}/${generateSlug(product.subcategories)}`}/${product.custom_url}`}
                        className={`font-medium ${isSamplePage ? 'text-xs xl:text-16' : 'text-xs xl:text-18'}`}
                      >
                        {product.name}
                      </Link>
                      {!isSamplePage ? (
                        product.category?.toLowerCase().trim() ===
                        'accessories' ? (
                          <>
                            <p className="max-sm:text-xs">
                              Price Per Piece:{' '}
                              <span className="font-semibold">
                                <span className="font-currency font-normal text-lg">
                                  
                                </span>{' '}
                                {product.price}
                              </span>
                            </p>
                            <p className="max-sm:text-xs">
                              No. of Pieces:{' '}
                              <span className="font-semibold">
                                {product.requiredBoxes}
                              </span>
                            </p>
                            {product.selectedColor && (
                              <p className="max-sm:text-xs">
                                Color:{' '}
                                <span className="font-bold">
                                  {product.selectedColor.colorName}
                                </span>
                              </p>
                            )}
                          </>
                        ) : product.addInstallation ? (
                          <p className="text-[14px]">
                            Installation Cost:{' '}
                            <span className="font-semibold">
                              {product.installationCost.toFixed(2)}
                            </span>
                          </p>
                        ) : (
                          <p className="text-[14px]">
                            Installation:{' '}
                            <span className="font-semibold">Not Included</span>
                          </p>
                        )
                      ) : (
                        <p className="text-xs xl:text-16">Free Sample</p>
                      )}
                    </div>
                  </td>

                  {!isClearance ? (
                    pathname !== '/freesample' && (
                      <td className="p-3">
                        <div className="flex flex-col">
                          <div className="flex_center text-xs xl:text-20 bg-gray-200 px-3 py-2 w-fit">
                            <button
                              onClick={() =>
                                setItems?.((prevItems) =>
                                  updateQuantity(product, -1, prevItems)
                                )
                              }
                              className="px-2 text-gray-700"
                            >
                              <FiMinus />
                            </button>
                            <span className="px-2 text-black font-semibold">
                              {product.category?.toLowerCase().trim() ===
                              'accessories'
                                ? product.requiredBoxes
                                : product.squareMeter === 0
                                  ? '0.00'
                                  : product.squareMeter.toFixed(2)}
                            </span>
                            <button
                              onClick={() =>
                                setItems?.((prevItems) =>
                                  updateQuantity(product, 1, prevItems)
                                )
                              }
                              className="px-2 text-gray-700"
                            >
                              <GoPlus />
                            </button>
                          </div>
                        </div>
                      </td>
                    )
                  ) : (
                    <td className="p-3">
                      <p className="max-sm:text-xs">
                        {product.squareMeter.toFixed(2)}{' '}
                        {product.unit === 'sqft' ? 'ft²' : 'SQM'}
                      </p>
                    </td>
                  )}

                  <td
                    className={`text-start ${isSamplePage ? 'text-xs xl:text-16 p-2' : 'text-xs xl:text-20 p-3'} font-normal`}
                  >
                    {pathname === '/freesample'
                      ? 'Free'
                      : product.totalPrice.toFixed(2)}
                  </td>
                  <td
                    className={`text-center ${isSamplePage ? 'text-xs xl:text-16 p-2' : 'text-xs xl:text-20 p-3'} font-normal`}
                  >
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </td>
                  <td className={`${isSamplePage ? 'p-2' : 'p-3'}`}>
                    <div className="flex gap-4 lg:gap-6 xl:gap-10 items-center justify-center">
                      {!isSamplePage && (
                        <button
                          id="AddToCart"
                          onClick={() =>
                            handleAddToCart(product, setItems ?? (() => {}))
                          }
                          className="bg-black text-white text-10 xl:text-20 2xl:text-24 flex gap-2 items-center whitespace-nowrap px-4 py-2"
                        >
                          Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleRemoveItem(
                            product,
                            setItems ?? (() => {}),
                            isSamplePage
                          )
                        }
                        className={`${isSamplePage ? 'h-5 w-5 lg:h-6 lg:w-6 xl:w-7 xl:h-7' : 'h-5 w-5 lg:h-7 lg:w-7 xl:h-10 xl:w-10'}`}
                      >
                        <Image
                          src="/assets/images/Wishlist/close.svg"
                          alt="Remove"
                          height={100}
                          width={100}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div
        className={`flex items-center ${isSamplePage ? 'justify-between' : 'justify-start'}`}
      >
        <Link
          href="/collections"
          className="bg-black text-white px-4 py-2 gap-2 justify-center items-center w-fit mt-5 hidden md:flex"
        >
          <FaArrowLeftLong /> Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default ProductTable;
