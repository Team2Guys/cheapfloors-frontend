'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuItemProps } from 'types/types';
import Container from 'components/common/container/Container';
import { usePathname } from 'next/navigation';

const Megamenu: React.FC<
  MenuItemProps & {
    submenu?: { label: string; href: string; image?: string; price?: string }[];
  }
> = ({ label, href, submenu, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleLinkClick = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 50);
  };

  return (
    <div
      className="relative font-inter capitalize font-light pb-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseLeave}
    >
      <Link
        className={`text-10 min-[1150px]:text-11 min-[1350px]:text-13 2xl:text-sm 3xl:text-base capitalize ${pathname === `/${href}` ? 'bg-gray-light p-[6px] xl:p-2 rounded-xl' : 'hover:bg-gray-light p-[6px]  xl:p-2 rounded-xl '}`}
        href={`/${href}`}
      >
        {label}
      </Link>

      {isOpen && (
        <div className="absolute left-0 top-9 pt-2 z-50 w-screen">
          {label === 'Accessories' && products && products.length > 0 && (
            <div
              className="fixed z-50 bg-white shadow overflow-y-auto border-primary border-t w-screen left-1/2 -translate-x-1/2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Container className="grid grid-cols-8 gap-2 2xl:gap-4 my-2 capitalize">
                {products.map((product, index) => (
                  <Link
                    key={index}
                    href={`/accessories/${product.custom_url}`}
                    className="group block"
                    onClick={handleLinkClick}
                  >
                    <div className="overflow-hidden">
                      {product.posterImageUrl && (
                        <Image
                          src={product.posterImageUrl.imageUrl}
                          alt={product.posterImageUrl.altText ?? product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-wrap text-10 xl:text-12 2xl:text-sm font-medium group-hover:text-primary group-hover:border-b group-hover:border-b-primary">
                      {product.name}
                    </span>
                  </Link>
                ))}
              </Container>
            </div>
          )}

          {/* Regular Mega Menu (non-Accessories) */}
          {label !== 'Accessories' && submenu && (
            <div
              className={`fixed z-50 bg-white shadow overflow-y-auto border-primary border-t ${
                submenu.length <= 3
                  ? 'w-[60vw] xl:w-[50vw]'
                  : 'w-screen left-1/2 -translate-x-1/2'
              }`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {submenu.length > 0 ? (
                <Container className="flex gap-4 my-2 capitalize 3xl:px-4">
                  {[...submenu]
                    .sort((a, b) => {
                      const getGroup = (item: {
                        label: string;
                        price?: string;
                      }) => {
                        const label = item.label.toLowerCase();
                        if (label.includes('polar')) return '0';
                        if (label.includes('spc')) return '1';
                        if (label.includes('lvt')) return '2';
                        return '3';
                      };
                      const groupA = getGroup({ ...a, price: a.price || '0' });
                      const groupB = getGroup({ ...b, price: b.price || '0' });
                      if (groupA !== groupB)
                        return groupA.localeCompare(groupB);
                      return (
                        parseFloat(a.price || '0') - parseFloat(b.price || '0')
                      );
                    })
                    .map((sub, index) => (
                      <Link
                        key={index}
                        href={sub.href}
                        className={`group ${
                          submenu.length <= 3 ? 'w-4/12' : 'w-[20%]'
                        }`}
                        onClick={handleLinkClick}
                      >
                        {sub.image && (
                          <Image
                            src={sub.image}
                            alt={sub.label}
                            width={500}
                            height={500}
                            className="w-full h-[220px] object-cover"
                          />
                        )}
                        <span className=" text-sm xl:text-base font-medium group-hover:text-primary group-hover:border-b group-hover:border-b-primary font-inter">
                          {sub.label}
                        </span>
                      </Link>
                    ))}
                </Container>
              ) : (
                <Container className="w-full animate-pulse px-2 flex gap-4 my-2">
                  {[...Array(submenu.length <= 3 ? 3 : 5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-[220px] ${
                        submenu.length <= 3 ? 'w-4/12' : 'w-[20%]'
                      } bg-gray-300 rounded mb-3`}
                    />
                  ))}
                </Container>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Megamenu;
