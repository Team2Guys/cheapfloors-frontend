'use client';
import { useState } from 'react';
import Image from 'next/image';
import tamaraLogo from '../../../public/assets/images/payment-icons/tamara-logo.webp';
import Modal from 'components/ui/modal';
import { tamarafeature, tamaralist, tamarawhy } from 'data/produuct-detail';
import { PaymentMethodProps } from 'types/product-detail';
import { formatAED } from 'utils/helperFunctions';
import { IoInformationCircleOutline } from 'react-icons/io5';

const PaymentMethod = ({ installments, compact }: PaymentMethodProps) => {
  const [tamaraOpen, setTamaraOpen] = useState(false);
  const paymentLabels = ['Today', 'In 1 month', 'In 2 month', 'In 3 month'];

  if (compact) {
    return (
      <div className="border border-[#0000003D] rounded-lg px-2 py-2.5 xl:px-4 sm:py-3 font-inter">
        <div className="flex flex-wrap xsm:flex-nowrap md:flex-wrap 2xl:flex-nowrap items-center justify-between gap-2">
          <p className="text-sm xl:text-base font-medium text-black leading-tight shrink-0">
            Pay in 4 interest-free payments with
          </p>
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setTamaraOpen(true)}
              className="flex items-center gap-0.5"
              aria-label="Tamara payment info"
            >
              <Image
                src={tamaraLogo}
                alt="Tamara"
                width={72}
                height={22}
                className="h-[18px] sm:h-5 w-auto object-contain"
              />
              <IoInformationCircleOutline className="text-primary text-[15px]" />
            </button>
          </div>
        </div>
        <PaymentModals tamaraOpen={tamaraOpen} setTamaraOpen={setTamaraOpen} />
      </div>
    );
  }

  return (
    <div className="border border-[#0000003D] rounded-xl p-2 font-inter">
      <h3 className="text-lg font-medium text-black">Buy Now, Pay Later</h3>

      <div className="relative mt-6 rounded-lg border border-[#0000003D] px-2 pt-4 pb-4">
        <div className="absolute -top-3 left-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTamaraOpen(true)}
            aria-label="Tamara payment info"
            className="flex items-center rounded-md border border-[#D47F86]"
          >
            <Image
              src={tamaraLogo}
              alt="tamara"
              width={64}
              height={24}
              className="h-6 w-auto object-contain"
            />
          </button>
        </div>
        <p className="text-base font-medium text-[#8D8D8D]">
          Pay 4 interest-free payments of
        </p>
        <button
          type="button"
          onClick={() => setTamaraOpen(true)}
          className="text-base text-black underline"
        >
          Learn more...
        </button>

        <div className="mt-3 flex flex-wrap items-start justify-between xsm:justify-start gap-x-2 xsm:gap-x-7 gap-y-2">
          {paymentLabels.map((label, index) => (
            <div key={index} className="text-left">
              <p
                className='text-base font-medium text-nowrap text-black'
              >
                <span className="font-currency font-normal text-lg"></span>
                {formatAED(installments)}
              </p>
              <p className="mt-0.5 text-xs text-[#8D8D8D]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <PaymentModals tamaraOpen={tamaraOpen} setTamaraOpen={setTamaraOpen} />
    </div>
  );
};

const PaymentModals = ({
  tamaraOpen,
  setTamaraOpen
}: {
  tamaraOpen: boolean;
  //eslint-disable-next-line
  setTamaraOpen: (open: boolean) => void;
}) => (
  <Modal
    isOpen={tamaraOpen}
    onClose={() => setTamaraOpen(false)}
    width="w-[95%] md:w-[60%]"
  >
      <h2 className="text-2xl font-bold text-center">
        Pay easier with Tamara
      </h2>
      <div className="py-8 px-5 xs:px-10 md:px-20 me-4 xs:me-7">
        <div className="text-center">
          <Image
            height={130}
            width={130}
            src={tamaraLogo}
            alt="logo"
            className="mx-auto"
          />
        </div>
        <h2 className="text-center font-bold text-2xl mt-5">
          Pay easier with Tamara
        </h2>
        <div className="px-4 py-2 bg-gradient-to-r from-orange-300 via-blue-300 to-pink-300 mt-4 rounded-[70px]">
          <div className="bg-gradient-to-r from-orange-100 via-blue-100 to-pink-100 pb-6 pt-1 px-8 rounded-[70px] flex flex-col gap-2">
            <div className="w-10/12 mx-auto">
              {tamarafeature.map((item) => (
                <div className="flex_between py-2" key={item.id}>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-md font-light mt-1">{item.para}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 px-5 xs:px-10 2xl:px-20">
          <h3 className="font-bold text-2xl">Why Tamara?</h3>
          <div className="flex_center flex-wrap 2xl:flex-nowrap 2xl:justify-between gap-4 pt-4">
            {tamarawhy.map((item) => (
              <div
                className="w-auto px-2 h-9 rounded-2xl bg-primary text-white flex_center text-20 font-semibold"
                key={item.id}
              >
                {item.para}
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ul className="font-20 font-normal">
              {tamaralist.map((item) => (
                <li className="flex items-center gap-2" key={item.id}>
                  <span>({item.id})</span>
                  <span>{item.para}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  </Modal>
);

export default PaymentMethod;
