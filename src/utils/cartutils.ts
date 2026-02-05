import { ICart } from 'types/prod';
import {
  getWishlist,
  removeWishlistItem,
  getFreeSamples,
  removeFreeSample,
  addToCart
} from 'utils/indexedDB';
import { showAlert } from './Alert';

export const fetchItems = async (
  isSamplePage: boolean,
  setItems?: (_items: ICart[]) => void
) => {
  try {
    if (isSamplePage) {
      const samples = await getFreeSamples();
      if (setItems) {
        setItems(samples);
      } else {
        return samples;
      }
    } else {
      const wishlist = await getWishlist();
      if (setItems) {
        setItems(wishlist);
      } else {
        return wishlist;
      }
    }
  } catch {
    console.log('Error fetching items.');
  }
};

export const updateQuantity = (
  product: ICart,
  delta: number,
  items: ICart[]
): ICart[] => {
  return items.map((item) => {
    if (
      !(
        item.id === product.id &&
        item.selectedColor?.color === product.selectedColor?.color &&
        item.addInstallation === product.addInstallation
      )
    )
      return item;

    // Handle Accessories (quantity is in meters)
    if (
      item.category?.toLowerCase() === 'accessories' ||
      item.category === 'Accessory'
    ) {
      const metres = Math.max(1, (item.requiredBoxes ?? 1) + delta);
      const unitPrice = item.price ?? 0; // price per metre
      const totalPrice = +(unitPrice * metres).toFixed(2);

      return {
        ...item,
        requiredBoxes: metres,
        squareMeter: metres,
        totalPrice
      };
    }
    // Handle Tiles and other products (based on square meters)
    const newArea = Math.max(1, +(item.squareMeter + delta).toFixed(2));
    const sqmPerBox = Number(item.boxCoverage) || 1;
    const areaInSqm = item.unit === 'sqft' ? newArea / 10.764 : newArea;

    const boxesNeeded = Math.ceil(areaInSqm / sqmPerBox);
   

    let newInstallationCost = 0;
    if (item.addInstallation) {
      const installationRate = item?.name.toLowerCase()?.includes('herringbone')
        ? 35
        : 25;
      newInstallationCost = newArea * installationRate;
    }
    const totalPrice = areaInSqm * (item.price || 0) + newInstallationCost;
    return {
      ...item,
      requiredBoxes: boxesNeeded,
      squareMeter: newArea,
      totalPrice,
      installationCost: newInstallationCost
    };
  });
};

export const handleRemoveItem = async (
  product: ICart,
  setItems: (_callback: (_prevItems: ICart[]) => ICart[]) => void,
  isSamplePage?: boolean
) => {
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
    if (isSamplePage) {
      await removeFreeSample(compositeKey);
      window.dispatchEvent(new Event('freeSampleUpdated'));
    } else {
      await removeWishlistItem(compositeKey);
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
    setItems((_prev) =>
      _prev.filter(
        (item) =>
          !(
            item.id === product.id &&
            item.selectedColor?.color === product.selectedColor?.color &&
            item.isClearance === product.isClearance &&
            item.addInstallation === product.addInstallation
          )
      )
    );
  } catch {
    showAlert({
      title: 'Error removing item.',
      icon: 'error'
    });
  }
};

export const handleAddToCart = async (
  product: ICart,
  setItems: (_callback: (_prevItems: ICart[]) => ICart[]) => void
) => {
  try {
    const success = await addToCart(product);
    if (success) {
      await handleRemoveItem(product, setItems);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  } catch {
    showAlert({
      title: 'Error adding item.',
      icon: 'error'
    });
  }
};
