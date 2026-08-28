'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from 'components/Others/HelperRedux';
import { loggedInAdminAction } from '../redux/slices/Admin/AdminsSlice';

// setTimeout above this overflows to an immediate fire
const MAX_TIMEOUT = 2147483647;

const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

// Logs the admin out the moment the JWT expires, even if they are sitting
// idle on a dashboard page (the proxy only re-checks on navigation).
export const useSessionExpiry = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const logout = () => {
      Cookies.remove('admin_access_token');
      Cookies.remove('super_admin_access_token');
      Cookies.remove('admin_data');
      dispatch(loggedInAdminAction(undefined));
      router.replace('/dashboard/Admin-login');
    };

    const token =
      Cookies.get('admin_access_token') ||
      Cookies.get('super_admin_access_token');
    if (!token) {
      logout();
      return;
    }

    const expiry = getTokenExpiry(token);
    if (!expiry) return; // undecodable token — leave it to the proxy check
    if (expiry <= Date.now()) {
      logout();
      return;
    }

    const timer = setTimeout(logout, Math.min(expiry - Date.now(), MAX_TIMEOUT));
    return () => clearTimeout(timer);
  }, [router, dispatch]);
};
