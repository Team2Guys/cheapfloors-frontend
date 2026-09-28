'use client';
import { useAppSelector } from 'components/Others/HelperRedux';
import {
  AdminPermission,
  hasAdminPermission,
  isSuperAdmin as isSuperAdminProfile
} from 'data/adminPermissions';

// Permission checks for dashboard UI. The super admin can do everything;
// regular admins only what they were granted. Until the session has loaded,
// everything reads as not allowed.
export const useAdminPermissions = () => {
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);
  const isSuperAdmin = isSuperAdminProfile(loggedInUser);
  const can = (permission: AdminPermission): boolean =>
    hasAdminPermission(loggedInUser, permission);

  return { can, isSuperAdmin, loggedInUser };
};
