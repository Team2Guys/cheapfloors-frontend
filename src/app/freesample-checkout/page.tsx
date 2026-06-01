import FreeSampleCheckout from './FreeSampleCheckout';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
import Breadcrumb from '@/components/Reusable/breadcrumb';

export const metadata = createMetadata(pageMetadataData.freesample_checkout);

const FreeSampleCheckoutPage = () => {
  return (
    <>
      <Breadcrumb title="Free Samples" />
      <FreeSampleCheckout />
    </>)
};

export default FreeSampleCheckoutPage;
