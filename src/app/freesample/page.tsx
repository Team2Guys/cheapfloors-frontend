import React from 'react';
import FreeSamplePage from './FreeSamplePage';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.freesample);
const FreeSample = () => {
  return <FreeSamplePage />;
};

export default FreeSample;
