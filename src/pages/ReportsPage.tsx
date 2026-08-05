/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useERPStore } from '../store/erpStore';
import {
  FileText,
  TrendingUp,
  BarChart4,
  Download,
  Printer,
  Calculator,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ReportsPage() {
  const { accounts, products, inventory } = useERPStore();

  // Dynamic values extract from ledger chart of accounts
  const salesRevenue = accounts.find((a) => a.code === '4150')?.balance || 0;
  const cogs = accounts.find((a) => a.code === '5100')?.balance || 0;
  const adminExpenses = accounts.find((a) => a.code === '5200')?.balance || 0;

  // Calculation formulas
  const grossProfit = salesRevenue - cogs;
  const netIncome = grossProfit - adminExpenses;
  const marginRatio = salesRevenue > 0 ? (grossProfit / salesRevenue) * 100 : 0;

  // Inventory valuation list
  const valuationItems = inventory.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const cost = prod?.cost || 0;
    const totalVal = item.quantity * cost;
    return {
      sku: prod?.sku || 'N/A',
      name: prod?.name || 'Unknown',
      qty: item.quantity,
      cost,
      totalVal,
    };
  });

  const totalInventoryValue = valuationItems.reduce((sum, item) => sum + item.totalVal, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="reports-and-analytics-area">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Financial Statements & Audits</h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyze Trading Statements, compute dynamic Profit Margins, and verify Inventory Valuation logs.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 text-xs">
          <button
            id="print-statement-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer min-h-[40px] shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Financials
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gross Profit Margin</span>
            <span className="text-lg font-black text-emerald-600 font-mono">₹{grossProfit.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg">
            {marginRatio.toFixed(1)}% Ratio
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Capitalized Inventory Valuation</span>
            <span className="text-lg font-black text-slate-900 font-mono">₹{totalInventoryValue.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg">
            Asset Value
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Income After Admin Charge</span>
            <span className={`text-lg font-black font-mono ${netIncome >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
              ₹{netIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-slate-500 bg-slate-150 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg">
            Balance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dynamic Trading income sheet */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Calculator className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Trading Statement (Income Sheet)</h3>
          </div>

          <div className="text-xs font-sans space-y-4 pt-1">
            
            {/* Sales Revenue */}
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Gross Sales Revenue (Account 4150)</span>
              <span className="font-mono text-slate-900 font-bold">₹{salesRevenue.toLocaleString('en-IN')}</span>
            </div>

            {/* Production deductions */}
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                Less: Cost of Goods Sold COGS (Account 5100)
              </span>
              <span className="font-mono text-red-500 font-bold">-₹{cogs.toLocaleString('en-IN')}</span>
            </div>

            {/* Trading result */}
            <div className="flex justify-between items-center py-3 bg-slate-50 rounded-lg px-4 border border-slate-100 font-sans">
              <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wide">Dynamic Gross Margin Total</span>
              <span className="font-mono text-emerald-600 font-black text-sm">₹{grossProfit.toLocaleString('en-IN')}</span>
            </div>

            {/* Administrative overheads */}
            <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Less: General & Corporate Expenses (Account 5200)</span>
              <span className="font-mono text-red-500 font-bold">-₹{adminExpenses.toLocaleString('en-IN')}</span>
            </div>

            {/* Bottom net row */}
            <div className="flex justify-between items-center py-3.5 bg-indigo-50/60 rounded-xl px-4 border border-indigo-100 font-sans">
              <span className="font-black text-indigo-950 uppercase text-[10px] tracking-widest block">Net Operating Income Surplus</span>
              <span className="font-mono text-indigo-700 font-extrabold text-base">₹{netIncome.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-slate-50 text-[10px] text-slate-500 p-2.5 rounded-lg leading-normal italic">
              💡 Formula metrics derived directly from Account General series in double-entry trial database ledger entries without static placeholders.
            </div>

          </div>
        </div>

        {/* Dynamic inventory valuation log sheet */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 font-sans">Inventory Asset Valuation ledger</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Capital Sourced</span>
            </div>

            {/* Small list table */}
            <div className="overflow-x-auto text-xs max-h-64 overflow-y-auto">
              <table className="w-full text-left text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2 px-2">SKU ID</th>
                    <th className="py-2 px-2">Material</th>
                    <th className="py-2 px-2 text-center">In Stock</th>
                    <th className="py-2 px-2 text-right">Unit Cost</th>
                    <th className="py-2 px-2 text-right">Asset Value</th>
                  </tr>
                </thead>
                <tbody>
                  {valuationItems.map((valItem, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2 px-2 font-mono font-bold text-slate-900">{valItem.sku}</td>
                      <td className="py-2 px-2 font-sans font-semibold max-w-[120px] truncate">{valItem.name}</td>
                      <td className="py-2 px-2 text-center font-mono">{valItem.qty}</td>
                      <td className="py-2 px-2 text-right font-mono">₹{valItem.cost}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">₹{valItem.totalVal.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sourced Valuation Summary row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans pb-1">
            <span className="font-extrabold text-slate-800">Total Capitalized Inventory Asset (Account 1400):</span>
            <span className="font-mono text-slate-950 font-black text-sm">₹{totalInventoryValue.toLocaleString('en-IN')}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
