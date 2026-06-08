import { useEffect, useState } from 'react';
import Navbar from './navbar';
import { IProduct } from 'types/prod';
import { Category } from 'types/cat';
import TopNav from './top-nav';
import { staticCategories, staticProducts } from '@/data/header';

const Header = () => {
  const [categories] = useState<Category[]>(staticCategories);
  const [products] = useState<IProduct[]>(staticProducts);
  const [isLoading] = useState<boolean>(false);
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
