import { ICart, ProductImage } from 'types/prod';
import { showAlert } from './Alert';
let deleteTimer: NodeJS.Timeout | null = null;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ecommerceDB', 4);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart');
      }
      if (!db.objectStoreNames.contains('wishlist')) {
        db.createObjectStore('wishlist');
      }
      if (!db.objectStoreNames.contains('freeSample')) {
        db.createObjectStore('freeSample');
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const now = Date.now();
      const lastReset = localStorage.getItem('dbLastReset');
      if (!lastReset) {
        scheduleDelete(db, 10 * 1000); // 10s for first time
        localStorage.setItem('dbLastReset', now.toString());
      } else {
        const diff = now - parseInt(lastReset, 10);

        if (diff < 7 * 24 * 60 * 60 * 1000) {
          scheduleDelete(db, 7 * 24 * 60 * 60 * 1000 - diff);
        } else {
          db.close();
          const deleteReq = indexedDB.deleteDatabase('ecommerceDB');
          deleteReq.onsuccess = () => {
            localStorage.removeItem('dbLastReset');
          };
        }
      }

      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
};

// helper to schedule auto-delete
function scheduleDelete(db: IDBDatabase, timeout: number) {
  if (deleteTimer) clearTimeout(deleteTimer);

  deleteTimer = setTimeout(() => {
    db.close();
    const deleteReq = indexedDB.deleteDatabase('ecommerceDB');

    deleteReq.onsuccess = () => {
      console.log('Database deleted after timer.');
      localStorage.removeItem('dbLastReset');
    };
    deleteReq.onerror = () => {
      console.error('Error deleting database', deleteReq.error);
    };
    deleteReq.onblocked = () => {
      console.warn('Database deletion blocked (maybe open elsewhere)');
    };
  }, timeout);
}

