import { fetchCategories, fetchProducts } from 'config/fetch';
import { staticMenuItems } from 'data/data';
import React from 'react';
import { ICategory } from 'types/type';
import Clearance from './Clearance';
import Breadcrumb from 'components/Reusable/breadcrumb';
import { IProduct } from 'types/prod';
import { clearanceProducts } from 'data/clearance';

const Page = async () => {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts()
  ]);
  const filteredProducts = products
    .map((product: IProduct) => {
      const clearance = clearanceProducts.find(
        (r) => r.name.toLowerCase() === product.name.toLowerCase()
      );

      return clearance ? { ...product, ...clearance } : null;
    })
    .filter(Boolean);

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
    'Save HUGE amounts on the bundles listed below. These once in a lifetime offers will not be repeated, so grab what you can, while you can.<br>Bundles are strictly sold in the quantities on display and include delivery to all mainland UAE address. Check delivery page for more info on timings.';

  return (
    <>
      <Breadcrumb
        image="/assets/images/clearance/bannar.webp"
        altText="bannar"
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
