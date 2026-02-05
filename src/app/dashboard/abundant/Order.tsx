'use client';

import { useMutation } from '@apollo/client';
import Breadcrumb from 'components/Dashboard/Breadcrumbs/Breadcrumb';
import DefaultLayout from 'components/Dashboard/DefaultLayout';
import Modal from 'components/ui/modal';
import Table from 'components/ui/table';
import {
  ORDER_STATUS_UPDATE,
  UPDATE_ORDER_DELIVERY_DATE
} from 'graphql/mutations';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { BsEyeFill } from 'react-icons/bs';
import { FiDownloadCloud } from 'react-icons/fi';
import { Order as prodOrder } from 'types/prod';
import { showAlert } from 'utils/Alert';
import { formatAED } from 'utils/helperFunctions';
import * as XLSX from 'xlsx';

const Order = ({
  title,
  ordersData,
  isfreesample,
  orders
}: {
  title: string;
  orders: prodOrder[];
  ordersData: prodOrder[];
  isfreesample?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderIdStatus, setOrdeIdStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<prodOrder | null>(null);
  const [data, setData] = useState<prodOrder[]>(ordersData);
  const [postOrderStatus] = useMutation(ORDER_STATUS_UPDATE);
  const [updateOrderDeliveryDate] = useMutation(UPDATE_ORDER_DELIVERY_DATE);
  const showModal = (record: prodOrder) => {
    setSelectedOrder(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const orderStatus = ['placed', 'shipped', 'delivered', 'cancel'];

  const handleCategoryChange = async (
    e: ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    setOrdeIdStatus(orderId);
    const status = e.target.value as string;
    const findOrder = data.find((order) => order.orderId === orderId);
    if (
      (findOrder?.deliveryDate === '' ||
        findOrder?.deliveryDate === undefined ||
        findOrder?.deliveryDate === null) &&
      (status === 'shipped' || status === 'delivered')
    ) {
      showAlert({
        title: 'Please Select Delivery Date First',
        icon: 'error'
      });
      setOrdeIdStatus('');
      return;
    }

    // Optimistically update UI
    setData((prevData) =>
      prevData.map((order) =>
        order.orderId === orderId ? { ...order, orderStatus: status } : order
      )
    );

    try {
      await postOrderStatus({
        variables: { orderId, status }
      });
      showAlert({
        title: 'Order Status has been successfully updated!',
        icon: 'success'
      });
    } catch (err) {
      setData((prevData) =>
        prevData.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: order.orderStatus }
            : order
        )
      );
      console.error('Failed to update order status:', err);
      showAlert({
        title: 'Order Status update failed!',
        icon: 'error'
      });
    } finally {
      setOrdeIdStatus('');
    }
  };

  const handleDeliveryDateChange = async (
    e: ChangeEvent<HTMLInputElement>,
    orderId: string
  ) => {
    e.preventDefault();
    setOrdeIdStatus(orderId);
    const deliveryDateValue = e.target.value;
    const date = new Date(deliveryDateValue);
    if (isNaN(date.getTime())) {
      showAlert({
        title: 'Invalid date',
        icon: 'error'
      });
      return;
    }
    setData((prevData) =>
      prevData.map((order) =>
        order.orderId === orderId
          ? { ...order, deliveryDate: deliveryDateValue }
          : order
      )
    );

    try {
      await updateOrderDeliveryDate({
        variables: { orderId, deliveryDate: date }
      });
      showAlert({
        title: 'Delivery date updated successfully',
        icon: 'success'
      });
    } catch (err) {
      setData((prevData) =>
        prevData.map((order) =>
          order.orderId === orderId
            ? { ...order, deliveryDate: order.deliveryDate }
            : order
        )
      );
      console.error(err);
      showAlert({
        title: 'Failed to update delivery date',
        icon: 'error'
      });
    } finally {
      setOrdeIdStatus('');
    }
  };

  const hasTransactionDate = data?.some((item) => item.transactionDate);
  const columns = [
    {
      title: 'Order Id',
      key: 'orderId'
    },
    {
      title: 'Name',
      key: 'firstName',
      render: (record: prodOrder) => `${record.firstName} ${record.lastName}`
    },
    {
      title: 'Email',
      key: 'email'
    },
    {
      title: 'Phone Number',
      key: 'phone'
    },
    {
      title: 'Country',
      key: 'country'
    },
    {
      title: 'Emirate',
      key: 'emirate'
    },
    ...(!isfreesample
      ? hasTransactionDate
        ? [
            {
              title: 'Transaction Date',
              key: 'transactionDate',
              render: (record: prodOrder) =>
                new Date(record.transactionDate).toLocaleString()
            },
            {
              title: 'Total Amount',
              key: 'totalPrice'
            },
            {
              title: 'Delivery Date',
              key: 'deliveryDate',
              render: (record: prodOrder) => (
                <input
                  type="date"
                  name="deliveryDate"
                  value={
                    record.deliveryDate ? record.deliveryDate.split('T')[0] : ''
                  }
                  onChange={(e) => handleDeliveryDateChange(e, record.orderId)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`${orderIdStatus === record.orderId ? 'cursor-not-allowed opacity-50' : ''}`}
                />
              )
            },
            {
              title: 'order Status',
              key: 'orderStatus',
              render: (record: prodOrder) => (
                <select
                  name="category"
                  value={record.orderStatus || ''}
                  onChange={(e) => handleCategoryChange(e, record.orderId)}
                  className={`dashboard_input min-w-32 ${
                    orderIdStatus === record.orderId ||
                    record.orderStatus === 'Cancel'
                      ? 'cursor-not-allowed opacity-50'
                      : ''
                  }`}
                  disabled={
                    orderIdStatus === record.orderId ||
                    record.orderStatus === 'Canceled'
                  }
                >
                  <option value="" disabled>
                    Select Status
                  </option>

                  {orderStatus.map((status, index) => {
                    let isDisabled = false;

                    if (
                      record.orderStatus === 'shipped' &&
                      status === 'placed'
                    ) {
                      isDisabled = true;
                    } else if (
                      record.orderStatus === 'delivered' &&
                      (status === 'placed' || status === 'shipped')
                    ) {
                      isDisabled = true;
                    } else if (record.orderStatus === 'canceled') {
                      isDisabled = true;
                    }

                    return (
                      <option
                        key={index}
                        value={status}
                        className="capitalize"
                        disabled={isDisabled}
                      >
                        {status}
                      </option>
                    );
                  })}
                </select>
              )
            }
          ]
        : [
            {
              title: 'Checkout Date',
              key: 'checkoutDate',
              render: (record: prodOrder) =>
                new Date(record.checkoutDate).toLocaleString()
            },
            {
              title: 'Total Amount',
              dataIndex: 'totalPrice',
              key: 'totalPrice',
              width: 100
            }
          ]
      : [
          {
            title: 'Create At',
            key: 'createdAt',
            render: (record: prodOrder) =>
              record?.checkoutDate
                ? new Date(record.checkoutDate)
                    .toLocaleString('en-US', { hour12: true })
                    .replace(/:\d{2}\s/, ' ')
                : null
          },
          {
            title: 'Delivery Date',
            key: 'deliveryDate',
            render: (record: prodOrder) => (
              <input
                type="date"
                name="deliveryDate"
                value={
                  record.deliveryDate ? record.deliveryDate.split('T')[0] : ''
                }
                onChange={(e) => handleDeliveryDateChange(e, record.orderId)}
                min={new Date().toISOString().split('T')[0]}
                className={`${orderIdStatus === record.orderId ? 'cursor-not-allowed opacity-50' : ''}`}
              />
            )
          },
          {
            title: 'order Status',
            key: 'orderStatus',
            render: (record: prodOrder) => (
              <select
                name="category"
                value={record.orderStatus || ''}
                onChange={(e) => handleCategoryChange(e, record.orderId)}
                className={`dashboard_input min-w-32 ${
                  orderIdStatus === record.orderId ||
                  record.orderStatus === 'Cancel'
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={
                  orderIdStatus === record.orderId ||
                  record.orderStatus === 'Cancel'
                }
              >
                <option value="" disabled>
                  Select Status
                </option>

                {orderStatus.map((status, index) => {
                  let isDisabled = false;

                  if (record.orderStatus === 'shipped' && status === 'placed') {
                    isDisabled = true;
                  } else if (
                    record.orderStatus === 'delivered' &&
                    (status === 'placed' || status === 'shipped')
                  ) {
                    isDisabled = true;
                  } else if (record.orderStatus === 'cancel') {
                    isDisabled = true;
                  }

                  return (
                    <option
                      key={index}
                      value={status}
                      className="capitalize"
                      disabled={isDisabled}
                    >
                      {status}
                    </option>
                  );
                })}
              </select>
            )
          }
        ]),
    {
      title: 'View',
      key: 'view',
      render: (record: prodOrder) => (
        <button onClick={() => showModal(record)} className="cursor-pointer">
          <BsEyeFill className="text-primary cursor-pointer transition duration-300 ease-in-out hover:scale-200" />
        </button>
      )
    }
  ].filter(Boolean);

  const handleExport = () => {
    // Flatten the data (convert nested product into single row or join important values)
    const filtered_orders = orders?.map((order) => {
      return {
        OrderID: order.orderId,
        Email: order.email,
        Name: `${order.firstName} ${order.lastName}`,
        Address: order.address,
        Phone: order.phone,
        City: order.city,
        Country: order.country,
        Emirate: order.emirate,
        checkoutDate: new Date(order.checkoutDate).toLocaleString(),
        transactionDate: new Date(order?.transactionDate).toLocaleString(),
        PaymentStatus: order.paymentStatus ? 'Paid' : 'Unpaid',
        orderStatus: order.orderStatus,
        TotalPrice: order.totalPrice,
        ProductNames: order.products.map((p) => p.name).join(', '),
        Productslength: order.products.map((p) => p.requiredBoxes).join(', '),
        squareMeter: order.products.map((p) => p.squareMeter).join(', '),
        ProductsIds: order.products.map((p) => p.id).join(', '),
        ProductsUrls: order.products
          .map((p) => {
            let urls = 'https://easyfloors.ae/';
            const category = p.category.trim().toLowerCase();
            if (category == 'accessories' || category === 'accessory') {
              urls += `accessories/${p.custom_url ?? ''}`;
            } else {
              urls += `${p.category}/${p.subcategories}/${p.custom_url ?? ''}`;
            }
            return urls;
          })
          .join(', '),
        SellingPrice: order.products.map((p) => p.price).join(', '),
        Delivery_Charges: order?.shipmentFee,
        shippingMethod: order?.shippingMethod?.name,
        is3DSecure: order.is3DSecure,
        Note: order.note,
        FreeSample: order?.isfreesample,
        PaymentMethodType: order?.pay_methodType,
        paymethod_sub_type: order?.paymethod_sub_type,
        cardLastDigits: order?.cardLastDigits,
        Currency: order?.currency
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(filtered_orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders-IF');
    XLSX.writeFile(workbook, 'Orders-EF.xlsx');
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={title} />
      <button
        className="flex items-center gap-2 dark:text-white mb-4"
        onClick={handleExport}
      >
        {' '}
        Export Orders <FiDownloadCloud className="text-primary" />
      </button>

      {data && data.length > 0 ? (
        <>
          <Table<prodOrder> data={data} columns={columns} rowKey="orderId" />
          <Modal isOpen={isModalOpen} onClose={handleCancel}>
            {data && (
              <div className="space-y-3 max-h-[80vh] overflow-y-auto">
                <p>
                  <strong>OrderId:</strong> {selectedOrder?.orderId}
                </p>
                <p>
                  <strong>Name:</strong> {selectedOrder?.firstName}{' '}
                  {selectedOrder?.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder?.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {selectedOrder?.phone}
                </p>
                <p>
                  <strong>Shipping Method:</strong>{' '}
                  {selectedOrder?.shippingMethod?.name}
                </p>
                <p>
                  <strong>Country:</strong> {selectedOrder?.country}
                </p>
                <p>
                  <strong>Emirate:</strong> {selectedOrder?.emirate}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder?.city}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder?.address}
                </p>
                <p>
                  <strong>Other Notes:</strong> {selectedOrder?.note}
                </p>
                <p>
                  <strong>Shippment Fee:</strong>{' '}
                  {selectedOrder?.shipmentFee === 0 ? (
                    'Free'
                  ) : (
                    <span className="font-currency text-18 font-normal">
                       {selectedOrder?.shipmentFee}
                    </span>
                  )}
                </p>
                <p>
                  <strong>Total Amount:</strong>{' '}
                  <span className="font-currency text-18 font-normal"></span>{' '}
                  {selectedOrder?.totalPrice}
                </p>
                <p>
                  <strong>Payment Status:</strong>{' '}
                  {selectedOrder?.totalPrice === 0 ? (
                    <span className="text-primary">Free</span>
                  ) : selectedOrder?.transactionDate ? (
                    <span className="text-green">Paid</span>
                  ) : (
                    <span className="text-red-500">UnPaid</span>
                  )}
                </p>
                {selectedOrder?.orderStatus && (
                  <p>
                    <strong>Order Status:</strong> {selectedOrder?.orderStatus}
                  </p>
                )}
                {selectedOrder?.deliveryDate && (
                  <p>
                    <strong>delivery Date:</strong>{' '}
                    {new Date(selectedOrder?.deliveryDate).toLocaleString(
                      'en-US',
                      { day: 'numeric', month: 'long', year: 'numeric' }
                    )}
                  </p>
                )}
                <p>
                  <strong>
                    {selectedOrder?.transactionDate
                      ? 'Transaction Date'
                      : 'Checkout Date'}
                    :
                  </strong>{' '}
                  {selectedOrder?.transactionDate
                    ? new Date(
                        selectedOrder?.transactionDate || ''
                      ).toLocaleString()
                    : new Date(
                        selectedOrder?.checkoutDate || ''
                      ).toLocaleString()}
                </p>
                {selectedOrder?.products.map((prod, index) => (
                  <div key={index} className="flex_between gap-2 pe-3">
                    <div className="flex gap-2">
                      <Image
                        src={`${prod.image}`}
                        alt={prod.name}
                        width={50}
                        height={50}
                        className='max-h-[70px]'
                      />
                      <div>
                        <h3 className="font-medium">{prod.name}</h3>
                        {selectedOrder.isfreesample ? (
                          <p className="font-medium">Sample piece</p>
                        ) : prod.category?.toLowerCase().trim() ===
                          'accessories' ? (
                          <>
                            <p className="font-medium">
                              Price per Piece:{' '}
                              <span className="font-normal">
                                {prod.pricePerBox.toFixed(2)}
                              </span>
                            </p>
                            <p className="font-medium">
                              No. of Pieces:{' '}
                              <span className="font-normal">
                                {prod.requiredBoxes}
                              </span>
                            </p>
                            {prod.selectedColor && (
                              <p className="font-medium">
                                Color:{' '}
                                <span className="font-normal">
                                  {prod.selectedColor.colorName} (
                                  {prod.selectedColor.color})
                                </span>
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-medium">
                              Price:{' '}
                              <span className="font-normal">
                                {prod.price.toFixed(2)}
                              </span>
                            </p>
                            <p className="font-medium">
                              {prod.isClearance ? 'Bundle' : 'Area'}{' '}
                              {Number(prod.squareMeter).toFixed(2)} SQM
                            </p>
                            {prod.addInstallation ? (
                              <p className="font-medium">
                                Installation Cost:{' '}
                                <span className="font-normal">
                                  {prod.installationCost?.toFixed(2)}
                                </span>
                              </p>
                            ) : (
                              <p className="font-medium">
                                Installation:{' '}
                                <span className="font-normal">
                                  Not Included
                                </span>
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <p className="font-medium">
                      {prod.totalPrice === 0
                        ? 'Free'
                        : formatAED(prod.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        </>
      ) : (
        <p className="text-primary dark:text-white">No Orders found</p>
      )}
    </DefaultLayout>
  );
};

export default Order;
