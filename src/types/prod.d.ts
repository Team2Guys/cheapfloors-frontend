import { EDIT_CATEGORY, ISUBCATEGORY, ISUBCATEGORY_EDIT } from './cat';
import { BlogStatus } from './general';
import { AdditionalInformation } from './type';

export interface ProductImage {
  imageUrl: string;
  public_id: string;
  altText?: string;
  imageIndex?: number;
  Index?: string;
  size?: string;
  color?: string | number;
  colorName?: string;
  plankWidth?: string;
  plankHeight?: string;
  isBlurred?: boolean;
  colorCode?: string;
}

export interface AdditionalInformation {
  name: string;
  detail: string;
}

export interface IProduct {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  short_description?: string;
  stock?: number;
  discountPrice?: number;
  sale?: string;
  spacification?: specsDetails[];
  posterImageUrl: ProductImage;
  productImages?: ProductImage[];
  hoverImageUrl?: ProductImage;
  AdditionalInformation?: AdditionalInformation[];
  colors?: AdditionalInformation[];
  categoriesId?: number;
  subcategory: ISUBCATEGORY_EDIT;
  custom_url?: string;
  thickness?: string;
  ResidentialWarranty?: string;
  CommmericallWarranty?: string;
  plankWidth?: string;
  waterproof?: boolean;
  category: EDIT_CATEGORY;
  Meta_Title?: string;
  Canonical_Tag?: string;
  Meta_Description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
  FAQS?: AdditionalInformation[];
  boxCoverage?: string;
  featureImages?: ProductImage[];
  acessories?: IProduct[];
  colorCode: string;
  __typename?: string;
  requiredBoxes?: number;
  squareMeter?: number;

  totalPrice?: number;
  sizes?: Sizes[];
  pricePerBox?: number;
  selectedColor?: ProductImage;
  matchedProductImages?: ProductImage[];
  lengthPrice?: string;
  status?: BlogStatus;
  sku?: string;
  stockUpdateDate?: Date;
  bundle?: number;
  bundlePrice?: number;
  bundleDisPrice?: number;
}

export interface Sizes {
  width: string;
  height: string;
  thickness: string;
}

export interface IProductAccessories extends IProduct {
  products?: IProduct[];
}
export interface IProductFilter extends IProduct {
  [key: string]: string;
}

export interface ICollectionFilter extends ISUBCATEGORY {
  [key: string]: string;
}

export interface ICart {
  id: string | number;
  name: string;
  price?: number;
  stock: number;
  subcategory?: string;
  category?: string;
  image?: string;
  totalPrice: number;
  pricePerBox: number;
  originalPricePerBox?: number;
  squareMeter: number;
  requiredBoxes: number;
  boxCoverage?: string;
  subcategories?: string;
  unit?: string;
  pricePerMeter?: number;
  requiredQty?: number;
  isAccessory?: string;
  isfreeSample?: boolean;
  selectedColor?: ProductImage;
  matchedProductImages?: ProductImage;
  custom_url?: string;
  productImages?: ProductImage[];
  featureImages?: ProductImage[];
  isClearance?: boolean;
  installationCost?: number;
  addInstallation?: boolean;
}

export interface EDIT_PRODUCT_PROPS extends IProduct {
  id?: number | string;
  posterImageUrl?: ProductImage;
  productImages?: ProductImage[];
  hoverImageUrl?: ProductImage;
  categoriesId?: number;
  category?: string;
  subcategory?: string;
  custom_url: string;
}

export interface IAccessories extends IProduct {
  colors: AdditionalInformation[];
  products: IProduct[];
}

export interface Edit_Accessories extends EDIT_PRODUCT_PROPS {
  colors: AdditionalInformation[];
}

export interface Order {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  address: string;
  note: string;
  phone: string;
  emirate: string;
  orderId: string;
  transactionDate: string;
  shipmentFee: number;
  totalPrice: number;
  pay_methodType: string;
  paymethod_sub_type: string;
  cardLastDigits: number;
  checkout: boolean;
  paymentStatus: boolean;
  isRefund: boolean;
  success: boolean;
  pending: boolean;
  currency: string;
  is3DSecure: string;
  checkoutDate: string;
  products: orderProduct[];
  isfreesample?: boolean;
  shippingMethod: {
    name: string;
    deliveryDuration: string;
    freeShipping?: number;
    fee: number;
  };
  __typename: string;
  isfreesample?: string;
  orderStatus?: string;
  deliveryDate?: string;
}

interface orderProduct {
  boxCoverage: string;
  category: string;
  id: number;
  image: string;
  name: string;
  price: number;
  pricePerBox: number;
  requiredBoxes: number;
  squareMeter: string;
  stock: number;
  subcategories: string;
  totalPrice: number;
  custom_url: string;
  selectedColor?: ProductImage;
  isClearance?: boolean;
  installationCost?: number;
  addInstallation?: boolean;
}
