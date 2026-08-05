/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800" id="erp-app-layout">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Panel Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Dynamic Outlet Renderer */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
