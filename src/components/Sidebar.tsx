'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  MapPin,
  Building,
  Store,
  BarChart3,
  FileText,
  Users,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Shipments', href: '/shipments', icon: Truck },
    { label: 'Tracking', href: '/tracking', icon: MapPin },
    { label: 'Carriers', href: '/carriers', icon: Building },
    { label: 'Warehouses', href: '/warehouses', icon: Store },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Users', href: '/users', icon: Users },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0B132B] text-slate-300 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                ShipTrack
              </h1>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                Multi-Carrier Shipment Tracking System
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Banner Card */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-900 to-blue-950/80 border border-slate-800/80 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-white">Delivering Smarter Logistics</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Faster • Safer • Smarter</p>
          </div>
        </div>
      </aside>
    </>
  );
}
