import React from 'react';
import CartPage from 'components/cart/cart-page';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { fetchAccessories, fetchProducts } from 'config/fetch';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
import { IProduct } from 'types/prod';
export const metadata = createMetadata(pageMetadataData.cart);
const Cart = async () => {
  const [products, accessories] = await Promise.all([
    fetchProducts(),
    fetchAccessories()
  ]);
  const publishedProducts = products.filter((product: IProduct) => {
    const categoryStatus = product.category?.status;
    const subcategoryStatus = product.subcategory?.status;
    const productStatus = product.status;
    const isCategoryPublished = categoryStatus === 'PUBLISHED';
    const isSubcategoryPublished =
      !product.subcategory || subcategoryStatus === 'PUBLISHED';
    const isProductPublished = productStatus === 'PUBLISHED';
    return isCategoryPublished && isSubcategoryPublished && isProductPublished;
  });
  return (
    <>
      <Breadcrumb title="Cart" />
      <CartPage products={publishedProducts} accessories={accessories} />
    </>
  );
};

export default Cart;
