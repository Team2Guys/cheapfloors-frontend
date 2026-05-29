'use client';
import AccessoriesContainer from 'components/accessoriesDetailProduct/AccessoriesContainer';
import Container from 'components/common/container/Container';
const AdditionalInfo = dynamic(
  () => import('components/product-detail/additional-information')
);
const FaqDetail = dynamic(() => import('components/product-detail/faq-detail'));
const Features = dynamic(() => import('components/Reusable/features'));
import RelatedSlider from 'components/related-slider/related-slider';
import Breadcrumb from 'components/Reusable/breadcrumb';
import dynamic from 'next/dynamic';
import React from 'react';
import { IProduct } from 'types/prod';
import { detailprops } from 'types/product-detail';

const AccessoriesDetail = ({
  ProductName,
  ProductInfo,
  productData
}: detailprops) => {
  return (
    <>
      <Breadcrumb subcategory="accessories" title={ProductName} />
      <AccessoriesContainer productData={productData as IProduct} />
      <Container className="mb-10 lg:px-20">
        <AdditionalInfo
          name={productData.name || ''}
          description={productData.description || ''}
          AdditionalInformation={productData.AdditionalInformation}
          subcategory={productData.subcategory?.name || ''}
        />
        <div className="mt-10">
          <FaqDetail faqs={productData.FAQS} />
        </div>
      </Container>
      <Features />
      <RelatedSlider products={ProductInfo?.slice(0, 5) || []} isAccessories />
    </>
  );
};

export default AccessoriesDetail;
