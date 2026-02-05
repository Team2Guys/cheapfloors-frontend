import { EDIT_CATEGORY } from 'types/cat';
import { IProduct, ProductImage } from 'types/prod';
import { showAlert } from 'utils/Alert';
import {
  addToCart,
  addToFreeSample,
  addToWishlist,
  getFreeSamples
} from 'utils/indexedDB';

export const handleAddToStorage = async (
  productData: IProduct | EDIT_CATEGORY,
  totalPrice: string | number,
  pricePerBox: number,
  squareMeter: number,
  requiredBoxes: number,
  subCategory: string,
  MainCategory: string,
  type: 'cart' | 'wishlist' | 'freeSample',
  image?: string,
  boxCoverage?: string,
  unit?: string,
  selectedColor?: ProductImage,
  matchedProductImages?: ProductImage,
  isClearance?: boolean,
  installationCost?: number,
  addInstallation?: boolean
) => {
  if (!productData) {
    showAlert({
      title: 'Product is undefined',
      icon: 'error'
    });
    return;
  }
  if (type === 'cart') {
    if (requiredBoxes <= 0) {
      showAlert({
        title: 'Please enter quantity to add the product to the cart.',
        icon: 'error'
      });
      return;
    }

    if (requiredBoxes > Number(productData?.stock)) {
      const totalSQM = Number(productData?.stock) * Number(productData.boxCoverage);
      showAlert({
        title: `Requested SQM quantity exceeds available stock! Only ${totalSQM} available.`,
        icon: 'error'
      });
      return;
    }
  }


  const adjustedSquareMeter = (MainCategory.toLowerCase().trim() === 'accessories') ? requiredBoxes : squareMeter;
  const adjustedTotalPrice =
    Number(totalPrice) > 0 ? totalPrice : Number(productData.price || 0 ) * (adjustedSquareMeter || 1);

  let posterImageUrl;
  if (MainCategory.toLowerCase().trim() === 'accessories') {
    posterImageUrl =
      (productData as IProduct).productImages?.find(
        (img) => img.colorCode === selectedColor?.color
      )?.imageUrl ?? image;
  } else {
    posterImageUrl = matchedProductImages?.imageUrl ?? image;
  }
  const adjustedUnit = unit || 'sqm';

  const item = {
    id: Number(productData.id),
    name: productData.name,
    price: Number(
      isClearance ? (productData as IProduct).bundlePrice : productData.price
    ),
    stock: Number(productData.stock),
    image: posterImageUrl,
    subcategories: subCategory,
    category: MainCategory,
    boxCoverage,
    totalPrice: addInstallation
      ? Number(adjustedTotalPrice) + (installationCost || 0)
      : Number(adjustedTotalPrice),
    pricePerBox,
    squareMeter: adjustedSquareMeter || 1,
    requiredBoxes: requiredBoxes || 1,
    unit: adjustedUnit,
    selectedColor,
    matchedProductImages,
    isfreeSample: type === 'freeSample' || false,
    custom_url: productData.custom_url,
    isClearance: isClearance || false,
    installationCost: installationCost || 0,
    addInstallation: addInstallation || false
  };

  try {
    if (type === 'cart') {
      const success = await addToCart(item);
      if (success) return;
    } else if (type === 'freeSample') {
      const existingSamples = await getFreeSamples();

      // if (existingSamples.some((sample) => sample.id === item.id)) {
      if (
        existingSamples.some(
          (sample) =>
            sample.id === item.id &&
            sample.selectedColor?.color === item.selectedColor?.color
        )
      ) {
        showAlert({
          title: 'Product already added to Free Samples.',
          icon: 'info'
        });
        return;
      }

      if (existingSamples.length >= 5) {
        showAlert({
          title: 'You can add only up to 5 free samples.',
          icon: 'error'
        });
        return;
      }

      await addToFreeSample(item);
      return;
    } else if (type === 'wishlist') {
      const added = await addToWishlist(item);

      if (!added) {
        showAlert({
          title: 'Product is already in your wishlist.',
          icon: 'info'
        });
      }
      return;
    }
  } catch {
    showAlert({
      title: `Error adding product to ${type}`,
      icon: 'error'
    });
  }
};

export const calculateProductDetails = (
  area: string,
  unit: string,
  productData: IProduct | undefined
) => {
  const boxCoverage = productData?.boxCoverage;
  const pricePerSqm = (productData?.price || 0);
  const numericCoverage = Number(boxCoverage);
  const convertedArea =
    unit === 'sqft'
      ? parseFloat((parseFloat(area) * 0.092903).toFixed(2))
      : parseFloat(area);

  const requiredBoxes =
    area && numericCoverage > 0
      ? Math.ceil(convertedArea / numericCoverage)
      : 0;

  const pricePerBox =
    productData?.price !== undefined ? numericCoverage * productData.price : 0;

  const squareMeter = convertedArea;
  const totalPrice = unit === 'sqft' ? Number(area) * Number(pricePerSqm / 10.7639) : Number(area) * pricePerSqm;
  const installments = totalPrice / 4;

  return {
    convertedArea,
    requiredBoxes,
    pricePerBox,
    squareMeter,
    totalPrice,
    installments,
    boxCoverage
  };
};
