import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { IoIosClose } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { TbShoppingBag } from 'react-icons/tb';
import { ICart } from 'types/prod';
import { showAlert } from 'utils/Alert';
import { formatAED } from 'utils/helperFunctions';
import {
  getCart,
  removeCartItem,
  removeWishlistItem,
  removeFreeSample,
  getWishlist,
  getFreeSamples
} from 'utils/indexedDB';

interface DropdownPanelProps {
  icon: ReactNode;
  badgeCount?: number;
  panelClassName?: string;
  cartItems: ICart[];
  type: 'cart' | 'wishlist' | 'freeSample';
  viewLink?: string;
  emptyMessage?: string;
}

const DropdownPanel: React.FC<DropdownPanelProps> = ({
  icon,
  badgeCount = 0,
  panelClassName = '',
  cartItems,
  type,
  viewLink = '/cart',
  emptyMessage = 'Cart is empty'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localItems, setLocalItems] = useState<ICart[]>(cartItems);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen && !isHovered) {
      // Start auto-close timer
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    }

    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen, isHovered]);
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const isCartPage = pathname === '/cart';
      const isWishlistPage = pathname === '/wishlist';
      const isFreeSamplePage = pathname === '/freesample';
      const isThankYouPage = pathname === '/thank-you';
      if (
        (type === 'cart' && isThankYouPage) ||
        (type === 'freeSample' && isThankYouPage)
      ) {
        return;
      }
      if (isFreeSamplePage && type === 'cart') {
        setIsOpen(true);
      } else if (!isFreeSamplePage) {
        const shouldShowPanel =
          (type === 'cart' && !isCartPage) ||
          (type === 'wishlist' && !isWishlistPage) ||
          (type === 'freeSample' && !isWishlistPage);

        if (shouldShowPanel) {
          setIsOpen(true);
        }
      }
    };

    window.addEventListener(`${type}Updated`, handleUpdate);
    return () => {
      window.removeEventListener(`${type}Updated`, handleUpdate);
    };
  }, [type, pathname]);

  useEffect(() => {
    const fetchItems = async () => {
      let updatedItems: ICart[] = [];

      if (type === 'cart') {
        updatedItems = (await getCart()) || [];
      } else if (type === 'wishlist') {
        updatedItems = (await getWishlist()) || [];
      } else if (type === 'freeSample') {
        updatedItems = (await getFreeSamples()) || [];
      }
      setLocalItems(updatedItems);
    };
    fetchItems();
    const handleUpdate = () => {
      fetchItems();
    };
    window.addEventListener(`${type}Updated`, handleUpdate);
    return () => {
      window.removeEventListener(`${type}Updated`, handleUpdate);
    };
  }, [type, isOpen]);

  const closePanel = () => {
    setIsOpen(false);
  };

  const handleRemoveItem = async (product: ICart, isFreeSample: boolean) => {
    const compositeKey =
      product.category?.toLowerCase().trim() === 'accessories'
        ? `${product.id}-${product.selectedColor?.color}`
        : product.isClearance && product.addInstallation
          ? `${product.id}-clearance-installation`
          : product.isClearance
            ? `${product.id}-clearance`
            : product.addInstallation
              ? `${product.id}-installation`
              : `${product.id}`;
    try {
      if (type === 'freeSample' && isFreeSample) {
        await removeFreeSample(compositeKey);
      } else if (type === 'cart') {
        await removeCartItem(compositeKey);
      } else if (type === 'wishlist') {
        await removeWishlistItem(compositeKey);
      }
      setLocalItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.id === product.id &&
              item.selectedColor?.color === product.selectedColor?.color &&
              item.isfreeSample === isFreeSample
            )
        )
      );
      window.dispatchEvent(new Event(`${type}Updated`));
    } catch {
      showAlert({
        title: `Error removing item from ${type}`,
        icon: 'error'
      });
    }
  };

  // const updateQuantity = useCallback(
  //   async (product: ICart, change: number) => {
  //     try {
  //       const compositeKey =
  //         product.category?.toLowerCase().trim() === 'accessories'
  //           ? `${product.id}-${product.selectedColor?.color}`
  //           : product.addInstallation
  //             ? `${product.id}-installation`
  //             : `${product.id}`;
  //       const item = localItems.find(
  //         (item) =>
  //           item.id === product.id &&
  //           item.selectedColor?.color === product.selectedColor?.color &&
  //           item.addInstallation === product.addInstallation
  //       );
  //       if (!item)
  //         return showAlert({
  //           title: 'Item not found.',
  //           icon: 'error'
  //         });
  //       const newQty = (item.requiredBoxes || 0) + change;
  //       if (newQty < 1)
  //         return showAlert({
  //           title: 'Minimum quantity is 1 box.',
  //           icon: 'error'
  //         });
  //       if (newQty > item.stock)
  //         return showAlert({
  //           title: `Max ${item.stock} boxes allowed.`,
  //           icon: 'error'
  //         });
  //       let newInstallationCost;
  //       if (item.addInstallation) {
  //         const installationRate = item?.name
  //           .toLowerCase()
  //           ?.includes('herringbone')
  //           ? 35
  //           : 25;
  //         newInstallationCost =
  //           Number(item.boxCoverage) * newQty * installationRate;
  //       }

  //       const updatedItem = {
  //         ...item,
  //         requiredBoxes: newQty,
  //         totalPrice: item.pricePerBox * newQty,
  //         squareMeter: Number(item.boxCoverage) * newQty,
  //         installationCost: newInstallationCost
  //       };

  //       const db = await openDB();
  //       const tx = db.transaction(type, 'readwrite');
  //       await tx.objectStore(type).put(updatedItem, compositeKey);

  //       setLocalItems((prev) =>
  //         prev.map((cartItem) =>
  //           cartItem.id === product.id &&
  //           cartItem.selectedColor?.color === product.selectedColor?.color
  //             ? updatedItem
  //             : cartItem
  //         )
  //       );

  //       window.dispatchEvent(new Event(`${type}Updated`));
  //     } catch {
  //       showAlert({
  //         title: `Failed to update ${type}`,
  //         icon: 'error'
  //       });
  //     }
  //   },
  //   [localItems, type]
  // );

  // const increment = (item: ICart) => updateQuantity(item, 1);
  // const decrement = (item: ICart) => updateQuantity(item, -1);

  const totalAmount = localItems.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );
  return (
    <div className="relative group">
      <div
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex_center h-7 p-1 text-white lg:text-black hover:text-white fill-white focus:bg-white focus:fill-black lg:fill-black lg:hover:bg-primary lg:hover:fill-white cursor-pointer"
      >
        {badgeCount > 0 && (
          <span className="absolute flex_center bg-white lg:bg-primary h-3 sm:h-4 text-black lg:text-white text-10 sm:text-xs w-3 sm:w-4 right-[2px] sm:-right-1 -top-1 font-semibold">
            {badgeCount}
          </span>
        )}
        {icon}
      </div>

      {isOpen && (
        <div
          ref={panelRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed lg:absolute right-2 sm:right-5 lg:right-0  top-10 z-[999] bg-white shadow-lg rounded-lg border border-gray-200 ${panelClassName}`}
        >
          {localItems.length > 0 ? (
            <div className="p-2 sm:w-96">
              <div className="flex_between mb-2">
                <p className="font-bold text-md-h6">{type.toUpperCase()}</p>
                <IoIosClose
                  size={30}
                  onClick={closePanel}
                  className="cursor-pointer"
                />
              </div>

              <div className="max-h-52 border w-[280px] sm:w-full border-slate-100 overflow-y-auto p-1 custom-scrollbar">
                {localItems.length > 0 ? (
                  localItems.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-3 bg-white shadow-sm mb-2"
                    >
                      <div className="flex gap-3">
                        <div className="relative">
                          <div className="bg-gray-100 p-1 rounded-md">
                            <Image
                              width={80}
                              height={80}
                              src={
                                item.image ||
                                item.matchedProductImages?.imageUrl ||
                                '/default-image.png'
                              }
                              alt={item.name}
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveItem(item, item.isfreeSample || false)
                            }
                            className="absolute -top-2 -right-2 bg-white shadow h-4 w-4 rounded-full flex_center text-xs"
                          >
                            <IoCloseSharp size={10} />
                          </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-between text-start">
                          <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                            {item.name}
                          </h2>
                          {item.category?.toLowerCase().trim() ===
                            'accessories' && (
                              <p className="sm:text-xs mt-1">
                                Color: {item.selectedColor?.colorName}
                              </p>
                            )}
                          {item.isfreeSample ? (
                            'free'
                          ) : (
                            <p className="sm:text-xs mt-1">
                              {item.category?.toLowerCase().trim() ===
                                'accessories'
                                ? 'Piece Price:'
                                : 'Price:'}{' '}
                              <span className="font-currency font-normal text-17">
                                
                              </span>{' '}
                              <span>
                                {(item.price ?? 0).toFixed(2)}
                              </span>
                              {item.category?.toLowerCase().trim() ===
                                'accessories' ? '' :
                                <>
                                  /m
                                  <sup>2</sup>
                                </>
                              }
                            </p>
                          )}
                          {item.isClearance || item.isfreeSample ? null : item.category?.toLowerCase().trim() ===
                            'accessories' ? (
                            <p className="sm:text-xs mt-1">
                              No. of Pieces: {item.requiredBoxes.toFixed(0)}
                            </p>
                          ) : (
                            <p className="sm:text-xs mt-1">
                              Area: {item.squareMeter.toFixed(2)} SQM
                            </p>
                          )}
                          {item.isClearance ? (
                            <p className="sm:text-xs mt-1">
                              Bundle:{' '}
                              {(
                                item.requiredBoxes * Number(item.boxCoverage)
                              ).toFixed(2)}{' '}
                              SQM
                            </p>
                          ) : (
                            !item.isfreeSample &&
                            type === 'cart' && (
                              // <div className="flex items-center border w-28 h-8 justify-between px-2 mt-2">
                              //   <button
                              //     onClick={() => decrement(item)}
                              //     className="px-1 hover:text-black"
                              //   >
                              //     <LuMinus />
                              //   </button>
                              //   <span className="text-purple px-1">
                              //     {item.requiredBoxes}
                              //   </span>
                              //   <button
                              //     onClick={() => increment(item)}
                              //     className="px-1 hover:text-black"
                              //   >
                              //     <LuPlus />
                              //   </button>
                              // </div>
                              ''
                            )
                          )}
                          {item.category?.toLowerCase().trim() ===
                            'accessories' ? (
                            ''
                          ) : item.addInstallation ? (
                            <p className="sm:text-xs mt-1">
                              Installation Cost:{' '}
                              <span className="font-semibold">
                                <span className="font-currency text-20 sm:text-sm font-normal">
                                  
                                </span>{' '}
                                {formatAED(item.installationCost)}
                              </span>
                            </p>
                          ) : (
                            <p className="sm:text-xs mt-1">
                              Installation:{' '}
                              <span className="font-semibold">
                                Not Included
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      {type === 'cart' && (
                        <div className="flex_between mt-2">
                          <span className="text-sm font-semibold">Total:</span>
                          {item.isfreeSample ? (
                            'free'
                          ) : (
                            <span className="text-sm">
                              <span className="font-currency text-18 font-normal">
                                
                              </span>{' '}
                              {formatAED(item.totalPrice) || '0.00'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="font-bold p-4 text-start">{emptyMessage}</p>
                )}
              </div>

              <div className="text-end mt-2 mb-2 font-bold">
                {type === 'cart' && (
                  <p>
                    Total:{' '}
                    <span className="font-currency text-20 font-normal"></span>{' '}
                    {formatAED(totalAmount)}
                  </p>
                )}
              </div>

              <div className="w-full mt-2 space-y-1">
                <Link
                  href={viewLink}
                  onClick={closePanel}
                  className="w-full block text-center bg-primary hover:bg-secondary text-white py-1"
                >
                  View{' '}
                  {type === 'cart'
                    ? 'Cart'
                    : type === 'wishlist'
                      ? 'Wishlist'
                      : 'Free Samples'}
                </Link>

                <div className="border text-center w-full border-secondary hover:bg-secondary hover:text-white transition duration-300 py-1">
                  <Link
                    href="/collections"
                    onClick={closePanel}
                    className=" text-center  px-4 py-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 sm:w-96 py-10 text-center flex_center flex-col space-y-4">
              <TbShoppingBag size={50} />
              <p className="text-center text-black capitalize text-20 font-semibold">
                {emptyMessage}
              </p>
              <div className="flex justify-center mt-2">
                <Link
                  href="/collections"
                  onClick={closePanel}
                  className="bg-primary hover:bg-secondary text-white px-4 py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      )
      }
    </div >
  );
};

export default DropdownPanel;
