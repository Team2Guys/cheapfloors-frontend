'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { ICart } from 'types/prod';
import { fetchItems } from 'utils/cartutils';
import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';

const ProductTable = dynamic(() => import('components/product-table'));
const WishlistSmall = dynamic(() => import('components/smallscreen'));
const Container = dynamic(
  () => import('components/common/container/Container')
);
const Breadcrumb = dynamic(() => import('components/Reusable/breadcrumb'));
const Top = dynamic(() => import('components/top'));

const WishlistPage = () => {
  const [items, setItems] = useState<ICart[]>([]);
  useEffect(() => {
    fetchItems(false, setItems);
  }, []);

  const products = items.filter(
    (item) => item.category !== 'Accessories' && !item.isClearance
  );
  const accessories = items.filter(
    (item) =>
      (item.category?.toLowerCase() === 'accessories' ||
        item.category === 'Accessory') &&
      !item.isClearance
  );
  const clearanceItems = items.filter((item) => item.isClearance);
  if (items.length === 0) {
    return (
      <Container>
        <Breadcrumb title="Wishlist" />
        <Top heading="Wishlist" Icon={CiHeart} />
        <div className="text-center pb-10 xsm:pb-20 pt-2">
          <p className="text-center text-[24px]">Wishlist is empty</p>
          <Link
            href="/collections"
            className="text-center text-[18px] bg-primary p-2 flex w-fit mx-auto items-center text-white gap-2 mt-4"
          >
            <FaArrowLeftLong /> Go Back to Shop
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Breadcrumb title="Wishlist" />
      <Container>
        <Top heading="Wishlist" Icon={CiHeart} />
        {products.length > 0 && (
          <div className="hidden md:block pb-6 xl:pt-6 xl:mb-10">
            <ProductTable
              columns={[
                'Product',
                'QTY(m/m2)',
                'Total Price',
                'Availability',
                'Action'
              ]}
              items={products}
              setItems={setItems}
            />
          </div>
        )}

        {clearanceItems.length > 0 && (
          <div className="hidden md:block pb-6 xl:pt-6 xl:mb-10">
            <ProductTable
              columns={[
                'Clearance Product',
                'Bundle',
                'Total Price',
                'Availability',
                'Action'
              ]}
              items={clearanceItems}
              setItems={setItems}
              isClearance
            />
          </div>
        )}

        {accessories.length > 0 && (
          <div className="hidden md:block pb-6 xl:pt-6 xl:mb-10 ">
            <ProductTable
              columns={[
                'Accessories',
                'QTY Piece',
                'Total Price',
                'Availability',
                'Action'
              ]}
              items={accessories}
              setItems={setItems}
            />
          </div>
        )}
        <div className="block md:hidden mb-5">
          <WishlistSmall items={items} setItems={setItems} />
        </div>
      </Container>
    </>
  );
};

export default WishlistPage;
