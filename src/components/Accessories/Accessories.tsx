'use client';

import Card from 'components/Card/Card';
import Container from 'components/common/container/Container';
import CardSkeleton from 'components/skaletons/card-skaleton';
const Select = dynamic(() => import('components/ui/Select'), { ssr: false });
import { defaultOrder } from 'data/accessory';
import { features } from 'data/data';
import dynamic from 'next/dynamic';
import React, { useState, useMemo } from 'react';
import { Category } from 'types/cat';
import { IProduct } from 'types/prod';

interface ProductCardProps {
  product: IProduct[];
  category: Category;
}

const AccessoriesComp: React.FC<ProductCardProps> = ({ product, category }) => {
  const [sortOption, setSortOption] = useState<string>('Default');

  const sortedProducts = useMemo(() => {
    const sortedArray = [...product];
    switch (sortOption) {
      case 'A to Z':
        return sortedArray.sort((a, b) => a.name.localeCompare(b.name));
      case 'Z to A':
        return sortedArray.sort((a, b) => b.name.localeCompare(a.name));
      case 'Low to High':
        return sortedArray.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'High to Low':
        return sortedArray.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return sortedArray.sort(
          (a, b) => defaultOrder.indexOf(a.name) - defaultOrder.indexOf(b.name)
        );
    }
  }, [sortOption, product]);

  return (
    <Container>
      <div className="lg:mt-14 mt-5 py-4 font-inter space-y-4">
        <h1 className="text-24 md:text-34 font-bold">{category?.name}</h1>
        <p
          className="text-base 2xl:text-lg lg:leading-[26px]"
          dangerouslySetInnerHTML={{ __html: category?.description || '' }}
        />
      </div>
      <div className="flex items-center justify-end gap-2 lg:py-8">
        <span className="text-[#191C1F] text-sm hidden lg:block">Sort by:</span>
        <Select
          options={[
            'Default',
            'A to Z',
            'Z to A',
            'Low to High',
            'High to Low'
          ]}
          onChange={setSortOption}
          sortOption={sortOption}
        />
      </div>
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:mb-16">
          {sortedProducts?.map((product, index) => (
            <Card
              key={index}
              product={product}
              categoryData={product.category}
              isAccessories
              isSoldOut={(product.stock ?? 0) < 0}
              features={features}
            />
          ))}
        </div>
      ) : (
        <CardSkeleton length={5} />
      )}
    </Container>
  );
};

export default AccessoriesComp;
