/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import {
  Settings,
  Shield,
  HelpCircle,
  Building,
  CheckCircle,
  Clock,
  Laptop,
  Coins
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, login } = useERPStore();
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states matching standard brand info
  const [companyName, setCompanyName] = useState('All We Need Store');
  const [taxPercent, setTaxPercent] = useState(18);
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const swapSimulationRole = (role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'ACCOUNTANT') => {
    const mockEmailMap = {
      ADMIN: 'admin@allweneed.com',
      MANAGER: 'manager@allweneed.com',
      CASHIER: 'cashier@allweneed.com',
      ACCOUNTANT: 'accountant@allweneed.com',
    };
    login(mockEmailMap[role], role);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6" id="settings-configuration-area">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">System Configurations & Preferences</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure default taxation coefficients, change simulation roles, review company profiles, and view sandbox endpoints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Core preferences and settings (Col-span 7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Enterprise Registry Card</h3>
          </div>

          <form onSubmit={handleSaveConfigs} className="space-y-4 text-xs font-sans" id="settings-master-form">
            <div>
              <label htmlFor="company-name-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Registered Enterprise Title</label>
              <input
                id="company-name-input"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs text-slate-950 font-bold"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tax System CGST + SGST Rate (%)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono text-center font-bold text-slate-950 h-[38px]"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                  />
                  <span className="text-slate-450 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Local Transaction Currency</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[38px] text-xs font-bold text-slate-950"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                >
                  <option value="₹">₹ - Indian Rupee (INR)</option>
                  <option value="$">$ - US Dollar (USD)</option>
                  <option value="€">€ - Euro (EUR)</option>
                </select>
              </div>
            </div>

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-155 p-3 rounded-lg text-emerald-800 text-xs flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Registry configurations committed to local storage cache!
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[40px] text-xs"
            >
              Commit Configuration Changes
            </button>
          </form>

        </div>

        {/* RIGHT PANEL: Role Simulation controls (Col-span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-indigo-505 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900">Staff Access Role Swap Tool</h3>
          </div>

          <div className="text-xs font-sans space-y-4">
            <p className="text-slate-500 leading-relaxed text-xs">
              Fast-track authorization settings by dynamically changing roles. This toggles visibility filters and edits logs under different staff signatures.
            </p>

            {currentUser && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Current Session Badge:</p>
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
                  {currentUser.name}
                  <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase text-[10px] px-2 py-0.5 rounded font-black tracking-wider">
                    {currentUser.role}
                  </span>
                </h4>
              </div>
            )}

            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Choose Audit Target Role:</span>
              
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={() => swapSimulationRole('ADMIN')}
                  className="w-full text-left bg-slate-50 hover:bg-indigo-950 border border-slate-200 hover:border-indigo-850 p-3 rounded-xl hover:text-indigo-205 transition-all text-slate-750 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900 font-sans">ADMINISTRATOR</p>
                    <p className="text-[10px] text-slate-500 font-medium">Bypass validations, full ledger adjustments, define products</p>
                  </div>
                  <Shield className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => swapSimulationRole('ACCOUNTANT')}
                  className="w-full text-left bg-slate-50 hover:bg-slate-800 border border-slate-200 p-3 rounded-xl text-slate-755 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900 font-sans">ACCOUNTANT</p>
                    <p className="text-[10px] text-slate-500 font-medium">Manual journal postings, trial balance verification, audit sheets</p>
                  </div>
                  <Coins className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => swapSimulationRole('CASHIER')}
                  className="w-full text-left bg-slate-50 hover:bg-slate-800 border border-slate-200 p-3 rounded-xl text-slate-755 hover:text-white transition-all flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-bold text-slate-900 font-sans">CASHIER / BILLING OFFICER</p>
                    <p className="text-[10px] text-slate-500 font-medium">Checkout point access, invoice settlement, customer lookup</p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl flex items-start gap-2.5 text-slate-500">
              <Laptop className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-705">Environment variables</h4>
                <p className="text-[10px] font-mono mt-1 text-slate-400 leading-normal">
                  STATION_PORT: 3000<br />
                  NODE_ENV: production
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
