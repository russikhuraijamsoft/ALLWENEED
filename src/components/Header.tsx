/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useERPStore } from '../store/erpStore';
import { LogOut, Bell, Shield, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser, logout, inventory, products } = useERPStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute products below warning threshold
  const lowStockAlerts = inventory.filter((item) => item.quantity <= item.minStockAlert).map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    return {
      id: item.id,
      name: prod?.name || 'Unknown item',
      qty: item.quantity,
      min: item.minStockAlert,
    };
  });

  const [showAlerts, setShowAlerts] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30" id="erp-header">
      {/* Search Bar / System Motto */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-bold text-slate-800 tracking-wide font-sans hidden sm:inline-block">
          All We Need Store ERP
        </span>
        <span className="text-slate-300 hidden sm:inline-block">|</span>
        <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
          STABLE_BUILD_V1.5
        </span>
      </div>

      {/* Right Tools Area */}
      <div className="flex items-center space-x-4">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{time.toISOString().split('T')[0]}</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">{time.toLocaleTimeString()}</span>
        </div>

        {/* Low Stock Alerts Bell */}
        <div className="relative">
          <button
            id="notif-bell-btn"
            onClick={() => setShowAlerts(!showAlerts)}
            className={`p-2 rounded-lg transition-colors duration-200 cursor-pointer relative ${
              lowStockAlerts.length > 0
                ? 'bg-red-50 hover:bg-red-100/80 text-red-600'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            {lowStockAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            )}
          </button>

          {/* Trigger Alert Card */}
          {showAlerts && (
            <div
              id="notif-dropdown-div"
              className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Active Stock Alerts ({lowStockAlerts.length})
                </h4>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="text-[10px] text-slate-400 hover:text-slate-600 font-sans cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {lowStockAlerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">All stock levels are optimal.</p>
                ) : (
                  lowStockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-red-50/50 border border-red-100/50">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-semibold text-red-950">{alert.name}</p>
                        <p className="text-red-700 mt-0.5">
                          In Stock: <strong className="font-bold">{alert.qty}</strong> (Min Alert Level: {alert.min})
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <span className="h-6 w-px bg-slate-200"></span>

        {/* User Info & Profile */}
        {currentUser && (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</p>
              <div className="flex items-center justify-end space-x-1 mt-0.5">
                <Shield className="w-3 h-3 text-indigo-500" />
                <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 rounded px-1.5 py-0.2">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Profile Avatar Avatar circle */}
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm select-none">
              {currentUser.name.charAt(0)}
            </div>

            {/* Logout button */}
            <button
              id="logout-header-btn"
              onClick={handleLogout}
              title="Logout Account"
              className="p-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-500 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
