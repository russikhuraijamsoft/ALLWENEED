/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import { PurchaseItem } from '../types';
import {
  FilePlus2,
  ListFilter,
  Truck,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

export default function PurchasesPage() {
  const {
    purchaseOrders,
    suppliers,
    products,
    addPurchaseOrder,
    receivePurchaseOrder
  } = useERPStore();

  // Create PO form states
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poNotes, setPoNotes] = useState('');
  const [draftItems, setDraftItems] = useState<PurchaseItem[]>([]);

  // Individual item selector state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [itemQty, setItemQty] = useState(1);
  const [itemCost, setItemCost] = useState(products[0]?.cost || 0);

  const handleProductSelectChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setItemCost(prod.cost);
    }
  };

  const addItemToDraft = () => {
    if (!selectedProductId || itemQty <= 0 || itemCost <= 0) return;
    
    // Check if product already exists in draft
    const existingIdx = draftItems.findIndex((item) => item.productId === selectedProductId);
    if (existingIdx !== -1) {
      const updated = [...draftItems];
      updated[existingIdx].quantity += Number(itemQty);
      setDraftItems(updated);
    } else {
      setDraftItems([...draftItems, { productId: selectedProductId, quantity: Number(itemQty), cost: Number(itemCost) }]);
    }

    // Reset item selectors
    setItemQty(1);
  };

  const removeDraftItem = (index: number) => {
    setDraftItems(draftItems.filter((_, i) => i !== index));
  };

  const handleCreatePO = () => {
    if (draftItems.length === 0 || !selectedSupplierId) return;

    addPurchaseOrder({
      supplierId: selectedSupplierId,
      items: draftItems,
      status: 'ORDERED',
      orderDate: new Date().toISOString().split('T')[0],
      notes: poNotes
    });

    // Reset everything
    setDraftItems([]);
    setPoNotes('');
  };

  // Calculations for Draft PO
  const draftSubtotal = draftItems.reduce((sum, item) => sum + item.quantity * item.cost, 0);

  return (
    <div className="space-y-6" id="purchases-procurement-container">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Procurement & Purchases</h1>
          <p className="text-xs text-slate-500 mt-1">
            Build Purchase Orders (PO), source raw materials from suppliers, and authorize receipt entry auditing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Purchase Order constructor (Col-span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FilePlus2 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900">Compose Purchase Order</h3>
          </div>

          <div className="text-xs font-sans space-y-4">
            {/* Supplier select */}
            <div>
              <label htmlFor="po-supplier-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Select Supplier Partner</label>
              <select
                id="po-supplier-select"
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[38px]"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Add items row builder */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-200/60 pb-1.5">
                Add Items Matrix
              </span>
              
              {/* Product list selector */}
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Pick Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductSelectChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 text-xs h-[32px]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} [{p.sku}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Qty & Cost inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Order Quantity</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    value={itemQty}
                    onChange={(e) => setItemQty(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Agreed Cost (₹/Unit)</label>
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                    value={itemCost}
                    onChange={(e) => setItemCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="button"
                id="add-item-po-draft-btn"
                onClick={addItemToDraft}
                className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold p-2 rounded text-xs active:scale-95 transition-all cursor-pointer min-h-[32px]"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                Include Item Row
              </button>
            </div>

            {/* Display Draft List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PO Draft Rows</span>
              
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {draftItems.length === 0 ? (
                  <p className="text-center text-slate-400 italic py-6">No rows included in draft.</p>
                ) : (
                  draftItems.map((item, idx) => {
                    const prodObj = products.find((p) => p.id === item.productId);
                    return (
                      <div key={idx} className="p-3 bg-slate-50/40 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{prodObj?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.quantity} Qty @ ₹{item.cost}/unit
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">₹{(item.quantity * item.cost).toLocaleString('en-IN')}</span>
                          <button
                            type="button"
                            onClick={() => removeDraftItem(idx)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Total summary and write */}
            {draftItems.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs border-b border-dashed border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">Estimated PO Total Amount:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">₹{draftSubtotal.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label htmlFor="po-notes-input" className="text-[9px] font-bold text-slate-400 uppercase block mb-1">PO Terms / Dispatch instructions</label>
                  <textarea
                    id="po-notes-input"
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. standard credit payment terms net 30, dispatch by rail cargo..."
                    rows={2}
                    value={poNotes}
                    onChange={(e) => setPoNotes(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  id="submit-po-btn"
                  onClick={handleCreatePO}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl shadow-md shadow-indigo-600/10 active:scale-95 transition-all text-center cursor-pointer min-h-[40px]"
                >
                  Dispatch Purchase Order
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL: Dispatched Purchase Orders Logs (Col-span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Active PO Registry Board
            </span>
            <span className="text-slate-400 text-[10px] font-mono">{purchaseOrders.length} Orders Listed</span>
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto">
            {purchaseOrders.map((po) => {
              const supObj = suppliers.find((s) => s.id === po.supplierId);
              return (
                <div
                  key={po.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all duration-200"
                  id={`po-card-${po.poNumber}`}
                >
                  {/* Header metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                    <div>
                      <h4 className="font-mono font-extrabold text-slate-900 text-sm flex items-center gap-1">
                        {po.poNumber}
                        <span className="text-slate-300">|</span>
                        <span className="text-[11px] text-slate-500 font-normal">Dated: {po.orderDate}</span>
                      </h4>
                      <p className="text-[11px] text-indigo-600 flex items-center gap-1 mt-0.5 font-bold uppercase tracking-wider">
                        <Truck className="w-3.5 h-3.5" />
                        {supObj?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        po.status === 'RECEIVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {po.status === 'RECEIVED' ? <ClipboardCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {po.status}
                      </span>
                    </div>
                  </div>

                  {/* Items catalog list */}
                  <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Ordered Inventory Line Items</span>
                    {po.items.map((it, idx) => {
                      const prodObj = products.find((p) => p.id === it.productId);
                      return (
                        <div key={idx} className="flex justify-between items-center text-[11px] text-slate-600">
                          <span className="truncate max-w-xs">{prodObj?.name || 'Unknown Item'} <strong className="font-mono text-slate-400">({it.quantity} {prodObj?.unit})</strong></span>
                          <span className="font-mono text-slate-900 font-semibold">₹{(it.quantity * it.cost).toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total and actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <p className="text-slate-400 text-[10px] font-semibold uppercase">Gross Billing Amount</p>
                      <p className="font-mono text-slate-900 font-black text-sm mt-0.5">₹{po.totalAmount.toLocaleString('en-IN')}</p>
                    </div>

                    {po.status !== 'RECEIVED' ? (
                      <button
                        id={`authorize-receive-po-btn-${po.id}`}
                        onClick={() => receivePurchaseOrder(po.id)}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-indigo-600/15 cursor-pointer min-h-[38px]"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Receive Goods
                      </button>
                    ) : (
                      <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold tracking-wider uppercase font-mono bg-emerald-50 rounded px-2.5 py-1">
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        Stock Merged & journaled
                      </div>
                    )}
                  </div>

                  {po.notes && (
                    <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 p-2 rounded-lg italic">
                      🏷️ Terms: {po.notes}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          <div className="bg-amber-50/60 p-3.5 border border-amber-100 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 leading-normal">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Goods Receipt Note (GRN) auditing</strong>: Authorizing the Receipt of Goods instantly triggers double-entry Ledger bookkeeping. The "Inventory Asset Account (1400)" is debited, and "Accounts Payable (2100)" is credited, adding the total balance to the respective supplier ledger account.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
