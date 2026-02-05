'use client';
import Breadcrumb from 'components/Dashboard/Breadcrumbs/Breadcrumb';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import ViewProduct from 'components/Dashboard/dashboard_products/ViewProduct';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { IAccessories, IProduct } from 'types/prod';
import { DASHBOARD_MAINPAGE_PROPS } from 'types/PagesProps';
import { usePathname } from 'next/navigation';
const AddProd = dynamic(
  () => import('components/Dashboard/dashboard_products/AddProd')
);

const Product = ({
  categories,
  productsData,
  accessories
}: DASHBOARD_MAINPAGE_PROPS) => {
  const [editProduct, setEditProduct] = useState<
    IProduct | IAccessories | undefined
  >();
  const [products, setProducts] = useState<(IProduct | IAccessories)[]>([]);
  const [selecteMenu, setselecteMenu] = useState<string>('Add All Products');
  const path = usePathname();
  const accessoryFlag = path === '/dashboard/accessories';
  const EditInitialValues = {
    name: editProduct?.name || '',
    description: editProduct?.description || '',
    price: editProduct?.price || 0,
    spacification: editProduct && editProduct?.spacification,
    discountPrice: editProduct?.discountPrice,
    category: editProduct && editProduct?.category?.id,
    subcategory: editProduct && editProduct?.subcategory?.id,
    stock: (editProduct && editProduct.stock) || 0,
    posterImageUrl: editProduct?.posterImageUrl || {},
    productImages: (editProduct && editProduct.productImages) || [],
    AdditionalInformation:
      (editProduct && editProduct.AdditionalInformation) || [],
    Meta_Title: (editProduct && editProduct?.Meta_Title) || '',
    Meta_Description: (editProduct && editProduct?.Meta_Description) || '',
    Canonical_Tag: (editProduct && editProduct?.Canonical_Tag) || '',
    custom_url: editProduct && editProduct?.custom_url,
    plankWidth: editProduct && editProduct?.plankWidth,
    thickness: editProduct && editProduct?.thickness,
    ResidentialWarranty: editProduct && editProduct?.ResidentialWarranty,
    CommmericallWarranty: editProduct && editProduct?.CommmericallWarranty,
    waterproof: editProduct && editProduct?.waterproof,
    FAQS: (editProduct && editProduct?.FAQS) || [],
    boxCoverage: editProduct && editProduct?.boxCoverage,
    featureImages: (editProduct && editProduct?.featureImages) || [],
    colorCode: editProduct && editProduct?.colorCode,
    colors: editProduct && editProduct?.colors,
    sizes: editProduct && editProduct?.sizes,
    //@ts-expect-error added
    products: (editProduct && editProduct?.products?.map((value) => value.id)) || [],
    lengthPrice: editProduct && editProduct?.lengthPrice,
    status: editProduct && editProduct?.status,
    sku: editProduct && editProduct?.sku
  };

  useEffect(() => {
    setProducts(accessoryFlag && accessories ? accessories : productsData);
  }, [productsData, accessories]);
  const productFlag: boolean =
    selecteMenu === 'Add All Products' ? true : false;

  return (
    <DefaultLayout>
      <Breadcrumb
        pageName={
          productFlag
            ? `${accessoryFlag ? 'Accessories' : 'Products'}`
            : `${!productFlag ? 'Edit' : 'Add'} ${accessoryFlag ? 'Accessory' : 'Products'}`
        }
      />
      {productFlag ? (
        <ViewProduct
          products={products}
          setProducts={setProducts}
          setselecteMenu={setselecteMenu}
          setEditProduct={setEditProduct}
          accessoryFlag={accessoryFlag}
        />
      ) : (
        <AddProd
          setselecteMenu={setselecteMenu}
          EditInitialValues={editProduct}
          setEditProduct={setEditProduct}
          EditProductValue={
            EditInitialValues &&
            (EditInitialValues.name !== undefined ||
              EditInitialValues.category !== undefined)
              ? EditInitialValues
              : undefined
          }
          categoriesList={categories}
          products={productsData}
          accessoryFlag={accessoryFlag}
        />
      )}
    </DefaultLayout>
  );
};

export default Product;
