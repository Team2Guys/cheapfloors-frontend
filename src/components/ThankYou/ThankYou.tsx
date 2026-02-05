'use client';

import React, { useEffect, useRef } from 'react';

import { PaymentQueryParams } from 'app/thank-you/page';
import { useMutation } from '@apollo/client';
import { POST_PAYMENT_STATUS } from 'graphql/mutations';
import OrderSummary from './OrderSummary';
import CardSkeleton from 'components/skaletons/card-skaleton';
import Image from 'next/image';
import Shipping from './Shipping';
import { openDB } from 'utils/indexedDB';
import { ORDERS_PROD } from 'types/OrdersProd';
const ThankYouComp: React.FC<{ extractedParams: PaymentQueryParams }> = ({
  extractedParams
}) => {
  const hasRun = useRef(false);
  const [postPaymentStatus, { data, loading, error }] =
    useMutation(POST_PAYMENT_STATUS);

  const handlePurchaseClick = () => {
    pushToDataLayer({
      event: 'purchase_Completed',
      ecommerce: {
        transaction_id: data?.postpaymentStatus?.orderId,
        value: data?.postpaymentStatus?.totalPrice,
        currency: 'AED',
        items: data.postpaymentStatus.products.map((val: ORDERS_PROD) => ({
          item_name: val.name,
          item_id: val?.id,
          price: val.price,
          quantity: val.requiredBoxes
        }))
      }
    });
  };

  const waitForTx = (tx: IDBTransaction): Promise<void> => {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  };

  const paymentHandler = async () => {
    if (hasRun.current || !extractedParams.success) return;
    hasRun.current = true;

    try {
      await postPaymentStatus({
        variables: { postpaymentStatus: extractedParams }
      });

      handlePurchaseClick();
    } catch (err) {
      console.error('Payment handler failed:', err);
      hasRun.current = false;
    }
  };
  useEffect(() => {
    const clearCart = async () => {
      try {
        const db = await openDB();

        if (data.postpaymentStatus.isfreesample) {
          const freeTx = db.transaction('freeSample', 'readwrite');
          freeTx.objectStore('freeSample').clear();
          await waitForTx(freeTx);
          window.dispatchEvent(new Event('freeSampleUpdated'));
        } else {
          const cartTx = db.transaction('cart', 'readwrite');
          cartTx.objectStore('cart').clear();
          await waitForTx(cartTx);
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };

    if (data) {
      clearCart();
    }
  }, [data]);

  //eslint-disable-next-line
  const pushToDataLayer = (data: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
    }
  };

  useEffect(() => {
    paymentHandler();
  }, []);

  return loading ? (
    <CardSkeleton length={3} />
  ) : error || !extractedParams.success ? (
    <div className="flex justify-center my-20 '">
      <div className="w-full max-w-md">
        <div className="border-b-4 border-red shadow-lg p-12 text-center flex flex-col items-center">
          <Image
            className="flex justify-center"
            src="/assets/remove.webp"
            alt="remove image"
            height={50}
            width={50}
          />
          <h2 className="text-4xl font-bold mt-2 mb-3">Payment Unsuccessful</h2>
          <p className="text-lg text-gray-700 font-medium">
            {' '}
            Your payment was not completed. Please try again or contact our
            support team for assistance.
          </p>
        </div>
      </div>
    </div>
  ) : (
    data && (
      <div className="max-w-4xl mx-auto md:p-0 p-2 mt-4">
        <h1 className="md:text-6xl text-3xl font-bold text-center font-inter">
          THANK YOU!
        </h1>
        <p className="text-center mt-2 md:text-xl md:px-0 px-4">
          Say thanks, confirm the payment, provide the order ID and mention that
          the order confirmation email has been sent.
        </p>
        <Shipping orderid={extractedParams.orderId} />
        <OrderSummary data={data} />
      </div>
    )
  );
};

export default ThankYouComp;
