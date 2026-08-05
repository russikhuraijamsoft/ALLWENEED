/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import { Truck, Plus, Mail, Phone, MapPin, Search, ChevronRight, HeartHandshake } from 'lucide-react';

export default function SuppliersPage() {
  const { suppliers, addSupplier } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');

  // form inputs
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    addSupplier({
      name,
      code: code.toUpperCase(),
      contactName: contact,
      phone,
      email,
      address
    });

    // Reset Form
    setName('');
    setCode('');
    setContact('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const filtered = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.phone.includes(q);
  });

  return (
    <div className="space-y-6" id="suppliers-ledger-container">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">B2B Suppliers Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain catalogs of authorized business providers, trade accounts, contact coordinates, and cash payables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Supplier Form */}
        <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4 text-xs font-sans">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Configure Supplier Card</h3>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Supplier Company Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-semibold"
              placeholder="e.g. Aggarwal Grains Distributor"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Internal Code</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono text-center uppercase"
                placeholder="SUP-007"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Contact Name</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                placeholder="Managing Director"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                placeholder="+91 999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Coordinates</label>
              <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                placeholder="sales@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Postal Address</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
              placeholder="Warehouse address coordinates..."
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[40px]"
          >
            Register Supplier
          </button>
        </form>

        {/* Suppliers List representation (Col-span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Lookup query */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
              placeholder="Lookup suppliers by catalog name, phone number, or specific code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Suppliers Cards listing */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl">
                No supplier accounts found matching lookup indices.
              </p>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-all"
                  id={`supplier-node-${s.code}`}
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black uppercase text-[10px]">
                        {s.code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-500 font-sans mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {s.email || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {s.phone}
                      </span>
                      {s.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {s.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing tracker */}
                  <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 shrink-0 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-sans">
                      Trade Balance Payable
                    </span>
                    <span className={`text-lg font-mono font-black mt-0.5 ${s.outstandingBalance > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                      ₹{s.outstandingBalance.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-bold flex items-center justify-end gap-1 font-sans">
                      <HeartHandshake className="w-3.5 h-3.5 text-slate-400 inline" />
                      Net Terms Net 30
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
