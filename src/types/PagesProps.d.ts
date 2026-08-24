import { Category, EDIT_CATEGORY, ISUBCATEGORY } from './cat';
import { IProduct } from './prod';

export interface SubCategoryComponentProps_dashboard {
  subCategories: ISUBCATEGORY[];
  cetagories: Category[];
}

export interface DASHBOARD_VIEW_SUBCATEGORIES_PROPS {
  setMenuType: React.Dispatch<SetStateAction<string>>;
  seteditCategory?: React.Dispatch<
    SetStateAction<ISUBCATEGORY | undefined | null>
  >;
  editCategory?: ISUBCATEGORY | undefined | null;
  subCategories?: ISUBCATEGORY[];
}

export interface DASHBOARD_ADD_SUBCATEGORIES_PROPS extends DASHBOARD_VIEW_SUBCATEGORIES_PROPS {
  categoriesList: Category[];
}

export interface DASHBOARD_ADD_SUBCATEGORIES_PROPS_PRODUCTFORMPROPS {
  setselecteMenu: React.Dispatch<React.SetStateAction<string>>;
  EditInitialValues?: IProduct | undefined;
  EditProductValue?: EDIT_PRODUCT_PROPS | null | undefined;
  setEditProduct?: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
  subCategories?: ISUBCATEGORY[];
  categoriesList?: ICategory[];
  products?: IProduct[];
  accessoryFlag?: boolean;
}

export interface DASHBOARD_MAINPAGE_PROPS {
  categories: ICategory[];
  productsData: IProduct[];
  accessories?: IAccessories[];
}

export interface DASHBOARD_MAIN_PRODUCT_PROPS {
  products: IProduct[];
  setProducts: React.Dispatch<SetStateAction<IProduct[]>>;
  setselecteMenu: React.Dispatch<SetStateAction<string>>;
  setEditProduct: React.Dispatch<SetStateAction<IProduct | undefined>>;
  accessoryFlag?: boolean;
}

export interface BreadcrumbProps {
  title?: string;
  heading?: string;
  image?: string;
  slug?: string;
  subcategory?: string;
  altText?: string;
  isImagetext?: boolean;
  imageClass?: string;
  showTitle?: boolean;
  useHeadingTag?: boolean;
  isClearance?: boolean;
  isHideTitle?: boolean;
}

export interface productCardProps {
  product: IProduct | EDIT_CATEGORY;
  isSoldOut?: boolean;
  isAccessories?: boolean;
  sldier?: boolean;
  features: Feature[];
  categoryData?: ICategory;
  subCategoryFlag?: boolean;
  priority?: boolean;
  isFreeSample?: boolean;
  setModalProduct?: React.Dispatch<React.SetStateAction<IProduct | null>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
