import axios from 'axios';
import React from 'react';
import { FILE_DELETION_MUTATION } from 'graphql/mutations';
import { IProduct, ProductImage, AdditionalInformation } from 'types/prod';
import { Category } from 'types/cat';
import Swal from 'sweetalert2';
import { ImagesProps } from 'components/ImageUploader/ImageUploader';
import { FILE_UPLOAD_MUTATION } from 'graphql/mutations';
import { FilterState, ISUBCATEGORY } from 'types/cat';
import { ProductFilterParams, SelectedFilter } from 'types/types';

export const ImageRemoveHandler = async (
  imagePublicId: string,
  setterFunction: React.Dispatch<
    React.SetStateAction<ProductImage[] | undefined>
  >,
  finalToken?: string
) => {
  try {
    await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL || '',
      {
        query: FILE_DELETION_MUTATION,
        variables: {
          public_id: imagePublicId
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${finalToken}`
        },
        withCredentials: true
      }
    );

    setterFunction((prev) =>
      prev?.filter((item) => item.public_id !== imagePublicId)
    );
  } catch (error) {
    throw error;
  }
};

export const handleImageAltText = (
  index: number,
  newImageIndex: string,
  setImagesUrlhandler: React.Dispatch<
    React.SetStateAction<ProductImage[] | undefined>
  >,
  variantType: string
) => {
  setImagesUrlhandler((prev: ProductImage[] | undefined) => {
    if (!prev) return [];

    const updatedImagesUrl = prev?.map((item: ProductImage, i: number) =>
      i === index ? { ...item, [variantType]: newImageIndex } : item
    );
    return updatedImagesUrl;
  });
};

export const TrimerHandler = (value: string) => {
  if (!value) return;

  return value.trim().toLowerCase();
};

// Returns the price to use for sorting/filtering: the discount price when the
// product has a valid discount, otherwise the regular price.
export const getEffectivePrice = (product: IProduct): number => {
  const discountedPrice = product.discountPrice;
  const hasDiscount = !!discountedPrice && discountedPrice > 0;
  return Number(hasDiscount ? discountedPrice : product.price);
};

export const ProductsSorting = (
  filtered: IProduct[],
  sortOption: string,
  isClearance?: boolean
): IProduct[] => {
  const clone = [...filtered];

  const getSortablePart = (name: string) => {
    const parts = name.split(' - ');
    return parts.length > 1 ? parts[1] : name;
  };

  switch (sortOption) {
    case 'A to Z':
      return clone.sort((a, b) => {
        if (!a.name || !b.name) return 0;
        const nameA = getSortablePart(a.name);
        const nameB = getSortablePart(b.name);
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });

    case 'Z to A':
      return clone.sort((a, b) => {
        if (!a.name || !b.name) return 0;
        const nameA = getSortablePart(a.name);
        const nameB = getSortablePart(b.name);
        return nameB.localeCompare(nameA, undefined, { sensitivity: 'base' });
      });

    case 'Low to High':
      return clone.sort((a, b) => {
        if (isClearance) {
          const rawPriceA =
            a?.bundle && a?.bundlePrice
              ? a.bundle *
              (Number(a.bundlePrice) * (Number(a?.boxCoverage) || 1))
              : a.price;

          const rawPriceB =
            b?.bundle && b?.bundlePrice
              ? b.bundle *
              (Number(b.bundlePrice) * (Number(b?.boxCoverage) || 1))
              : b.price;

          const priceA = Number(rawPriceA);
          const priceB = Number(rawPriceB);

          return priceA - priceB;
        }

        return getEffectivePrice(a) - getEffectivePrice(b);
      });

    case 'High to Low':
      return clone.sort((a, b) => {
        if (isClearance) {
          const rawPriceA =
            a?.bundle && a?.bundlePrice
              ? a.bundle *
              (Number(a.bundlePrice) * (Number(a?.boxCoverage) || 1))
              : a.price;

          const rawPriceB =
            b?.bundle && b?.bundlePrice
              ? b.bundle *
              (Number(b.bundlePrice) * (Number(b?.boxCoverage) || 1))
              : b.price;

          const priceA = Number(rawPriceA);
          const priceB = Number(rawPriceB);

          return priceB - priceA;
        }

        return getEffectivePrice(b) - getEffectivePrice(a);
      });

    default:
      return filtered;
  }
};

export function getExpectedDeliveryDate(
  shippingMethod: 'Standard Shipping' | 'Express Shipping' | 'Self Collect',
  orderTime: Date
): string {
  const orderHour = orderTime.getHours();
  const currentDate = new Date(orderTime);

  if (shippingMethod === 'Express Shipping') {
    currentDate.setDate(currentDate.getDate() + (orderHour < 13 ? 1 : 2));
    return `Expected delivery within 1 day i.e;  ${formatDate(currentDate)}`;
  } else if (shippingMethod === 'Standard Shipping') {
    let daysToAdd = 0;
    const deliveryDates: string[] = [];
    currentDate.setDate(currentDate.getDate() + 1);

    while (daysToAdd < 2) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        deliveryDates.push(formatDate(new Date(currentDate)));
        daysToAdd++;
      }
    }

    return (
      'Expected delivery within 2-3 days i.e;' + deliveryDates.join(' to ')
    );
  }

  const newDate = new Date(currentDate.setDate(currentDate.getDate() + 2));
  const twoDayEarlierDate = new Date(
    currentDate.setDate(currentDate.getDate() + 1)
  );

  return (
    'Available for self collection within 2-3 days i.e:' +
    formatDate(newDate) +
    ' to ' +
    formatDate(twoDayEarlierDate)
  );
}

export function trackingOrder(
  shippingMethod: 'Standard Shipping' | 'Express Shipping' | 'Self Collect',
  orderTime: Date
): string {
  const orderHour = orderTime.getHours();
  const currentDate = new Date(orderTime);

  if (shippingMethod === 'Express Shipping') {
    currentDate.setDate(currentDate.getDate() + (orderHour < 13 ? 1 : 2));
    return formatDate(currentDate);
  } else if (shippingMethod === 'Standard Shipping') {
    let daysToAdd = 0;
    const deliveryDates: string[] = [];
    currentDate.setDate(currentDate.getDate() + 1);

    while (daysToAdd < 2) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
        deliveryDates.push(formatDate(new Date(currentDate)));
        daysToAdd++;
      }
    }

    return deliveryDates.join(' to ');
  }

  const newDate = new Date(currentDate.setDate(currentDate.getDate() + 2));
  const twoDayEarlierDate = new Date(
    currentDate.setDate(currentDate.getDate() + 1)
  );

  return formatDate(newDate) + ' to ' + formatDate(twoDayEarlierDate);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export const handleNavigate = (product: IProduct, categoryData: Category) => {
  if (product.subcategory) {
    return `/${product.category?.RecallUrl ?? categoryData?.RecallUrl}/${product.subcategory?.custom_url ?? ''}/${product.custom_url?.toLowerCase() ?? ''}`;
  } else {
    return `/${product.category?.RecallUrl ?? categoryData?.RecallUrl}/${product.custom_url?.toLowerCase() ?? ''}`;
  }
};

export const getShippingData = (
  type: string,
  fee: number,
  selectedEmirate: string
) => {
  if (type === 'express') {
    return {
      name: 'Express Service (Dubai Only)',
      fee,
      deliveryDuration: 'Next working day (cut-off time 1pm)'
    };
  } else if (type === 'standard') {
    if (selectedEmirate === 'Dubai') {
      return {
        name: 'Standard Service (Dubai)',
        fee,
        deliveryDuration: '2 working days'
      };
    } else {
      return {
        name: 'Standard Service (All Other Emirates)',
        fee,
        deliveryDuration: '2-3 working days',
        freeShipping: 1000
      };
    }
  } else if (type === 'self-collect') {
    return {
      name: 'Self-Collect',
      fee,
      deliveryDuration: 'Monday to Saturday, 9am – 6pm',
      location:
        '24, 22nd street - Al Quoz Industrial Area 4 - Dubai - UAE'
    };
  }
};

export const updateImageStates = (
  setters: React.Dispatch<React.SetStateAction<ProductImage[] | undefined>>[],
  newImg: Partial<ProductImage>,
  originalSrc: string
) => {
  setters.forEach((setter) => {
    setter((prev) =>
      prev?.map((img) =>
        img.imageUrl === originalSrc ? { ...img, ...newImg } : img
      )
    );
  });
};

export const confirmLeaveWithUnsavedChanges = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Unsaved Changes!',
    text: 'You have unsaved changes. Do you want to leave without saving?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, leave',
    cancelButtonText: 'Stay here'
  });
  return result.isConfirmed;
};

export const confirmDeleteImage = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: 'Delete Image?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: 'Deleted!',
      text: 'Your image has been deleted.',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    });
    return true;
  }
  return false;
};

export const uploadPhotosToBackend = async (files: File[]) => {
  if (files.length === 0) throw new Error('No files found');

  const Response_data: ImagesProps[] = [];

  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append(
        'operations',
        JSON.stringify({
          query: FILE_UPLOAD_MUTATION,
          variables: { file: null }
        })
      );
      formData.append('map', JSON.stringify({ file: ['variables.file'] }));
      formData.append('file', file);
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL || '', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      if (result.data) {
        Response_data.push(result.data.createFileUploading);
      }
    }

    return Response_data;
  } catch (error) {
    throw error;
  }
};

export const productFilter = ({
  products,
  priceValue,
  coverageArea,
  sortOption,
  selectedProductFilters,
  isWaterProof,
  subcategory,
  selectedTags,
  isClearance
}: ProductFilterParams & { selectedTags?: string[] }): {
  filtered: IProduct[];
  appliedFilters: SelectedFilter[];
} => {
  let filtered = products;
  const appliedFilters: SelectedFilter[] = [];

  if (subcategory) {
    filtered = filtered?.filter(
      (product) =>
        product.subcategory?.custom_url === subcategory &&
        product.status === 'PUBLISHED'
    );
  }

  filtered = ProductsSorting(filtered || [], sortOption, isClearance);

  filtered = filtered?.filter((product) => {
    const price = isClearance
      ? parseFloat(String(product.bundlePrice))
      : getEffectivePrice(product);
    return price >= priceValue[0] && price <= priceValue[1];
  });

  if (coverageArea) {
    filtered = filtered?.filter((product) => {
      const coverage = parseFloat(
        (
          product?.bundle && product?.bundle * Number(product?.boxCoverage)
        )?.toFixed(2)
      );
      return coverage >= coverageArea[0] && coverage <= coverageArea[1];
    });
  }

  if (selectedTags && selectedTags.length > 0) {
    filtered = filtered?.filter((product) => {
      const productName = product.name?.toLowerCase() || '';
      return selectedTags.some((tag) => {
        const normalizedTag = tag.toLowerCase();
        return productName.includes(normalizedTag);
      });
    });

    selectedTags.forEach((tag) => {
      appliedFilters.push({ name: 'Tag', value: tag });
    });
  }

  if (isWaterProof === true || isWaterProof === false) {
    filtered = filtered?.filter(
      (product) => product.waterproof === isWaterProof
    );
    appliedFilters.push({ name: 'isWaterProof', value: isWaterProof });
  }

  const filterMapping: { key: keyof FilterState; productKey: string }[] = [
    { key: 'Colours', productKey: 'colors' },
    { key: 'thicknesses', productKey: 'thickness' },
    { key: 'commercialWarranty', productKey: 'CommmericallWarranty' },
    { key: 'residentialWarranty', productKey: 'ResidentialWarranty' },
    { key: 'plankWidth', productKey: 'plankWidth' },
    { key: 'plankLength', productKey: 'plankLength' }
  ];
  const normalizeKeys: (keyof FilterState)[] = [
    'thicknesses',
    'plankWidth',
    'plankLength'
  ];

  filterMapping.forEach(({ key, productKey }) => {
    const selectedValues = selectedProductFilters[key];
    if (selectedValues.length > 0) {
      filtered = filtered?.filter((product) => {
        let productValue = product[productKey];

        if (key === 'plankLength') {
          productValue = product.sizes?.[0]?.height;
        }

        if (typeof productValue === 'string') {
          productValue = normalizeKeys.includes(key)
            ? productValue.replace(/\s+/g, '').trim()
            : productValue.trim();
        }

        if (Array.isArray(productValue)) {
          return productValue.some((val: AdditionalInformation) =>
            selectedValues.includes(val?.name.trim())
          );
        }

        return selectedValues.includes(productValue || '');
      });

      selectedValues.forEach((value: string) => {
        appliedFilters.push({ name: key, value });
      });
    }
  });
  filtered = isClearance ? filtered : filtered.filter((product) => product.status === 'PUBLISHED');
  return { filtered: filtered || [], appliedFilters };
};

export const collectionFilter = ({
  products,
  priceValue,
  selectedProductFilters,
  isWaterProof,
  selectedTags
}: ProductFilterParams): {
  filtered: ISUBCATEGORY[];
  appliedFilters: SelectedFilter[];
} => {
  let filtered = (products as unknown as ISUBCATEGORY[]) ?? [];
  const appliedFilters: SelectedFilter[] = [];

  // Filter by price
  filtered = filtered.filter((product) => {
    const price = parseFloat(String(product?.price ?? 0));
    return price >= priceValue[0] && price <= priceValue[1];
  });

  // Draft products must not influence any subcategory matching below
  const publishedProducts = (subcat: ISUBCATEGORY) =>
    subcat.products?.filter((prod) => prod.status === 'PUBLISHED') ?? [];

  // Filter by waterproof
  if (isWaterProof === true || isWaterProof === false) {
    filtered = filtered.filter((subcat) => {
      return publishedProducts(subcat).some(
        (prod) => prod.waterproof === isWaterProof
      );
    });
    appliedFilters.push({ name: 'isWaterProof', value: isWaterProof });
  }

  // Filter by tags
  if (selectedTags && selectedTags.length > 0) {
    filtered = filtered.filter((subcat) => {
      const subcatName = subcat.name?.toLowerCase() || '';
      return selectedTags.some((tag) => {
        const normalizedTag = tag.toLowerCase();
        return subcatName.includes(normalizedTag) || publishedProducts(subcat).some((prod) => prod.name?.toLowerCase().includes(normalizedTag));
      });
    });
    selectedTags.forEach((tag) => {
      appliedFilters.push({ name: 'Tag', value: tag });
    });
  }

  // Filter by selected product filters (Colours, thicknesses, commercialWarranty, residentialWarranty, plankWidth, plankLength)
  const filterMapping: { key: keyof FilterState; productKey: string }[] = [
    { key: 'Colours', productKey: 'colors' },
    { key: 'thicknesses', productKey: 'thickness' },
    { key: 'commercialWarranty', productKey: 'CommmericallWarranty' },
    { key: 'residentialWarranty', productKey: 'ResidentialWarranty' },
    { key: 'plankWidth', productKey: 'plankWidth' },
    { key: 'plankLength', productKey: 'plankLength' }
  ];

  const normalizeKeys: (keyof FilterState)[] = [
    'thicknesses',
    'plankWidth',
    'plankLength'
  ];

  filterMapping.forEach(({ key, productKey }) => {
    const selectedValues = selectedProductFilters[key];
    if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      filtered = filtered.filter((subcat) => {
        // A subcat matches if its sizes match, OR if any of its products match
        type SizeKey = 'thickness' | 'width' | 'height';

        const sizeKey: SizeKey | undefined =
          productKey === 'thickness'
            ? 'thickness'
            : productKey === 'plankWidth'
              ? 'width'
              : productKey === 'plankLength'
                ? 'height'
                : undefined;

        const subcatValue =
          sizeKey ? subcat.sizes?.[0]?.[sizeKey] : undefined;

        const normalizedSubcatValue = typeof subcatValue === 'string'
          ? (normalizeKeys.includes(key) ? subcatValue.replace(/\s+/g, '').trim() : subcatValue.trim())
          : '';

        if (normalizedSubcatValue && selectedValues.includes(normalizedSubcatValue)) {
          return true;
        }

        // Otherwise check its products
        return publishedProducts(subcat).some((product) => {
          let productValue = product[productKey as keyof typeof product];

          if (key === 'plankLength') {
            productValue = product.sizes?.[0]?.height;
          }

          if (typeof productValue === 'string') {
            productValue = normalizeKeys.includes(key)
              ? productValue.replace(/\s+/g, '').trim()
              : productValue.trim();
          }

          if (Array.isArray(productValue)) {

            //eslint-disable-next-line
            return productValue.some((val: any) =>
              selectedValues.includes(val?.name?.trim() || val?.trim() || '')
            );
          }

          return selectedValues.includes((productValue as string) || '');
        });
      });

      selectedValues.forEach((value) => {
        appliedFilters.push({ name: key, value });
      });
    }
  });

  return { filtered, appliedFilters };
};

export const filterAndSort = (
  items: ISUBCATEGORY[],
  categoryName: string,
  urlIncludes: string
) =>
  items
    .filter(
      (item) =>
        item.status === 'PUBLISHED' &&
        item.category?.name === categoryName &&
        item.custom_url.includes(urlIncludes)
    )
    .sort((a, b) => Number(a.price) - Number(b.price));

export const formatAED = (price: number | undefined | null): string => {
  if (price == null || isNaN(price)) return '0';

  const isWholeNumber = price % 1 === 0;

  return price.toLocaleString('en-AE', {
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: 2
  });
};

// Uppercase "SPC"/"LVT", capitalize every other word.
// e.g. "spc flooring" -> "SPC Flooring", "POLAR FLOORING" -> "Polar Flooring".
export const formatDisplayName = (name: string) =>
  name
    ?.split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'spc' || lower === 'lvt') return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ') ?? name;

export const DateFormatHandler = (input: Date | string) => {
  if (!input) return 'Not available';

  const parsedDate = typeof input === 'string' ? new Date(input) : input;

  if (isNaN(parsedDate.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
    .format(parsedDate)
    .toUpperCase();
};
