'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from 'components/Others/HelperRedux';
import { loggedInAdminAction } from '../redux/slices/Admin/AdminsSlice';
import { fetchCurrentAdmin } from 'config/fetch';

// DefaultLayout and the dashboard home both call this on mount; share the
// request while it is in flight instead of asking the backend twice.
let profileRequest: Promise<unknown> | null = null;

/**
 * Restores the signed-in admin after a refresh. The role and grants come from
 * the backend (resolved from the verified token), not from the admin_data
 * cookie: the browser writes that cookie, so anyone could edit it to claim a
 * super admin role or extra grants.
 */
export const useAdminAuthInit = () => {
  const dispatch = useAppDispatch();
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);

  useEffect(() => {
    if (loggedInUser) return;

    const token =
      Cookies.get('admin_access_token') ||
      Cookies.get('super_admin_access_token');
    if (!token) return;

    if (!profileRequest) {
      profileRequest = fetchCurrentAdmin(token).finally(() => {
        profileRequest = null;
      });
    }

    let cancelled = false;
    profileRequest.then((admin) => {
      // A rejected token is handled by the proxy and useSessionExpiry.
      if (!cancelled && admin) dispatch(loggedInAdminAction(admin));
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, loggedInUser]);
};
