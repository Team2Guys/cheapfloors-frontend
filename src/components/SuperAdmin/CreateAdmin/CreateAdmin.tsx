'use client';

import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import Loader from 'components/Loader/Loader';
import { useMutation } from '@apollo/client';
import { CREATE_ADMIN, UPDATE_ADMIN } from 'graphql/mutations';
import { BlogStatus } from 'types/general';
import Checkbox from 'components/ui/checkbox';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { showAlert } from 'utils/Alert';

type formDataTypes = {
  fullname: string;
  email: string;
  password: string;
  status: BlogStatus;
  canAddProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  canAddCategory: boolean;
  canDeleteCategory: boolean;
  canEditCategory: boolean;
  canCheckProfit: boolean;
  canCheckRevenue: boolean;
  canCheckVisitors: boolean;
  canViewUsers: boolean;
  canViewSales: boolean;
  canVeiwAdmins: boolean;
  canVeiwTotalproducts: boolean;
  canVeiwTotalCategories: boolean;
};

const initialValues: formDataTypes = {
  fullname: '',
  email: '',
  password: '',
  status: 'DRAFT',
  canAddProduct: false,
  canEditProduct: false,
  canDeleteProduct: false,
  canAddCategory: false,
  canDeleteCategory: false,
  canEditCategory: false,
  canCheckProfit: false,
  canCheckRevenue: false,
  canCheckVisitors: false,
  canViewUsers: false,
  canViewSales: false,
  canVeiwAdmins: false,
  canVeiwTotalproducts: false,
  canVeiwTotalCategories: false
};

const CreateAdmin = ({
  setselecteMenu,
  EditAdminValue,
  EditInitialValues,
  setEditProduct
  //eslint-disable-next-line
}: any) => {
  const isUpdate = !!EditAdminValue;
  const [formData, setFormData] = useState<formDataTypes>(
    isUpdate ? EditAdminValue : initialValues
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();
  const [showPassword, setShowPassword] = useState(false);
  const [createAdmin] = useMutation(CREATE_ADMIN);
  const [updateAdmin] = useMutation(UPDATE_ADMIN);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      if (!formData.fullname || !formData.email || !formData.password) {
        return showAlert({
          title: 'Name, email, and password are required',
          icon: 'warning'
        });
      }

      setLoading(true);
      const input = isUpdate
        ? { id: EditInitialValues.id, ...formData }
        : formData;
      const { data } = isUpdate
        ? await updateAdmin({ variables: { input } })
        : await createAdmin({ variables: { input } });

      console.log(data, 'Mutation Response'); //eslint-disable-line

      showAlert({
        title: `Admin ${isUpdate ? 'updated' : 'created'} successfully`,
        icon: 'success'
      });
      setTimeout(() => {
        setFormData(initialValues);
        setselecteMenu('AllAdmin');
        setEditProduct(undefined);
      }, 500);
      //eslint-disable-next-line
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      showAlert({
        title: err?.message || 'An error occurred',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllPermissions = () => {
    const allTrue = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === 'boolean' ? true : value
      ])
    );
    setFormData(allTrue as formDataTypes);
  };

  const handleClearAllPermissions = () => {
    const allFalse = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === 'boolean' ? false : value
      ])
    );
    setFormData(allFalse as formDataTypes);
  };

  const checkboxData = [
    { name: 'canAddProduct', label: 'Can Add Product' },
    { name: 'canEditProduct', label: 'Can Edit Product' },
    { name: 'canDeleteProduct', label: 'Can Delete Product' },
    { name: 'canAddCategory', label: 'Can Add Category' },
    { name: 'canDeleteCategory', label: 'Can Delete Category' },
    { name: 'canEditCategory', label: 'Can Edit Category' },
    { name: 'canCheckProfit', label: 'Can Check Profit' },
    { name: 'canCheckRevenue', label: 'Can Check Revenue' },
    { name: 'canCheckVisitors', label: 'Can Check Visitors' },
    { name: 'canViewUsers', label: 'Can View Users' },
    { name: 'canViewSales', label: 'Can View Sales' },
    { name: 'canVeiwAdmins', label: 'Can View Admins' },
    { name: 'canVeiwTotalCategories', label: 'Can View Categories' },
    { name: 'canVeiwTotalproducts', label: 'Can View Products' }
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto mt-1 mb-5 space-y-6 bg-white p-6 rounded-md shadow-xl"
    >
      <div className="flex_between">
        <p
          className="dashboard_primary_button"
          onClick={() => {
            setselecteMenu('AllAdmin');
            setEditProduct(undefined);
          }}
        >
          <IoMdArrowRoundBack /> Back
        </p>

        <div className="flex gap-6 items-center">
          <div className="flex gap-4 items-center">
            <label className="font-semibold">Admin Status:</label>
            {['DRAFT', 'PUBLISHED'].map((status) => {
              const isActive = formData.status === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: status as BlogStatus
                    }))
                  }
                  disabled={isActive}
                  className={`px-4 py-2 rounded-md text-sm border
                    ${isActive
                      ? 'bg-black text-white border-black cursor-not-allowed'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
          <button
            type="submit"
            className="dashboard_primary_button"
            disabled={loading}
          >
            {loading ? (
              <Loader color="#fff" />
            ) : isUpdate ? (
              'Update Admin'
            ) : (
              'Add Admin'
            )}
          </button>
        </div>
      </div>

      <div className="text-2xl font-semibold mb-4">Create New Admin</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            className="dashboard_input"
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            className="dashboard_input"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="md:col-span-2 relative">
          <label className="block mb-1 font-semibold">Password</label>
          <input
            className="dashboard_input pr-10"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2/4 text-gray-500"
          >
            {showPassword ? (
              <FaRegEye size={20} />
            ) : (
              <FaRegEyeSlash size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {checkboxData.map((checkbox) => (
          <Checkbox
            key={checkbox.name}
            name={checkbox.name}
            checked={
              formData[checkbox.name as keyof typeof formData] as boolean
            }
            onChange={handleCheckboxChange}
          >
            {checkbox.label}
          </Checkbox>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleClearAllPermissions}
          className="text-sm underline"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleAddAllPermissions}
          className="text-sm underline"
        >
          Mark All Permissions
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default CreateAdmin;
