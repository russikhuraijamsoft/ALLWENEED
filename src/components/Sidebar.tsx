/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Truck,
  Users,
  Calculator,
  DollarSign,
  BarChart3,
  Settings,
  Gem,
  Store
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const menuItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Inventory', path: '/inventory', icon: Layers },
    { name: 'Purchases', path: '/purchases', icon: ShoppingBag },
    { name: 'Suppliers', path: '/suppliers', icon: Truck },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'POS Billing', path: '/pos', icon: Calculator },
    { name: 'Accounting', path: '/accounting', icon: DollarSign },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-850 select-none shrink-0" id="erp-sidebar">
      {/* Brand Section */}
      <div className="h-16 px-6 flex items-center space-x-3 bg-slate-950/80 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/20">
          <Store className="w-5 h-5 text-indigo-100" />
        </div>
        <div>
          <h2 className="text-sm font-black text-white tracking-wider uppercase leading-tight font-sans">
            All We Need
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
            Store ERP System
          </p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <IconComp className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Meta Section */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 text-center">
        <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <Gem className="w-3.5 h-3.5 text-indigo-400" />
          <span>PRO EDITION</span>
        </div>
      </div>
    </aside>
  );
}