export const addToCart = async (product: ICart): Promise<boolean> => {
  try {
    // 1️⃣ Validate quantity
    if (!product.squareMeter || product.squareMeter <= 0) {
      showAlert({
        title: 'Please enter a valid box quantity (at least 1).',
        icon: 'error'
      });
      return false;
    }

    const db = await openDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');

    // 2️⃣ Load full cart (needed for clearance bundle check)
    const cartItems: ICart[] = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // 3️⃣ Composite key logic (correct handling)
    let compositeKey: string;

    if (product.category?.toLowerCase().trim() === 'accessories') {
      compositeKey = `${product.id}-${product.selectedColor?.color}`;
    } else if (product.isClearance && product.addInstallation) {
      compositeKey = `${product.id}-clearance-installation`;
    } else if (product.isClearance) {
      compositeKey = `${product.id}-clearance`;
    } else if (product.addInstallation) {
      compositeKey = `${product.id}-installation`;
    } else {
      compositeKey = String(product.id);
    }

    // 4️⃣ Check existing product by composite key
    const existingProduct: ICart | undefined = await new Promise(
      (resolve, reject) => {
        const request = store.get(compositeKey);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    );

    // 5️⃣ CLEARANCE BUNDLE DUPLICATE CHECK
    // same id + same boxCoverage + both clearance → block
    const existingBundle = cartItems.find(
      (item) =>
        item.id === product.id &&
        item.boxCoverage === product.boxCoverage &&
        item.isClearance === true &&
        product.isClearance === true
    );

    if (existingBundle) {
      showAlert({
        title: 'Bundle is already added',
        icon: 'error'
      });
      return false;
    }

    // 🔍 Count TOTAL SQM already in cart for THIS product
    const sqmAlreadyInCart = cartItems
      .filter(item => item.id === product.id)
      .reduce((sum, item) => {
        return sum + (item.squareMeter);
      }, 0);

    // 🔢 SQM requested for the NEW addition
    let newSQMRequired;

    if (product.category?.toLowerCase().trim() === "accessories") {
      newSQMRequired = product.requiredBoxes;
    } else {
      newSQMRequired = product.squareMeter; // quantity = sqm requested
    }

    // 📦 Total available SQM from stock
    const totalAvailableSQM =
      product.stock * (product.category?.toLowerCase().trim() === "accessories" ? 1 : Number(product.boxCoverage) || 1);

    // 📉 Remaining SQM
    const remainingSQM = Number((totalAvailableSQM - sqmAlreadyInCart).toFixed(2));
    // ❗ FINAL STOCK CHECK (SQM-based)
    if (newSQMRequired > remainingSQM) {
      showAlert({
        title: `Cannot add more than ${product.category?.toLowerCase().trim() === "accessories" ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
        icon: "error",
      });
      return false;
    }


    // 6️⃣ Merge boxes only for same composite key
    let newRequiredBoxes = product.requiredBoxes || 1;
    let newSquareMeter = product.squareMeter || 1;

    if (existingProduct) {
      newRequiredBoxes += existingProduct.requiredBoxes || 0;
      newSquareMeter += existingProduct.squareMeter || 0;
    }

    // 7️⃣ Stock validation
    // if (newRequiredBoxes > product.stock) {
    //   // const remainingSQM = remainingStock * Number(product.boxCoverage);
    //   showAlert({
    //     title: `Cannot add more than ${product.category?.toLowerCase().trim() === "accessories" ? `${remainingSQM} Peices` : `${remainingSQM.toFixed(2)} SQM`}.`,
    //     icon: 'error'
    //   });
    //   return false;
    // }
    const adjustedSquareMeter = (product.category?.toLowerCase().trim() === 'accessories') ? newRequiredBoxes : newSquareMeter;

    // 8️⃣ Build updated product for saving
    const updatedProduct = {
      ...product,
      requiredBoxes: newRequiredBoxes,
      squareMeter: newSquareMeter,
      totalPrice: product.addInstallation
        ? Number(product.price || 0) * adjustedSquareMeter +
        (product.installationCost || 0)
        : Number(product.price || 0) * adjustedSquareMeter
    };
    // 9️⃣ Save to DB
    await store.put(updatedProduct, compositeKey);

    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return false;
  }
};

export const getCart = async (): Promise<ICart[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readonly');
    const store = tx.objectStore('cart');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const removeCartItem = async (id: string | number): Promise<void> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('cart', 'readwrite');
      const store = tx.objectStore('cart');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => resolve();
    });
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    throw error;
  }
};

// Swap an accessory cart item's color to a matching variant. Because the
// accessory composite key includes the color, this moves the item to a new key.
export const updateCartItemColor = async (
  item: ICart,
  newColor: ProductImage
): Promise<void> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('cart', 'readwrite');
      const store = tx.objectStore('cart');

      const oldKey = `${item.id}-${item.selectedColor?.color}`;
      const newKey = `${item.id}-${newColor.color}`;

      const updatedItem: ICart = {
        ...item,
        selectedColor: {
          ...newColor,
          public_id: newColor.public_id || '',
          imageUrl: newColor.imageUrl || '',
          colorName: newColor.colorName || newColor.altText || ''
        },
        image: newColor.imageUrl || item.image,
        matchedProductImages: newColor
      };

      if (oldKey !== newKey) {
        store.delete(oldKey);
      }
      store.put(updatedItem, newKey);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });

    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    throw error;
  }
};

export const addToWishlist = async (product: ICart): Promise<boolean> => {
  try {
    const db = await openDB();
    const tx = db.transaction('wishlist', 'readwrite');
    const store = tx.objectStore('wishlist');

    // 1️⃣ Build composite key
    let compositeKey: string;
    if (product.category?.toLowerCase().trim() === 'accessories') {
      compositeKey = `${product.id}-${product.selectedColor?.color}`;
    } else if (product.isClearance && product.addInstallation) {
      compositeKey = `${product.id}-clearance-installation`;
    } else if (product.isClearance) {
      compositeKey = `${product.id}-clearance`;
    } else if (product.addInstallation) {
      compositeKey = `${product.id}-installation`;
    } else {
      compositeKey = String(product.id);
    }

    // 2️⃣ Check if product already exists
    const existingProduct: ICart | undefined = await new Promise(
      (resolve, reject) => {
        const request = store.get(compositeKey);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    );

    if (existingProduct) {
      // Already in wishlist
      return false;
    }

    // 3️⃣ Save product to wishlist
    await new Promise<void>((resolve, reject) => {
      const request = store.put(
        {
          ...product,
          requiredBoxes: product.requiredBoxes ?? 1
        },
        compositeKey
      );
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    window.dispatchEvent(new Event('wishlistUpdated'));
    return true;
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    throw error;
  }
};

export const removeWishlistItem = async (
  id: number | string
): Promise<void> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('wishlist', 'readwrite');
      const store = tx.objectStore('wishlist');
      const request = store.delete(id);

      request.onsuccess = () => {
        tx.oncomplete = () => resolve();
      };
      request.onerror = () => reject(request.error);
    });

    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (error) {
    throw error;
  }
};

export const getWishlist = async (): Promise<ICart[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('wishlist', 'readonly');
      const store = tx.objectStore('wishlist');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    throw error;
  }
};

export const addToFreeSample = async (product: ICart): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction('freeSample', 'readwrite');
    const store = tx.objectStore('freeSample');
    // const compositeKey = String(product.id)
    let compositeKey: string;
    if (product.category?.toLowerCase().trim() === 'accessories') {
      compositeKey = `${product.id}-${product.selectedColor?.color}`;
    } else {
      compositeKey = String(product.id);
    }

    const samples: ICart[] = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (samples.length >= 5) {
      showAlert({
        title: 'You can only add up to 5 free samples.',
        icon: 'error'
      });
      return;
    }

    product.requiredBoxes = 1;
    product.price = 0;
    product.totalPrice = 0;

    await new Promise<void>((resolve, reject) => {
      const request = store.put(product, compositeKey);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    window.dispatchEvent(new Event('freeSampleUpdated'));
  } catch (error) {
    showAlert({
      title: 'Error adding free sample.',
      icon: 'error'
    });
    throw error;
  }
};

export const removeFreeSample = async (id: number | string): Promise<void> => {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('freeSample', 'readwrite');
      const store = tx.objectStore('freeSample');
      const request = store.delete(id);

      request.onsuccess = () => {
        tx.oncomplete = () => resolve();
      };
      request.onerror = () => reject(request.error);
    });

    window.dispatchEvent(new Event('freeSampleUpdated'));
  } catch (error) {
    throw error;
  }
};

export const getFreeSamples = async (): Promise<ICart[]> => {
  try {
    const db = await openDB();

    if (!db.objectStoreNames.contains('freeSample')) {
      return [];
    }

    const tx = db.transaction('freeSample', 'readonly');
    const store = tx.objectStore('freeSample');
    const request = store.getAll();

    return await new Promise<ICart[]>((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    return [];
    throw error;
  }
};
