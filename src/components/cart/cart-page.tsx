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
import TrustBadges from '../product-detail/trust-badges';
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

  const handleAddInstallation = async (product: ICart) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor?.color === product.selectedColor?.color &&
        !item.addInstallation
    );

    if (existingItemIndex === -1) return;

    // Clone the item to avoid mutating state directly
    const existingItem = { ...cartItems[existingItemIndex] };

    // 1️⃣ OLD key
    const oldKey =
      existingItem.category?.toLowerCase().trim() === 'accessories'
        ? `${existingItem.id}-${existingItem.selectedColor?.color}`
        : existingItem.isClearance
          ? `${existingItem.id}-clearance`
          : `${existingItem.id}`;

    // 🔍 FIND TARGET ITEM (WITH installation) BEFORE mutation
    const targetItemIndex = cartItems.findIndex(
      (item) =>
        item.id === existingItem.id &&
        item.selectedColor?.color === existingItem.selectedColor?.color &&
        item.addInstallation === true
    );

    let targetItem = targetItemIndex !== -1 ? { ...cartItems[targetItemIndex] } : null;

    // 2️⃣ Add installation
    const installationRate = existingItem?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25;
    const installationCost = existingItem.squareMeter * installationRate;
    existingItem.totalPrice += installationCost;
    existingItem.installationCost = installationCost;
    existingItem.addInstallation = true;

    // 3️⃣ NEW key
    const newKey =
      existingItem.category?.toLowerCase().trim() === 'accessories'
        ? `${existingItem.id}-${existingItem.selectedColor?.color}`
        : existingItem.isClearance
          ? `${existingItem.id}-clearance-installation`
          : `${existingItem.id}-installation`;

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
      targetItem.installationCost = (targetItem.installationCost || 0) + existingItem.installationCost;

      // Update target item and remove the old item
      updatedCartItems[targetItemIndex] = targetItem;
      updatedCartItems.splice(existingItemIndex, 1);
    } else {
      updatedCartItems[existingItemIndex] = existingItem;
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

  const handleRemoveInstallation = async (product: ICart) => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor?.color === product.selectedColor?.color &&
        item.addInstallation === true
    );

    if (existingItemIndex === -1) return;

    const existingItem = { ...cartItems[existingItemIndex] };

    // 1️⃣ OLD key
    const oldKey =
      existingItem.category?.toLowerCase().trim() === 'accessories'
        ? `${existingItem.id}-${existingItem.selectedColor?.color}`
        : existingItem.isClearance
          ? `${existingItem.id}-clearance-installation`
          : `${existingItem.id}-installation`;

    // 🔍 FIND TARGET ITEM (NO installation) BEFORE mutation
    const targetItemIndex = cartItems.findIndex(
      (item) =>
        item.id === existingItem.id &&
        item.selectedColor?.color === existingItem.selectedColor?.color &&
        !item.addInstallation
    );

    let targetItem = targetItemIndex !== -1 ? { ...cartItems[targetItemIndex] } : null;

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

      // Update target item and remove the old item
      updatedCartItems[targetItemIndex] = targetItem;
      updatedCartItems.splice(existingItemIndex, 1);
    } else {
      updatedCartItems[existingItemIndex] = existingItem;
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
    <Container className="font-inter mt-10 mb-4 sm:mb-10 relative max-sm:max-w-[100%]">
      <h1 className="text-[28px] md:text-[36px] xl:text-[48px] font-bold text-black mb-6">Your Shopping Basket</h1>
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
              <div className="pr-1 md:pr-4">
                {nonAccessoryItems.length > 0 && (
                  <>
                    <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                      <div className="w-[150px] shrink-0">Product</div>
                      <div className="flex-grow">
                        <div className="grid grid-cols-12 w-full gap-4">
                          <div className="col-span-6"></div>
                          <div className="col-span-3 text-center">Quantity</div>
                          <div className="col-span-2 text-center">Unit price</div>
                          <div className="col-span-1 text-end">Action</div>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[500px] md:max-h-[590px] overflow-y-auto pr-2 custom-scrollbar">
                      {nonAccessoryItems.map((item, cartindex) => (
                        <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                          {/* Mobile Delete Button - Top Right */}
                          <div className="flex justify-end xl:hidden mb-2">
                            <button
                              className="text-gray-500 hover:text-red-500 bg-[#f5f5f3] border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                              onClick={() => handleRemoveItem(item)}
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
                                alt="cart"
                              />
                            </div>

                            {/* Info Column */}
                            <div className="flex-grow flex flex-col justify-center">
                              {/* Grid aligning with header */}
                              <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                                {/* Title */}
                                <div className="col-span-12 xl:col-span-6">
                                  <Link
                                    href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                    className="text-[15px] md:text-[16px] font-medium text-black hover:text-primary transition line-clamp-2"
                                  >
                                    {item.name}
                                  </Link>

                                  {/* Mobile display for Quantity and Price */}
                                  {!item.isClearance && (
                                    <div className="flex justify-between items-center mt-3 xl:hidden pr-2">
                                      <div
                                        className={`flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-bold ${item.isfreeSample ? 'hidden' : 'flex'}`}
                                      >
                                        <button
                                          className="hover:opacity-80 text-black bg-[#ffb81c] rounded-full h-6 w-6 flex items-center justify-center transition"
                                          onClick={() => decrement(item)}
                                        >
                                          <LuMinus className="size-3" />
                                        </button>
                                        <span className="text-black text-[15px] px-2 min-w-[32px] text-center">
                                          <input
                                            type="number"
                                            value={String(item.squareMeter).padStart(2, '0')}
                                            onChange={(e) => handleQunatity(e, item)}
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
                                        <span>
                                          {formatAED(
                                            item.addInstallation ?
                                              item.totalPrice - (item.installationCost || 0) :
                                              item.totalPrice ?? 0
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Quantity (Desktop) */}
                                <div className="col-span-3 mx-auto hidden xl:flex justify-center">
                                  <div
                                    className={`flex justify-between items-center border border-[#ffb81c] bg-white rounded-full p-[2px] w-fit font-semibold shadow-sm ${item.isfreeSample ? 'hidden' : 'flex'}`}
                                  >
                                    <button
                                      className="bg-[#ffb81c] text-black rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 transition"
                                      onClick={() => decrement(item)}
                                    >
                                      <LuMinus className="size-3" />
                                    </button>
                                    <span className="text-black px-2 text-sm min-w-[32px] text-center">
                                      <input
                                        type="number"
                                        value={String(item.squareMeter).padStart(2, '0')}
                                        onChange={(e) => handleQunatity(e, item)}
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

                                {/* Unit Price (Desktop) */}
                                <div className="col-span-2 text-center hidden xl:block">
                                  {item.isfreeSample ? (
                                    <p className="text-[16px] font-semibold">
                                      <span>Free</span>
                                    </p>
                                  ) : (
                                    <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                      <span className="font-currency font-normal text-[20px]"></span>
                                      <span>
                                        {formatAED(
                                          item.addInstallation ?
                                            item.totalPrice - (item.installationCost || 0) :
                                            item.totalPrice ?? 0
                                        )}
                                      </span>
                                    </p>
                                  )}
                                </div>

                                {/* Action (Desktop / Delete) */}
                                <div className="col-span-1 hidden xl:flex justify-end">
                                  <button
                                    className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                                    onClick={() => handleRemoveItem(item)}
                                  >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"></polyline>
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* Installation charges checkbox container (Desktop) */}
                              {!item.isfreeSample && (
                                <div className="mt-2 xl:mt-4 hidden xl:block">
                                  <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-lg flex items-center justify-between p-2 md:p-3 w-full`}>
                                    <div className="flex items-center gap-2 md:gap-3">
                                      <input
                                        type="checkbox"
                                        checked={item.addInstallation}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            handleAddInstallation(item);
                                          } else {
                                            handleRemoveInstallation(item);
                                          }
                                        }}
                                        className="w-4 h-4 md:w-5 md:h-5 accent-[#ffb81c] cursor-pointer"
                                      />
                                      <span className="font-semibold text-[15px]">Installation Charges</span>
                                    </div>
                                    <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-gray-200 text-gray-500'} font-bold rounded-full px-4 py-1.5 text-[14px] shadow-sm flex items-center gap-1 transition`}>
                                      <span className="font-currency font-normal text-[18px]"></span>
                                      <span>{formatAED(item.installationCost || (item.squareMeter * (item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25)))}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Installation charges checkbox container (Mobile) */}
                          {!item.isfreeSample && (
                            <div className="mt-4 block xl:hidden w-full">
                              <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-md flex items-center justify-between p-3 w-full`}>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={item.addInstallation}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        handleAddInstallation(item);
                                      } else {
                                        handleRemoveInstallation(item);
                                      }
                                    }}
                                    className="w-[18px] h-[18px] accent-[#ffb81c] cursor-pointer"
                                  />
                                  <span className="font-medium text-[15px] text-black">Installation<br />Charges</span>
                                </div>
                                <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-gray-200 text-gray-500'} font-bold rounded-full px-4 py-1.5 text-[15px] flex items-center gap-1 transition`}>
                                  <span className="font-currency font-normal text-[18px]"></span>
                                  <span>{formatAED(item.installationCost || (item.squareMeter * (item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25)))}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* clearance product */}

              {clearanceItems.length > 0 && (
                <div className="pr-1 md:pr-4 mt-7">
                  <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                    <div className="w-[150px] shrink-0">Clearance Product</div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-12 w-full gap-4">
                        <div className="col-span-6"></div>
                        <div className="col-span-3 text-center">Bundle</div>
                        <div className="col-span-2 text-center">Total Price</div>
                        <div className="col-span-1 text-end">Action</div>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-[500px] md:max-h-[590px] overflow-y-auto pr-2 custom-scrollbar">
                    {clearanceItems.map((item, cartindex) => (
                      <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                        <div className="flex gap-3 md:gap-4 items-stretch relative">
                          <button
                            className="absolute top-0 right-0 xl:hidden text-gray-400 hover:text-red-500 bg-[#f5f5f3] rounded-full p-1.5"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>

                          <div className="w-[90px] md:w-[130px] xl:w-[150px] shrink-0 h-[90px] md:h-[130px] xl:h-[150px] relative rounded overflow-hidden">
                            <Image
                              fill
                              className="object-cover"
                              src={item.image ?? '/default-image.png'}
                              alt="cart"
                            />
                          </div>

                          <div className="flex-grow flex flex-col justify-center">
                            <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                              <div className="col-span-12 xl:col-span-6 pr-8 xl:pr-0">
                                <Link
                                  href={`/${generateSlug(item.category ?? '')}/${generateSlug(item.subcategories ?? '')}/${item.custom_url}`}
                                  className="text-[14px] md:text-[16px] font-semibold text-black hover:text-primary transition line-clamp-2"
                                >
                                  {item.name}
                                </Link>

                                <div className="mt-2 text-sm">
                                  <p className="text-gray-600">
                                    Price:{' '}
                                    <span className="font-currency font-normal"></span>{' '}
                                    <span className="font-semibold text-black">
                                      {item.unit === 'sqft'
                                        ? ((item.price ?? 0) / 10.764).toFixed(2)
                                        : (item.price ?? 0).toFixed(2)}
                                    </span>
                                    /{item.unit === 'sqft' ? 'ft²' : 'm²'}
                                  </p>
                                  <p className="block xl:hidden mt-1 text-gray-600">
                                    Bundle:{' '}
                                    <span className="font-semibold text-black">
                                      {Number((Number(item.boxCoverage) * Number(item.requiredBoxes ?? 0)).toFixed(2))}
                                    </span>
                                    {item.unit === 'sqft' ? ' ft²' : ' SQM'}
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-3 hidden xl:block text-center text-sm font-semibold text-black">
                                {Number((Number(item.boxCoverage) * Number(item.requiredBoxes ?? 0)).toFixed(2))}
                                {item.unit === 'sqft' ? ' ft²' : ' SQM'}
                              </div>

                              <div className="col-span-2 text-center hidden xl:block">
                                <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                  <span className="font-currency font-normal"></span>{' '}
                                  <span>{formatAED(item.totalPrice ?? 0)}</span>
                                </p>
                              </div>

                              <div className="col-span-1 hidden xl:flex justify-end">
                                <button
                                  className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                                  onClick={() => handleRemoveItem(item)}
                                >
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {item.addInstallation && (
                              <div className="mt-2 xl:mt-4">
                                <div className="border border-[#ffc341] rounded-lg flex items-center justify-between p-2 md:p-3 w-full">
                                  <div className="flex items-center gap-2 md:gap-3">
                                    <input
                                      type="checkbox"
                                      checked={true}
                                      onChange={() => handleRemoveInstallation(item)}
                                      className="w-4 h-4 md:w-5 md:h-5 accent-[#ffc341] cursor-pointer"
                                    />
                                    <span className="font-semibold text-xs md:text-sm xl:text-16">Installation Charges</span>
                                  </div>
                                  <div className="bg-[#ffc341] text-black font-bold rounded-full px-3 py-1 text-xs md:text-sm shadow-sm flex items-center gap-1 transition">
                                    <span className="font-currency font-normal"></span>
                                    <span>{formatAED(item.installationCost)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Accessory */}
              {/* Accessory */}
              {accessoryItems.length > 0 && (
                <div className="pr-1 md:pr-4 mt-7">
                  <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                    <div className="w-[150px] shrink-0">Accessories</div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-12 w-full gap-4">
                        <div className="col-span-6"></div>
                        <div className="col-span-3 text-center">Qty Piece</div>
                        <div className="col-span-2 text-center">Unit price</div>
                        <div className="col-span-1 text-end">Action</div>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[500px] md:max-h-[590px] overflow-y-auto pr-2 custom-scrollbar">
                    {accessoryItems.map((item, cartindex) => (
                      <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                        {/* Mobile Delete Button - Top Right */}
                        <div className="flex justify-end xl:hidden mb-2">
                          <button
                            className="text-gray-500 hover:text-red-500 bg-[#f5f5f3] border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                            onClick={() => handleRemoveItem(item)}
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
                              src={
                                item?.matchedProductImages?.imageUrl ??
                                item.image ??
                                '/default-image.png'
                              }
                              alt="cart"
                            />
                          </div>

                          <div className="flex-grow flex flex-col justify-center">
                            <div className="grid grid-cols-12 items-center w-full gap-2 xl:gap-4">
                              <div className="col-span-12 xl:col-span-6">
                                <Link
                                  href={`/accessories/${item.custom_url}`}
                                  className="text-[15px] md:text-[16px] font-medium text-black hover:text-primary transition line-clamp-2"
                                >
                                  {item.name}
                                </Link>

                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                  <p>
                                    Color:{' '}
                                    <span className="font-semibold text-black">
                                      {item?.selectedColor?.colorName || item?.selectedColor?.colorCode || ''}
                                    </span>
                                  </p>
                                </div>

                                {/* Mobile display for Quantity and Price */}
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
                                        value={String(item.requiredBoxes).padStart(2, '0')}
                                        onChange={(e) => handleQunatity(e, item)}
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
                                    <span>{(item.totalPrice ?? 0).toFixed(2)}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="col-span-3 hidden xl:flex justify-center">
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
                                      value={String(item.requiredBoxes).padStart(2, '0')}
                                      onChange={(e) => handleQunatity(e, item)}
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

                              <div className="col-span-2 text-center hidden xl:block">
                                <p className="text-[16px] font-bold text-black flex items-center justify-center gap-1">
                                  <span className="font-currency text-lg font-normal"></span>{' '}
                                  <span>{formatAED(item.price ?? 0)}</span>
                                </p>
                              </div>

                              <div className="col-span-1 hidden xl:flex justify-end">
                                <button
                                  className="bg-[#f5f5f3] hover:bg-red-50 text-gray-400 hover:text-red-500 border border-[#ebebeb] rounded-full p-2 transition flex items-center justify-center"
                                  onClick={() => handleRemoveItem(item)}
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
              {/* accessory end */}
              <Link
                href="/collections"
                className="text-black px-4 py-2 gap-2 justify-center items-center w-fit mt-5 hidden lg:flex mx-auto text-lg"
              >
                <FaArrowLeftLong className='text-primary' size={25} /> Continue shopping
              </Link>
            </div>
            <div className="w-full md:w-[45%] xl:w-[30%] 2xl:w-[35%] bg-[#FAFAFA] p-3 sm:p-5 space-y-5 h-fit">
              <div className="flex gap-2 md:gap-5 items-center justify-between">
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
                        className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'express'
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
                    className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'standard'
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
                    className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'self-collect'
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
                            24, 22nd street - Al Quoz Industrial Area 4 - Dubai - UAE
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
                <p className='font-semibold text-2xl'>Subtotal Incl. VAT</p>
                <p>
                  <span className="font-currency font-normal text-20 lg:text-25">
                    
                  </span>{' '}
                  {total > 0 ? formatAED(total) : formatAED(subTotal)}
                </p>
              </div>
              {total > 0 && (
                <PaymentMethod
                  installments={
                    total > 0
                      ? parseFloat(total.toFixed(2)) / 4
                      : parseFloat(subTotal.toFixed(2)) / 4
                  }
                  compact
                />
              )}

              <Link
                href="/checkout"
                className="bg-primary hover:bg-secondary text-white px-4 py-4 rounded-lg w-full text-sm md:text-20 block text-center "
              >
                Proceed to Checkout
              </Link>
              <TrustBadges />

            </div>
          </div>
          <RelatedSlider products={products.slice(0, 5)} />
        </>
      )}
    </Container>
  );
};

export default CartPage;
