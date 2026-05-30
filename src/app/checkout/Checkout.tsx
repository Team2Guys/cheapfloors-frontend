'use client';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Image from 'next/image';
import Container from 'components/common/container/Container';
import Link from 'next/link';
// import secureImg from '../../../public/assets/icons/safe-icon-1.png';
import lightImg from '../../../public/assets/icons/light.png';
import light_2Img from '../../../public/assets/icons/light-02-(traced).png';
import deliveryImg from '../../../public/assets/icons/truck.png';
import locationImg from '../../../public/assets/icons/installation.png';
// import { CiDeliveryTruck } from 'react-icons/ci';
import { emirateCityMap, emirates } from 'data/data';
import { ICart } from 'types/prod';
import { getCart, openDB } from 'utils/indexedDB';
// import { paymentcard } from 'data/cart';
import PaymentMethod from 'components/product-detail/payment';
import { useMutation } from '@apollo/client';
import { INITIATE_FREE_SAMPLE, INITIATE_PAYMENT } from 'graphql/mutations';
import Input from 'components/appointment/Input';
import Select from 'components/appointment/Select';
import { checkoutValidationSchema } from 'utils/CheckoutValidaion';
import revalidateTag from 'components/ServerActons/ServerAction';
import { useRouter } from 'next/navigation';
import { fetchItems } from 'utils/cartutils';
import { formatAED, getShippingData } from 'utils/helperFunctions';
import Accordion from 'components/ui/accordion';
import { showAlert } from 'utils/Alert';
import { termsConditionsData } from 'data/terms-condition';
import TrustBadges from '@/components/product-detail/trust-badges';


interface ProductExtrasProps {
  installments?: number;
  isFreeSample?: boolean;
}

