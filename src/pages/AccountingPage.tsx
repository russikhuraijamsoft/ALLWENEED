/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import {
  DollarSign,
  Plus,
  BookOpen,
  FileSpreadsheet,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Percent,
  Check
} from 'lucide-react';

export default function AccountingPage() {
  const { accounts, ledger, addManualJournal } = useERPStore();

  // Manual Journal Input States
  const [desc, setDesc] = useState('');
  const [debitAcc, setDebitAcc] = useState(accounts[0]?.code || '1010');
  const [creditAcc, setCreditAcc] = useState(accounts[1]?.code || '1020');
  const [amountVal, setAmountVal] = useState('');

  const [postSuccess, setPostSuccess] = useState(false);

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amountVal || debitAcc === creditAcc) return;

    addManualJournal({
      date: new Date().toISOString().split('T')[0],
      description: desc,
      debitedAccount: debitAcc,
      creditedAccount: creditAcc,
      amount: Number(amountVal)
    });

    // Reset Form
    setDesc('');
    setAmountVal('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  const totalAssets = accounts.filter(a => a.type === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accounts.filter(a => a.type === 'EQUITY').reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6" id="accounting-ledger-area">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">General Accounting Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Double-entry bookkeeping accounts, manual journal postings, auditing trails, and balance sheets.
          </p>
        </div>
      </div>

      {/* Stats block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-white border border-slate-250 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Capital Assets</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">₹{totalAssets.toLocaleString('en-IN')}</p>
          </div>
          <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">Assets</span>
        </div>

        <div className="bg-white border border-slate-250 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Payables Liability</p>
            <p className="text-lg font-black text-red-600 mt-0.5">₹{totalLiabilities.toLocaleString('en-IN')}</p>
          </div>
          <span className="p-2 bg-red-50 text-red-600 rounded-lg">Liabilities</span>
        </div>

        <div className="bg-white border border-slate-250 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Working Reserves</p>
            <p className="text-lg font-black text-indigo-700 mt-0.5">₹{(totalAssets - totalLiabilities).toLocaleString('en-IN')}</p>
          </div>
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">Equity Balance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Chart of Accounts & New Manual entry (Col-span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Chart of Accounts */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Corporate Chart of Accounts (COA)</h3>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Standard Code</th>
                    <th className="py-2.5 px-3">Account Title Name</th>
                    <th className="py-2.5 px-3">Classification Type</th>
                    <th className="py-2.5 px-3 text-right">Current Ledger Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-650">{acc.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{acc.name}</td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide ${
                          acc.type === 'ASSET'
                            ? 'bg-emerald-50 text-emerald-700'
                            : acc.type === 'LIABILITY'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {acc.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{acc.balance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Journals Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Double Entry General Journal Ledger</h3>
            </div>

            <div className="overflow-x-auto text-xs max-h-96 overflow-y-auto">
              <table className="w-full text-left text-slate-650 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] sticky top-0 bg-white">
                    <th className="py-2.5 px-3">Audit Date</th>
                    <th className="py-2.5 px-3">Journal Ref ID</th>
                    <th className="py-2.5 px-3">Description Narration</th>
                    <th className="py-2.5 px-3 text-center">Debited Code</th>
                    <th className="py-2.5 px-3 text-center">Credited Code</th>
                    <th className="py-2.5 px-3 text-right">Debit Trans Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-100 font-sans hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{entry.date}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{entry.journalNumber}</td>
                      <td className="py-3 px-3 font-medium text-slate-700 max-w-xs truncate">{entry.description}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-600 bg-emerald-50/20">{entry.debitedAccount}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-red-500 bg-red-50/20">{entry.creditedAccount}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">₹{entry.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Post Manual Journal (Col-span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingDown className="w-5 h-5 text-indigo-500 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-900 font-sans">Draft Journal Entry</h3>
          </div>

          <form onSubmit={handlePostJournal} className="space-y-4 text-xs font-sans" id="manual-journal-form">
            <div>
              <label htmlFor="jv-desc-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Narration Narrative</label>
              <input
                id="jv-desc-input"
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-xs text-slate-950 font-medium"
                placeholder="e.g. Paid Office internet Broadband subscription"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="jv-debit-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Debited Account (Receiving Value)</label>
              <select
                id="jv-debit-select"
                value={debitAcc}
                onChange={(e) => setDebitAcc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[38px] text-xs font-semibold text-slate-950"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.code}>
                    {acc.code} - {acc.name} (Bal: ₹{acc.balance})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="jv-credit-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Credited Account (Disbursing Value)</label>
              <select
                id="jv-credit-select"
                value={creditAcc}
                onChange={(e) => setCreditAcc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[38px] text-xs font-semibold text-slate-950"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.code}>
                    {acc.code} - {acc.name} (Bal: ₹{acc.balance})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="jv-amount-input" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Amount to Transfer (₹)</label>
              <input
                id="jv-amount-input"
                type="number"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono text-center font-bold text-sm text-slate-950"
                placeholder="0.00"
                value={amountVal}
                onChange={(e) => setAmountVal(e.target.value)}
              />
            </div>

            {postSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-emerald-800 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Journal post balanced & committed!
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[40px] text-xs"
            >
              Commit Journal Posting
            </button>
          </form>

          <div className="bg-indigo-50/60 p-3 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-[10px] text-indigo-900 leading-normal">
            <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <strong>Double Entry Constraint Compliant</strong>: Manual posting is only approved once debited and credited accounts are distinct, keeping General Ledger trial tables fully mathematically balanced.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
