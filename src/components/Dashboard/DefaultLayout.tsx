'use client';
import React, { useState } from 'react';
import Sidebar from 'components/Dashboard/Sidebar';
import Header from 'components/Dashboard/Header';
import { useSessionExpiry } from 'hooks/useSessionExpiry';
import { useAdminAuthInit } from 'hooks/useAuthInitializer';

export default function DefaultLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAdminAuthInit();
  useSessionExpiry();

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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
