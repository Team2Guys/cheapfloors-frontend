'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegEye } from 'react-icons/fa';
import { LiaEdit } from 'react-icons/lia';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { IAccessories, IProduct } from 'types/prod';
import { DASHBOARD_MAIN_PRODUCT_PROPS } from 'types/PagesProps';
import { useMutation } from '@apollo/client';
import { REMOVE_ACCESSORY, REMOVE_PRODUCT } from 'graphql/mutations';
import { FETCH_ALL_PRODUCTS } from 'graphql/queries';
import { FETCH_ALL_ACCESSORIES } from 'graphql/accessorie';
import Table from 'components/ui/table';
import { showAlert } from 'utils/Alert';

const ViewProduct: React.FC<DASHBOARD_MAIN_PRODUCT_PROPS> = ({
  products,
  setProducts,
  setselecteMenu,
  setEditProduct,
  accessoryFlag
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [removeProduct] = useMutation(REMOVE_PRODUCT);
  const [removeAccessory] = useMutation(REMOVE_ACCESSORY);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const canAddProduct = true;
  const canDeleteProduct = true;
  const canEditproduct = true;
  const filteredProducts: IProduct[] =
    products
      ?.filter((product: IProduct) => {
        const searchtext = searchTerm.trim().toLowerCase();

        return (
          product.name.toLowerCase().includes(searchtext) ||
          product?.status?.toLowerCase().includes(searchtext) ||
          product.description?.toLowerCase().includes(searchtext) ||
          product.price?.toString().includes(searchtext) ||
          product?.discountPrice?.toString().includes(searchtext) ||
          product?.ResidentialWarranty?.toString().includes(searchtext) ||
          product?.plankWidth?.toString().includes(searchtext) ||
          product?.stock?.toString().includes(searchtext) ||
          (product.category &&
            product?.category?.name.toLowerCase().includes(searchtext)) ||
          (product.subcategory &&
            product.subcategory.name.toLowerCase().includes(searchtext))
        );
      })
      .sort((a: IProduct, b: IProduct) => {
        const searchText = searchTerm.trim().toLowerCase();
        const aStartsWith = a.name.toLowerCase().startsWith(searchText)
          ? -1
          : 1;
        const bStartsWith = b.name.toLowerCase().startsWith(searchText)
          ? -1
          : 1;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        if (!searchText) {
          return dateB - dateA;
        }
        return aStartsWith - bStartsWith || dateB - dateA;
      }) || [];

  const confirmDelete = (key: string | number) => {
    const type = accessoryFlag ? 'Accessories' : 'product';
    Swal.fire({
      title: 'Are you sure?',
      text: `Once deleted, the ${type} cannot be recovered.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(key, type);
      }
    });
  };

  const handleDelete = async (
    key: string | number,
    type: 'product' | 'Accessories'
  ) => {
    try {
      if (type === 'product') {
        await removeProduct({
          variables: { id: +key },
          refetchQueries: [{ query: FETCH_ALL_PRODUCTS }]
        });
        setProducts(
          (prev: IProduct[]) => prev.filter((item) => item.id !== key) || []
        );
      } else {
        await removeAccessory({
          variables: { id: +key },
          refetchQueries: [{ query: FETCH_ALL_ACCESSORIES }]
        });
        setProducts(
          (prev: IAccessories[]) => prev.filter((item) => item.id !== key) || []
        );
      }

      showAlert({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted: The ${type} has been successfully deleted.`,
        icon: 'success'
      });
    } catch (err) {
      showAlert({
        title: `Deletion Failed: There was an error deleting the ${type}.`,
        icon: 'error'
      });
      throw err;
    }
  };

  const columns = [
    {
      title: 'Image',
      key: 'posterImageUrl',
      render: (record: IProduct) => (
        <Image
          src={record.posterImageUrl.imageUrl || ''}
          alt={`Image of ${record?.name}`}
          width={200}
          loading="lazy"
          className="sm:w-[36px] sm:h-[36px] rounded-md object-contain"
          height={200}
        />
      )
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Status',
      key: 'status'
    },
    {
      title: `${!accessoryFlag ? 'Stock (Boxes)' : 'Stock (Pieces)'}`,
      key: 'stock',
      render: (record: IProduct) => {
        return <p>{record.stock}</p>;
      }
    },
    ...(!accessoryFlag ? [{
      title: 'Stock (SQM)',
      key: 'stock',
      render: (record: IProduct) => {
        return (
          <p> {Number(((record?.stock || 0) * Number(record.boxCoverage || 0)).toFixed(2))}</p>
        );
      }
    }] : []),
    {
      title: 'SKU',
      key: 'Sku',
      render: (record: IProduct) => {
        return <p>{record.sku}</p>;
      }
    },

    {
      title: 'Stock Updated Date',
      key: 'stockUpdateDate',
      render: (record: IProduct) =>
        record?.stockUpdateDate
          ? new Date(record.stockUpdateDate)
              .toLocaleString('en-US', { hour12: true })
              .replace(/:\d{2}\s/, ' ')
          : null
    },

    {
      title: 'Updated At',
      key: 'updatedAt',
      render: (record: IProduct) =>
        record?.updatedAt
          ? new Date(record.updatedAt)
              .toLocaleString('en-US', { hour12: true })
              .replace(/:\d{2}\s/, ' ')
          : null
    },

    {
      title: 'Edited By',
      key: 'last_editedBy',
      ellipsis: true
    },
    {
      title: 'Preview',
      key: 'Preview',
      render: (record: IProduct) => {
        let urls;
        if (record.subcategory?.custom_url) {
          urls = `/${record.category?.RecallUrl + '/' + record.subcategory?.custom_url + '/' + record.custom_url}`;
        } else {
          urls = `/${record.category?.RecallUrl + '/' + record.custom_url}`;
        }

        return (
          <Link className="hover:text-black" target="_blank" href={urls}>
            <FaRegEye />
          </Link>
        );
      }
    },
    {
      title: 'Edit',
      key: 'Edit',
      render: (record: IProduct) => (
        <LiaEdit
          className={`${canEditproduct ? 'cursor-pointer' : ''} ${
            !canEditproduct ? 'cursor-not-allowed text-slate-200' : ''
          }`}
          size={20}
          onClick={() => {
            if (canEditproduct) {
              setEditProduct(record);
              setselecteMenu('Add Products');
            }
          }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: IProduct) => (
        <RiDeleteBin6Line
          className={`${canDeleteProduct ? 'text-red-600 cursor-pointer' : ''} ${
            !canDeleteProduct ? 'cursor-not-allowed text-slate-200' : ''
          }`}
          size={20}
          onClick={() => {
            confirmDelete(record.id);
          }}
        />
      )
    }
  ].filter(Boolean);

  return (
    <div>
      <div className="flex_between gap-2 mb-4 flex-nowrap text-black dark:text-white">
        <input
          className="dashboard_input"
          style={{ width: 'max-content' }}
          type="search"
          placeholder="Search Product"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <p
            className={`${
              canAddProduct &&
              'cursor-pointer rounded-md text-nowrap text-12 xs:text-base'
            } py-2 px-4 ${
              canAddProduct && 'bg-black text-white rounded-md border'
            } flex justify-center dark:bg-primary dark:border-0 ${
              !canAddProduct &&
              'cursor-not-allowed bg-gray-500 text-white rounded-md'
            }`}
            onClick={() => {
              if (canAddProduct) {
                setselecteMenu('Add Products');
                setEditProduct(undefined);
              }
            }}
          >
            {`Add ${accessoryFlag ? 'Accessory' : 'Products'}`}
          </p>
        </div>
      </div>
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <Table<IProduct>
            data={filteredProducts}
            columns={columns}
            rowKey="id"
          />
        </div>
      ) : (
        <p className="text-primary dark:text-white">No products found</p>
      )}
    </div>
  );
};

export default ViewProduct;
