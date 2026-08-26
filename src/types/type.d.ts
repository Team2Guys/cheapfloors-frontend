import { FormEventHandler, SetStateAction } from 'react';
import { IProduct } from './prod';
import { ISUBCATEGORY } from './cat';

export interface Feature {
  icon: string;
  label: string;
  width: number;
  height: number;
}

interface FlooringProduct {
  image: string;
  price: string;
  name: string;
}

interface Color {
  name: string;
  detail: string;
}

export type Block = {
  id: number;
  heading: string;
  points: string[];
  imageUrl: string;
};
export interface HeadingImageProps {
  title: string;
  imageUrl: string;
}

export interface TCategoryData {
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  buttonLink?: string;
  buttonText?: string;
}

export interface FeaturesProps {
  items: FeatureItem[];
}
export interface HeroItem {
  // backgroundImage: string;
  // backgroundImageMobile: string;
  offerText: string;
  highlight: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  flooringType: string;
  brand: string;
}

export interface HeroMainProps {
  items: HeroItem[];
}
export interface BlogCardProps {
  card: ISUBCATEGORY;
  index?: number;
}
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}
export interface BoxItem {
  id: number;
  title: string;
  description: string;
  buttonText: string;
}
export interface BoxData {
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  link: string;
  bgImage: string;
}

export interface CardData {
  id: number;
  heading: string;
  content: string[];
}

export interface CategoryData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface FormState {
  success?: string;
  error?: string;
}

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  name: string;
  options: Option[];
  label: string;
  required?: boolean;
  placeholder?: string;
}

export interface Appointmentprops {
  title?: string;
  description?: string;
  AppointsType: string;
}
export interface RECORDS {
  totalSubCategories: string;
  totalProducts: string;
  totalCategories: string;
  totalAdmins: string;
  totalRevenue: string;
  totalSoldProducts: string;
  totalUsers: string;
  totalabundantOrderProd: string;
  totalAccessories: string;
  Orders: string;
  abdundantOrders: string;
  freeSamples: string;
  InstallationAppointments: string;
  MeasureAppointments: string;
}

export interface specsDetails {
  id: number;
  specsDetails: string;
}

export interface ICategory {
  id: number;
  name: string;
  createdAt?: string;
  posterImageUrl?: string;
  posterImagePublicId?: string;
  description?: string;
  short_description?: string;
  Images_Alt_Text?: string;
  Meta_Title?: string;
  Meta_Description?: string;
  Canonical_Tag?: string;
  subcategories?: ICategory[];
  custom_url?: string;
  status?: BlogStatus;
  recalledSubCats?: ISUBCATEGORY[];
}
export interface Sizes {
  name: string;
  filterName?: string;
  price: string;
  discountPrice: string;
  stock?: string;
}
export interface IReview {
  id: number;
  name: string;
  email: string;
  review: string;
  star: number;
  createdAt: string;
  productId: number;
  userProfileImg?: string;
}
export interface IOrder {
  id: number;
  orderId: string;
  user_email: string;
  address: string;
  phoneNumber?: string;
  products: IOrderProduct[];
  paymentStatus: IPaymentStatus;
  createdAt: string;
}
export interface IOrderProduct {
  id: number;
  orderId: string;
  createdAt: string;
  quantity: number;
  saleRecordId: number;
  productData: IProduct;
}

export interface IPaymentStatus {
  checkoutData: string;
  checkoutStatus: boolean;
  paymentStatus: boolean;
}

export interface modelDetails {
  name: string;
  detail: string;
}
export interface spacification {
  specsDetails: string;
}

/* eslint-disable */

export interface FormValues {
  name: string;
  description: string;
  salePrice: string;
  purchasePrice: string;
  discountPrice: string;
  starRating: string;
  reviews: string;
  colors: { colorName: string }[];
  modelDetails: modelDetails[];
  spacification: spacification[];
  sizes: string[];
  category: string;
  code: string;
  totalStockQuantity: number;
  variantStockQuantities: { variant: string; quantity: number }[];
  price?: string;
  AdditionalInformation?: [];
  FAQS?: [];
  box: string;
}

export interface USRPROPS {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  error: string | null | undefined;
  loading: boolean | null | undefined;
  inputFields: any;
  buttonTitle: string;
  title?: string;
  descrition?: string;
  InstructionText?: string;
  routingText?: string;
  navigationLink?: string;
  navigationTxt?: string;
  SelectComonent?: any;
  setadminType?: React.Dispatch<SetStateAction<string | undefined>>;
  adminType?: string | undefined;
}
interface ModelDetail {
  name?: string;
  detail?: string;
}

interface Specification {
  specsDetails?: string;
}
interface sizes {
  sizesDetails?: string;
}

interface Color {
  colorName?: string;
}

export interface Admin {
  fullname?: string;
  email?: string;
  password?: string;
  status?: BlogStatus;
  canAddCategory?: boolean;
  canAddProduct?: boolean;
  canCheckProfit?: boolean;
  canCheckRevenue?: boolean;
  canCheckVisitors?: boolean;
  canDeleteCategory?: boolean;
  canDeleteProduct?: boolean;
  canEditCategory?: boolean;
  canEditProduct?: boolean;
  canVeiwAdmins?: boolean;
  canViewSales?: boolean;
  canVeiwTotalCategories?: boolean;
  canVeiwTotalproducts?: boolean;
  canViewUsers?: boolean;
}

export interface AdminRecord {
  _id: string;
  id: string;
  fullname: string;
  email: string;
  canAddProduct: boolean;
  canDeleteProduct: boolean;
  canAddCategory: boolean;
  canDeleteCategory: boolean;
  canCheckProfit: boolean;
  canViewUsers: boolean;
}

export interface ITamaraList {
  id: number;
  title?: string;
  para: string;
}

export interface CartSelectProps {
  select: { value: string; label: string }[];
  onSelect: (state: string, fee: number) => void;
  selectedFee: number;
  selectedShipping: string;
}
export interface PrivacyPolicyItem {
  title?: string;
  content?: string[];
  subItems?: string[];
  heading?: string[];
  contentend?: string[];
  Links?: string[];
}
export interface PrivacyPolicyProps {
  data?: PrivacyPolicyItem[];
}

export interface IfilterValues {
  commercialWarranty: string;
  residentialWarranty: string;
  thicknesses: string;
  plankWidth: string;
  plankLength: string;
}

export interface ProductTableProps {
  columns?: string[];
  isSamplePage?: boolean;
  items?: ICart[];
  setItems?: React.Dispatch<SetStateAction<ICart[]>>;
  isClearance?: boolean;
}
