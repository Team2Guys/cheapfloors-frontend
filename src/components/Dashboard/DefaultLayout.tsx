'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from 'components/Dashboard/Sidebar';
import Header from 'components/Dashboard/Header';
import { useSessionExpiry } from 'hooks/useSessionExpiry';
import { useAdminAuthInit } from 'hooks/useAuthInitializer';
import { useAppSelector } from 'components/Others/HelperRedux';
import { getRequiredPermission } from 'data/adminPermissions';
import { useDashTheme } from 'components/Dashboard/theme/dashTheme';

export default function DefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useDashTheme();
  useAdminAuthInit();
  useSessionExpiry();

  const pathname = usePathname();
  const { loggedInUser } = useAppSelector((state) => state.usersSlice);

  // Regular admins may only open the pages they were granted; super admins
  // (any other role) see everything. Nothing is blocked until the session has
  // loaded, so the page doesn't flash a denial while restoring the login.
  const requiredPermission = getRequiredPermission(pathname);
  const accessDenied =
    !!loggedInUser &&
    loggedInUser.role === 'Admin' &&
    !!requiredPermission &&
    !loggedInUser[requiredPermission];

  return (
    // .dash-root scopes the dashboard palette (globals.css); the theme picker
    // in the header sets data-dash-theme.
    <div
      className="dash-root relative flex h-screen overflow-hidden bg-dash-canvas text-dash-ink"
      data-dash-theme={theme}
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {accessDenied ? (
              <div className="mx-auto mt-10 max-w-xl rounded-xl border border-dash-line bg-dash-surface p-8 text-center">
                <h1 className="mb-2 text-2xl font-semibold">Access denied</h1>
                <p className="mb-6 text-dash-muted">
                  Your admin account doesn&apos;t have permission to view this
                  page. Ask a super admin to grant it.
                </p>
                <Link
                  href="/dashboard"
                  className="dashboard_primary_button inline-flex"
                >
                  Back to dashboard
                </Link>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
