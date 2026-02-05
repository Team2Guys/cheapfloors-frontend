import { useEffect, useLayoutEffect, useState } from 'react';
import Navbar from './navbar';
import { IProduct } from 'types/prod';
import { Category } from 'types/cat';
import { fetchCategories, fetchProducts } from 'config/fetch';
import {
  FETCH_HEADER_CATEGORIES,
  FETCH_HEADER_PRODUCTS
} from 'graphql/queries';
import TopNav from './top-nav';

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const [data, product] = await Promise.all([
          fetchCategories(FETCH_HEADER_CATEGORIES),
          fetchProducts(FETCH_HEADER_PRODUCTS)
        ]);
        const publishedCategories = data.map((cat: Category) => ({
          ...cat,
          subcategories:
            cat.subcategories?.filter((sub) => sub.status === 'PUBLISHED') ||
            [],
          recalledSubCats:
            cat.recalledSubCats?.filter(
              (recall) => recall?.status === 'PUBLISHED'
            ) || [],
          products:
            cat.products?.filter((prod) => prod.status === 'PUBLISHED') || [],
          accessories:
            cat.accessories?.filter((acc) => acc.status === 'PUBLISHED') || []
        }));
        const publishedProducts = product.filter((products: IProduct) => {
          const isCategoryPublished = products.category?.status === 'PUBLISHED';
          const isSubcategoryPublished =
            products.subcategory.status === 'PUBLISHED';
          const isProductPublished = products.status === 'PUBLISHED';
          return (
            isCategoryPublished && isSubcategoryPublished && isProductPublished
          );
        });
        setCategories(publishedCategories);
        setProducts(publishedProducts);
        setIsLoading(false);
      } catch {
        console.error('Error fetching items.');
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);
  return (
    <div
      className='w-full z-50 fixed top-0'
    >
      <TopNav />
      <Navbar
        categories={categories}
        products={products}
        isLoading={isLoading}
        isScrolled={isScrolled}
      />
    </div>
  );
};

export default Header;
