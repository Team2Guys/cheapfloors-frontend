'use client';
import Container from 'components/common/container/Container';
import PaymentMethod from 'components/product-detail/payment';
import { paymentcard } from 'data/cart';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { LuMinus, LuPlus } from 'react-icons/lu';
import CartSelect from './cart-select';
import { getCart, openDB, removeCartItem } from 'utils/indexedDB';
import { ICart, IProduct } from 'types/prod';
import RelatedSlider from 'components/related-slider/related-slider';
import lightImg from '../../../public/assets/icons/light1(traced).png';
import deliveryImg from '../../../public/assets/icons/delivery-truck 2 (traced).png';
import locationImg from '../../../public/assets/icons/location 1 (traced).png';
import { emirates, generateSlug } from 'data/data';
import Accordion from 'components/ui/accordion';
import { showAlert } from 'utils/Alert';
import { formatAED } from 'utils/helperFunctions';
interface CartPageProps {
  products: IProduct[];
}
const CartPage = ({ products }: CartPageProps) => {
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Enter Emirate');
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<ICart[]>([]);
  const [selectedFee, setSelectedFee] = useState(0);
  const nonAccessoryItems = cartItems.filter(
    (item) =>
      item.category?.toLowerCase().trim() !== 'accessories' &&
      item.category !== 'Accessory' &&
      !item.isClearance
  );
  const accessoryItems = cartItems.filter(
    (item) =>
      (item.category?.toLowerCase().trim() === 'accessories' ||
        item.category === 'Accessory') &&
      !item.isClearance
  );
  const clearanceItems = cartItems.filter((item) => item.isClearance);
  const [shipping, setShipping] = useState<
    | {
        name: string;
        fee: number;
        deliveryDuration: string;
        freeShipping?: number;
      }
    | undefined
  >(undefined);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    'Shipping Options'
  );

  const handleToggle = (label: string) => {
    setOpenAccordion((prev) => (prev === label ? null : label));
  };
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCart();
        const subTotalPrice = items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );

        setSubTotal(subTotalPrice);
        setCartItems(items);
      } catch {
        showAlert({
          title: 'Error fetching cart items',
          icon: 'error'
        });
      }
    };

    fetchCartItems();
    const handleCartUpdate = () => fetchCartItems();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleRemoveItem = async (product: ICart) => {
    try {
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
      await removeCartItem(compositeKey);
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.id === product.id &&
              item.selectedColor?.color === product.selectedColor?.color
            )
        )
      );

      window.dispatchEvent(new Event('cartUpdated'));
    } catch {
      showAlert({
        title: `Error removing item from cart.`,
        icon: 'error'
      });
    }
  };

  useEffect(() => {
    const subTotalPrice = cartItems.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    setSubTotal(subTotalPrice);

    // Recalculate shipping and total whenever cart items change
    const fee = calculateShippingFee(
      subTotalPrice,
      selectedShipping,
      selectedCity
    );
    setSelectedFee(fee);

    const totalBeforeTax = subTotalPrice + fee;
    setTotal(totalBeforeTax);
  }, [cartItems]);

  const updateQuantity = async (product: ICart, change: number) => {
    try {
      const item = cartItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor?.color === product.selectedColor?.color &&
          item.addInstallation === product.addInstallation
      );
      if (!item) {
        showAlert({
          title: 'Item not found in cart.',
          icon: 'error'
        });
        return;
      }

      // 🔍 Count TOTAL SQM already in cart for THIS product
      let sqmInCart;
      if (product.category?.toLowerCase().trim() === 'accessories') {
        sqmInCart = cartItems
          .filter(
            (item) =>
              item.id === product.id &&
              item.selectedColor?.color === product.selectedColor?.color
          )
          .reduce((sum, item) => {
            return sum + item.requiredBoxes;
          }, 0);
      } else {
        sqmInCart = cartItems
          .filter((item) => item.id === product.id)
          .reduce((sum, item) => {
            return sum + item.squareMeter;
          }, 0);
      }
      const sqmAlreadyInCart =
        sqmInCart -
        (product.category?.toLowerCase().trim() === 'accessories'
          ? product.requiredBoxes
          : product.squareMeter);

      // 🔢 SQM requested for the NEW addition
      let newSQMRequired;

      if (product.category?.toLowerCase().trim() === 'accessories') {
        newSQMRequired = (item.requiredBoxes || 0) + change;
      } else {
        newSQMRequired = (item.squareMeter || 0) + change; // quantity = sqm requested
      }

      // 📦 Total available SQM from stock
      const totalAvailableSQM =
        product.stock *
        (product.category?.toLowerCase().trim() === 'accessories'
          ? 1
          : Number(product.boxCoverage) || 1);

      // 📉 Remaining SQM
      const remainingSQM = totalAvailableSQM - sqmAlreadyInCart;

      // ❗ FINAL STOCK CHECK (SQM-based)
      if (newSQMRequired > remainingSQM) {
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return false;
      }
      if (
        (product.category?.toLowerCase().trim() === 'accessories'
          ? item.requiredBoxes || 0
          : item.squareMeter || 0) +
          change >
        totalAvailableSQM
      ) {
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return;
      }

      const compositeKey =
        item.category?.toLowerCase().trim() === 'accessories'
          ? `${item.id}-${item.selectedColor?.color}`
          : item.addInstallation
            ? `${item.id}-installation`
            : `${item.id}`;
      const newSquareMeter = (item.squareMeter || 0) + change;
      const newRequiredBoxes =
        product.category?.toLowerCase().trim() === 'accessories'
          ? (item.requiredBoxes || 0) + change
          : Math.ceil(newSquareMeter / Number(item.boxCoverage));
      if (
        product.category?.toLowerCase().trim() === 'accessories'
          ? newRequiredBoxes < 1
          : newSquareMeter < 1
      ) {
        showAlert({
          title: `Minimum quantity is 1  ${product.category?.toLowerCase().trim() === 'accessories' ? 'Peice' : 'SQM'}.`,
          icon: 'error'
        });
        return;
      }
      if (newRequiredBoxes > item.stock) {
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return;
      }
      let newInstallationCost = 0;
      if (item.addInstallation) {
        const installationRate = item?.name
          .toLowerCase()
          ?.includes('herringbone')
          ? 35
          : 25;
        newInstallationCost = newSquareMeter * installationRate;
      }

      const newTotalPrice =
        (item.price || 0) *
        (product.category?.toLowerCase().trim() === 'accessories'
          ? newRequiredBoxes
          : newSquareMeter);

      const updatedItem = {
        ...item,
        requiredBoxes: newRequiredBoxes,
        squareMeter: newSquareMeter,
        totalPrice: newTotalPrice + newInstallationCost,
        selectedFee: selectedFee,
        selectedCity: selectedCity,
        shippingMethod: shipping,
        installationCost: newInstallationCost
      };

      const db = await openDB();
      const tx = db.transaction('cart', 'readwrite');
      const store = tx.objectStore('cart');
      await new Promise<void>((resolve, reject) => {
        const request = store.put(updatedItem, compositeKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      setCartItems((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === product.id &&
          cartItem.selectedColor?.color === product.selectedColor?.color &&
          cartItem.addInstallation === product.addInstallation
            ? {
                ...cartItem,
                requiredBoxes: newRequiredBoxes,
                squareMeter: newSquareMeter,
                totalPrice: newTotalPrice + newInstallationCost,
                installationCost: newInstallationCost
              }
            : cartItem
        )
      );

      // Dispatch event for cart update
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      showAlert({
        title: 'Failed to update item quantity.',
        icon: 'error'
      });
      throw error;
    }
  };

  const increment = (product: ICart) => updateQuantity(product, 1);
  const decrement = (product: ICart) => updateQuantity(product, -1);

  useEffect(() => {
    handleShippingSelect('standard');
  }, []);

  const handleQunatity = async (
    e: ChangeEvent<HTMLInputElement>,
    product: ICart
  ) => {
    try {
      e.preventDefault();
      const quantity = Number(e.target.value);
      const item = cartItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor?.color === product.selectedColor?.color &&
          item.addInstallation === product.addInstallation
      );
      if (!item) {
        showAlert({
          title: 'Item not found in cart.',
          icon: 'error'
        });
        return;
      }

      // 🔍 Count TOTAL SQM already in cart for THIS product
      let sqmInCart;
      if (product.category?.toLowerCase().trim() === 'accessories') {
        sqmInCart = cartItems
          .filter(
            (item) =>
              item.id === product.id &&
              item.selectedColor?.color === product.selectedColor?.color
          )
          .reduce((sum, item) => {
            return sum + item.requiredBoxes;
          }, 0);
      } else {
        sqmInCart = cartItems
          .filter((item) => item.id === product.id)
          .reduce((sum, item) => {
            return sum + item.squareMeter;
          }, 0);
      }
      const sqmAlreadyInCart =
        sqmInCart -
        (product.category?.toLowerCase().trim() === 'accessories'
          ? product.requiredBoxes
          : product.squareMeter);

      // 🔢 SQM requested for the NEW addition
      const newSQMRequired = quantity;

      // 📦 Total available SQM from stock
      const totalAvailableSQM =
        product.stock *
        (product.category?.toLowerCase().trim() === 'accessories'
          ? 1
          : Number(product.boxCoverage) || 1);

      // 📉 Remaining SQM
      const remainingSQM = totalAvailableSQM - sqmAlreadyInCart;

      // ❗ FINAL STOCK CHECK (SQM-based)
      if (newSQMRequired > remainingSQM) {
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return false;
      }
      if (quantity > totalAvailableSQM) {
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${totalAvailableSQM} Peices` : `${totalAvailableSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return;
      }

      const newRequiredBoxes =
        product.category?.toLowerCase().trim() === 'accessories'
          ? quantity
          : Math.ceil(quantity / Number(product.boxCoverage));
      if (quantity < 1) {
        showAlert({
          title: `Minimum quantity is 1  ${product.category?.toLowerCase().trim() === 'accessories' ? 'Peice' : 'SQM'}.`,
          icon: 'error'
        });
        return;
      }
      if (newRequiredBoxes > product.stock) {
        // const remainingSQM = product.stock * Number(product.boxCoverage);
        showAlert({
          title: `Cannot add more than ${product.category?.toLowerCase().trim() === 'accessories' ? `${totalAvailableSQM} Peices` : `${totalAvailableSQM.toFixed(2)} SQM`}.`,
          icon: 'error'
        });
        return;
      }
      let newInstallationCost = 0;
      if (product.addInstallation) {
        const installationRate = product?.name
          .toLowerCase()
          ?.includes('herringbone')
          ? 35
          : 25;
        newInstallationCost = quantity * installationRate;
      }

      const newTotalPrice = (product.price || 0) * quantity;
      const compositeKey =
        product.category?.toLowerCase().trim() === 'accessories'
          ? `${product.id}-${product.selectedColor?.color}`
          : product.addInstallation
            ? `${product.id}-installation`
            : `${product.id}`;

      const updatedItem = {
        ...item,
        requiredBoxes: newRequiredBoxes,
        squareMeter: quantity,
        totalPrice: newTotalPrice + newInstallationCost,
        selectedFee: selectedFee,
        selectedCity: selectedCity,
        shippingMethod: shipping,
        installationCost: newInstallationCost
      };

      setCartItems((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === product.id &&
          cartItem.selectedColor?.color === product.selectedColor?.color &&
          cartItem.addInstallation === product.addInstallation
            ? {
                ...cartItem,
                requiredBoxes: newRequiredBoxes,
                squareMeter: quantity,
                totalPrice: newTotalPrice + newInstallationCost,
                installationCost: newInstallationCost
              }
            : cartItem
        )
      );

      const db = await openDB();
      const tx = db.transaction('cart', 'readwrite');
      const store = tx.objectStore('cart');
      await new Promise<void>((resolve, reject) => {
        const request = store.put(updatedItem, compositeKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      showAlert({
        title: 'Failed to update item quantity.',
        icon: 'error'
      });
      throw error;
    }
  };

  const calculateShippingFee = (
    subtotal: number,
    shippingType: string | null,
    selectedCity: string
  ): number => {
    if (selectedCity !== 'Enter Emirate') {
      if (shippingType === 'express') {
        return 150;
      }
      if (shippingType === 'self-collect') {
        return 0;
      }
      if (selectedCity === 'Dubai') {
        if (shippingType === 'express') {
          return 150;
        } else if (shippingType === 'standard') {
          return 0;
        }
      } else {
        if (subtotal >= 2000) {
          return 0;
        } else {
          return 200;
        }
      }
    }
    return 0;
  };

  const handleStateSelect = (state: string) => {
    setSelectedCity(state);
    localStorage.setItem('selectedEmirate', JSON.stringify(state));

    // If not Dubai, force standard shipping
    const shippingType = state === 'Dubai' ? selectedShipping : 'standard';
    if (state !== 'Dubai') {
      setSelectedShipping('standard');
    }

    const fee = calculateShippingFee(subTotal, shippingType, state);
    setSelectedFee(fee);

    const totalBeforeTax = subTotal + fee;
    setTotal(totalBeforeTax);
  };

  const handleShippingSelect = (type: string) => {
    setSelectedShipping(type);
    localStorage.setItem('selectedShipping', type);

    if (type === 'self-collect') {
      // Save previous city before overriding
      setSelectedCity('Dubai');
      localStorage.setItem('selectedEmirate', JSON.stringify('Dubai'));

      const fee = calculateShippingFee(subTotal, type, 'Dubai');
      setSelectedFee(fee);
      setTotal(subTotal + fee);
    } else {
      // Restore previous city if it exists
      const cityToUse = selectedCity;

      setSelectedCity(cityToUse);
      localStorage.setItem('selectedEmirate', JSON.stringify(selectedCity));

      const fee = calculateShippingFee(subTotal, type, cityToUse);
      setSelectedFee(fee);
      setTotal(subTotal + fee);
    }
  };

  useEffect(() => {
    localStorage.setItem('shipping', JSON.stringify(shipping));
    localStorage.setItem('shippingFee', JSON.stringify(selectedFee));
    localStorage.setItem('selectedEmirate', JSON.stringify(selectedCity));
  }, [selectedCity, selectedShipping]);

  useEffect(() => {
    let shippingData;

    if (selectedShipping === 'standard') {
      if (selectedCity === 'Dubai') {
        shippingData = {
          name: 'Standard Service (Dubai)',
          fee: 0,
          deliveryDuration: '2 working days'
        };
      } else {
        shippingData = {
          name: 'Standard Service (Other Emirates)',
          fee: selectedFee,
          deliveryDuration: '2-3 working days',
          freeShipping: 1000
        };
      }
    } else if (selectedShipping === 'express') {
      shippingData = {
        name: 'Express Service (Dubai Only)',
        fee: 150,
        deliveryDuration: 'Next working day (cut-off 1pm)'
      };
    } else if (selectedShipping === 'self-collect') {
      shippingData = {
        name: 'Self-Collect',
        fee: 0,
        deliveryDuration: 'Monday to Saturday (9am–6pm)'
      };
    }

    localStorage.setItem('shipping', JSON.stringify(shippingData));
    setShipping(shippingData);
  }, [selectedShipping, selectedCity, selectedFee]);

  const handleRemoveInstallation = async (product: ICart) => {
    const existingItem = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor?.color === product.selectedColor?.color &&
        item.addInstallation === true
    );

    if (!existingItem) return;

    // 1️⃣ OLD key
    const oldKey =
      existingItem.category?.toLowerCase().trim() === 'accessories'
        ? `${existingItem.id}-${existingItem.selectedColor?.color}`
        : existingItem.isClearance
          ? `${existingItem.id}-clearance-installation`
          : `${existingItem.id}-installation`;

    // 🔍 FIND TARGET ITEM (NO installation) BEFORE mutation
    const targetItem = cartItems.find(
      (item) =>
        item !== existingItem &&
        item.id === existingItem.id &&
        item.selectedColor?.color === existingItem.selectedColor?.color &&
        item.addInstallation === false
    );

    // 2️⃣ Remove installation
    const installationCost = existingItem.installationCost || 0;
    existingItem.totalPrice -= installationCost;
    existingItem.installationCost = 0;
    existingItem.addInstallation = false;

    // 3️⃣ NEW key
    const newKey =
      existingItem.category?.toLowerCase().trim() === 'accessories'
        ? `${existingItem.id}-${existingItem.selectedColor?.color}`
        : existingItem.isClearance
          ? `${existingItem.id}-clearance`
          : `${existingItem.id}`;

    // 4️⃣ MERGE if target exists
    let updatedCartItems = [...cartItems];

    if (targetItem) {
      const totalSQM = targetItem.squareMeter + existingItem.squareMeter;
      const totalBoxes = totalSQM / Number(existingItem.boxCoverage);

      if (totalBoxes > existingItem.stock) {
        console.error('Not enough stock');
      }

      targetItem.requiredBoxes = totalBoxes;
      targetItem.squareMeter += existingItem.squareMeter;
      targetItem.totalPrice += existingItem.totalPrice;

      // remove duplicated item
      updatedCartItems = updatedCartItems.filter(
        (item) => item !== existingItem
      );
    }

    setCartItems(updatedCartItems);

    // 5️⃣ IndexedDB
    const db = await openDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');

    await store.delete(oldKey);

    if (targetItem) {
      await store.put(targetItem, newKey);
    } else {
      await store.put(existingItem, newKey);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Container className="font-inter mt-10  mb-4 sm:mb-10 relative max-sm:max-w-[100%]">
      <h1 className="text-center xl:text-[48px]">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-center text-[24px] pt-10">Cart is empty</p>
          <Link
            href="/collections"
            className="text-center text-[18px] bg-primary p-2 flex w-fit mx-auto items-center text-white gap-2 mt-4"
          >
            <FaArrowLeftLong /> Go Back to Shop
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap md:flex-nowrap gap-5 ">
            <div className=" w-full md:w-[55%] xl:w-[70%] 2xl:w-[65%] px-2">
              {/* product */}
              <div className="max-h-[590px] overflow-x-auto pr-4">
                {nonAccessoryItems.length > 0 && (
                  <>
                    <div className="hidden xl:grid grid-cols-12 text-20 font-light pb-3">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-3 text-center">Area</div>
                      <div className="col-span-2 text-center">Total Price</div>
                      <div className="col-span-1 text-end">Remove</div>
                    </div>
                    <p className="block xl:hidden text-12 font-semibold">
                      Product
                    </p>
                    <div className="border border-b border-[#DEDEDE]" />
                    {nonAccessoryItems.map((item, cartindex) => (
                      <div key={cartindex}>
                        <div className="grid grid-cols-12 text-20 font-light py-2 2xl:py-4 items-center">
                          <div className="col-span-11 xl:col-span-6">
                            <div className="flex gap-2 xsm:gap-4">
                              <div className="w-full max-w-[65px] md:max-w-[140px] h-[69px] md:h-[140px] 2xl:max-w-[170x] 2xl:h-[140px]">
                                <Image
                                  fill
                                  className="!relative block"
                                  src={item.image ?? '/default-image.png'}
                                  alt="cart"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Link
                                  href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                  className="text-[12px] xsm:text-13 xl:text-sm 2xl:text-base font-medium"
                                >
                                  {item.name}
                                </Link>
                                {item.isfreeSample ? (
                                  <p className="text-12 sm:text-sm 2xl:text-17">
                                    Price: Free
                                  </p>
                                ) : (
                                  <>
                                    <p className="text-12 sm:text-sm 2xl:text-17">
                                      Price:{' '}
                                      <span className="font-currency font-normal 2xl:text-22">
                                        
                                      </span>{' '}
                                      <span>
                                        {(item.price ?? 0).toFixed(2)}
                                      </span>
                                      /m
                                      <sup>2</sup>
                                    </p>
                                    <p className="text-12 sm:text-sm 2xl:text-17">
                                      Area:{' '}
                                      {Number(
                                        Number(item.squareMeter).toFixed(2)
                                      )}{' '}
                                      SQM
                                    </p>
                                  </>
                                )}

                                {!item.isfreeSample && item.isAccessory && (
                                  <p className="text-12 sm:text-sm 2xl:text-17">
                                    Price Per Piece:
                                    <span className="font-bold">
                                      <span className="font-currency font-normal 2xl:text-20">
                                        
                                      </span>{' '}
                                      {item.pricePerBox &&
                                        item.pricePerBox.toFixed(2)}
                                    </span>
                                  </p>
                                )}
                                {!item.isClearance && (
                                  <div className="flex flex-wrap xl:hidden gap-2 mt-2 items-center">
                                    <div
                                      className={`flex justify-center items-center border border-[#959595] px-1 py-1 w-fit text-purple ${item.isfreeSample ? 'hidden' : 'block'}`}
                                    >
                                      <button
                                        className="px-1 hover:text-black"
                                        onClick={() => decrement(item)}
                                      >
                                        <LuMinus />
                                      </button>
                                      <span className="text-purple text-sm px-1">
                                        <input
                                          type="number"
                                          value={item.squareMeter}
                                          onChange={(e) =>
                                            handleQunatity(e, item)
                                          }
                                          className="max-w-[50px] text-center no-spinner"
                                        />
                                      </span>
                                      <button
                                        className="px-1 hover:text-black"
                                        onClick={() => increment(item)}
                                      >
                                        <LuPlus />
                                      </button>
                                    </div>
                                    <p className="text-sm font-semibold whitespace-nowrap">
                                      Total Price:{' '}
                                      <span className="font-currency font-normal text-18">
                                        
                                      </span>{' '}
                                      <span>
                                        {(item.totalPrice ?? 0).toFixed(2)}
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3 mx-auto hidden xl:block">
                            <div
                              className={`flex justify-center items-center border border-[#959595] px-0 2xl:px-1 py-1 2xl:py-2 w-fit text-purple ${item.isfreeSample ? 'hidden' : 'block'}`}
                            >
                              <button
                                className="px-1 2xl:px-2 hover:text-black"
                                onClick={() => decrement(item)}
                              >
                                <LuMinus />
                              </button>
                              <span className="text-purple px-1 2xl:px-2 overflow-hidden">
                                <input
                                  type="number"
                                  value={item.squareMeter}
                                  onChange={(e) => handleQunatity(e, item)}
                                  className="max-w-[50px] text-center no-spinner"
                                />
                              </span>
                              <button
                                className="px-1 2xl:px-2 hover:text-black"
                                onClick={() => increment(item)}
                              >
                                <LuPlus />
                              </button>
                            </div>
                          </div>

                          <div className="col-span-2 text-center hidden xl:block">
                            {item.isfreeSample ? (
                              <p className="2xl:text-20 font-semibold">
                                <span>Free</span>
                              </p>
                            ) : (
                              <p className="2xl:text-20 font-semibold">
                                <span className="font-currency font-normal text-20 2xl:text-25 ">
                                  
                                </span>{' '}
                                <span>
                                  {formatAED(
                                    // item.addInstallation
                                    //   ? (item.installationCost || 0) +
                                    //   item.totalPrice :
                                    item.totalPrice ?? 0
                                  )}
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="col-span-1 text-end xl:pr-5">
                            <button
                              className="text-primary"
                              onClick={() => handleRemoveItem(item)}
                            >
                              <svg
                                className="w-4 h-4 2xl:w-6 2xl:h-5"
                                viewBox="0 0 23 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21.4688 4H17.8438V1.8125C17.8438 0.847266 17.031 0.0625 16.0313 0.0625H6.96875C5.96904 0.0625 5.15625 0.847266 5.15625 1.8125V4H1.53125C1.02998 4 0.625 4.39102 0.625 4.875V5.75C0.625 5.87031 0.726953 5.96875 0.851563 5.96875H2.56211L3.26162 20.2695C3.30693 21.202 4.10557 21.9375 5.07129 21.9375H17.9287C18.8973 21.9375 19.6931 21.2047 19.7384 20.2695L20.4379 5.96875H22.1484C22.273 5.96875 22.375 5.87031 22.375 5.75V4.875C22.375 4.39102 21.97 4 21.4688 4ZM15.8047 4H7.19531V2.03125H15.8047V4Z"
                                  fill="#BF6933"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="border border-b border-[#DEDEDE]" />

                        {item.addInstallation && (
                          <>
                            <div className="grid grid-cols-12">
                              <p className="col-span-7 lg:col-span-9 py-2 text-12 sm:text-sm 2xl:text-17">
                                Installation Charges
                              </p>
                              <div className="col-span-2  text-center py-2 text-12 sm:text-sm 2xl:text-17">
                                <span className="font-bold">
                                  <span className="font-currency font-normal 2xl:text-20">
                                    
                                  </span>{' '}
                                  {formatAED(item.installationCost)}
                                </span>
                              </div>
                              <div className="col-span-3 lg:col-span-1 text-end xl:pr-5 py-2 text-12 sm:text-sm 2xl:text-17">
                                <button
                                  className="text-primary"
                                  onClick={() => handleRemoveInstallation(item)}
                                >
                                  <svg
                                    className="w-4 h-4 2xl:w-6 2xl:h-5"
                                    viewBox="0 0 23 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M21.4688 4H17.8438V1.8125C17.8438 0.847266 17.031 0.0625 16.0313 0.0625H6.96875C5.96904 0.0625 5.15625 0.847266 5.15625 1.8125V4H1.53125C1.02998 4 0.625 4.39102 0.625 4.875V5.75C0.625 5.87031 0.726953 5.96875 0.851563 5.96875H2.56211L3.26162 20.2695C3.30693 21.202 4.10557 21.9375 5.07129 21.9375H17.9287C18.8973 21.9375 19.6931 21.2047 19.7384 20.2695L20.4379 5.96875H22.1484C22.273 5.96875 22.375 5.87031 22.375 5.75V4.875C22.375 4.39102 21.97 4 21.4688 4ZM15.8047 4H7.19531V2.03125H15.8047V4Z"
                                      fill="#BF6933"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="border border-b border-[#DEDEDE]" />
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* clearance product */}

              {clearanceItems.length > 0 && (
                <div className="max-h-[590px] overflow-x-auto pr-4 mt-7">
                  <div className="hidden xl:grid grid-cols-12 text-20 font-light pb-3">
                    <div className="col-span-6">Clearance Product</div>
                    <div className="col-span-3 text-center">Bundle</div>
                    <div className="col-span-2 text-center">Total Price</div>
                    <div className="col-span-1 text-end">Remove</div>
                  </div>
                  <p className="block xl:hidden text-12 font-semibold">
                    Clearance Product
                  </p>
                  <div className="border border-b border-[#DEDEDE]" />
                  {clearanceItems.map((item, cartindex) => (
                    <div key={cartindex}>
                      <div className="grid grid-cols-12 text-20 font-light py-2 2xl:py-4 items-center">
                        <div className="col-span-11 xl:col-span-6">
                          <div className="flex gap-2 xsm:gap-4">
                            <div className="w-full max-w-[65px] md:max-w-[140px] h-[69px] md:h-[140px] 2xl:max-w-[170x] 2xl:h-[140px]">
                              <Image
                                fill
                                className="!relative block"
                                src={item.image ?? '/default-image.png'}
                                alt="cart"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                className="text-[12px] xsm:text-13 xl:text-sm 2xl:text-base font-medium"
                              >
                                {item.name}
                              </Link>

                              <p className="text-12 sm:text-sm 2xl:text-17">
                                Price:{' '}
                                <span className="font-currency font-normal 2xl:text-22">
                                  
                                </span>{' '}
                                <span>
                                  {item.unit === 'sqft'
                                    ? ((item.price ?? 0) / 10.764).toFixed(2)
                                    : (item.price ?? 0).toFixed(2)}
                                </span>
                                /{item.unit === 'sqft' ? 'ft' : 'm'}
                                <sup>2</sup>
                              </p>
                              <p className="text-12 sm:text-sm 2xl:text-17 block xl:hidden">
                                Bundle:
                                <span className="font-bold"></span>
                                {Number(
                                  (
                                    Number(item.boxCoverage) *
                                    Number(item.requiredBoxes ?? 0)
                                  ).toFixed(2)
                                )}
                                {item.unit === 'sqft' ? ' ft²' : ' SQM'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 hidden xl:block text-center">
                          <p className="text-12 sm:text-sm 2xl:text-17">
                            <span className="font-bold"></span>
                            {Number(
                              (
                                Number(item.boxCoverage) *
                                Number(item.requiredBoxes ?? 0)
                              ).toFixed(2)
                            )}
                            {item.unit === 'sqft' ? ' ft²' : ' SQM'}
                          </p>
                        </div>
                        <div className="col-span-2 text-center hidden xl:block">
                          <p className="2xl:text-20 font-semibold">
                            <span className="font-currency font-normal text-20 2xl:text-25 ">
                              
                            </span>{' '}
                            <span>{formatAED(item.totalPrice ?? 0)}</span>
                          </p>
                        </div>
                        <div className="col-span-1 text-end xl:pr-5">
                          <button
                            className="text-primary"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <svg
                              className="w-4 h-4 2xl:w-6 2xl:h-5"
                              viewBox="0 0 23 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21.4688 4H17.8438V1.8125C17.8438 0.847266 17.031 0.0625 16.0313 0.0625H6.96875C5.96904 0.0625 5.15625 0.847266 5.15625 1.8125V4H1.53125C1.02998 4 0.625 4.39102 0.625 4.875V5.75C0.625 5.87031 0.726953 5.96875 0.851563 5.96875H2.56211L3.26162 20.2695C3.30693 21.202 4.10557 21.9375 5.07129 21.9375H17.9287C18.8973 21.9375 19.6931 21.2047 19.7384 20.2695L20.4379 5.96875H22.1484C22.273 5.96875 22.375 5.87031 22.375 5.75V4.875C22.375 4.39102 21.97 4 21.4688 4ZM15.8047 4H7.19531V2.03125H15.8047V4Z"
                                fill="#BF6933"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="border border-b border-[#DEDEDE]" />
                      {item.addInstallation && (
                        <>
                          <div className="grid grid-cols-12">
                            <p className="col-span-7 lg:col-span-8 py-2 text-12 sm:text-sm 2xl:text-17">
                              Installation Charges
                            </p>
                            <div className="col-span-2 text-center py-2 text-12 sm:text-sm 2xl:text-17">
                              <span className="font-bold">
                                <span className="font-currency font-normal 2xl:text-20">
                                  
                                </span>{' '}
                                {formatAED(item.installationCost)}
                              </span>
                            </div>
                            <div className="col-span-3 lg:col-span-2 text-end xl:pr-5 py-2 text-12 sm:text-sm 2xl:text-17">
                              <button
                                className="text-primary"
                                onClick={() => handleRemoveInstallation(item)}
                              >
                                <svg
                                  className="w-4 h-4 2xl:w-6 2xl:h-5"
                                  viewBox="0 0 23 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M21.4688 4H17.8438V1.8125C17.8438 0.847266 17.031 0.0625 16.0313 0.0625H6.96875C5.96904 0.0625 5.15625 0.847266 5.15625 1.8125V4H1.53125C1.02998 4 0.625 4.39102 0.625 4.875V5.75C0.625 5.87031 0.726953 5.96875 0.851563 5.96875H2.56211L3.26162 20.2695C3.30693 21.202 4.10557 21.9375 5.07129 21.9375H17.9287C18.8973 21.9375 19.6931 21.2047 19.7384 20.2695L20.4379 5.96875H22.1484C22.273 5.96875 22.375 5.87031 22.375 5.75V4.875C22.375 4.39102 21.97 4 21.4688 4ZM15.8047 4H7.19531V2.03125H15.8047V4Z"
                                    fill="#BF6933"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="border border-b border-[#DEDEDE]" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Accessory */}
              <div className=" max-h-[590px] overflow-x-auto pr-4 mt-7">
                {accessoryItems.length > 0 && (
                  <>
                    <div className=" hidden xl:grid grid-cols-12 text-20 font-light pb-3">
                      <div className="col-span-6">Accessories</div>
                      <div className="col-span-3 text-center">Qty Piece</div>
                      <div className="col-span-2 text-center">Total Price</div>
                      <div className="col-span-1 text-end">Remove</div>
                    </div>
                    <p className="block xl:hidden text-12 font-semibold">
                      Accessories
                    </p>
                    <div className="border border-b border-[#DEDEDE]" />
                    {accessoryItems.map((item, cartindex) => (
                      <div key={cartindex}>
                        <div className="grid grid-cols-12 text-20 font-light py-2 2xl:py-4 items-center">
                          <div className=" col-span-11 xl:col-span-6">
                            <div className="flex gap-2 xsm:gap-4">
                              <Image
                                width={170}
                                height={160}
                                className="w-full max-w-[65px] md:max-w-[140px] h-[69px] md:h-[140px] 2xl:max-w-[170x] 2xl:h-[140px]"
                                src={
                                  item?.matchedProductImages?.imageUrl ??
                                  item.image ??
                                  '/default-image.png'
                                }
                                alt="cart"
                              />
                              <div>
                                <Link
                                  href={`/accessories/${item.custom_url}`}
                                  className="text-[12px] xsm:text-13 xl:text-sm 2xl:text-base font-medium"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-12 sm:text-sm 2xl:text-17 ">
                                  Price:{' '}
                                  <span className="font-currency font-normal 2xl:text-18">
                                    
                                  </span>{' '}
                                  <span>{(item.price ?? 0).toFixed(2)}</span>
                                  /Piece
                                </p>
                                <p className="text-12 sm:text-sm 2xl:text-17">
                                  No. of Pieces:
                                  <span className="font-bold">
                                    {' '}
                                    {item.requiredBoxes ?? 0}
                                  </span>
                                </p>
                                <p className="text-12 sm:text-sm 2xl:text-17">
                                  Color:
                                  <span className="font-bold">
                                    {' '}
                                    {item?.selectedColor?.colorName ||
                                      item?.selectedColor?.colorCode ||
                                      ''}
                                  </span>
                                </p>
                                <div className="flex flex-wrap xl:hidden gap-2 mt-2 items-center">
                                  <div className="flex justify-center items-center border border-[#959595] px-1 py-1 w-fit text-purple ">
                                    <button
                                      className="px-1 hover:text-black"
                                      onClick={() => decrement(item)}
                                    >
                                      <LuMinus />
                                    </button>
                                    <span className="text-purple text-sm px-1">
                                      <input
                                        type="number"
                                        value={item.requiredBoxes}
                                        onChange={(e) =>
                                          handleQunatity(e, item)
                                        }
                                        className="max-w-[50px] text-center no-spinner"
                                      />
                                    </span>
                                    <button
                                      className="px-1 hover:text-black"
                                      onClick={() => increment(item)}
                                    >
                                      <LuPlus />
                                    </button>
                                  </div>
                                  <p className="text-sm font-semibold whitespace-nowrap">
                                    Total:{' '}
                                    <span className="font-currency font-normal text-18">
                                      
                                    </span>{' '}
                                    <span>
                                      {(item.totalPrice ?? 0).toFixed(2)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3 mx-auto hidden xl:block">
                            <div className="flex justify-center items-center border border-[#959595] px-1 2xl:px-2 py-2 2xl:py-3 w-fit text-purple">
                              <button
                                className="px-1 2xl:px-2 hover:text-black"
                                onClick={() => decrement(item)}
                              >
                                <LuMinus />
                              </button>
                              <span className="text-purple px-1 2xl:px-2 overflow-hidden">
                                <input
                                  type="number"
                                  value={item.requiredBoxes}
                                  onChange={(e) => handleQunatity(e, item)}
                                  className="max-w-[50px] text-center no-spinner"
                                />
                              </span>
                              <button
                                className="px-1 2xl:px-2 hover:text-black"
                                onClick={() => increment(item)}
                              >
                                <LuPlus />
                              </button>
                            </div>
                          </div>
                          <div className="col-span-2 text-center hidden xl:block">
                            <p className="2xl:text-20 font-semibold">
                              <span className="font-currency font-normal">
                                
                              </span>{' '}
                              <span>{formatAED(item.totalPrice ?? 0)}</span>
                            </p>
                          </div>
                          <div className="col-span-1 text-end xl:pr-5">
                            <button
                              className="text-primary"
                              onClick={() => handleRemoveItem(item)}
                            >
                              <svg
                                className=" w-4 h-4  2xl:w-6 2xl:h-5"
                                viewBox="0 0 23 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21.4688 4H17.8438V1.8125C17.8438 0.847266 17.031 0.0625 16.0313 0.0625H6.96875C5.96904 0.0625 5.15625 0.847266 5.15625 1.8125V4H1.53125C1.02998 4 0.625 4.39102 0.625 4.875V5.75C0.625 5.87031 0.726953 5.96875 0.851563 5.96875H2.56211L3.26162 20.2695C3.30693 21.202 4.10557 21.9375 5.07129 21.9375H17.9287C18.8973 21.9375 19.6931 21.2047 19.7384 20.2695L20.4379 5.96875H22.1484C22.273 5.96875 22.375 5.87031 22.375 5.75V4.875C22.375 4.39102 21.97 4 21.4688 4ZM15.8047 4H7.19531V2.03125H15.8047V4Z"
                                  fill="#BF6933"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="border border-b border-[#DEDEDE]" />
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* accessory end */}
              <Link
                href="/collections"
                className="bg-black text-white px-4 py-2 gap-2 justify-center items-center w-fit mt-5 hidden lg:flex"
              >
                <FaArrowLeftLong /> Continue shopping
              </Link>
            </div>
            <div className="w-full md:w-[45%] xl:w-[30%] 2xl:w-[35%] bg-background p-3 sm:p-5 space-y-5 h-fit">
              <div className="flex gap-2 md:gap-5 items-center max-sm:justify-between">
                <h2 className=" text-18 md:text-20 2xl:text-28">
                  Order Summary
                </h2>
                <p className="text-sm text-[#FF0004]">
                  (*Total {cartItems.length}{' '}
                  {cartItems.length === 1 ? 'Item' : ' Items'})
                </p>
              </div>
              <div className="border border-b border-[#DEDEDE]" />
              <div className="flex_between lg:text-20">
                <p>Subtotal:</p>
                <p>
                  <span className="font-currency font-normal text-20 2xl:text-25">
                    
                  </span>{' '}
                  {formatAED(subTotal)}
                </p>
              </div>
              {selectedShipping !== 'self-collect' && (
                <CartSelect
                  select={emirates}
                  selectedFee={selectedFee}
                  selectedShipping={selectedShipping ?? ''}
                  onSelect={handleStateSelect}
                />
              )}
              {selectedCity !== 'Enter Emirate' && (
                <Accordion
                  isCheckout
                  label="Shipping Options"
                  isOpen={openAccordion === 'Shipping Options'}
                  onToggle={() => handleToggle('Shipping Options')}
                >
                  {(selectedCity === 'Dubai' ||
                    selectedCity == 'Enter Emirate') && (
                    <div
                      className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${
                        selectedShipping === 'express'
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                      onClick={() => handleShippingSelect('express')}
                    >
                      <Image
                        src={lightImg}
                        alt="icon"
                        className="size-12 xs:size-16"
                      />
                      <div className="text-11 xs:text-base">
                        <strong className="text-15 xs:text-20">
                          Express Service (Dubai Only)
                        </strong>
                        <p className="text-11 xs:text-base">
                          Delivery:{' '}
                          <strong>Next working day (cut-off time 1pm)</strong>
                        </p>
                        <p>
                          Delivery Cost:{' '}
                          <strong>
                            <span className="font-currency font-normal text-18">
                              
                            </span>
                            150
                          </strong>
                        </p>
                      </div>
                    </div>
                  )}
                  <div
                    className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${
                      selectedShipping === 'standard'
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => handleShippingSelect('standard')}
                  >
                    <Image
                      src={deliveryImg}
                      alt="icon"
                      className="size-12 xs:size-16"
                    />
                    <div>
                      <strong className="text-15 xs:text-20">
                        Standard Service{' '}
                        {selectedCity === 'Dubai'
                          ? '(Dubai)'
                          : '(All Other Emirates)'}{' '}
                      </strong>
                      <p className="text-11 xs:text-base">
                        Delivery:{' '}
                        <strong>
                          2{selectedCity === 'Dubai' ? '' : '-3'} working days
                        </strong>
                      </p>
                      <p className="text-11 xs:text-base">
                        <span>Delivery Cost: </span>
                        {selectedCity === 'Dubai' ? (
                          <strong>Free</strong>
                        ) : (
                          <>
                            Free for orders above{' '}
                            <strong>
                              <span className="font-currency font-normal text-18">
                                
                              </span>
                              2,000
                            </strong>
                            .{' '}
                            <strong>
                              <span className="font-currency font-normal text-18">
                                
                              </span>
                              200
                            </strong>{' '}
                            delivery charge applies for orders below{' '}
                            <strong>
                              <span className="font-currency font-normal text-18">
                                
                              </span>
                              1,999
                            </strong>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${
                      selectedShipping === 'self-collect'
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => handleShippingSelect('self-collect')}
                  >
                    <Image
                      src={locationImg}
                      alt="icon"
                      className="size-12 xs:size-16"
                    />
                    <div>
                      <strong className="text-15 xs:text-20">
                        Self-Collect:
                      </strong>
                      <p className="text-11 xs:text-base">
                        Collection: Monday to Saturday{' '}
                        <strong>(9am-6pm)</strong>
                      </p>
                      <p className="text-11 xs:text-base">
                        <span>Location:</span>{' '}
                        <strong>
                          <Link
                            className="hover:text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://maps.app.goo.gl/BBJjwVKgTK4PPTWR8"
                          >
                            Unit A11, J1 Warehouses, Jebel Ali Industrial Area-1
                            - Dubai
                          </Link>
                        </strong>
                      </p>
                    </div>
                  </div>
                </Accordion>
              )}

              {/* Shipping Fee show when select city */}
              {/* <div className='flex_between lg:text-20'>
                  <p>Shipping Fee:</p>
                  <p>{selectedCity ? selectedFee > 0 ? <p><span className="font-currency font-normal text-18"></span> {selectedFee}</p> : 'Free' : 'Pleae select city'}</p>
                </div> */}
              <div className="border border-b border-[#DEDEDE]" />
              <div className="flex_between lg:text-20">
                <p>Subtotal Incl. VAT</p>
                <p>
                  <span className="font-currency font-normal text-20 lg:text-25">
                    
                  </span>{' '}
                  {total > 0 ? formatAED(total) : formatAED(subTotal)}
                </p>
              </div>
              <Link
                href="/checkout"
                className="bg-primary hover:bg-secondary text-white px-4 py-3 w-full text-sm md:text-20 block text-center "
              >
                Proceed to Checkout
              </Link>

              <p className="text-18 xl:text-22 font-semibold text-center">
                Buy Now, Pay Later
              </p>
              {total > 0 && (
                <PaymentMethod
                  installments={
                    total > 0
                      ? parseFloat(total.toFixed(2)) / 4
                      : parseFloat(subTotal.toFixed(2)) / 4
                  }
                />
              )}
              <div className="flex justify-between gap-2">
                {paymentcard.map((array, index) => (
                  <Image
                    className=" w-16 h-11 md:w-14 md:h-12 2xl:w-[90px] 2xl:h-[60px]"
                    key={index}
                    width={90}
                    height={60}
                    src={array.image}
                    alt="payment-card"
                  />
                ))}
              </div>
            </div>
          </div>
          <RelatedSlider products={products.slice(0, 5)} />
        </>
      )}
    </Container>
  );
};

export default CartPage;
