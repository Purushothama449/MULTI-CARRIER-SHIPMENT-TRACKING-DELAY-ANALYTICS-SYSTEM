import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShipTrack - Multi-Carrier Shipment Tracking System',
  description: 'Enterprise multi-carrier shipment tracking & delay analytics system built for DBMS Level-3 Project.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
