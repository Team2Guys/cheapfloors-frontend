'use client';
import { useState } from 'react';
import Image from 'next/image';
import tabbyLogo from '../../../public/assets/images/payment-icons/tabby-logo.webp';
import tamaraLogo from '../../../public/assets/images/payment-icons/tamara-logo.webp';
import Modal from 'components/ui/modal';
import {
  tabbyfeature,
  tabbyhowitwork,
  tabbypayicon,
  tamarafeature,
  tamaralist,
  tamarawhy
} from 'data/produuct-detail';
import { PaymentMethodProps } from 'types/product-detail';
import { formatAED } from 'utils/helperFunctions';
import { IoInformationCircleOutline } from 'react-icons/io5';

const PaymentMethod = ({ installments, compact }: PaymentMethodProps) => {
  const [tabbyOpen, setTabbyOpen] = useState(false);
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
            <button
              type="button"
              onClick={() => setTabbyOpen(true)}
              className="flex items-center gap-0.5"
              aria-label="Tabby payment info"
            >
              <Image
                src={tabbyLogo}
                alt="Tabby"
                width={52}
                height={22}
                className="h-[18px] sm:h-5 w-auto object-contain"
              />
              <IoInformationCircleOutline className="text-primary text-[15px]" />
            </button>
          </div>
        </div>
        <PaymentModals
          tabbyOpen={tabbyOpen}
          setTabbyOpen={setTabbyOpen}
          tamaraOpen={tamaraOpen}
          setTamaraOpen={setTamaraOpen}
        />
      </div>
    );
  }

  return (
    <div className="border border-[#0000001F] rounded-xl p-4 font-inter">
      <h3 className="text-base font-bold text-black">Buy Now, Pay Later</h3>

      <div className="relative mt-6 rounded-lg border border-[#0000001F] px-4 pt-5 pb-4">
        <div className="absolute -top-3 left-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTabbyOpen(true)}
            aria-label="Tabby payment info"
            className="flex items-center rounded-md bg-[#3BFFC1] px-2 py-1"
          >
            <Image
              src={tabbyLogo}
              alt="tabby"
              width={44}
              height={16}
              className="h-[15px] w-auto object-contain"
            />
          </button>
          <button
            type="button"
            onClick={() => setTamaraOpen(true)}
            aria-label="Tamara payment info"
            className="flex items-center rounded-md bg-gradient-to-r from-orange-300 via-blue-300 to-pink-300 px-2 py-1"
          >
            <Image
              src={tamaraLogo}
              alt="tamara"
              width={52}
              height={16}
              className="h-[15px] w-auto object-contain"
            />
          </button>
        </div>
        <p className="text-13 text-[#6B6B6B]">
          Pay 4 interest-free payments of{' '}
          <span className="font-currency font-normal"></span>{' '}
          {formatAED(installments)}
        </p>
        <button
          type="button"
          onClick={() => setTabbyOpen(true)}
          className="text-13 text-[#6B6B6B] underline"
        >
          Learn more...
        </button>

        <div className="mt-3 flex flex-wrap items-start gap-x-7 gap-y-2">
          {paymentLabels.map((label, index) => (
            <div key={index} className="text-left">
              <p
                className={`text-13 font-semibold text-nowrap ${index === 0 ? 'text-black' : 'text-[#8D8D8D] line-through'}`}
              >
                <span className="font-currency font-normal text-xs"></span>{' '}
                {formatAED(installments)}
              </p>
              <p className="mt-0.5 text-[11px] text-[#8D8D8D]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <PaymentModals
        tabbyOpen={tabbyOpen}
        setTabbyOpen={setTabbyOpen}
        tamaraOpen={tamaraOpen}
        setTamaraOpen={setTamaraOpen}
      />
    </div>
  );
};

const PaymentModals = ({
  tabbyOpen,
  setTabbyOpen,
  tamaraOpen,
  setTamaraOpen
}: {
  tabbyOpen: boolean;
  //eslint-disable-next-line
  setTabbyOpen: (open: boolean) => void;
  tamaraOpen: boolean;
  //eslint-disable-next-line
  setTamaraOpen: (open: boolean) => void;
}) => (
  <>
    <Modal
      isOpen={tabbyOpen}
      onClose={() => setTabbyOpen(false)}
      width="w-[95%] md:w-[60%]"
    >
      <h2 className="text-2xl font-bold py-2">Easy Monthly Installments</h2>
      <div className="py-5 ps-5 xs:ps-10 md:ps-20 pe-4 me-4 xs:me-7">
        <Image
          height={130}
          width={130}
          src={tabbyLogo}
          alt="logo"
          className=" "
        />
        <h2 className="text-xl xs:text-2xl sm:text-lg md:text-xl font-bold mt-5 leading-10 xs:leading-tight">
          <span className="rounded-full bg-[#3BFFC1] px-4 py-0 text-nowrap">
            Shop now,
          </span>
          <br />
          <span className="text-[#3BFFC1] text-outline-border  tracking-wider">
            pay over time.
          </span>
        </h2>
        <ul className='mt-5 font-bold text-lg xs:text-2xl sm:text-xl md:text-xl list-["–"] list-inside leading-normal md:leading-normal'>
          {tabbyfeature.map((item) => (
            <li key={item.id}>{item.para}</li>
          ))}
        </ul>
        <div className="mt-5">
          <h3 className="font-bold text-2xl sm:text-3xl">How it works</h3>
          <ul className="font-medium text-lg xs:text-xl md:text-2xl mt-3 md:leading-relaxed">
            {tabbyhowitwork.map((item) => (
              <li className="flex items-center gap-2" key={item.id}>
                <span className="rounded-full bg-lightbackground min-w-10 h-10 flex_center">
                  {item.id}
                </span>
                <span className="w-full">{item.para}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2 mt-5 px-6">
          {tabbypayicon.map((item, index) => (
            <Image
              src={item.imageUrl}
              alt="master"
              className="sm:w-20 w-14 sm:h-20 object-contain"
              key={index}
              width={80}
              height={80}
            />
          ))}
        </div>
      </div>
    </Modal>

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
  </>
);

export default PaymentMethod;
