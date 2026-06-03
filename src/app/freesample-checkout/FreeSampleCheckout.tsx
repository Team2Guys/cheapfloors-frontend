'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import Container from 'components/common/container/Container';
import Select from 'components/appointment/Select';
import { emirateCityMap, emirates } from 'data/data';
import { INITIATE_FREE_SAMPLE } from 'graphql/mutations';
import { ICart } from 'types/prod';
import { fetchItems } from 'utils/cartutils';
import { freeSampleCheckoutValidationSchema } from 'utils/freeSampleCheckoutValidation';
import { showAlert } from 'utils/Alert';

// const SAMPLE_SLOTS = 5;

const fieldClass =
  'w-full h-[44px] px-3 border border-[#0000003D] rounded-lg bg-transparent text-base font-medium text-black placeholder:text-[#2727273D] focus:outline-none focus:ring-1 focus:ring-primary';

const labelClass = 'text-lg font-medium text-black mb-1 block';

const FreeSampleCheckout = () => {
  const router = useRouter();
  const [items, setItems] = useState<ICart[]>([]);
  const [selectedEmirate, setSelectedEmirate] = useState('Dubai');
  const [selectedCity, setSelectedCity] = useState('');
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [otherCity, setOtherCity] = useState('');
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marketingOptOut, setMarketingOptOut] = useState(false);

  const [initiateFreesample] = useMutation(INITIATE_FREE_SAMPLE);

  const shipping = {
    name: 'Standard Shipping',
    fee: 0,
    deliveryDuration: '3-4 working days'
  };

  useEffect(() => {
    const load = async () => {
      const samples = await fetchItems(true);
      setItems(samples || []);
    };
    load();
    const handleUpdate = () => load();
    window.addEventListener('freeSampleUpdated', handleUpdate);
    return () => window.removeEventListener('freeSampleUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    const cities = emirateCityMap[selectedEmirate] || [];
    const sorted = cities
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label));
    sorted.push({ value: 'Other', label: 'Other Areas' });
    setCityOptions(sorted);
  }, [selectedEmirate]);

  const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emirate: string;
    city: string;
    country: string;
    address: string;
    note: string;
  }) => {
    if (items.length === 0) {
      showAlert({ title: 'Please add at least one sample', icon: 'warning' });
      return;
    }

    try {
      setIsLoading(true);
      const orderData = {
        ...values,
        city: isOtherCity ? otherCity : selectedCity || values.city,
        shipmentFee: 0,
        totalPrice: 0,
        products: items,
        shippingMethod: shipping,
        note: marketingOptOut
          ? `${values.note || ''} [Marketing opt-out]`.trim()
          : values.note
      };

      const { data } = await initiateFreesample({
        variables: { createFreesample: orderData }
      });
      const orderid = data.freeSample.paymentKey;
      router.push(`/thank-you?isFreeSample=true&order=${orderid}`);
    } catch (err: unknown) {
      const error = err as {
        graphQLErrors?: { message: string }[];
        networkError?: { message: string };
        message?: string;
      };
      showAlert({
        title:
          error?.graphQLErrors?.[0]?.message ||
          error?.networkError?.message ||
          error?.message ||
          'Something went wrong',
        icon: 'error'
      });
    } finally {
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  const renderSlot = (index: number) => {
    const item = items[index];

    if (item) {
      return (
        <Link
          href={`/${item.category}/${item.subcategories}/${item.custom_url}`}
          key={`sample-${item.id}-${index}`}
          className="border border-primary rounded-lg bg-white p-2 flex flex-col justify-between h-[198px] w-[140px] xs:w-[156px]"
        >
          <div className="relative size-[120px] mx-auto">
            <Image
              src={
                item.image ||
                item.matchedProductImages?.imageUrl ||
                item.selectedColor?.imageUrl ||
                ''
              }
              alt={item.name}
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>
          <p className="text-base font-semibold text-black text-center mt-2 leading-tight">
            {item.name}
          </p>
        </Link>
      );
    }

    return (
      <Link
        key={`empty-${index}`}
        href="/collections"
        className="border border-primary rounded-lg bg-white flex flex-col items-center justify-center aspect-square p-3 hover:bg-[#FFFBF0] transition-colors h-[198px] w-[140px] xs:w-[156px]"
      >
        <div className="w-14 h-14 border-2 border-dashed border-black flex items-center justify-center">
          <span className="text-primary text-4xl font-light leading-none">+</span>
        </div>
        <span className="text-black mt-2 text-base font-semibold">Add Sample</span>
      </Link>
    );
  };

  return (
    <Container className="font-inter pb-16 pt-4 sm:pt-6">
      <h1 className="text-[28px] sm:text-[32px] font-bold text-black mb-5 sm:mb-6">
        Free Samples
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Left: sample selection */}
        <div className="w-full lg:w-[55%] xl:w-[70%]">
          <div className="bg-[#FAFAFA] py-3 px-4 text-center mb-4">
            <p className="text-[14px] font-bold text-black">
              Order 5 Free Samples - Free of Charge
            </p>
          </div>

          <div className="flex flex-wrap justify-center xsm:justify-start gap-3 lg:gap-6 xl:gap-8 border-b border-[#0000003D] pb-5">
            {Array.from({ length: 5 }).map((_, i) => renderSlot(i))}
          </div>


          <p className="text-center text-[13px] sm:text-[14px] text-black mt-6 leading-relaxed px-2">
            All sample orders placed before 1:00 PM (Mon–Fri) will be delivered the next day. Orders placed after 1:00 PM will be delivered on the following business day.{' '}
            <span className="text-primary font-semibold">Delivery charges apply at AED 15.</span>
          </p>
        </div>

        {/* Right: shipping form */}
        <div className="w-full lg:w-[45%] xl:w-[30%]">
          <div className="bg-[#FAFAFA] rounded-lg p-4 sm:p-6 free-sample-checkout">
            <h2 className="text-center text-primary font-bold text-[18px] sm:text-[20px] mb-5">
              Shipping address
            </h2>

            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                emirate: 'Dubai',
                city: '',
                country: 'United Arab Emirates',
                address: '',
                note: ''
              }}
              validationSchema={freeSampleCheckoutValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <Form className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label htmlFor="firstName" className={labelClass}>
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Enter first name"
                        value={values.firstName}
                        onChange={handleChange}
                        className={fieldClass}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="p"
                        className="text-red-500 text-[12px] mt-0.5"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Enter last name"
                        value={values.lastName}
                        onChange={handleChange}
                        className={fieldClass}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="p"
                        className="text-red-500 text-[12px] mt-0.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      value={values.email}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-[12px] mt-0.5"
                    />
                  </div>

                  <div className="custom-input-phone-wrapper">
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      name="phone"
                      placeholder="Enter phone number"
                      value={values.phone}
                      className="ring-0 !outline-none text-base font-medium"
                      onChange={(value) => setFieldValue('phone', value || '')}
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-[12px] mt-0.5"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Country<span className="text-red-500">*</span>
                    </label>
                    <Select
                      name="country"
                      options={[
                        {
                          value: 'United Arab Emirates',
                          label: 'United Arab Emirates'
                        }
                      ]}
                      className={fieldClass}
                      placeholder="United Arab Emirates"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Emirate</label>
                      <Select
                        name="emirate"
                        options={emirates}
                        placeholder="Select Emirate"
                        initialValue={selectedEmirate}
                        onChange={(val) => {
                          setSelectedEmirate(val);
                          setFieldValue('emirate', val);
                        }}
                        className={fieldClass}
                      />
                      <ErrorMessage
                        name="emirate"
                        component="p"
                        className="text-red-500 text-[12px] mt-0.5"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Area</label>
                      <Select
                        name="city"
                        allowOther
                        options={cityOptions}
                        placeholder="Select Area"
                        onChange={(value) => {
                          setFieldValue('city', value);
                          setSelectedCity(value);
                          setIsOtherCity(
                            value === 'Other' || value === 'Other Areas'
                          );
                        }}
                        className={fieldClass}
                      />
                      <ErrorMessage
                        name="city"
                        component="p"
                        className="text-red-500 text-[12px] mt-0.5"
                      />
                    </div>
                  </div>

                  {isOtherCity && (
                    <div>
                      <label htmlFor="otherCity" className={labelClass}>
                        Add Area
                      </label>
                      <input
                        id="otherCity"
                        name="otherCity"
                        type="text"
                        placeholder="Enter Your Area"
                        value={otherCity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setOtherCity(e.target.value)
                        }
                        className={fieldClass}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter address"
                      value={values.address}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                    <ErrorMessage
                      name="address"
                      component="p"
                      className="text-red-500 text-[12px] mt-0.5"
                    />
                  </div>

                  <div>
                    <label htmlFor="note" className={labelClass}>
                      Additional Information
                    </label>
                    <input
                      id="note"
                      name="note"
                      type="text"
                      placeholder="Apartment, Suite, etc."
                      value={values.note}
                      onChange={handleChange}
                      className={fieldClass}
                    />
                  </div>

                  <p className="text-base text-black leading-relaxed pt-1">
                    We&apos;d love to send you money-off vouchers, special offers and the very latest in fashion and interior design tips. We will always respect your privacy and we will never sell your details to any other company.
                  </p>

                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={marketingOptOut}
                      onChange={(e) => setMarketingOptOut(e.target.checked)}
                      className="hidden"
                    />
                    <span
                      className={`w-[18px] h-[18px] shrink-0 border-2 flex items-center justify-center rounded-[2px] mt-0.5 ${marketingOptOut
                        ? 'bg-primary border-primary'
                        : 'bg-white border-primary'
                        }`}
                    >
                      {marketingOptOut && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-base font-semibold text-black leading-snug">
                      No thanks, I don&apos;t want to hear about offers or
                      services
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading || items.length === 0}
                    className="w-full py-3 mt-2 rounded-[5px] border border-primary bg-white text-black text-base font-semibold hover:bg-[#FFFBF0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || isLoading
                      ? 'Processing...'
                      : 'Order Free Sample'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FreeSampleCheckout;
