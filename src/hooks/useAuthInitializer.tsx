'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch } from 'components/Others/HelperRedux';
import { loggedInAdminAction } from '../redux/slices/Admin/AdminsSlice';

export const useAdminAuthInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const adminDataCookie = Cookies.get('admin_data');
    if (adminDataCookie) {
      try {
        const adminData = JSON.parse(adminDataCookie);
        dispatch(loggedInAdminAction(adminData));
      } catch (e) {
        console.error('Failed to parse admin_data cookie:', e);
      }
    } else {
      console.warn('No admin_data cookie found on refresh.');
    }
  }, [dispatch]);
};
