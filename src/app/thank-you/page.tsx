import RelatedSlider from 'components/related-slider/related-slider';
import Breadcrumb from 'components/Reusable/breadcrumb';
import FreeSampleThank from 'components/ThankYou/FreeSampleThank';
import ThankYouComp from 'components/ThankYou/ThankYou';
import { fetchProducts } from 'config/fetch';
import { Metadata } from 'next';
import React from 'react';
import logo from '../../../public/assets/images/logo.webp';
import { IProduct } from 'types/prod';
interface ThankYouProps {
  searchParams: Promise<Record<string, string | null>>;
}

export const generateMetadata = async ({
  searchParams
}: ThankYouProps): Promise<Metadata> => {
  const params = await searchParams;
  const isPaymentSuccessful = params.success === 'true';
  const isFreeSample = params.isFreeSample === 'true';
  return isFreeSample || isPaymentSuccessful
    ? {
        title: 'Payment Successful | Easy Floors',
        description:
          'Thank you for your purchase! Your payment has been processed successfully. We’ll begin preparing your order right away.',
        openGraph: {
          title: 'Payment Successful | Easy Floors',
          description:
            'Thank you for your purchase! Your payment was successful. Your flooring products will be delivered soon.',
          url: 'https://easyfloors.ae/thank-you',
          images: [
            { url: `https://easyfloors.ae${logo.src}`, alt: 'Easyfloors' }
          ],
          type: 'website'
        },
        alternates: {
          canonical: 'https://easyfloors.ae/thank-you'
        }
      }
    : {
        title: 'Payment Failed | Easy Floors',
        description:
          'Unfortunately, your payment could not be processed. Please try again or contact our support team for assistance.',
        openGraph: {
          title: 'Payment Failed | Easy Floors',
          description:
            'There was an issue processing your payment. Please retry or get in touch with our support team.',
          url: 'https://easyfloors.ae/thank-you',
          images: [
            { url: `https://easyfloors.ae${logo.src}`, alt: 'Easyfloors' }
          ],
          type: 'website'
        },
        alternates: {
          canonical: 'https://easyfloors.ae/thank-you'
        }
      };
};

export interface PaymentQueryParams {
  success: boolean;
  integrationId: string | undefined;
  orderId: string | undefined;
  pending: boolean;
  is3DSecure: string | undefined;
  pay_methodType: string | undefined;
  cardLastDigits: string | undefined;
  paymethod_sub_type: string | undefined;
  isFreeSample?: string;
}

const ThankYou = async ({ searchParams }: ThankYouProps) => {
  const productData = await fetchProducts();
  const PublishProduct = productData.filter(
    (product: IProduct) => product.status === 'PUBLISHED'
  );
  const params = await searchParams;
  const isFreeSample = params.isFreeSample === 'true';
  const extractedParams: PaymentQueryParams = {
    success: params.success === 'true',
    integrationId: params.integration_id || undefined,
    orderId: params.order || undefined,
    pending: params.pending === 'true',
    is3DSecure: params.is_3d_secure || undefined,
    pay_methodType: params['source_data.type'] || undefined,
    cardLastDigits: params['source_data.pan'] || undefined,
    paymethod_sub_type: params['source_data.sub_type'] || undefined
  };

  return (
    <>
      <Breadcrumb title="Thank You" />
      {isFreeSample ? (
        <FreeSampleThank orderId={extractedParams.orderId} />
      ) : (
        <ThankYouComp extractedParams={extractedParams} />
      )}
      <RelatedSlider products={PublishProduct.slice(0, 5)} />
    </>
  );
};

export default ThankYou;
