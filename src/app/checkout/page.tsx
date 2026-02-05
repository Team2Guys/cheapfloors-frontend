import Breadcrumb from 'components/Reusable/breadcrumb';
import React from 'react';
import Checkout from './Checkout';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.checkout);
const CheckoutPage = async () => {
  return (
    <>
      <Breadcrumb title="Checkout" />
      <Checkout />
    </>
  );
};

export default CheckoutPage;
