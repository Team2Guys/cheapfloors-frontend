import { useEffect, useState } from 'react';
import Navbar from './navbar';
import TopNav from './top-nav';
import { staticCategories } from '@/data/header';
import { fetchProducts } from 'config/fetch';
import { IProduct } from 'types/prod';

const Header = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  console.log(products.slice(0, 10))
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(
          (data || []).filter(
            (product: IProduct) => product.status === 'PUBLISHED' && product.category.status === 'PUBLISHED' && product.subcategory.status === 'PUBLISHED'
          )
        );
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

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

  return (
    <div
      className='w-full z-50 fixed top-0'
    >
      <TopNav />
      <Navbar
        categories={staticCategories}
        products={products}
        isLoading={isLoading}
        isScrolled={isScrolled}
      />
    </div>
  );
};

export default Header;
