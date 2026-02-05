import { BlogStatus } from './general';
import { AdditionalInformation, IProduct, ProductImage, Sizes } from './prod';
import { Product } from './type';

export interface Category {
  id: number | string;
  name: string;
  description?: string;
  short_description?: string;
  Meta_Description?: string;
  Meta_Title?: string;
  Canonical_Tag?: string;
  images_alt_text?: string;
  posterImageUrl: ProductImage;
  custom_url: string;
  createdAt: Date;
  updatedAt: Date;
  last_editedBy?: string;
  Recall_Cat?: string;
  products?: IProduct[];
  accessories?: Product[];
  RecallUrl?: string;
  Heading?: string;
  sizes?: Sizes[];
  BannerImage?: ProductImage;
  status?: BlogStatus;
  subcategories?: {
    id: number | string;
    name: string;
    posterImageUrl?: ProductImage;
    status?: BlogStatus;
    custom_url: string;
    createdAt: Date;
    updatedAt: Date;
  }[];

  whatAmiImageBanner?: ProductImage;
  topHeading?: string;
  recalledSubCats: ISUBCATEGORY[];
  price?: string | number;
  stock?: number;
  boxCoverage?: string;
  __typename?: string;
}

export interface CategoriesFilter extends Category {
  sortedSubcategories: ISUBCATEGORY[];
}

export interface EDIT_CATEGORY extends Category {
  id?: number | string;
  custom_url?: string;
  RecallUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  posterImageUrl?: ProductImage;
  recalledSubCats?: ISUBCATEGORY[];
  subcategory?: ISUBCATEGORY_EDIT;
  sizes?: Sizes[];
  pricePerBox?: number;
  staus?: string;
}

export interface ISUBCATEGORY extends Category {
  id: number | string;
  category: EDIT_CATEGORY;
  products?: IProduct[];
  whatAmiImage?: ProductImage[];
  whatAmiImageBanner?: ProductImage;
  homePageImage?: ProductImage;
  whatAmiTopHeading?: string;
  whatamIdetails: AdditionalInformation[];
  recalledSubCats?: ISUBCATEGORY[];
  Heading?: string;
  BannerImage?: ProductImage;
  posterImageUrl?: ProductImage;
  recalledByCategories?: Category[];
  sizes?: Sizes[];
  whatIamEndpoint?: string;
  whatAmiCanonical_Tag?: string;
  whatAmiMeta_Description?: string;
  whatAmiMeta_Title?: string;
  status?: BlogStatus;
}

export interface ISUBCATEGORY_EDIT extends ISUBCATEGORY {
  id?: number | string;
  category: number | string;
  products?: IProduct[];
  posterImageUrl?: ProductImage;
  createdAt?: Date;
  updatedAt?: Date;
  custom_url?: string;
  recalledByCategories: string[];
}

export interface mainCategory {
  whatAmiImageBanner: ProductImage;
  topHeading: string;
  description: string;
}

export interface SUBNCATEGORIES_PAGES_PROPS {
  catgories: Category[];
  categoryData: Category;
  subCategoryData?: ISUBCATEGORY;
  isSubCategory: boolean;
  mainCategory?: mainCategory;
  slug: string;
  subcategory?: string;
  subdescription?: ICategory;
}

export type FilterState = {
  Colours: string[];
  thicknesses: string[];
  commercialWarranty: string[];
  residentialWarranty: string[];
  plankWidth: string[];
  plankLength: string[];
};

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: string;
  showBackdrop?: boolean;
}

export interface CLEATANCE_PAGES_PROPS {
  catgories: Category[];
  products: Product[];
  description: string;
  name: string;
  slug: string;
}
