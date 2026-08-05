/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import { Users, Plus, Mail, Phone, MapPin, Search, Award, DollarSign } from 'lucide-react';

export default function CustomersPage() {
  const { customers, addCustomer } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');

  // form inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    addCustomer({
      name,
      phone,
      email,
      address
    });

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
  };

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" id="customers-ledger-container">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">B2C Customers & Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain customer registries, track loyalty membership award points, and audit outstanding unpaid grocery credits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Customer Form */}
        <form onSubmit={handleAdd} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4 text-xs font-sans">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Define Customer Card</h3>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Customer Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-950"
              placeholder="e.g. Gopal Sriram"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                placeholder="+91 98124xxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Coordinates</label>
              <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono text-slate-950"
                placeholder="gopal@sriram.me"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Postal Residence</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 text-slate-950"
              placeholder="Residential address details..."
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer min-h-[40px]"
          >
            Register Customer Account
          </button>
        </form>

        {/* Customers List Board (Col-span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Lookup query */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
              placeholder="Search member list by customer name, phone prefix, coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Customers Cards Listing */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <p className="text-center py-12 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl font-sans">
                No customer accounts match your search indices.
              </p>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-all"
                  id={`customer-node-${c.id}`}
                >
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm font-sans">{c.name}</h4>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400 font-sans" />
                        {c.phone}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400 font-sans" />
                        {c.email || 'N/A'}
                      </span>
                      {c.address && (
                        <span className="flex items-center gap-1 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {c.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Loyalty Points / Receivables Grid */}
                  <div className="flex items-center space-x-6 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 shrink-0 divide-x divide-slate-150">
                    
                    {/* Points */}
                    <div className="text-left font-sans">
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        Loyalty Card
                      </span>
                      <span className="text-base font-black text-slate-800 font-mono block mt-0.5">
                        {c.points || 0} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                      </span>
                    </div>

                    {/* Dues */}
                    <div className="text-right pl-6 font-sans">
                      <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block flex items-center gap-1 justify-end">
                        <DollarSign className="w-3.5 h-3.5 text-red-500 font-sans" />
                        Credit Accounts Balance
                      </span>
                      <span className={`text-base font-mono font-black mt-0.5 block ${c.outstandingBalance > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                        ₹{c.outstandingBalance.toLocaleString('en-IN')}
                      </span>
                    </div>

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
