'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from 'components/Others/HelperRedux';
import { loggedInAdminAction } from '../../../../redux/slices/Admin/AdminsSlice';
import USRcomponent from 'components/userComponent/userComponent';
import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN, super_admin_ADMIN_LOGIN } from 'graphql/mutations';
import Cookies from 'js-cookie';
import { showAlert } from 'utils/Alert';

const DashboardLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const intialvalue = {
    email: '',
    password: ''
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [formData, setFormData] = useState(intialvalue);

  const [loginError, setError] = useState<string | null | undefined>();
  const [adminType, setadminType] = useState<string | undefined>('Admin');

  const [adminLogin, { loading }] = useMutation(ADMIN_LOGIN);
  const [superadminLogin] = useMutation(super_admin_ADMIN_LOGIN);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      return setError('All fields are rquired');
    }
    try {
      const { email, password } = formData;

      const adminFlag = adminType == 'Admin';
      const Admin_type = adminFlag ? 'adminLogin' : 'superAdminLogin';

      const response = adminFlag
        ? await adminLogin({ variables: { email, password } })
        : await superadminLogin({ variables: { email, password } });
      dispatch(loggedInAdminAction(response.data[Admin_type]));
      Cookies.set(
        adminType == 'Admin'
          ? 'admin_access_token'
          : 'super_admin_access_token',
        response.data[Admin_type].token,
        {
          // js-cookie expires is in days; keep in sync with the backend's 24h JWT
          expires: 1
        }
      );
      Cookies.set(
        'admin_data',
        JSON.stringify({ ...response.data[Admin_type], role: adminType }),
        { expires: 1 }
      );
      setFormData(intialvalue);
      showAlert({
        title: 'You have sucessfully login',
        icon: 'success'
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    //eslint-disable-next-line
    } catch (err: any) {

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      throw err;
    }
  };

  const inputFields = [
    {
      type: 'email',
      name: 'email',
      id: 'email',
      placeholder: 'Email',
      value: formData.email,
      onChange: handleChange,
      iconClassName: 'text-red-500'
    },
    {
      type: 'password',
      name: 'password',
      id: 'password',
      placeholder: 'Enter Password',
      value: formData.password,
      onChange: handleChange,
      iconClassName: 'text-red-500'
    }
  ];

  return (
    <div>
      <USRcomponent
        handleSubmit={handleSubmit}
        error={loginError}
        loading={loading}
        inputFields={inputFields}
        title="Sign In as Admin"
        buttonTitle="Sign In"
        setadminType={setadminType}
        adminType={adminType}
      />
    </div>
  );
};

export default DashboardLogin;
