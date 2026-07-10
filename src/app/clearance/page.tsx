import { fetchCategories, fetchProducts } from 'config/fetch';
import { staticMenuItems } from 'data/data';
import React from 'react';
import { ICategory } from 'types/type';
import Clearance from './Clearance';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { IProduct } from 'types/prod';

const Page = async () => {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts()
  ]);
  // Clearance now lists discounted products only (no bundles).
  const filteredProducts = products.filter(
    (product: IProduct) =>
      product.status === 'PUBLISHED' &&
      !!product.discountPrice &&
      Number(product.discountPrice) > 0
  );

  const filteredCategories =
    categories
      .filter((value: ICategory) => value?.name?.trim() !== 'ACCESSORIES')
      .sort((a: ICategory, b: ICategory) => {
        const indexA = staticMenuItems.findIndex(
          (item) => item.label.toLowerCase() === a.name.trim().toLowerCase()
        );
        const indexB = staticMenuItems.findIndex(
          (item) => item.label.toLowerCase() === b.name.trim().toLowerCase()
        );
        return (
          (indexA === -1 ? Infinity : indexA) -
          (indexB === -1 ? Infinity : indexB)
        );
      }) || [];

  const publishedCategories = filteredCategories.filter(
    (cat: ICategory) => cat.status === 'PUBLISHED'
  );
  const description =
    'Save on the discounted products listed below. Prices shown already reflect the discount and include delivery to all mainland UAE addresses. Check the delivery page for more info on timings.';

  return (
    <>
      <Breadcrumb
        image="/assets/images/clearance/banner-hero.webp"
        altText="Clearance Banner"
        slug="clearance"
      />
      <Clearance
        catgories={publishedCategories}
        products={filteredProducts}
        description={description}
        name="Clearance"
        slug="clearance"
      />
    </>
  );
};

export default Page;
