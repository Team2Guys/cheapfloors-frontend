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

/** An abandoned-checkout row also says how many attempts it stands for. */
type OrderRow = prodOrder & { attempts?: number; attemptOrderIds?: string[] };

const Order = ({
  title,
  ordersData,
  isfreesample,
  description,
  noun = 'orders'
}: {
  title: string;
  ordersData: OrderRow[];
  isfreesample?: boolean;
  description?: string;
  noun?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderIdStatus, setOrdeIdStatus] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [data, setData] = useState<OrderRow[]>(ordersData);
  const [postOrderStatus] = useMutation(ORDER_STATUS_UPDATE);
  const [updateOrderDeliveryDate] = useMutation(UPDATE_ORDER_DELIVERY_DATE);
  const showModal = (record: OrderRow) => {
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
      key: 'orderId',
      render: (record: OrderRow) => (
        <div>
          <p className="font-mono text-[13px]">{record.orderId}</p>
          {(record.attempts ?? 1) > 1 && (
            <span className="mt-1 inline-flex rounded-full bg-dash-accent-soft px-2 py-0.5 text-xs font-medium text-dash-accent-text">
              {record.attempts} attempts
            </span>
          )}
        </div>
      )
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
                  record.orderStatus === 'canceled'
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={
                  orderIdStatus === record.orderId ||
                  record.orderStatus === 'canceled'
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
    // Exports the rows on this page (not every order), one line per order with
    // its products joined.
    const filtered_orders = data.map((order) => {
      return {
        OrderID: order.orderId,
        ...(order.attempts
          ? {
              CheckoutAttempts: order.attempts,
              AttemptOrderIDs: (order.attemptOrderIds ?? []).join(', ')
            }
          : {}),
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
            let urls = 'https://cheapfloors.ae/';
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `${title.split(' ').join('-')}-CF.xlsx`);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName={title} description={description} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-dash-muted">
          <span className="font-semibold text-dash-ink">
            {data.length.toLocaleString('en-AE')}
          </span>{' '}
          {noun}
        </p>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-dash-line bg-dash-surface px-3 py-2 text-sm font-medium text-dash-ink transition-colors hover:bg-dash-sunken disabled:opacity-50"
          onClick={handleExport}
          disabled={data.length === 0}
        >
          <FiDownloadCloud className="text-dash-accent-text" /> Export to Excel
        </button>
      </div>

      {data && data.length > 0 ? (
        <>
          <Table<OrderRow> data={data} columns={columns} rowKey="orderId" />
          <Modal
            isOpen={isModalOpen}
            onClose={handleCancel}
            width="w-full max-w-xl rounded-2xl"
          >
            {selectedOrder && (
              <div className="space-y-4">
                {/* Header: order id, payment + status chips, dates */}
                <div className="pr-8">
                  <p className="text-11 font-semibold uppercase tracking-[0.14em] text-dash-muted">
                    {selectedOrder.isfreesample ? 'Free sample order' : 'Order'}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h2 className="font-mono text-20 font-bold leading-tight text-dash-ink">
                      {selectedOrder.orderId}
                    </h2>
                    {selectedOrder.totalPrice === 0 ? (
                      <span className="rounded-full bg-dash-accent-soft px-2.5 py-0.5 text-12 font-semibold text-dash-accent-text">
                        Free
                      </span>
                    ) : selectedOrder.transactionDate ? (
                      <span className="rounded-full bg-dash-positive-soft px-2.5 py-0.5 text-12 font-semibold text-dash-positive">
                        Paid
                      </span>
                    ) : (
                      <span className="rounded-full bg-dash-negative-soft px-2.5 py-0.5 text-12 font-semibold text-dash-negative">
                        Unpaid
                      </span>
                    )}
                    {selectedOrder.orderStatus && (
                      <span className="rounded-full border border-dash-line bg-dash-sunken px-2.5 py-0.5 text-12 font-medium capitalize text-dash-ink">
                        {selectedOrder.orderStatus}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-13 text-dash-muted">
                    {selectedOrder.transactionDate
                      ? `Paid on ${new Date(selectedOrder.transactionDate).toLocaleString()}`
                      : `Checkout on ${new Date(selectedOrder.checkoutDate || '').toLocaleString()}`}
                    {selectedOrder.deliveryDate && (
                      <>
                        {' '}
                        &middot; Delivery{' '}
                        {new Date(selectedOrder.deliveryDate).toLocaleString(
                          'en-US',
                          { day: 'numeric', month: 'long', year: 'numeric' }
                        )}
                      </>
                    )}
                  </p>
                  {(selectedOrder.attempts ?? 1) > 1 && (
                    <p className="mt-2 rounded-lg bg-dash-accent-soft px-3 py-2 text-12 leading-relaxed text-dash-accent-text">
                      {selectedOrder.attempts} checkout attempts — this is the
                      latest; earlier:{' '}
                      {selectedOrder.attemptOrderIds?.slice(1).join(', ')}
                    </p>
                  )}
                </div>

                {/* Customer + delivery */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <section className="rounded-xl border border-dash-line bg-dash-surface p-4">
                    <h3 className="mb-2 text-11 font-semibold uppercase tracking-[0.14em] text-dash-muted">
                      Customer
                    </h3>
                    <p className="text-sm font-semibold text-dash-ink">
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </p>
                    <a
                      href={`mailto:${selectedOrder.email}`}
                      className="mt-1 block break-all text-13 text-dash-accent-text hover:underline"
                    >
                      {selectedOrder.email}
                    </a>
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      className="mt-0.5 block text-13 text-dash-ink"
                    >
                      {selectedOrder.phone}
                    </a>
                  </section>
                  <section className="rounded-xl border border-dash-line bg-dash-surface p-4">
                    <h3 className="mb-2 text-11 font-semibold uppercase tracking-[0.14em] text-dash-muted">
                      Delivery
                    </h3>
                    <p className="text-sm font-semibold text-dash-ink">
                      {selectedOrder.shippingMethod?.name || '—'}
                    </p>
                    <p className="mt-1 text-13 leading-relaxed text-dash-muted">
                      {[
                        selectedOrder.address,
                        selectedOrder.city,
                        selectedOrder.emirate,
                        selectedOrder.country
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </section>
                </div>

                {selectedOrder.note && (
                  <section className="rounded-xl border border-dash-line bg-dash-sunken p-4">
                    <h3 className="mb-1 text-11 font-semibold uppercase tracking-[0.14em] text-dash-muted">
                      Notes
                    </h3>
                    <p className="text-13 leading-relaxed text-dash-ink">
                      {selectedOrder.note}
                    </p>
                  </section>
                )}

                {/* Items + totals */}
                <section className="overflow-hidden rounded-xl border border-dash-line">
                  <h3 className="border-b border-dash-line bg-dash-sunken px-4 py-2.5 text-11 font-semibold uppercase tracking-[0.14em] text-dash-muted">
                    Items ({selectedOrder.products.length})
                  </h3>
                  <ul className="divide-y divide-dash-line bg-dash-surface">
                    {selectedOrder.products.map((prod, index) => (
                      <li key={index} className="flex items-start gap-3 px-4 py-3">
                        <Image
                          src={`${prod.image}`}
                          alt={prod.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-lg border border-dash-line object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold leading-snug text-dash-ink">
                            {prod.name}
                          </h4>
                          {selectedOrder.isfreesample ? (
                            <p className="mt-0.5 text-12 text-dash-muted">
                              Sample piece
                            </p>
                          ) : prod.category?.toLowerCase().trim() ===
                            'accessories' ? (
                            <>
                              <p className="mt-0.5 text-12 text-dash-muted">
                                <span className="font-currency font-normal">
                                  
                                </span>{' '}
                                {prod.pricePerBox?.toFixed(2)} per piece &middot;{' '}
                                {prod.requiredBoxes}{' '}
                                {prod.requiredBoxes === 1 ? 'piece' : 'pieces'}
                              </p>
                              {prod.selectedColor && (
                                <p className="text-12 text-dash-muted">
                                  Color: {prod.selectedColor.colorName} (
                                  {prod.selectedColor.color})
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="mt-0.5 text-12 text-dash-muted">
                                <span className="font-currency font-normal">
                                  
                                </span>{' '}
                                {prod.price.toFixed(2)} &middot;{' '}
                                {prod.isClearance ? 'Bundle' : 'Area'}{' '}
                                {Number(prod.squareMeter).toFixed(2)} SQM
                              </p>
                              <p className="text-12 text-dash-muted">
                                {prod.addInstallation ? (
                                  <>
                                    Installation:{' '}
                                    <span className="font-currency font-normal">
                                      
                                    </span>{' '}
                                    {prod.installationCost?.toFixed(2)}
                                  </>
                                ) : (
                                  'Installation not included'
                                )}
                              </p>
                            </>
                          )}
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-dash-ink">
                          {prod.totalPrice === 0 ? (
                            'Free'
                          ) : (
                            <>
                              <span className="font-currency font-normal">
                                
                              </span>{' '}
                              {formatAED(prod.totalPrice)}
                            </>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-1.5 border-t border-dash-line bg-dash-sunken px-4 py-3">
                    <div className="flex items-center justify-between text-13 text-dash-muted">
                      <span>Shipment fee</span>
                      <span>
                        {selectedOrder.shipmentFee === 0 ? (
                          'Free'
                        ) : (
                          <>
                            <span className="font-currency font-normal"></span>{' '}
                            {formatAED(selectedOrder.shipmentFee)}
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-15 font-bold text-dash-ink">
                      <span>Total</span>
                      <span>
                        {selectedOrder.totalPrice === 0 ? (
                          'Free'
                        ) : (
                          <>
                            <span className="font-currency font-normal"></span>{' '}
                            {formatAED(selectedOrder.totalPrice)}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </Modal>
        </>
      ) : (
        <p className="rounded-xl border border-dash-line bg-dash-surface px-4 py-10 text-center text-dash-muted">
          No orders found
        </p>
      )}
    </DefaultLayout>
  );
};

export default Order;
