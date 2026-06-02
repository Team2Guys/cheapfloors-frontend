import React from 'react';
import Image from 'next/image';
import { formatAED, getExpectedDeliveryDate } from 'utils/helperFunctions';
import { ORDERS_PROD, PostPaymentStatusResponse } from 'types/OrdersProd';

const OrderSummary: React.FC<PostPaymentStatusResponse> = ({
  data,
  trackingOrer
}) => {
  const productlength = data?.postpaymentStatus?.products?.length || 0;
  const productsSubtotal = (data?.postpaymentStatus?.products ?? []).reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );
  const subtotal =
    trackingOrer
      ? data?.postpaymentStatus.totalPrice - data?.postpaymentStatus.shipmentFee
      : productsSubtotal;

  const ExpectedDeliveryDAte = getExpectedDeliveryDate(
    data?.postpaymentStatus?.shippingMethod.name,
    new Date(data?.postpaymentStatus?.transactionDate)
  );

  const getProductDetailLine = (item: ORDERS_PROD) => {
    const isAccessory =
      item?.category?.trim()?.toLowerCase() === 'accessories';

    if (data?.postpaymentStatus.isfreesample) {
      return 'Sample Piece';
    }

    if (isAccessory) {
      return `No. of Pieces: ${item.requiredBoxes}`;
    }

    if (item.isClearance) {
      return `Area: ${Number(item.squareMeter).toFixed(3)} SQM`;
    }

    return `Area: ${Number(item.squareMeter).toFixed(3)} SQM`;
  };

  return (
    <div className="bg-[#FAFAFA] p-2 xs:p-6 xsm:p-10">
      <div className="py-4 border-b border-[#E0E0E0]">
        <h2 className="text-[18px] sm:text-[20px] font-medium text-black">
          Order Summary{' '}
          <span className="text-red-500 ml-1">
            (*Total {productlength} {productlength > 1 ? 'Items' : 'Item'})
          </span>
        </h2>
      </div>

      <div className="py-4 sm:py-5">
        <div className="max-h-72 overflow-y-auto thin-scrollbar">
          {data?.postpaymentStatus?.products?.map(
            (item: ORDERS_PROD, index: number) => {
              const accessoryflag =
                item?.category?.trim()?.toLowerCase() === 'accessories';
              const colorFlag =
                accessoryflag && item.selectedColor && item.selectedColor.color;

              return (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 border-b  px-2 border-[#E0E0E0] pb-4 mb-4 last:mb-0"
                >
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <Image
                      src={item?.image || ''}
                      width={80}
                      height={80}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover border border-[#E0E0E0] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm xsm:text-base font-semibold text-black leading-snug">
                        {item?.name}
                      </p>

                      {trackingOrer ? (
                        <>
                          <p className="text-xs font-semibold text-black mt-1">
                            {getProductDetailLine(item)}
                          </p>
                          {!data?.postpaymentStatus.isfreesample && (
                            <>
                              <p className="text-xs font-semibold text-black mt-0.5">
                                {accessoryflag ? 'Piece Price' : 'Price'}:{' '}
                                <span className="font-currency font-normal">
                                  
                                </span>
                                {accessoryflag ? item.pricePerBox : item.price}
                              </p>
                              {!accessoryflag &&
                                (item.addInstallation ? (
                                  <p className="text-xs font-semibold text-black mt-0.5">
                                    Installation Cost:{' '}
                                    <span className="font-semibold">
                                      <span className="font-currency font-normal">
                                        
                                      </span>{' '}
                                      {formatAED(item.installationCost)}
                                    </span>
                                  </p>
                                ) : (
                                  <p className="text-xs font-semibold text-black mt-0.5">
                                    Installation:{' '}
                                    <span className="font-semibold">
                                      Not Included
                                    </span>
                                  </p>
                                ))}
                              {colorFlag && (
                                <p className="text-xs font-semibold text-black mt-0.5">
                                  Color :{' '}
                                  {`${item?.selectedColor?.colorName} (${item?.selectedColor?.color})`}
                                </p>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <p className="text-xs font-semibold text-black mt-1">
                          {getProductDetailLine(item)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-base font-semibold text-black whitespace-nowrap shrink-0">
                    {item.totalPrice === 0 ? (
                      'Free'
                    ) : (
                      <>
                        <span className="font-currency font-normal"></span>{' '}
                        {formatAED(item.totalPrice)}
                      </>
                    )}
                  </p>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between items-center text-base font-semibold p-3 text-black">
            <span>Subtotal</span>
            <span>
              <span className="font-currency font-normal"></span>{' '}
              {formatAED(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-base font-semibold p-3 text-black">
            <span>Shipping</span>
            <span>
              {data.postpaymentStatus.shipmentFee === 0 ? (
                'Free'
              ) : (
                <>
                  <span className="font-currency font-normal"></span>{' '}
                  {formatAED(data.postpaymentStatus.shipmentFee)}
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center border border-[#E0E0E0] p-3">
            <span className="text-[16px] sm:text-[18px] font-bold text-black">
              Total Incl VAT:
            </span>
            <span className="text-[16px] sm:text-[18px] font-bold text-black">
              <span className="font-currency font-normal"></span>{' '}
              {formatAED(data?.postpaymentStatus?.totalPrice)}
            </span>
          </div>

          {!trackingOrer && (
            <p className="text-[13px] sm:text-[14px] text-black pt-2 leading-relaxed">
              {ExpectedDeliveryDAte}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