const Checkout = ({
  installments,
  isFreeSample = false,
}: ProductExtrasProps) => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [mergedCart, setMergedCart] = useState<ICart[]>([]);
  const [selectedFee, setSelectedFee] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [shipping, setShipping] = useState<
    | {
      name: string;
      fee: number;
      deliveryDuration: string;
      freeShipping?: number;
    }
    | undefined
  >(undefined);
  const [selectedEmirate, setSelectedEmirate] = useState('');
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [isOtherCity, setIsOtherCity] = useState(false);
  const [otherCity, setOtherCity] = useState('');
  const [allItemsAreFreeSamples, seallItemsAreFreeSamples] =
    useState(isFreeSample);
  const [isLoading, setIsLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    'Shipping Options'
  );
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isInstallation, setIsInstallation] = useState(false);

  const handleToggle = (label: string) => {
    setOpenAccordion((prev) => (prev === label ? null : label));
  };
  const router = useRouter();
  useEffect(() => {
    const savedEmirate = localStorage.getItem('selectedEmirate');
    if (savedEmirate) {
      setSelectedEmirate(savedEmirate.replaceAll('"', ''));
    } else {
      setSelectedEmirate('Dubai'); // 👈 Default to Dubai
      localStorage.setItem('selectedEmirate', JSON.stringify('Dubai'));
    }
  }, []);

  useEffect(() => {
    if (!selectedEmirate) return;
    const cities = emirateCityMap[selectedEmirate] || [];
    const sortedCities = cities
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label));
    sortedCities.push({ value: 'Other', label: 'Other Areas' });
    setCityOptions(sortedCities);

    if (!isFreeSample) {
      if (selectedShipping === 'express' && selectedEmirate !== 'Dubai') {
        setSelectedShipping('standard');
        handleShippingSelect('standard');
      } else if (selectedShipping === 'standard') {
        handleShippingSelect('standard');
      }
    }

    localStorage.setItem('selectedEmirate', JSON.stringify(selectedEmirate));
  }, [selectedEmirate]);

  useEffect(() => {
    if (shipping) {
      localStorage.setItem('shipping', JSON.stringify(shipping));
      localStorage.setItem(
        'selectedShipping',
        JSON.stringify(selectedShipping)
      );
    }
  }, [shipping]);

  useEffect(() => {
    const savedShipping = localStorage.getItem('shipping');

    if (
      savedShipping &&
      savedShipping !== 'undefined' &&
      savedShipping !== 'null'
    ) {
      try {
        const parsedShipping = JSON.parse(savedShipping);
        if (parsedShipping?.name) {
          const key = parsedShipping.name.toLowerCase().replace(/\s+/g, '-');
          handleShippingSelect(key);
        }
      } catch {
        localStorage.removeItem('shipping');
      }
    } else {
      // if (isFreeSample) {
      //   handleShippingSelect('express');
      // } else {
      handleShippingSelect('standard');
      // }
    }
  }, [subTotal]);

  useEffect(() => {
    const savedShipping = localStorage.getItem('shipping');

    if (
      savedShipping &&
      savedShipping !== 'undefined' &&
      savedShipping !== 'null'
    ) {
      try {
        const parsedShipping = JSON.parse(savedShipping);
        if (parsedShipping?.name === 'Express Shipping') {
          setSelectedShipping('express');
          handleShippingSelect('express');
        } else if (parsedShipping?.name === 'Self-Collect') {
          setSelectedShipping('self-collect');
          handleShippingSelect('self-collect');
        } else if (parsedShipping?.name === 'Standard Shipping') {
          setSelectedShipping('standard');
          handleShippingSelect('standard');
        } else {
          // if (isFreeSample) {
          //   handleShippingSelect('express');
          // } else {
          handleShippingSelect('standard');
          // }
        }
      } catch {
        handleShippingSelect('standard');
        // if (isFreeSample) {
        //   localStorage.removeItem('express');
        //   handleShippingSelect('express');
        // } else {
        localStorage.removeItem('shipping');
        handleShippingSelect('standard');
        // }
      }
    } else {
      if (isFreeSample) {
        handleShippingSelect('standard');
      } else {
        if (selectedShipping) {
          handleShippingSelect(selectedShipping);
        } else {
          handleShippingSelect('standard');
        }
      }
    }
  }, [subTotal]);

  type FormInitialValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emirate: string;
    city: string;
    country: string;
    address: string;
    note: string;
  };

  const [initiatePayment] = useMutation(INITIATE_PAYMENT);
  const [initiateFreesample] = useMutation(INITIATE_FREE_SAMPLE);

  const handlePurchaseClick = () => {
    const transactionId = Date.now().toString();
    pushToDataLayer({
      event: 'purchase_initiated',
      ecommerce: {
        transaction_id: transactionId,
        value: selectedEmirate ? formatAED(total) : formatAED(subTotal),
        currency: 'AED',
        items: mergedCart.map((val) => ({
          item_name: val.name,
          item_id: val.id,
          price: val.price,
          quantity: val.requiredBoxes
        }))
      }
    });
  };

  const handlePayment = async (orderData: FormInitialValues) => {
    try {
      setIsLoading(true);
      if (allItemsAreFreeSamples && selectedFee === 0) {
        const { data } = await initiateFreesample({
          variables: { createFreesample: orderData }
        });
        const orderid = data.freeSample.paymentKey;
        router.push(`/thank-you?isFreeSample=true&order=${orderid}`);
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        return;
      }

      const { data } = await initiatePayment({
        variables: { createSalesProductInput: orderData }
      });
      const paymentKey = data.createSalesProduct.paymentKey;
      if (!paymentKey.client_secret)
        return showAlert({
          title: 'payment Key not found',
          icon: 'error'
        });
      const redirect_url = `https://uae.paymob.com/unifiedcheckout/?publicKey=${process.env.NEXT_PUBLIC_PAYMOB_PUBLIC_KEY}&clientSecret=${paymentKey.client_secret}`;
      window.location.href = redirect_url;
      revalidateTag('orders');
      //eslint-disable-next-line
    } catch (err: any) {
      const errorMessage =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.message ||
        err?.message ||
        'Something went wrong';
      showAlert({
        title: errorMessage,
        icon: 'error'
      });
      return err;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (isFreeSample) {
          const freeSample = await fetchItems(isFreeSample);
          setMergedCart(freeSample || []);
          seallItemsAreFreeSamples(isFreeSample);
          setTotalProducts((freeSample && freeSample.length) || 0);
          setSubTotal(0);
        } else {
          const items = await getCart();
          setMergedCart(items);
          setTotalProducts(items.length);
          const subTotalPrice = items.reduce(
            (total, item) => total + item.totalPrice,
            0
          );
          setSubTotal(subTotalPrice);
        }
      } catch {
        showAlert({
          title: 'Error fetching cart items:',
          icon: 'error'
        });
      }
    };

    fetchCartItems();
  }, []);

  const handleShippingSelect = (type: string) => {
    setSelectedShipping(type);
    let fee = 0;

    if (isFreeSample) {
      if (type === 'standard') {
        fee = 0;
      } else if (type === 'self-collect') {
        setSelectedEmirate('Dubai');
        localStorage.setItem('selectedEmirate', JSON.stringify('Dubai'));
        fee = 0;
      }
    } else if (type === 'express') {
      fee = 150;
    } else if (type === 'standard') {
      if (selectedEmirate === 'Dubai') {
        fee = 0;
      } else {
        fee = subTotal >= 2000 ? 0 : 200;
      }
    } else if (type === 'self-collect') {
      setSelectedEmirate('Dubai');
      localStorage.setItem('selectedEmirate', JSON.stringify('Dubai'));
      fee = 0;
    }
    setSelectedFee(fee);
    setTotal(subTotal + fee);

    const shippingData = getShippingData(type, fee, selectedEmirate);
    setShipping(shippingData);
    localStorage.setItem('shipping', JSON.stringify(shippingData));
  };

  useEffect(() => {
    let shippingData;
    if (selectedShipping === 'standard') {
      shippingData = {
        name: 'Standard Shipping',
        fee: 0,
        deliveryDuration: '3-4 working days'
      };
    } else if (selectedShipping === 'express') {
      shippingData = {
        name: 'Express Shipping',
        fee: isFreeSample ? 0 : 150,
        deliveryDuration: 'Next day delivery',
        freeShipping: 1000
      };
    } else if (selectedShipping === 'self-collect') {
      shippingData = {
        name: 'Self-Collect',
        fee: 0,
        deliveryDuration: 'Monday to Saturday (8:30am – 10pm)'
      };
    }
    setShipping(shippingData);
  }, [selectedShipping]);

  //eslint-disable-next-line
  const pushToDataLayer = (data: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
    }
  };

  const handleInstallation = async (
    e: MouseEvent<HTMLDivElement>,
    installation: boolean
  ) => {
    e.stopPropagation();
    setIsInstallation(installation);

    const db = await openDB();
    const tx = db.transaction('cart', 'readwrite');
    const store = tx.objectStore('cart');

    const cartItems: ICart[] = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const map = new Map<string, ICart>();

    for (const item of cartItems) {
      const isAccessory = item.category?.toLowerCase().trim() === 'accessories';

      // Accessories never get installation
      const shouldHaveInstallation = isAccessory ? false : installation;

      // 🔑 Build NEW composite key
      const newKey = shouldHaveInstallation
        ? `${item.id}-installation`
        : String(item.id);

      if (map.has(newKey)) {
        // 🔥 Merge quantities
        const existing = map.get(newKey)!;

        existing.requiredBoxes =
          (existing.requiredBoxes || 0) + (item.requiredBoxes || 0);

        existing.squareMeter =
          (existing.squareMeter || 0) + (item.squareMeter || 0);

        map.set(newKey, existing);
      } else {
        map.set(newKey, {
          ...item,
          addInstallation: shouldHaveInstallation
        });
      }
    }

    // 💰 Recalculate totals
    const finalCart = Array.from(map.values()).map((item) => {
      const adjustedQty =
        item.category?.toLowerCase().trim() === 'accessories'
          ? item.requiredBoxes
          : item.squareMeter;

      const installationRate = item.name.toLowerCase()?.includes('herringbone')
        ? 35
        : 25;
      const installationCost = item.addInstallation
        ? item.squareMeter * installationRate
        : 0;

      return {
        ...item,
        installationCost,
        totalPrice: item.addInstallation
          ? Number(item.price || 0) * adjustedQty + (installationCost || 0)
          : Number(item.price || 0) * adjustedQty
      };
    });

    // 🔄 Replace DB content
    await store.clear();
    for (const item of finalCart) {
      const key = item.addInstallation
        ? `${item.id}-installation`
        : String(item.id);

      await store.put(item, key);
    }

    setMergedCart(finalCart);
    setTotalProducts(finalCart.length);
    const subTotalPrice = finalCart.reduce(
      (total, item) => total + item.totalPrice,
      0
    );
    setSubTotal(subTotalPrice);
  };

  

  return (
    <Container>
      <h1 className="text-24 sm:text-4xl my-2 sm:my-7 text-left font-semibold font-rubik">Checkout</h1>
      <div className="flex items-center gap-2 sm:gap-4 mb-7">
        <span className="text-20 font-medium">Shipping Information</span>
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          className="text-black fill-black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.51562 6.53125L2.26562 10.7812C1.95312 11.0938 1.48438 11.0938 1.20312 10.7812L0.484375 10.0938C0.203125 9.78125 0.203125 9.3125 0.484375 9.03125L3.51562 6.03125L0.484375 3C0.203125 2.71875 0.203125 2.25 0.484375 1.9375L1.20312 1.21875C1.48438 0.9375 1.95312 0.9375 2.26562 1.21875L6.51562 5.46875C6.79688 5.78125 6.79688 6.25 6.51562 6.53125Z" />
        </svg>
        <span className="text-14 lg:text-20 text-primary">Payment</span>
      </div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          emirate: '',
          city: '',
          country: 'United Arab Emirates',
          address: '',
          note: '',
          terms: false
        }}
        validationSchema={checkoutValidationSchema}
        validateOnMount
        onSubmit={(values, { setSubmitting }) => {
          try {
            const { terms, ...withoutTerm } = values; //eslint-disable-line
            // const shippingOption = { name:  }
            const NewValues = {
              ...withoutTerm,
              city: isOtherCity ? otherCity : selectedCity,
              shipmentFee: selectedFee,
              totalPrice: total,
              products: mergedCart,
              shippingMethod: shipping
            };

            setSubmitting(true);
            handlePayment(NewValues);
          } catch (error) {
            console.log(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col lg:flex-row 2md:grid-cols-2 gap-5 lg:gap-10 min-h-screen mb-20">
            <div className="bg-white pb-4 px-2 sm:px-0 sm:pb-8 shadow-lg rounded-lg sm:shadow-none w-full lg:w-[50%] xl:w-[55%]">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="First Name"
                    required
                    name="firstName"
                    placeholder="Enter first name"
                    value={values.firstName}
                    onChange={handleChange}
                  />
                  {/* <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" /> */}
                  <div className="flex flex-col mb-1">
                    <label
                      htmlFor="Last Name"
                      className="text-14 font-medium font-inter mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="p-2 rounded-lg border border-gray-300 h-11 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full placeholder:text-14 placeholder:font-medium placeholder:text-[#0000003D] "
                      name="lastName"
                      placeholder="Enter Last name"
                      value={values.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Input
                  type="email"
                  label="Email Address"
                  required
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                />

                <div className="custom-input-phone-wrapper">
                  <label
                    htmlFor="phone"
                    className="text-14 font-medium font-inter"
                  >
                    Phone No <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="AE"
                    name="phone"
                    placeholder="Type Your Phone No"
                    value={values.phone}
                    className="ring-0 !outline-none text-14"
                    onChange={(value) => setFieldValue('phone', value)}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Select
                  name="country"
                  label="Country"
                  placeholder="Select Country"
                  required
                  options={[
                    {
                      value: 'United Arab Emirates',
                      label: 'United Arab Emirates'
                    }
                  ]}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    name="emirate"
                    label="Emirate"
                    options={emirates}
                    placeholder="Select Emirate"
                    initialValue={selectedEmirate}
                    onChange={(val) => setSelectedEmirate(val)}
                  />
                  <Select
                    name="city"
                    label="Area"
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
                  />
                </div>
                {isOtherCity && (
                  <Input
                    name="otherCity"
                    label="Add Area"
                    placeholder="Enter Your Area"
                    value={otherCity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOtherCity(e.target.value)
                    }
                  />
                )}

                <Input
                  type="text"
                  label="Address"
                  required
                  name="address"
                  placeholder="Enter Address"
                  value={values.address}
                  onChange={handleChange}
                />
                <Input
                  type="text"
                  label="Additional Information"
                  name="note"
                  placeholder="Apartment, Suite, etc."
                  value={values.note}
                  onChange={handleChange}
                />

                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={values.terms}
                      name="terms"
                      onChange={(e) => setFieldValue('terms', e.target.checked)}
                      id="terms-checkbox"
                      className="hidden"
                    />

                    <label
                      htmlFor="terms-checkbox"
                      className="checkbox-label flex justify-start items-start sm:items-center space-x-2 cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 border-2 flex_center transition-colors rounded-sm duration-200 mt-1 ${values.terms
                            ? 'bg-primary border-primary text-white'
                            : 'border-primary'
                          }`}
                      >
                        {values.terms && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-white"
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
                      </div>
                      <span className="text-14 sm:text-16 ">
                        I have read and agree to the{' '}
                        <button
                          className="text-primary hover:underline"
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                        >
                          Terms and Conditions
                        </button>
                      </span>
                    </label>

                    <ErrorMessage
                      name="terms"
                      component="div"
                      className="text-red-500 font-medium text-sm mt-1"
                    />
                  </div>
                </div>
              </div>  
            </div>
            <div className="bg-[#FAFAFA] w-full lg:w-[50%] xl:w-[45%]">
              <div className="p-2 xs:p-4 sm:p-8">
                <div className="flex justify-between gap-4 pb-4 border-b">
                  <h2 className="text-2xl font-medium">Order Summary</h2>
                  <span>
                    (
                    <span className="text-red-500 pt-1">
                      *Total {`${totalProducts}`}{' '}
                      {totalProducts > 1 ? 'Items' : 'Item'}
                    </span>
                    )
                  </span>
                </div>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pe-1 xs:pe-4 pt-3 mt-1">
                  {mergedCart.length > 0 ? (
                    mergedCart.map((item, index) => (
                      <div
                        key={index}
                        className="flex border-b border-t py-4"
                      >
                        <div className="p-1 bg-white border items-center flex">
                          <Image
                            src={
                              item.image ||
                              item.matchedProductImages?.imageUrl ||
                              ''
                            }
                            alt={item.name}
                            height={100}
                            width={100}
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-13 xs:text-base ">
                            {item.name}
                          </p>
                          {item.isfreeSample ? (
                            ''
                          ) : (
                            <p className="text-sm text-gray-600 text-12 xs:text-sm">
                              {item.category?.toLowerCase().trim() ===
                                'accessories' ? (
                                <>
                                  No. of Pieces:{' '}
                                  <span className="font-semibold">
                                    {item.requiredBoxes}
                                  </span>
                                </>
                              ) : (
                                <>
                                  {item.isClearance ? 'Bundle:' : 'Area:'}{' '}
                                  {item.squareMeter.toFixed(2)} SQM
                                </>
                              )}
                            </p>
                          )}
                          {item.isfreeSample ? (
                            <p className="md:text-sm text-gray-600 text-12">
                              Free Sample
                            </p>
                          ) : (
                            <p className="md:text-sm text-gray-600 text-12">
                              {item.category?.toLowerCase().trim() ===
                                'accessories'
                                ? 'Piece Price'
                                : 'Price'}
                              :{' '}
                              <span className="font-currency text-15 font-normal">
                                
                              </span>
                              {item.price?.toFixed(2)}
                            </p>
                          )}
                          {item.category?.toLowerCase().trim() ===
                            'accessories' ? (
                            ''
                          ) : item.addInstallation ? (
                            <p className="md:text-sm text-gray-600 text-12">
                              Installation Cost:{' '}
                              <span className="font-semibold">
                                <span className="font-currency text-15 font-normal">
                                  
                                </span>
                                {item.installationCost?.toFixed(2)}
                              </span>
                            </p>
                          ) : (
                            <p className="md:text-sm text-gray-600 text-12">
                              Installation:{' '}
                              <span className="font-semibold">
                                Not Included
                              </span>
                            </p>
                          )}
                          {item?.selectedColor?.colorName && (
                            <p className="text-sm text-gray-600 text-12 xs:text-sm">
                              Color:
                              <span>
                                {' '}
                                {item?.selectedColor?.colorName || ''}
                              </span>
                            </p>
                          )}
                        </div>
                        <p className="ml-auto font-medium text-nowrap text-13 xs:text-base">
                          <span className="font-currency font-normal text-20">
                            
                          </span>{' '}
                          {formatAED(item.totalPrice)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Cart is Empty</p>
                  )}
                </div>
              </div>
              <div className="px-2 xs:px-4 sm:px-8 pb-10">
                <div className="space-y-2 pb-4">
                  <p className="text-base font-semibold flex justify-between border-b pb-2">
                    Subtotal{' '}
                    <span className="text-black">
                      <span className="font-currency text-20 font-normal">
                        
                      </span>{' '}
                      {formatAED((subTotal) - (subTotal - (subTotal / 1.05)))}
                    </span>
                  </p>
                  <p className=" flex justify-between">
                    <span className="flex items-center gap-2 font-semibold">
                      Shipping 
                      {/* <CiDeliveryTruck size={16} className="mt-1" /> */}
                    </span>
                    <span className="text-black">
                      {selectedEmirate === 'Enter Emirate' ? (
                        isFreeSample ? (
                          selectedFee > 0 ? (
                            <span className="font-currency font-normal text-18">
                               {formatAED(selectedFee)}
                            </span>
                          ) : (
                            'Free'
                          )
                        ) : (
                          'Select Shipping Emirate'
                        )
                      ) : selectedShipping === 'express' ?
                        isFreeSample ?
                          'Free' :
                          (
                            <span className="font-currency font-normal text-18">
                               {formatAED(150)}
                            </span>
                          ) : selectedEmirate === 'Dubai' ? (
                            'Free'
                          ) : subTotal >= 2000 ? (
                            'Free'
                          ) : (
                          <span className="font-currency font-normal text-18">
                             {formatAED(200)}
                          </span>
                        )}
                    </span>
                  </p>
                  {/* <p className="text-lg font-bold flex justify-between">
                    VAT{' '}
                    <span>
                      <span className="font-currency font-normal text-20">
                        
                      </span> {formatAED(subTotal - (subTotal / 1.05))}
                    </span>
                  </p> */}
                  <p className="text-xl font-bold flex justify-between border p-2">
                    Total Incl. VAT{' '}
                    <span>
                      <span className="font-currency font-normal text-22">
                        
                      </span>{' '}
                      {selectedEmirate !== 'Enter Emirate'
                        ? formatAED(total)
                        : formatAED(subTotal)}
                    </span>
                  </p>

                   <div className="py-3">
                  <button
                    type="submit"
                    onClick={
                      allItemsAreFreeSamples ? () => { } : handlePurchaseClick
                    }
                    className={`w-full bg-primary hover:bg-secondary text-white rounded-md  ${allItemsAreFreeSamples ? 'p-3' : 'p-2'} `}
                    disabled={isSubmitting || isLoading || totalProducts === 0}
                  >
                    {isSubmitting || isLoading
                      ? 'Processing...'
                      : allItemsAreFreeSamples
                        ? 'Place Order'
                        : 'Pay Now'}
                  </button>
                   </div>

                  <div className="">
                    <Accordion
                      isCheckout
                      label="Shipping Options"
                      isOpen={openAccordion === 'Shipping Options'}
                      onToggle={() => handleToggle('Shipping Options')}
                    >
                      {isFreeSample ? (
                        <div
                          className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'standard'
                              ? 'border-primary'
                              : 'border-transparent'
                            }`}
                          onClick={() => handleShippingSelect('standard')}
                        >
                          <Image
                            src={deliveryImg}
                            alt="icon"
                            className="size-12 xs:size-16"
                          />
                          <div className="text-11 xs:text-base">
                            <strong className="text-15 xs:text-20">
                              Standard Service
                            </strong>
                            <p className="text-11 xs:text-base">
                              Delivery:{' '}
                              <strong>
                                Next working day (cut-off time 1pm)
                              </strong>
                            </p>
                            <p>
                              Delivery Cost:{' '}
                              {isFreeSample ? (
                                <strong>Free</strong>
                              ) : (
                                <strong>
                                  <span className="font-currency font-normal text-18">
                                    
                                  </span>
                                  30
                                </strong>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {(selectedEmirate === 'Dubai' || !selectedEmirate) &&
                            !allItemsAreFreeSamples && (
                              <div
                                className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'express'
                                    ? 'border-primary'
                                    : 'border-transparent'
                                  }`}
                                onClick={() => handleShippingSelect('express')}
                              >
                                <Image
                                  src={lightImg}
                                  alt="icon"
                                  className="size-12 xs:size-16"
                                />
                                <div className="">
                                  <strong className="text-primary test-16 font-semibold">
                                    Express Service (Dubai Only)
                                  </strong>
                                  <p className="text-14">
                                    Delivery:{' '}
                                    <strong>
                                      Next working day (cut-off time 1pm)
                                    </strong>
                                  </p>
                                  <p className="text-14">
                                    Delivery Cost:{' '}
                                    <strong>
                                      <span className="font-currency font-normal text-16">
                                        
                                      </span>
                                      150
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            )}
                          <div
                            className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'standard'
                                ? 'border-primary'
                                : 'border-transparent'
                              }`}
                            onClick={() => handleShippingSelect('standard')}
                          >
                            <Image
                              src={deliveryImg}
                              alt="icon"
                              className="size-12 xs:size-16"
                            />
                            <div>
                              <strong className="text-16 font-semibold text-primary">
                                Standard Service{' '}
                                {!allItemsAreFreeSamples &&
                                  (selectedEmirate === 'Dubai'
                                    ? ' (Dubai)'
                                    : ' (All Other Emirates)')}
                              </strong>
                              <p className="text-14">
                                Delivery:{' '}
                                <strong>
                                  2{selectedCity === 'Dubai' ? '' : '-3'}{' '}
                                  working days
                                </strong>
                              </p>
                              <p className="text-14">
                                <span>Delivery Cost:</span>
                                {allItemsAreFreeSamples ? (
                                  <strong> Free</strong>
                                ) : selectedEmirate === 'Dubai' ? (
                                  <strong> Free</strong>
                                ) : (
                                  <>
                                    Free for orders above{' '}
                                    <strong>
                                      <span className="font-currency font-normal text-16">
                                        
                                      </span>
                                      2,000
                                    </strong>
                                    .{' '}
                                    <strong>
                                      <span className="font-currency font-normal text-16">
                                        
                                      </span>
                                      200
                                    </strong>{' '}
                                    delivery charge applies for orders below{' '}
                                    <strong>
                                      <span className="font-currency font-normal text-16">
                                        
                                      </span>
                                      1,999
                                    </strong>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div
                        className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${selectedShipping === 'self-collect'
                            ? 'border-primary'
                            : 'border-transparent'
                          }`}
                        onClick={() => handleShippingSelect('self-collect')}
                      >
                        <Image
                          src={locationImg}
                          alt="icon"
                          className="size-12 xs:size-16"
                        />
                        <div>
                          <strong className="text-16 font-semibold text-primary">
                            Self-Collect:
                          </strong>
                          <p className="text-14">
                            Collection Monday-Saturday{' '}
                            <strong>(9am-6pm)</strong>
                          </p>
                          <p className="text-14">
                            <span>Location:</span>{' '}
                            <strong>
                              <Link
                                className="hover:text-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://maps.app.goo.gl/BBJjwVKgTK4PPTWR8"
                              >
                                Unit A11, J1 Warehouses, Jebel Ali Industrial
                                Area-1 - Dubai
                              </Link>
                            </strong>
                          </p>
                        </div>
                      </div>
                    </Accordion>
                    <Accordion
                      isCheckout
                      label="Installation"
                      isOpen={openAccordion === 'Installation'}
                      onToggle={() => handleToggle('Installation')}
                    >
                      <div
                        className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center border-2 ${!isFreeSample ? 'cursor-pointer' : ''} ${isInstallation ? 'border-primary' : 'border-transparent'}`}
                        onClick={(e) => !isFreeSample && handleInstallation(e, !isInstallation)}
                      >
                        <Image
                          src={light_2Img}
                          alt="icon"
                          className="size-12 xs:size-16"
                        />
                        <div>
                          <div className="text-16 text-primary font-semibold">
                            Installation Information:
                          </div>
                          <p className="text-14">
                            Installation charge for straight planks is{' '}
                            <span className="font-currency text-16 font-normal">
                              
                            </span>{' '}
                            25 per metre square, and for herringbone is{' '}
                            <span className="font-currency text-18 font-normal">
                              
                            </span>{' '}
                            35 per metre square. We&apos;re based in Dubai, so
                            just a heads-up—other locations in Emirates may have
                            additional charges.
                          </p>
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-primary underline text-primary text-14 font-semibold"
                            href="/help-with-installations"
                          >
                            Book Installation Appointment
                          </Link>
                        </div>
                      </div>
                    </Accordion>
                    <Accordion
                      isCheckout
                      label="Return Policy"
                      isOpen={openAccordion === 'Return Policy'}
                      onToggle={() => handleToggle('Return Policy')}
                    >
                      <p className="text-14 bg-white px-4">
                        We offer 7-day hassle-free returns on all unused, sealed
                        items in their original packaging. If you change your
                        mind or receive a defective product, we’re here to help.{' '}
                        <Link
                          className="font-semibold text-red-500 hover:text-red-500 hover:underline underline"
                          href="/return-and-refund-policy"
                        >
                          Learn more
                        </Link>
                      </p>
                    </Accordion>
                  </div>

                  
                </div>
               
                {/* <div className="flex_center gap-2 mt-4">
                  <Image
                    src={secureImg}
                    alt="secure img"
                    className="w-4 xs:w-7 h-5 xs:h-8"
                  />
                  <p className="text-13 xs:text-15 sm:text-17">
                    Secure shopping with SSL data encryption
                  </p>
                </div> */}

                {/* {subTotal > 0 && (
                  <div className="mt-4">
                    <h3 className="text-20 xs:text-24 font-medium text-center">
                      Buy Now, Pay Later
                    </h3>
                    <div className="flex gap-2 my-4 mx-auto w-full 2xl:max-w-3xl">
                      <PaymentMethod
                        installments={(subTotal + (selectedFee || 0)) / 4}
                      />
                    </div>
                  </div>
                )}
                <div className="mx-auto w-full max-w-xl mt-2">
                  <h3 className="text-18 xs:text-20 text-center font-medium">
                    Guaranteed Safe Checkout
                  </h3>
                  <div className="flex justify-between flex-wrap gap-5 pt-3">
                    {paymentcard.map((array, index) => (
                      <Image
                        className=" w-16 h-11 md:w-14 md:h-12 2xl:w-[90px] 2xl:h-[60px]"
                        key={index}
                        width={90}
                        height={60}
                        src={array.image}
                        alt="payment-card"
                      />
                    ))}
                  </div>
                </div> */}

                 <div className="space-y-2.5">
                <PaymentMethod installments={installments ?? 0} compact />
                <TrustBadges />
                 </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-2xl w-full relative py-6">
            <h2 className="text-center text-xl xsm:text-2xl font-bold mb-4">
              Terms And Conditions
            </h2>
            <div className="max-h-[70vh] overflow-y-auto px-6">
              {/* Close Button */}
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                aria-label="Close"
              >
                &times;
              </button>

              {/* Modal Content */}
              <div className="space-y-6">
                {termsConditionsData
                  .slice(
                    0,
                    termsConditionsData.findIndex(
                      (section) => section.title === 'General Terms'
                    ) + 1
                  )
                  .map((section, idx) => (
                    <div key={idx}>
                      {section.title && (
                        <h3 className="text-lg font-semibold mb-2">
                          {section.title}
                        </h3>
                      )}
                      {section.heading?.map((head, i) => (
                        <h4 key={i} className="text-md font-medium mt-2">
                          {head}
                        </h4>
                      ))}
                      {section.content?.map((para, i) => (
                        <p key={i} className="text-sm text-gray-700 mb-2">
                          {para}
                        </p>
                      ))}
                      {section.subItems && (
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                          {section.subItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                {/* Read More Link */}
                <div className="text-right mt-4">
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    className="text-primary hover:underline text-sm font-medium"
                    onClick={() => setShowTermsModal(false)}
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Checkout;
