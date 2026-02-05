import Breadcrumb from 'components/Reusable/breadcrumb';
import Checkout from 'app/checkout/Checkout';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.freesample_checkout);
const CheckoutPage = async () => {
  return (
    <>
      <Breadcrumb title="free sample checkout" />
      <Checkout isFreeSample />
    </>
  );
};

export default CheckoutPage;
