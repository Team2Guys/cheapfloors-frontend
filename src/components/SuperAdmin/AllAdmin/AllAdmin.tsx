import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from 'components/Loader/Loader';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AdminRecord } from 'types/type';
import Table from 'components/ui/table';
//eslint-disable-next-line
function Admins({ setselecteMenu, setEditAdmin, AllAdmins }: any) {

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [delLoading, setDelLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDelLoading(id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/delete-admin`,
        {
          headers: { adminId: id }
        }
      );
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDelLoading(null);
    }
  };

  useEffect(() => {
    setAdmins(AllAdmins);
  }, [AllAdmins]);

  const columns = [
    { title: 'Name', key: 'fullname' },
    { title: 'Email', key: 'email' },
    { title: 'Status', key: 'status' },
    {
      title: 'Can Add Product',
      key: 'canAddProduct',
      render: (record: AdminRecord) => (record.canAddProduct ? 'Yes' : 'No')
    },
    {
      title: 'Can Delete Product',
      key: 'canDeleteProduct',
      render: (record: AdminRecord) => (record.canDeleteProduct ? 'Yes' : 'No')
    },
    {
      title: 'Can Add Category',
      key: 'canAddCategory',
      render: (record: AdminRecord) => (record.canAddCategory ? 'Yes' : 'No')
    },
    {
      title: 'Can View Product',
      key: 'canDeleteCategory',
      render: (record: AdminRecord) => (record.canDeleteCategory ? 'Yes' : 'No')
    },
    {
      title: 'Can view Profit',
      key: 'canCheckProfit',
      render: (record: AdminRecord) => (record.canCheckProfit ? 'Yes' : 'No')
    },
    {
      title: 'Can View Total user',
      key: 'canViewUsers',
      render: (record: AdminRecord) => (record.canViewUsers ? 'Yes' : 'No')
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (record: AdminRecord) => (
        <FaEdit
          className="cursor-pointer text-slate-500"
          size={18}
          onClick={() => {
            setEditAdmin(record);
            setselecteMenu('');
          }}
        />
      )
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (record: AdminRecord) =>
        delLoading === record.id ? (
          <Loader />
        ) : (
          <RiDeleteBin6Line
            className="cursor-pointer text-red-500"
            size={18}
            onClick={() => handleDelete(record.id)}
          />
        )
    }
  ];

  return (
    <>
      <div className="flex_between mb-4">
        <p className="text-lg font-semibold dark:text-white">Admins</p>
        <button
          onClick={() => setselecteMenu('Add Admin')}
          className="bg-black text-white px-4 py-2 rounded-md dark:bg-primary"
        >
          Add new Admin
        </button>
      </div>

      <Table<AdminRecord> data={admins} columns={columns} rowKey="id" />
    </>
  );
}

export default Admins;
