'use client';

import React, { SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { LiaEdit } from 'react-icons/lia';
import Swal from 'sweetalert2';
import { Category } from 'types/cat';
import { useMutation } from '@apollo/client';
import { REMOVE_CATEGORY } from 'graphql/mutations';
import Table from 'components/ui/table';
import revalidateTag from 'components/ServerActons/ServerAction';
import { showAlert } from 'utils/Alert';

interface CategoryProps {
  setMenuType: React.Dispatch<SetStateAction<string>>;
  seteditCategory?: React.Dispatch<SetStateAction<Category | undefined | null>>;
  cetagories?: Category[];
}

const DashboardCat = ({
  setMenuType,
  seteditCategory,
  cetagories
}: CategoryProps) => {
  const [category, setCategory] = useState<Category[] | undefined>(cetagories);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [removeCategory] = useMutation(REMOVE_CATEGORY);

  useEffect(() => {
    setCategory(cetagories);
  }, [cetagories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories: Category[] =
    (category &&
      category
        .filter(
          (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cat.status &&
              cat.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (cat.description &&
              cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })) ||
    [];

  const canDeleteCategory = true;
  const canAddCategory = true;
  const canEditCategory = true;

  const confirmDelete = (key: string | number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, the Category cannot be recovered.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(key);
      }
    });
  };

  const handleDelete = async (key: number | string) => {
    try {
      await removeCategory({ variables: { id: Number(key) } });
      setCategory((prev) =>
        prev ? prev.filter((item) => item.id !== key) : []
      );
      revalidateTag('categories');
      showAlert({
        title: 'Category Deleted: The category has been successfully deleted.',
        icon: 'success'
      });
    } catch (err) {
      showAlert({
        title: 'Deletion Failed: There was an error deleting the category.',
        icon: 'error'
      });
      throw err;
    }
  };

  const handleEdit = (record: Category) => {
    if (seteditCategory) {
      seteditCategory(record);
      setMenuType('CategoryForm');
    }
  };

  const columns = [
    {
      title: 'Image',
      key: 'posterImageUrl',
      render: (record: Category) =>
        record.posterImageUrl ? (
          <Image
            src={record.posterImageUrl.imageUrl || ''}
            alt={`Image of ${record.name}`}
            loading="lazy"
            width={50}
            height={50}
          />
        ) : (
          <span>No Image</span>
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
      title: 'Created At',
      key: 'createdAt',
      render: (record: Category) => {
        const date = new Date(record.createdAt);
        return <span>{date.toISOString().split('T')[0]}</span>;
      }
    },
    {
      title: 'Updated At',
      key: 'updatedAt',
      render: (record: Category) => {
        const date = new Date(record.updatedAt);
        return <span>{date.toISOString().split('T')[0]}</span>;
      }
    },
    {
      title: 'Edited By',
      key: 'last_editedBy'
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (record: Category) => (
        <LiaEdit
          className={`cursor-pointer ${canEditCategory ? 'text-black dark:text-white' : 'cursor-not-allowed text-slate-200'}`}
          size={20}
          onClick={() => canEditCategory && handleEdit(record)}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Category) => (
        <RiDeleteBin6Line
          className={`cursor-pointer ${
            canDeleteCategory
              ? 'text-red-500 dark:text-red-700'
              : 'cursor-not-allowed text-slate-300'
          }`}
          size={20}
          onClick={() => canDeleteCategory && confirmDelete(record.id)}
        />
      )
    }
  ];

  return (
    <div>
      <div className="flex_between mb-4 text-dark dark:text-white">
        <input
          className="dashboard_input"
          style={{ width: 'max-content' }}
          type="search"
          placeholder="Search Category"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <p
            className={`${
              canAddCategory
                ? 'cursor-pointer bg-black text-white dark:bg-primary dark:border-0'
                : 'cursor-not-allowed bg-gray-400 text-white'
            } p-2 rounded-md flex justify-center`}
            onClick={() => {
              if (canAddCategory) {
                seteditCategory?.(undefined);
                setMenuType('Add Category');
              }
            }}
          >
            Add Category
          </p>
        </div>
      </div>

      {filteredCategories && filteredCategories.length > 0 ? (
        <Table<Category>
          data={filteredCategories}
          columns={columns}
          rowKey="id"
        />
      ) : (
        <p className="text-primary dark:text-white">No Categories found</p>
      )}
    </div>
  );
};

export default DashboardCat;
