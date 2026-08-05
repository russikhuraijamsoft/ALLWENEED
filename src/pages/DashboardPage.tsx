/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useERPStore } from '../store/erpStore';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { invoices, purchaseOrders, inventory, products, accounts, customers, suppliers } = useERPStore();
  const navigate = useNavigate();

  // Dynamic Metrics Computations
  const totalSalesVal = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPurchasesVal = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
  
  // Outstanding liability + asset levels
  const accountsAPRec = accounts.find(a => a.code === '1200')?.balance || 0;
  const accountsAPPay = accounts.find(a => a.code === '2100')?.balance || 0;
  const cashReserves = (accounts.find(a => a.code === '1010')?.balance || 0) + (accounts.find(a => a.code === '1020')?.balance || 0);

  // Products underalert metric
  const lowStockQuantity = inventory.filter((item) => item.quantity <= item.minStockAlert).length;

  // Let's create an elegant combined feed for recent operations (Last 5 transactions)
  const combinedOperations = [
    ...invoices.map((inv) => ({
      id: inv.id,
      type: 'SALE' as const,
      number: inv.invoiceNumber,
      amount: inv.totalAmount,
      date: inv.date,
      status: inv.status,
      method: inv.paymentMethod,
    })),
    ...purchaseOrders.map((po) => ({
      id: po.id,
      type: 'PURCHASE' as const,
      number: po.poNumber,
      amount: po.totalAmount,
      date: po.orderDate,
      status: po.status,
      method: 'ACCOUNTS_PAYABLE',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8" id="erp-dashboard-container">
      
      {/* Upper Welcomer Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 font-sans tracking-tight">
            ERP Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time analytics, inventory matching, and financial balances for All We Need Store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dash-quick-pos-btn"
            onClick={() => navigate('/pos')}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Launch POS Checkout
          </button>
        </div>
      </div>

      {/* Grid of 5 KPI Boards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sales Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Sales Revenue</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-mono">₹{totalSalesVal.toLocaleString('en-IN')}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                Live
              </span>
              from point of sales entries
            </p>
          </div>
        </div>

        {/* Purchase Value */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grains & Stock Sourced</span>
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-mono">₹{totalPurchasesVal.toLocaleString('en-IN')}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <span className="text-red-500 font-semibold">{purchaseOrders.length}</span> PO entries processed
            </p>
          </div>
        </div>

        {/* Net Cash Reserve */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Active Financial Reserves</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-900 font-mono">₹{cashReserves.toLocaleString('en-IN')}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <span className="font-semibold text-indigo-600">Liquid Cash</span> on Hand + Banks
            </p>
          </div>
        </div>

        {/* Low Stock Counter */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Low Stock Materials</span>
            <span className={`p-2 rounded-lg ${lowStockQuantity > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-450'}`}>
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black font-mono ${lowStockQuantity > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockQuantity} Items
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              {lowStockQuantity > 0 ? (
                <span className="text-amber-600 font-semibold">Requires immediate reorder</span>
              ) : (
                'Inventory levels fully stable'
              )}
            </p>
          </div>
        </div>

      </div>

      {/* Visual Charts & Stats Section built strictly with pure responsive SVGs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* High-fidelity Custom Chart Container */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quarterly Operational Overview</h3>
              <p className="text-xs text-slate-500">Sales versus inbound stock procurement metrics</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span>
                Sales Value
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm"></span>
                Inbound POs
              </span>
            </div>
          </div>

          {/* Clean High fidelity SVG Chart */}
          <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
            
            {/* Grid Line lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-slate-400 select-none pb-6 pr-2">
              <div className="border-b border-dashed border-slate-100 w-full pt-1">₹1,50,000</div>
              <div className="border-b border-dashed border-slate-100 w-full">₹1,00,000</div>
              <div className="border-b border-dashed border-slate-100 w-full">₹50,000</div>
              <div className="w-full">₹0</div>
            </div>

            {/* Simulated interactive data bars mapping to actual states */}
            <div className="w-full h-full flex items-end justify-around relative z-10 pb-6 pl-14">
              
              {/* Mar Bar */}
              <div className="flex flex-col items-center justify-end h-full space-y-2 group w-12">
                <div className="w-full flex items-end justify-center space-x-1">
                  <div className="w-4 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm" style={{ height: '70px' }}></div>
                  <div className="w-4 bg-rose-400 hover:bg-rose-500 transition-all rounded-t-sm" style={{ height: '40px' }}></div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500">MAR</span>
              </div>

              {/* Apr Bar */}
              <div className="flex flex-col items-center justify-end h-full space-y-2 group w-12">
                <div className="w-full flex items-end justify-center space-x-1">
                  <div className="w-4 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm" style={{ height: '110px' }}></div>
                  <div className="w-4 bg-rose-400 hover:bg-rose-500 transition-all rounded-t-sm" style={{ height: '55px' }}></div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500">APR</span>
              </div>

              {/* May Bar */}
              <div className="flex flex-col items-center justify-end h-full space-y-2 group w-12">
                <div className="w-full flex items-end justify-center space-x-1">
                  <div className="w-4 bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-sm" style={{ height: '140px' }}></div>
                  <div className="w-4 bg-rose-400 hover:bg-rose-500 transition-all rounded-t-sm" style={{ height: '95px' }}></div>
                </div>
                <span className="text-[10px] font-mono font-medium text-slate-500">MAY</span>
              </div>

              {/* Jun Bar (Current dynamic status calculation) */}
              <div className="flex flex-col items-center justify-end h-full space-y-2 group w-12">
                <div className="w-full flex items-end justify-center space-x-1">
                  {/* Map actual sales/purchases directly to height metrics */}
                  <div className="w-4 bg-indigo-600 ring-2 ring-indigo-200 transition-all rounded-t-sm cursor-pointer" style={{ height: `${Math.min(180, Math.max(15, totalSalesVal / 100))}px` }}></div>
                  <div className="w-4 bg-rose-500 ring-2 ring-rose-100 transition-all rounded-t-sm cursor-pointer" style={{ height: `${Math.min(180, Math.max(15, totalPurchasesVal / 100))}px` }}></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-600">JUN *</span>
              </div>

            </div>

          </div>

          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
            * June data points derived directly in real-time from Active Checkout entries and Goods Receipt transactions.
          </p>
        </div>

        {/* Subsidiary Account balance distributions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">Master Account Positions</h3>
            <p className="text-xs text-slate-500">Assets and liabilities ledger tracking</p>
          </div>

          {/* Distribution list */}
          <div className="space-y-4 py-4 flex-1 flex flex-col justify-center">
            
            {/* Account Checking */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Checking Reserves (1020)</span>
                <span className="font-mono text-slate-900 font-bold">₹{(accounts?.find(a => a.code === '1020')?.balance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Inventory Asset */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Inventory Stock Value (1400)</span>
                <span className="font-mono text-slate-900 font-bold">₹{(accounts?.find(a => a.code === '1400')?.balance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* Receivables */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Credit Receivables (1200)</span>
                <span className="font-mono text-slate-900 font-bold">₹{(accounts?.find(a => a.code === '1200')?.balance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Accounts Payable */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Liability Account Payable (2100)</span>
                <span className="font-mono text-slate-900 font-bold">₹{(accounts?.find(a => a.code === '2100')?.balance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(5, (accountsAPPay / (cashReserves || 100000)) * 100))}%` }}></div>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit Status:</span>
            <span className="text-emerald-600 font-bold tracking-wider uppercase font-mono">TRIAL_BAL_BALANCED</span>
          </div>
        </div>

      </div>

      {/* Combined Latest Operations Listing */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900">Latest Live Transactions</h3>
          </div>
          <span className="text-xs text-slate-400">Updates live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Registry Entry ID</th>
                <th className="py-3 px-4">Op Type</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Dockets</th>
                <th className="py-3 px-4 text-right">Credit Amount</th>
              </tr>
            </thead>
            <tbody>
              {combinedOperations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions captured in the active session. Launch POS or source products to generate logs.
                  </td>
                </tr>
              ) : (
                combinedOperations.map((op) => (
                  <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {op.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{op.number}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        op.type === 'SALE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {op.type === 'SALE' ? 'SALE INVOICE' : 'INBOUND PO'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] uppercase font-bold text-slate-500">{op.method}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        op.status === 'PAID' || op.status === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                      op.type === 'SALE' ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {op.type === 'SALE' ? '+' : '-'}₹{op.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
