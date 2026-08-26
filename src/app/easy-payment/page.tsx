import React from 'react';
import Container from 'components/common/container/Container';
import { easyPayment } from 'data/cart';
import Image from 'next/image';
import { createMetadata } from 'utils/metadataHelper';
import { pageMetadataData } from 'data/meta-data';
export const metadata = createMetadata(pageMetadataData.easyPayment);

const EasyPayment = () => {
  return (
    <Container className="space-y-2 sm:space-y-4 my-10 font-inter">
      <h1 className="text-center text-24 sm:text-36 font-semibold mb-4">
        Easy Payment
      </h1>
      <ul className="list-disc px-4 space-y-3">
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Shop anytime, stress-free – buy now and pay later with{' '}
          <b>Easy Payment</b> options.
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Enjoy <b>zero interest and no extra fees</b> when you split your
          payment.
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Use our trusted partner <b>Tamara </b>to divide your purchase into{' '}
          <b>4 equal payments</b>.
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Pay the first installment today, then the rest over the next{' '}
          <b>three months</b>.{' '}
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          It’s <b>simple, safe, and transparent</b>.
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          To activate, just select <b>Tamara</b> at checkout.
        </li>
      </ul>
      <div className="flex flex-wrap gap-5 pt-3">
        {easyPayment.slice(-1).map((array, index) => (
          <Image
            className="w-14 h-10 md:w-14 md:h-12 2xl:w-[90px] 2xl:h-[60px] shadow"
            key={index}
            width={90}
            height={60}
            src={array.image}
            alt="payment-card"
          />
        ))}
      </div>
      <ul className="list-disc px-4 space-y-3">
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Prefer to pay in full? We accept{' '}
          <b>Visa, Mastercard, Apple Pay, and Google Pay</b> for added
          security.{' '}
        </li>
        <li className="text-sm sm:text-20 sm:leading-[26px]">
          Our flexible payment options make shopping more accessible, so you can
          focus on getting what you need without upfront pressure.
        </li>
      </ul>
      <div className="flex  flex-wrap gap-5 pt-3">
        {easyPayment.slice(0, 4).map((array, index) => (
          <Image
            className=" w-14 h-10 md:w-14 md:h-12 2xl:w-[90px] 2xl:h-[60px] shadow"
            key={index}
            width={90}
            height={60}
            src={array.image}
            alt="payment-card"
          />
        ))}
      </div>
    </Container>
  );
};

export default EasyPayment;
