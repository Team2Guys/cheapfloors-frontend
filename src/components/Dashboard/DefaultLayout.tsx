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

export default function DefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen overflow-hidden relative bg-white dark:bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-primary opacity-30 rounded-full blur-3xl top-1/3 left-[10%] mix-blend-overlay" />
        <div className="absolute w-[500px] h-[500px] bg-primary opacity-20 rounded-full blur-2xl -top-20 right-[5%] mix-blend-overlay" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-2xl bottom-0 right-0 mix-blend-overlay" />
      </div>

      {/* Sidebar and Content */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="border-white border">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {accessDenied ? (
              <div className="bg-white rounded-md shadow-xl p-8 text-center max-w-xl mx-auto mt-10">
                <h1 className="text-2xl font-semibold mb-2">Access denied</h1>
                <p className="text-gray-600 mb-6">
                  Your admin account doesn&apos;t have permission to view this
                  page. Ask a super admin to grant it.
                </p>
                <Link href="/dashboard" className="dashboard_primary_button">
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
