import React from 'react';
import WishlistPage from './WishlistPage';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.wishlist);
const page = () => {
  return <WishlistPage />;
};

export default page;
