import React from 'react';
import Image from 'next/image';
import { formatAED, getExpectedDeliveryDate } from 'utils/helperFunctions';
import { ORDERS_PROD, PostPaymentStatusResponse } from 'types/OrdersProd';

const OrderSummary: React.FC<PostPaymentStatusResponse> = ({
  data,
  trackingOrer
}) => {
  const productlength = data?.postpaymentStatus?.products?.length || 0;

  const ExpectedDeliveryDAte = getExpectedDeliveryDate(
    data?.postpaymentStatus?.shippingMethod.name,
    new Date(data?.postpaymentStatus?.transactionDate)
  );

  return (
    <div className="bg-[#FFF9F5] ">
      <div className="border-b md:p-7 p-3 ">
        <h2 className="md:text-3xl text-xl">
          Order Summary{' '}
          <sup className="md:text-sm md:ml-3 text-10 text-red-500">
            *Total {`${productlength}`} {productlength > 1 ? 'Items' : 'Item'}
          </sup>{' '}
        </h2>
      </div>
      <div className="md:p-10 p-2">
        <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {data?.postpaymentStatus?.products?.map(
            (item: ORDERS_PROD, index: number) => {
              const accessoryflag =
                item?.category?.trim()?.toLowerCase() == 'accessories';
              const colorFlag =
                accessoryflag && item.selectedColor && item.selectedColor.color;
              return (
                <div key={index} className="md:pr-6">
                  <div className="flex_between border-b gap-5 pb-4 mb-4">
                    <div className="flex items-center md:gap-5 gap-2">
                      <Image
                        src={item?.image || ''}
                        width={100}
                        height={100}
                        alt={item.name}
                        className="md:w-20 md:h-20 w-16 h-16 object-cover border p-1"
                      />
                      <div>
                        <p className="font-bold md:text-base text-sm">
                          {item?.name}
                        </p>
                        {data?.postpaymentStatus.isfreesample ? (
                          <p className="md:text-sm text-12">Sample Piece</p>
                        ) : (
                          <>
                            <p className="md:text-sm text-12">
                              {accessoryflag
                                ? 'No. of Pieces'
                                : item.isClearance
                                  ? 'Bundle'
                                  : 'Area'}
                              :{' '}
                              {accessoryflag
                                ? item.requiredBoxes
                                : ` ${Number(item.squareMeter).toFixed(2)}  SQM`}
                            </p>
                            <p className="md:text-sm text-12">
                              {accessoryflag ? 'Piece Price' : 'Price'}:{' '}
                              <span className="font-currency text-15 font-normal">
                                
                              </span>
                              {accessoryflag ? item.pricePerBox : item.price}
                            </p>
                            {accessoryflag ? (
                              ''
                            ) : item.addInstallation ? (
                              <p className="md:text-sm text-12">
                                Installation Cost:{' '}
                                <span className="font-semibold">
                                  <span className="font-currency text-15 font-normal">
                                    
                                  </span>{' '}
                                  {formatAED(item.installationCost)}
                                </span>
                              </p>
                            ) : (
                              <p className="md:text-sm text-12">
                                Installation:{' '}
                                <span className="font-semibold">
                                  Not Included
                                </span>
                              </p>
                            )}
                            {colorFlag && (
                              <p className="md:text-sm text-12">
                                {' '}
                                Color :{' '}
                                {`${item?.selectedColor?.colorName} (${item?.selectedColor?.color})`}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <p className="md:text-lg font-semibold">
                      {item.totalPrice === 0 ? (
                        'Free'
                      ) : (
                        <>
                          <span className="font-currency text-18 font-normal">
                            
                          </span>{' '}
                          {formatAED(item.totalPrice)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-6 text-right">
          {trackingOrer && (
            <div className="flex justify-between">
              <p className=" whitespace-nowrap text-20 text-[#818EA1] ">
                Subtotal
              </p>
              <p className=" whitespace-nowrap text-20 font-normal">
                <span className="font-currency text-18 font-normal"></span>{' '}
                {data?.postpaymentStatus.totalPrice - data?.postpaymentStatus.shipmentFee}
              </p>
            </div>
          )}

          <div className="flex justify-between mt-5">
            <p className=" whitespace-nowrap text-20 text-[#818EA1] ">
              Shipping
            </p>
            <p className=" whitespace-nowrap text-20 font-normal">
              {data.postpaymentStatus.shipmentFee == 0 ? (
                'Free'
              ) : (
                <>
                  <span className="font-currency text-18 font-normal"></span>{' '}
                  {data.postpaymentStatus.shipmentFee}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <p className="md:text-2xl text-xl whitespace-nowrap font-bold">
              Total Incl:
            </p>
            <span className="flex-grow border-b"></span>
            <p className="lg:text-xl text-lg font-bold whitespace-nowrap">
              <span className="font-currency text-18 font-normal"></span>{' '}
              {data?.postpaymentStatus?.totalPrice}
            </p>
          </div>

          {!trackingOrer && (
            <div className="border-t md:mt-12 mt-3  ">
              <p className="text-left mt-2 md:text-xl">
                {ExpectedDeliveryDAte}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
