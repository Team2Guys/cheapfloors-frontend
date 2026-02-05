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

        return a.price - b.price;
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

        return b.price - a.price;
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
    weekday: 'long',
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
        '22nd 15B St - Al Quoz - Al Quoz Industrial Area 4 - Dubai - UAE'
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
    const price = parseFloat(
      String(isClearance ? product.bundlePrice : product.price)
    );
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
  selectedProductFilters
}: ProductFilterParams): {
  filtered: ISUBCATEGORY[];
  appliedFilters: SelectedFilter[];
} => {
  let filtered = products ?? [];

  const appliedFilters: SelectedFilter[] = [];

  // Filter by price
  filtered = filtered.filter((product) => {
    const price = parseFloat(String(product?.price ?? 0));
    return price >= priceValue[0] && price <= priceValue[1];
  });

  const filterMapping: { key: keyof FilterState; productKey: string }[] = [
    { key: 'thicknesses', productKey: 'thickness' },
    { key: 'plankWidth', productKey: 'width' },
    { key: 'plankLength', productKey: 'height' }
  ];

  filterMapping.forEach(({ key, productKey }) => {
    const selectedValues = selectedProductFilters[key];
    if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      filtered = filtered.filter((product) => {
        const filterValue = product?.sizes?.[0]?.[productKey] ?? '';
        return selectedValues.includes(filterValue);
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
  if (!price || isNaN(price)) return '0.00';
  return price.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

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
