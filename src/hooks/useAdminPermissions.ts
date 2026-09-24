'use client';
import { useAppSelector } from 'components/Others/HelperRedux';
import { AdminPermission } from 'data/adminPermissions';

// Permission checks for dashboard UI. Super admins (any role other than
// 'Admin') can do everything; regular admins only what they were granted.
// Until the session has loaded, everything reads as not allowed.
export const useAdminPermissions = () => {
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);
  const isSuperAdmin = !!loggedInUser && loggedInUser.role !== 'Admin';
  const can = (permission: AdminPermission): boolean =>
    isSuperAdmin || Boolean(loggedInUser?.[permission]);

  return { can, isSuperAdmin, loggedInUser };
};
