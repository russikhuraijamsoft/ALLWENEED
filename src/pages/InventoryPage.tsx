/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import {
  Layers,
  Search,
  SlidersHorizontal,
  Edit2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MapPin,
  Save,
  Info
} from 'lucide-react';

export default function InventoryPage() {
  const { inventory, products, categories, updateInventory } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit fields state
  const [tempRack, setTempRack] = useState('');
  const [tempMin, setTempMin] = useState(5);
  const [tempQty, setTempQty] = useState(0);

  const startEditing = (itemId: string, rack: string, min: number, qty: number) => {
    setEditingId(itemId);
    setTempRack(rack);
    setTempMin(min);
    setTempQty(qty);
  };

  const saveDetails = (itemId: string) => {
    updateInventory(itemId, {
      rackLocation: tempRack,
      minStockAlert: Number(tempMin),
      quantity: Number(tempQty)
    });
    setEditingId(null);
  };

  // Computations
  const totalItemsCount = inventory.reduce((acc, item) => acc + item.quantity, 0);

  const filteredInventoryItems = inventory.map((item) => {
    const prod = products.find((p) => p.id === item.productId);
    const cat = categories.find((c) => c.id === prod?.categoryId);
    return {
      ...item,
      productName: prod?.name || 'Unknown material',
      sku: prod?.sku || 'N/A',
      unit: prod?.unit || 'UNIT',
      category: cat?.name || 'Unassigned',
      status: item.quantity <= 0 ? 'OUT' : item.quantity <= item.minStockAlert ? 'LOW' : 'OK'
    };
  }).filter((item) => {
    const q = searchQuery.toLowerCase();
    return item.productName.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || item.rackLocation.toLowerCase().includes(q);
  });

  const lowCount = filteredInventoryItems.filter(i => i.status === 'LOW').length;
  const outCount = filteredInventoryItems.filter(i => i.status === 'OUT').length;

  return (
    <div className="space-y-6" id="inventory-ledger-container">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Store Inventory & Warehousing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track live shelf counts, edit material rack locations, and review stock warning parameters.
          </p>
        </div>
      </div>

      {/* Metrics Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs">
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Stock Quantity</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{totalItemsCount} Units</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg font-bold shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Low Stock warnings</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">{lowCount} Classes</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-xs">
          <div className="bg-rose-50 text-rose-600 p-2.5 rounded-lg font-bold shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Out of Stock Materials</p>
            <p className="text-lg font-black text-rose-600 mt-0.5">{outCount} Classes</p>
          </div>
        </div>
      </div>

      {/* Search and listings table */}
      <div className="space-y-4">
        
        {/* Lookup bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3 shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
            placeholder="Search shelves by name, stock index, or rack number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Master Ledger table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 w-48">SKU / ITEM CODE</th>
                  <th className="py-3.5 px-4">PRODUCT / COMMODITY</th>
                  <th className="py-3.5 px-4">SHELF LOCATION</th>
                  <th className="py-3.5 px-4">MIN ALERT CAP</th>
                  <th className="py-3.5 px-4">ON HAND STOCK</th>
                  <th className="py-3.5 px-4">LEVEL STATE</th>
                  <th className="py-3.5 px-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventoryItems.map((item) => {
                  const isEditing = editingId === item.id;
                  return (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.sku}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <p className="font-semibold text-slate-800">{item.productName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{item.category}</p>
                      </td>

                      {/* Rack location cell */}
                      <td className="py-3.5 px-4 font-sans text-slate-700">
                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs w-36 font-semibold"
                            value={tempRack}
                            onChange={(e) => setTempRack(e.target.value)}
                          />
                        ) : (
                          <span className="flex items-center gap-1.5 font-medium text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.rackLocation}
                          </span>
                        )}
                      </td>

                      {/* Minimum stock cell */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs w-16"
                            value={tempMin}
                            onChange={(e) => setTempMin(Number(e.target.value))}
                          />
                        ) : (
                          <span>{item.minStockAlert} {item.unit}</span>
                        )}
                      </td>

                      {/* On Hand level */}
                      <td className="py-3.5 px-4 font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs w-16 font-bold text-indigo-700"
                            value={tempQty}
                            onChange={(e) => setTempQty(Number(e.target.value))}
                          />
                        ) : (
                          <span className="font-bold text-slate-900">
                            {item.quantity} <span className="font-medium text-slate-400 text-[10px]">{item.unit}</span>
                          </span>
                        )}
                      </td>

                      {/* Status indicator */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'OK'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'LOW'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {item.status === 'OK' && <CheckCircle className="w-3 h-3" />}
                          {item.status === 'LOW' && <AlertTriangle className="w-3 h-3" />}
                          {item.status === 'OUT' && <XCircle className="w-3 h-3" />}
                          {item.status === 'OK' ? 'STABLE' : item.status === 'LOW' ? 'LOW REORDER' : 'CRITICAL OUT'}
                        </span>
                      </td>

                      {/* Action trigger */}
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <button
                            id={`save-inv-btn-${item.id}`}
                            onClick={() => saveDetails(item.id)}
                            className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Save
                          </button>
                        ) : (
                          <button
                            id={`edit-inv-btn-${item.id}`}
                            onClick={() => startEditing(item.id, item.rackLocation, item.minStockAlert, item.quantity)}
                            className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 cursor-pointer hover:font-bold"
                          >
                            <Edit2 className="w-3 h-3" />
                            Adjust
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip section */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-2.5 text-xs text-slate-500">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-700">Automatic Stock Deductions</h4>
            <p className="mt-0.5 leading-relaxed">
              Upon successful completion of any checkout in the Point of Sale Terminal or receipt of goods in the Purchases Ledger module, the system automatically adjusts inventory parameters. You can manually adjust stock discrepancies above.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
