'use client';
import Container from 'components/common/container/Container';
import PaymentMethod from 'components/product-detail/payment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { LuMinus, LuPlus } from 'react-icons/lu';
import CartSelect from './cart-select';
import { getCart, openDB, removeCartItem, updateCartItemColor } from 'utils/indexedDB';
import { ICart, IProduct, ProductImage } from 'types/prod';
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
  accessories?: IProduct[];
}
const CartPage = ({ products, accessories = [] }: CartPageProps) => {
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

  const normalizeColor = (value?: string | null) =>
    (value || '').trim().toLowerCase();

  const isAccessoryCartItem = (item: ICart) =>
    item.category?.toLowerCase().trim() === 'accessories' ||
    item.category === 'Accessory';

  const getFlooringInstallationRate = (item: ICart) =>
    item?.name?.toLowerCase()?.includes('herringbone') ? 35 : 25;

  // Installation cost: AED 35 per piece for accessories, otherwise per-sqm
  // (AED 35 for herringbone, AED 25 for other flooring).
  const getInstallationCost = (item: ICart) =>
    isAccessoryCartItem(item)
      ? (item.requiredBoxes || 0) * 35
      : (item.squareMeter || 0) * getFlooringInstallationRate(item);

  // The colour name of a flooring cart item: its selected colour, falling back
  // to the suffix of names like "Polar SPC Eco - Chestnut".
  const getFlooringColorName = (item: ICart) => {
    const fromSelected =
      item.selectedColor?.colorName || item.selectedColor?.altText;
    if (fromSelected) return normalizeColor(fromSelected);
    if (item.name?.includes(' - ')) {
      return normalizeColor(item.name.split(' - ').pop());
    }
    return '';
  };

  const flooringColorNames = new Set(
    nonAccessoryItems.map(getFlooringColorName).filter(Boolean)
  );

  // If an accessory's colour doesn't match any flooring colour in the cart but
  // the accessory offers a variant that does, return that matching variant.
  const getAccessoryColorSwap = (item: ICart): ProductImage | null => {
    if (flooringColorNames.size === 0) return null;

    const currentName = normalizeColor(
      item.selectedColor?.colorName || item.selectedColor?.altText
    );
    if (currentName && flooringColorNames.has(currentName)) return null;

    const fullAccessory = accessories.find(
      (acc) => String(acc.id) === String(item.id)
    );
    const variants = fullAccessory?.featureImages || [];

    const seen = new Set<string>();
    const uniqueVariants = variants.filter((variant) => {
      const key = String(variant.color ?? variant.colorCode ?? '');
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return (
      uniqueVariants.find((variant) => {
        const variantName = normalizeColor(
          variant.colorName || variant.altText
        );
        return (
          variantName &&
          flooringColorNames.has(variantName) &&
          String(variant.color) !== String(item.selectedColor?.color)
        );
      }) || null
    );
  };

  const handleSwapColor = async (item: ICart, newColor: ProductImage) => {
    try {
      await updateCartItemColor(item, newColor);
      showAlert({
        title: 'Accessory colour updated to match your flooring.',
        icon: 'success'
      });
    } catch {
      showAlert({
        title: 'Error updating accessory colour.',
        icon: 'error'
      });
    }
  };

  // For the "Frequently Bought Together" slider (accessories only): show each
  // accessory in the colour matching the flooring in the cart, otherwise white.
  const sliderAccessories: IProduct[] = accessories.map((acc) => {
    const variants = acc.featureImages || [];
    if (variants.length === 0) return acc;

    const seen = new Set<string>();
    const uniqueVariants = variants.filter((variant) => {
      const key = String(variant.color ?? variant.colorCode ?? '');
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const flooringMatch = uniqueVariants.find((variant) =>
      flooringColorNames.has(normalizeColor(variant.colorName || variant.altText))
    );
    const whiteMatch = uniqueVariants.find(
      (variant) => normalizeColor(variant.colorName || variant.altText) === 'white'
    );
    const preferred = flooringMatch || whiteMatch;
    if (!preferred) return acc;

    return {
      ...acc,
      posterImageUrl: { ...preferred, public_id: preferred.public_id || '' },
      featureImages: [
        preferred,
        ...uniqueVariants.filter((variant) => variant !== preferred)
      ]
    };
  });
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
        newInstallationCost = isAccessoryCartItem(item)
          ? newRequiredBoxes * 35
          : newSquareMeter * getFlooringInstallationRate(item);
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
        newInstallationCost = isAccessoryCartItem(product)
          ? newRequiredBoxes * 35
          : quantity * getFlooringInstallationRate(product);
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

    const targetItem = targetItemIndex !== -1 ? { ...cartItems[targetItemIndex] } : null;

    // 2️⃣ Add installation
    const installationCost = isAccessoryCartItem(existingItem)
      ? existingItem.requiredBoxes * 35
      : existingItem.squareMeter * getFlooringInstallationRate(existingItem);
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
    const updatedCartItems = [...cartItems];

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

    const targetItem = targetItemIndex !== -1 ? { ...cartItems[targetItemIndex] } : null;

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
    const updatedCartItems = [...cartItems];

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
                    <div className="block xl:hidden text-lg font-semibold text-black border-b border-[#DEDEDE] pb-2 mb-4 w-full">
                      Product
                    </div>
                    <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                      <div className="w-[150px] shrink-0">Product</div>
                      <div className="flex-grow">
                        <div className="grid grid-cols-12 w-full gap-4">
                          <div className="col-span-6"></div>
                          <div className="col-span-3 text-center">Quantity</div>
                          <div className="col-span-2 text-center">Total Price</div>
                          <div className="col-span-1 text-end">Action</div>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[500px] md:max-h-[590px] overflow-y-auto pr-2 custom-scrollbar">
                      {nonAccessoryItems.map((item, cartindex) => (
                        <div key={cartindex} className="border-b border-[#DEDEDE] py-4 px-2 xl:px-4 last:border-b-0">
                          {/* Mobile Delete Button - Top Right */}
                          <div className="flex justify-end xl:hidden mb-6">
                            <button
                              className="text-gray-500 hover:text-red-500 bg-[#FEB9071F] rounded-full transition flex items-center justify-center"
                              onClick={() => handleRemoveItem(item)}
                            >
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12" />
                                <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778" />
                                <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515" />
                                <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515" />
                                <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515" />
                                <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515" />
                              </svg>

                            </button>
                          </div>

                          <div className="flex gap-3 md:gap-4 items-stretch relative">
                            {/* Image */}
                            <div className="w-[100px] md:w-[130px] xl:w-[150px] shrink-0 h-[100px] md:h-[130px] xl:h-[150px] relative overflow-hidden">
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
                                  <div className="text-[#000000] text-sm mt-1">
                                    Price:{' '}<span className="font-currency text-lg font-normal"></span> {formatAED(item.price ?? 0)}/m<sup>2</sup>
                                  </div>

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
                                    className="bg-[#f5f5f3] hover:bg-red-50  hover:text-red-500  rounded-full transition flex items-center justify-center"
                                    onClick={() => handleRemoveItem(item)}
                                  >
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12" />
                                      <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778" />
                                      <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515" />
                                      <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515" />
                                      <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515" />
                                      <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515" />
                                    </svg>

                                  </button>
                                </div>
                              </div>

                              {/* Installation charges checkbox container (Desktop) */}
                              {!item.isfreeSample && (
                                <div className="mt-2 xl:mt-4 hidden xl:block">
                                  <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-lg flex items-center justify-between p-2 md:p-3 w-full`}>
                                    <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
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
                                    </label>
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
                                <label className="flex items-center gap-3 cursor-pointer">
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
                                </label>
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
                  <div className="block xl:hidden text-lg font-semibold text-black border-b border-[#DEDEDE] pb-2 mb-4 w-full">
                    Clearance Product
                  </div>
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
                                      checked
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
                  <div className="block xl:hidden text-lg font-semibold text-black border-b border-[#DEDEDE] pb-2 mb-4 w-full">
                    Accessory
                  </div>
                  <div className="hidden xl:flex gap-4 items-center text-16 font-semibold py-3 px-4 bg-[#F8F9FA] rounded-lg mb-4 text-black border border-[#EDEDED]">
                    <div className="w-[150px] shrink-0">Accessories</div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-12 w-full gap-4">
                        <div className="col-span-6"></div>
                        <div className="col-span-3 text-center">Qty Piece</div>
                        <div className="col-span-2 text-center">Total Price</div>
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
                            className="text-gray-500 hover:text-red-500 bg-[#FEB9071F] rounded-full transition flex items-center justify-center"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12" />
                              <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778" />
                              <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515" />
                              <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515" />
                              <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515" />
                              <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515" />
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
                                <div className="text-[#000000] text-sm mt-0.5">
                                  Price:{' '} <span className="font-currency text-lg font-normal"></span> {formatAED(item.price ?? 0)}/Piece
                                </div>

                                <div className="mt-0.5 text-sm text-gray-600 space-y-1">
                                  <p>
                                    Color:{' '}
                                    <span className="font-semibold text-black">
                                      {item?.selectedColor?.colorName || item?.selectedColor?.colorCode || ''}
                                    </span>
                                  </p>
                                  {(() => {
                                    const swapColor = getAccessoryColorSwap(item);
                                    if (!swapColor) return null;
                                    return (
                                      <div className="mt-1 rounded-md bg-[#FFF7E6] border border-[#FFE1A6] px-2 py-1.5 text-xs text-[#8a5a00]">
                                        <p>
                                          This colour doesn&apos;t match your flooring.
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => handleSwapColor(item, swapColor)}
                                          className="mt-1 font-semibold text-primary underline hover:opacity-80"
                                        >
                                          Swap to {swapColor.colorName || swapColor.altText} to match
                                        </button>
                                      </div>
                                    );
                                  })()}
                                </div>

                                {/* Mobile display for Quantity and Price */}
                                <div className="flex justify-between items-center mt-3 gap-3 xl:hidden pr-2">
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
                                  <span className="font-currency text-xl font-normal mb-0.5"></span>{' '}
                                  <span>{formatAED(item.totalPrice ?? 0)}</span>
                                </p>
                              </div>

                              <div className="col-span-1 hidden xl:flex justify-end">
                                <button
                                  className="bg-[#f5f5f3] hover:bg-red-50  hover:text-red-500  rounded-full transition flex items-center justify-center"
                                  onClick={() => handleRemoveItem(item)}
                                >
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" rx="16" fill="#FEB907" fillOpacity="0.12" />
                                    <rect x="0.388889" y="0.388889" width="31.2222" height="31.2222" rx="15.6111" stroke="black" strokeOpacity="0.12" strokeWidth="0.777778" />
                                    <path d="M14.0882 9.0637C13.6889 9.21411 13.3963 9.52587 13.2787 9.92514C13.2486 10.0236 13.235 10.1822 13.235 10.3846V10.6936H12.3133C11.3234 10.6936 11.2413 10.7018 10.9788 10.8386C10.5275 11.0683 10.2896 11.4976 10.3142 12.0391C10.3224 12.2634 10.3361 12.3181 10.4236 12.4985C10.5576 12.772 10.7518 12.9662 11.0253 13.0947L11.2386 13.1959L11.2441 17.4211L11.2523 21.6463L11.3288 21.8596C11.523 22.412 11.9551 22.825 12.4829 22.959C12.6224 22.9945 13.09 23 15.9916 23C18.9588 23 19.3581 22.9945 19.5085 22.9562C19.9515 22.8414 20.3563 22.5105 20.5614 22.0948C20.7665 21.6736 20.7555 21.9499 20.7555 17.3227C20.7555 13.401 20.7583 13.1795 20.8048 13.1658C20.9606 13.1139 21.1685 12.9908 21.2833 12.8841C22.0108 12.2032 21.7045 10.9862 20.7419 10.7346C20.6106 10.7018 20.4 10.6936 19.6698 10.6936H18.7592V10.4365C18.7592 10.2971 18.7455 10.1166 18.7318 10.0345C18.6662 9.69542 18.431 9.35905 18.1356 9.17856C17.8293 8.99533 17.8704 8.99806 15.9724 9.0008H14.2605L14.0882 9.0637ZM17.7172 9.73098C17.9852 9.87592 18.0727 10.0482 18.0755 10.4256V10.6936H15.9943H13.9132L13.9241 10.3846C13.9323 10.1084 13.9405 10.0674 14.0089 9.96343C14.1019 9.81575 14.2578 9.71183 14.43 9.68175C14.5011 9.67081 15.245 9.66261 16.0791 9.66261L17.5969 9.66808L17.7172 9.73098ZM20.6407 11.4211C21.0235 11.5797 21.1192 12.0528 20.8294 12.3454C20.7637 12.411 20.6653 12.4739 20.6024 12.4931C20.452 12.5368 11.5558 12.5423 11.3945 12.4958C11.337 12.4821 11.2468 12.4302 11.1921 12.381C10.8776 12.1047 10.9514 11.607 11.3343 11.4293C11.4382 11.38 11.6242 11.3773 15.9916 11.3773C20.0418 11.3773 20.5504 11.3828 20.6407 11.4211ZM20.0718 17.3172C20.0718 20.763 20.0664 21.4467 20.0336 21.5533C19.8995 21.9936 19.6015 22.2589 19.1776 22.319C19.0627 22.3355 17.7555 22.3409 15.8576 22.3382L12.729 22.33L12.5731 22.2671C12.2942 22.155 12.0672 21.9034 11.9578 21.5889C11.9141 21.4658 11.9086 21.1486 11.9031 17.3309L11.8922 13.2096H15.9834H20.0718V17.3172Z" fill="#151515" />
                                    <path d="M13.9018 14.1011C13.7131 14.194 13.7268 13.9479 13.7268 17.5113V20.7246L13.7979 20.8094C13.9921 21.0419 14.353 20.9243 14.3968 20.6125C14.405 20.5496 14.4105 19.1002 14.405 17.3937C14.3968 14.3663 14.3968 14.287 14.3421 14.2105C14.2491 14.071 14.0577 14.0218 13.9018 14.1011Z" fill="#151515" />
                                    <path d="M15.8409 14.1011C15.7917 14.1257 15.7315 14.1776 15.7042 14.2187C15.6577 14.287 15.6549 14.4593 15.6467 17.3937C15.6413 19.1002 15.6467 20.5496 15.6549 20.6125C15.6987 20.9243 16.0597 21.0419 16.2538 20.8094L16.325 20.7246V17.5113C16.325 13.9397 16.3386 14.1913 16.1445 14.0983C16.0351 14.0464 15.9503 14.0464 15.8409 14.1011Z" fill="#151515" />
                                    <path d="M17.774 14.1045C17.7193 14.1319 17.6564 14.1948 17.629 14.2495C17.5853 14.3397 17.5825 14.5393 17.588 17.5312C17.5962 20.4464 17.5989 20.7226 17.6427 20.7801C17.7165 20.8867 17.7959 20.9277 17.9244 20.9277C18.0803 20.9277 18.2006 20.8457 18.2389 20.709C18.2608 20.6379 18.2662 19.6315 18.2608 17.43L18.2526 14.2495L18.1705 14.1702C18.0639 14.0635 17.9052 14.0362 17.774 14.1045Z" fill="#151515" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Installation charges (accessory, Desktop) */}
                            <div className="mt-2 xl:mt-4 hidden xl:block">
                              <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-lg flex items-center justify-between p-2 md:p-3 w-full`}>
                                <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
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
                                </label>
                                <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-gray-200 text-gray-500'} font-bold rounded-full px-4 py-1.5 text-[14px] shadow-sm flex items-center gap-1 transition`}>
                                  <span className="font-currency font-normal text-[18px]"></span>
                                  <span>{formatAED(item.installationCost || getInstallationCost(item))}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Installation charges (accessory, Mobile) */}
                        <div className="mt-4 block xl:hidden w-full">
                          <div className={`border ${item.addInstallation ? 'border-[#ffb81c]' : 'border-[#e0e0e0]'} rounded-md flex items-center justify-between p-2 md:p-3 w-full`}>
                            <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
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
                              <span className="font-semibold text-[15px] text-black">Installation Charges</span>
                            </label>
                            <div className={`${item.addInstallation ? 'bg-[#ffb81c] text-black' : 'bg-gray-200 text-gray-500'} font-bold rounded-full px-4 py-1.5 text-[14px] shadow-sm flex items-center gap-1 transition`}>
                              <span className="font-currency font-normal text-[18px]"></span>
                              <span>{formatAED(item.installationCost || getInstallationCost(item))}</span>
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
                  // compact
                />
              )}

              <Link
                href="/checkout"
                className="bg-primary hover:bg-secondary text-white px-4 py-4 rounded-lg w-full text-sm md:text-20 block text-center "
              >
                Proceed to Checkout
              </Link>
              {/* <TrustBadges /> */}

            </div>
          </div>
          <RelatedSlider products={sliderAccessories.slice(0, 10)} isAccessories />
        </>
      )}
    </Container>
  );
};

export default CartPage;
