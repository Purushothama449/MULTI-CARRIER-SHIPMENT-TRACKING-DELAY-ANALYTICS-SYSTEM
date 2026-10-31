'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't render sidebar/header on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
