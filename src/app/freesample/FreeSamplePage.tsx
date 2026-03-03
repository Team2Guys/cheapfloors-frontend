'use client';
import CartSelect from 'components/cart/cart-select';
import PaymentMethod from 'components/product-detail/payment';
import Accordion from 'components/ui/accordion';
import { paymentcard } from 'data/cart';
import { emirates } from 'data/data';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICart } from 'types/prod';
import { fetchItems } from 'utils/cartutils';
const ProductTable = dynamic(() => import('components/product-table'));
const WishlistSmall = dynamic(() => import('components/smallscreen'));
const Container = dynamic(
  () => import('components/common/container/Container')
);
const Breadcrumb = dynamic(() => import('components/Reusable/breadcrumb'));
const Top = dynamic(() => import('components/top'));
import deliveryImg from '../../../public/assets/icons/delivery-truck 2 (traced).png';
import locationImg from '../../../public/assets/icons/location 1 (traced).png';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { formatAED } from 'utils/helperFunctions';

const FreeSamplePage = () => {
  const pathname = usePathname();
  const isSamplePage = pathname === '/freesample';
  const [items, setItems] = useState<ICart[]>([]);
  const [selectedFee, setSelectedFee] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Enter Emirate');
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState<
    | {
        name: string;
        fee: number;
        deliveryDuration: string;
        freeShipping?: number;
      }
    | undefined
  >(undefined);
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    'Shipping Options'
  );

  const handleToggle = (label: string) => {
    setOpenAccordion((prev) => (prev === label ? null : label));
  };
  useEffect(() => {
    fetchItems(isSamplePage, setItems);
    setSubTotal(0);
    const handleCartUpdate = () => fetchItems(isSamplePage, setItems);
    window.addEventListener('freeSampleUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('freeSampleUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    setSubTotal(0);

    // Recalculate shipping and total whenever cart items change
    const fee = calculateShippingFee(selectedShipping);
    setSelectedFee(fee);

    const totalBeforeTax = 0 + fee;
    setTotal(totalBeforeTax);
  }, [items]);

  useEffect(() => {
    handleShippingSelect('standard');
  }, []);

  const calculateShippingFee = (shippingType: string | null): number => {
    if (shippingType === 'standard') {
      return 0;
    }
    if (shippingType === 'self-collect') {
      return 0;
    }
    return 0;
  };

  const handleStateSelect = (state: string) => {
    setSelectedCity(state);
    localStorage.setItem('selectedEmirate', JSON.stringify(state));

    const shippingType = state === 'Dubai' ? selectedShipping : 'standard';

    const fee = calculateShippingFee(shippingType);
    setSelectedFee(fee);

    const totalBeforeTax = subTotal + fee;
    setTotal(totalBeforeTax);
  };

  const handleShippingSelect = (type: string) => {
    setSelectedShipping(type);
    localStorage.setItem('selectedShipping', type);

    if (type === 'self-collect') {
      // Save previous city before overriding
      setSelectedCity('Dubai');
      localStorage.setItem('selectedEmirate', JSON.stringify('Dubai'));

      const fee = calculateShippingFee(type);
      setSelectedFee(fee);
      setTotal(subTotal + fee);
    } else {
      // Restore previous city if it exists
      const cityToUse = selectedCity;

      setSelectedCity(cityToUse);
      localStorage.setItem('selectedEmirate', JSON.stringify(selectedCity));

      const fee = calculateShippingFee(type);
      setSelectedFee(fee);
      setTotal(subTotal + fee);
    }
  };

  useEffect(() => {
    localStorage.setItem('shipping', JSON.stringify(shipping));
    localStorage.setItem('shippingFee', JSON.stringify(selectedFee));
    localStorage.setItem('selectedEmirate', JSON.stringify(selectedCity));
  }, [selectedCity, selectedShipping]);

  useEffect(() => {
    let shippingData;

    if (selectedShipping === 'standard') {
      shippingData = {
        name: 'Standard Service',
        fee: 0,
        deliveryDuration: 'Next working day (cut-off 1pm)'
      };
    } else if (selectedShipping === 'self-collect') {
      shippingData = {
        name: 'Self-Collect',
        fee: 0,
        deliveryDuration: 'Monday to Saturday (8:30am – 10pm)'
      };
    }

    localStorage.setItem('shipping', JSON.stringify(shippingData));
    setShipping(shippingData);
  }, [selectedShipping, selectedCity, selectedFee]);

  return (
    <>
      <Breadcrumb title="Free Sample" />
      <Container>
        <Top
          heading="Free Samples"
          Icon={() => (
            <Image
              src="/assets/images/Wishlist/sample.svg"
              alt="Sample"
              width={24}
              height={24}
              className="h-10 w-10 lg:h-14 lg:w-14"
            />
          )}
        />
        {items.length === 0 ? (
          <div className="text-center mb-10">
            <p className="text-center text-[24px] ">
              Free Sample list is empty
            </p>
            <Link
              href="/collections"
              className="text-center text-[18px] bg-primary p-2 flex w-fit mx-auto items-center text-white gap-2 mt-4"
            >
              <FaArrowLeftLong /> Go Back to Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap lg:flex-nowrap gap-5 ">
            <div className=" w-full lg:w-[55%] xl:w-[70%] 2xl:w-[65%] px-2">
              <div className="hidden md:block pb-6 xl:pt-6 xl:mb-10">
                <ProductTable
                  columns={[
                    'Product',
                    'Price Per Piece',
                    'Stock Status',
                    'Action'
                  ]}
                  items={items}
                  setItems={setItems}
                  isSamplePage
                />
              </div>
              <div className="block md:hidden">
                <WishlistSmall items={items} setItems={setItems} isSamplePage />
              </div>
            </div>
            <div className="w-full lg:w-[45%] xl:w-[30%] 2xl:w-[35%] bg-background p-3 sm:p-5 space-y-5 h-fit">
              <div className="flex gap-2 md:gap-5 items-center max-sm:justify-between">
                <h2 className=" text-18 md:text-20 2xl:text-28">
                  Order Summary
                </h2>
                <p className="text-sm text-[#FF0004]">
                  (*Total {items.length}{' '}
                  {items.length === 1 ? 'Item' : ' Items'})
                </p>
              </div>
              <div className="border border-b border-[#DEDEDE]" />
              <div className="flex_between lg:text-20">
                <p>Subtotal:</p>
                <p>
                  <span className="font-currency font-normal text-20 2xl:text-25">
                    
                  </span>{' '}
                  {formatAED(subTotal)}
                </p>
              </div>
              {selectedShipping !== 'self-collect' && (
                <CartSelect
                  select={emirates}
                  selectedFee={selectedFee}
                  selectedShipping={selectedShipping ?? ''}
                  onSelect={handleStateSelect}
                />
              )}
              <Accordion
                isCheckout
                label="Shipping Options"
                isOpen={openAccordion === 'Shipping Options'}
                onToggle={() => handleToggle('Shipping Options')}
              >
                <div
                  className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${
                    selectedShipping === 'standard'
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
                      <strong>Next working day (cut-off time 1pm)</strong>
                    </p>
                    <p>
                      Delivery Cost:{' '}
                      <strong>
                        {/* <span className="font-currency font-normal text-18">
                          
                        </span> */}
                        Free
                      </strong>
                    </p>
                  </div>
                </div>
                <div
                  className={`bg-white px-2 xs:px-4 py-2 mt-2 flex gap-2 xs:gap-4 items-center cursor-pointer border-2 ${
                    selectedShipping === 'self-collect'
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
                    <strong className="text-15 xs:text-20">Self-Collect</strong>
                    <p className="text-11 xs:text-base">
                      Collection: Monday to Saturday{' '}
                      <strong>(8:30am - 10pm)</strong>
                    </p>
                    <p className="text-11 xs:text-base">
                      <span>Location:</span>{' '}
                      <strong>
                        <Link
                          className="hover:text-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://maps.app.goo.gl/BBJjwVKgTK4PPTWR8"
                        >
                          22nd 15B St - Al Quoz - Al Quoz Industrial Area 4 -
                          Dubai - UAE
                        </Link>
                      </strong>
                    </p>
                  </div>
                </div>
              </Accordion>

              <div className="border border-b border-[#DEDEDE]" />
              <div className="flex_between lg:text-20">
                <p>Total Incl. VAT</p>
                <p>
                  <span className="font-currency font-normal text-20 lg:text-25">
                    
                  </span>{' '}
                  {total > 0 ? formatAED(total) : formatAED(subTotal)}
                </p>
              </div>
              <Link
                href="freesample-checkout"
                className="bg-primary text-white px-4 py-3 w-full text-sm md:text-20 block text-center "
              >
                Proceed to Checkout
              </Link>

              <p className="text-18 xl:text-22 font-semibold text-center">
                Buy Now, Pay Later
              </p>
              {total > 0 && (
                <PaymentMethod
                  installments={
                    total > 0
                      ? parseFloat(total.toFixed(2)) / 4
                      : parseFloat(subTotal.toFixed(2)) / 4
                  }
                />
              )}
              <div className="flex justify-between gap-2">
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
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default FreeSamplePage;
