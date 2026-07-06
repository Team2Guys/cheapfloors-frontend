import { SwiperProps } from 'swiper/react';
import { FilterState, ISUBCATEGORY } from './cat';
import { IProduct } from './prod';
import { ReactNode } from 'react';

export interface SocialLink {
  href: string;
  alt: string;
  className?: string; // Applying class directly to the icon component
  target?: string;
}
export interface MenuItemProps {
  label: string;
  href: string;
  submenu?: { label: string; href: string; image?: string }[];
  scrolling?: boolean;
  products?: {
    name: string;
    custom_url: string;
    posterImageUrl?: { imageUrl: string; altText?: string };
  }[];
}
export interface HeaderAccessoriesProps {
  name: string;
  custom_url: string; // Add this property
  posterImageUrl: {
    imageUrl: string;
    altText?: string;
  };
}

export interface TextInputProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: ChangeEvent<HTMLInputElement>;
  min?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void; // eslint-disable-line
}
export interface FAQ {
  question: string;
  answer: string;
  category?: string; 
}

export interface FAQsListProps {
  faqspage: FAQ[];
}
export interface TAboutUs {
  id: number;
  image: string;
  alt: string;
  heading: string;
  paragraph: string;
}
export interface TAboutUsProps {
  sections: TAboutUs[];
}
export interface SampleGridData {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  alt: string;
  href: string;
}

export interface SampleGridProps {
  sections: SampleGridData[];
}

export interface TAutoVideoProps {
  videoUrl: string;
  fallbackImage?: string;
  className?: string;
}

export interface FIlterprops {
  className?: string;
  catgories: Category[];
  category?: Category;
  setIsWaterProof: React.Dispatch<
    React.SetStateAction<boolean | null | undefined>
  >;
  isWaterProof: boolean | null | undefined;
  setSelectedProductFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedProductFilters: FilterState;

  setPriceValue: React.Dispatch<React.SetStateAction<[number, number]>>;
  priceValue: [number, number];
  setcoverageArea?: React.Dispatch<React.SetStateAction<[number, number]>>;
  coverageArea?: [number, number];
  catSlug: string;
  isColection?: boolean;
  sortedSubcategories?: ISUBCATEGORY[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTags: string[];
  isSubCategory?: boolean;
  subcategory?: string;
  isClearance?: boolean;
  products?: IProduct[];
}

export type SelectedFilter =
  | { name: 'isWaterProof'; value: boolean }
  | { name: 'Tag'; value: string }
  | { name: keyof FilterState; value: string };

export interface SubCategoryProps {
  filteredProducts: Product[];
  selectedFilters: SelectedFilter[];
  setSelectedProductFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setIsWaterProof: React.Dispatch<
    React.SetStateAction<boolean | null | undefined>
  >;
  categoryData?: Category;
  subCategoryData?: Category;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}
export interface SubSection {
  subHeading: string;
  content: string;
}

export interface SubSection {
  subHeading: string;
  content: string;
}

export interface SubSection {
  subHeading: string;
  content: string;
}

export interface Step {
  title: string;
  content: string;
}

export interface MeasurementSection {
  title: string;
  description?: string;
  steps: Step[];
  image: string;
  stepsHeading?: string;
}
export interface OrderItem {
  image: string;
  title: string;
  boxes: number;
  sqm: number;
  price: number;
}
export interface AuthData {
  title: string;
  subtitle: string;
  description: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordText: string;
  buttonText: string;
  footerText: string;
  footerLinkText: string;
  value: string;
}

export interface AuthFormState {
  email: string;
  password: string;
}

export interface AccessoriesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  products: IProduct[];
  sizes?: Array<{ width?: string; height?: string; thickness?: string }>;
}
export interface InputProps {
  type: string;
  name: string;
  placeholder?: string;
  icon: ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (_e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface ProductFilterParams {
  products: IProductFilter[] | undefined;
  priceValue: [number, number];
  coverageArea?: [number, number];
  sortOption: string;
  selectedProductFilters: FilterState;
  isWaterProof: boolean | null | undefined;
  subcategory?: string;
  subcategories?: ISUBCATEGORY[];
  isClearance?: boolean;
  selectedTags?: string[];
}

export interface IAppointment {
  id: string | number;
  firstname: string;
  email: string;
  phoneNumber: string;
  whatsappNumber: string;
  area: string;
  selectRooms: string;
  preferredTime: string;
  findUs: string;
  comment?: string;
  contactMethod: { email: boolean; whatsapp: boolean; telephone: boolean };
  preferredDate: string;
  AppointsType: string;
}
export interface AccordionProps {
  label: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  detailpage?: boolean;
  showPlusMinus?: boolean;
  isCheckout?: boolean;
}
export interface RelatedSliderProps {
  products: IProduct[];
  isAccessories?: boolean;
}

export type OrderHistory = {
  id: string;
  email: string;
  address: string;
  phone: string;
  paymentStatus: string;
  createdAt: string;
};
export interface INavbar {
  categories?: Category[];
  products?: IProduct[];
  isLoading: boolean;
  isScrolled?: boolean;
}

export interface TPayment {
  cardImage: string;
  cardLastFour: string;
  amount: number;
  currency: string;
}

export interface TDelivery {
  name: string;
  email: string;
  address: string;
}
export interface CategoryFeatures {
  name: string;
  features: string[];
}
export interface Props extends BlogCardProps {
  index: number;
  card: string;
}

export interface CommonSwiperProps extends SwiperProps {
  children: ReactNode;
  enablePagination?: boolean;
  allowTouch?: boolean;
}

export interface InputWithUnitProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  selectOptions?: string[]; 
  setFieldValue: (_field: string, _value: string) => void;
}

export interface CroppedImage {
  imageUrl: string;
  public_id: string;
}

interface Column<T> {
  title: string;
  key: string;
  render?: (_record: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  emptyMessage?: string;
}
