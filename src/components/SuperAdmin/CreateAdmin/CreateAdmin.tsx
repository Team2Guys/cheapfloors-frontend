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
import {
  ADMIN_PERMISSION_GROUPS,
  ADMIN_PERMISSIONS,
  AdminPermission
} from 'data/adminPermissions';

type formDataTypes = {
  id?: number;
  fullname: string;
  email: string;
  password: string;
  status: BlogStatus;
} & Record<AdminPermission, boolean>;

const noPermissions = Object.fromEntries(
  ADMIN_PERMISSIONS.map((permission) => [permission, false])
) as Record<AdminPermission, boolean>;

const initialValues: formDataTypes = {
  fullname: '',
  email: '',
  password: '',
  status: 'DRAFT',
  ...noPermissions
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
    isUpdate ? { ...noPermissions, ...EditAdminValue } : initialValues
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

      const adminId = EditAdminValue?.id ?? EditInitialValues?.id;
      if (isUpdate && !adminId) {
        return showAlert({
          title: 'Could not find the admin to update. Go back and open it again.',
          icon: 'error'
        });
      }

      setLoading(true);
      // Send only the mutation's fields (not e.g. __typename or role that
      // may ride along on an admin record loaded from the API).
      const fields = {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        status: formData.status,
        ...Object.fromEntries(
          ADMIN_PERMISSIONS.map((permission) => [
            permission,
            Boolean(formData[permission])
          ])
        )
      };
      const input = isUpdate ? { id: adminId, ...fields } : fields;
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

      <div className="text-2xl font-semibold mb-4">
        {isUpdate ? 'Edit Admin' : 'Create New Admin'}
      </div>

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

      {/* Permissions, grouped by the dashboard area they unlock */}
      <div className="space-y-6 mt-4">
        {ADMIN_PERMISSION_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="font-semibold text-sm uppercase text-gray-600 mb-3">
              {group.title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {group.options.map((option) => (
                <Checkbox
                  key={option.name}
                  name={option.name}
                  checked={Boolean(formData[option.name])}
                  onChange={handleCheckboxChange}
                >
                  {option.label}
                </Checkbox>
              ))}
            </div>
          </div>
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
