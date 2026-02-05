import { fetchAccessories, fetchCategories, fetchProducts } from 'config/fetch';
import dynamic from 'next/dynamic';
import React from 'react';
const Product = dynamic(() => import('../products/Products'));
async function page() {
  const [categories, products, accessories] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
    fetchAccessories()
  ]);
  return (
    <Product
      categories={categories}
      productsData={products}
      accessories={accessories}
    />
  );
}

export default page;
