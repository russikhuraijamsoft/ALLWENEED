/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  User,
  CreditCard,
  Barcode,
  Printer,
  CheckCircle,
  FileSpreadsheet,
  Coins,
  Receipt
} from 'lucide-react';

export default function POSBillingPage() {
  const {
    products,
    inventory,
    customers,
    cart,
    selectedCustomerId,
    posPaymentMethod,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    checkoutPOS
  } = useERPStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [successReceiptNum, setSuccessReceiptNum] = useState<string | null>(null);

  // Filter products matching search
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q));
  }).map((prod) => {
    const stock = inventory.find((inv) => inv.productId === prod.id);
    return {
      ...prod,
      quantity: stock ? stock.quantity : 0
    };
  });

  // Calculate cart costs
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.customPrice || item.product.price) * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * 0.18); // 18% simulated GST
  const cartDiscounts = cart.reduce((sum, item) => {
    const price = item.customPrice || item.product.price;
    return sum + price * item.quantity * ((item.discountPercent || 0) / 100);
  }, 0);
  const cartGrandTotal = cartSubtotal + cartTax - cartDiscounts;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const invNum = checkoutPOS();
    if (invNum) {
      setSuccessReceiptNum(invNum);
      setTimeout(() => {
        // Automatically hide receipt alert after a while, or let user manually dismiss
      }, 10000);
    }
  };

  const handleCloseReceipt = () => {
    setSuccessReceiptNum(null);
  };

  return (
    <div className="space-y-6" id="pos-billing-area">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950 flex items-center gap-2">
            <Coins className="w-6 h-6 text-indigo-600 animate-pulse" />
            POS Terminal & Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cashier checkout terminal. Register sales barcodes, manage active customer registers, and log ledger invoices.
          </p>
        </div>
      </div>

      {successReceiptNum && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-start justify-between" id="checkout-receipt-alert">
          <div className="flex gap-3">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 text-xs">
              <h3 className="text-base font-bold text-emerald-950">Sale Processed Instantly!</h3>
              <p className="text-emerald-800">Invoice reference <strong>{successReceiptNum}</strong> dispatched successfully.</p>
              <p className="text-slate-500 leading-relaxed max-w-xl">
                The database has deducted stock units, updated customer loyalty ledger metrics, and created automated double-entry ledger journals.
              </p>
              
              {/* Monospace receipt preview */}
              <div className="bg-slate-950 font-mono text-[10px] text-emerald-400 p-4 rounded-xl max-w-sm border border-slate-800 shadow-xl space-y-1 select-none pr-12">
                <p className="text-center font-bold uppercase tracking-wider text-white">ALL WE NEED STORE ERP</p>
                <p className="text-center font-bold">POS BILLING TERMINAL RECEIPT</p>
                <p className="text-center text-slate-500">- - - - - - - - - - - - - - - - - - - - -</p>
                <p>INVOICE NO: {successReceiptNum}</p>
                <p>TIMESTAMP: {new Date().toISOString()}</p>
                <p>CUSTOMER REGISTER ID: {selectedCustomerId}</p>
                <p className="text-slate-500">- - - - - - - - - - - - - - - - - - - - -</p>
                <p className="text-white text-xs font-bold font-mono">GRAND TOTAL: ₹{cartGrandTotal.toLocaleString('en-IN')}</p>
                <p className="text-[9px] text-slate-400 mt-2">Dockets auto-posted to ledger series. Thank you.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                window.print();
              }}
              className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </button>
            <button
              onClick={handleCloseReceipt}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer min-h-[40px]"
            >
              New Transaction
            </button>
          </div>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT PANEL: Catalog (Col-span 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Lookup query */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
                placeholder="Scan barcodes or find products by name/SKU indices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Barcode className="w-5 h-5 text-slate-400 shrink-0" />
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const isOutOfStock = p.quantity <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && addToCart(p, 1)}
                  className={`bg-white border rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 text-xs flex flex-col justify-between h-40 ${
                    isOutOfStock
                      ? 'opacity-60 saturate-50 cursor-not-allowed border-slate-200'
                      : 'cursor-pointer hover:border-indigo-400 border-slate-200'
                  }`}
                  id={`pos-catalog-item-${p.id}`}
                >
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                      SKU: {p.sku}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs font-sans line-clamp-2 leading-relaxed">{p.name}</h4>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-50 pt-2 text-xs">
                    <div>
                      <p className="text-indigo-600 font-extrabold text-sm font-mono">₹{p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-slate-450 font-sans mt-0.5 font-bold">Standard MRP Unit</p>
                    </div>

                    <div className="text-right">
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold text-white bg-slate-400 px-2 py-1 rounded inline-block font-sans">
                          OUT OF STOCK
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded inline-block font-sans ${
                          p.quantity <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                        }`}>
                          Qty: <strong className="font-mono">{p.quantity}</strong> {p.unit}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT PANEL: POS Checkout Cart (Col-span 5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Checkout Cart</h3>
            </div>
            {cart.length > 0 && (
              <button
                id="pos-clear-cart-btn"
                onClick={clearCart}
                className="text-[10px] font-bold tracking-wider uppercase text-red-500 hover:text-red-700 font-sans cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className="text-xs font-sans space-y-5">
            {/* Cart list rows */}
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-350 mx-auto opacity-70" />
                  <p>Cart is currently empty.</p>
                  <p className="text-[10px] text-slate-450 non-italic">Pick items from the catalog on your left to checkout.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="p-3 bg-slate-50/30 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 truncate font-sans">{item.product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-slate-450 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                          ₹{item.product.price.toFixed(2)}
                        </span>
                        
                        {/* Custom price modifier or details */}
                        <span className="font-semibold text-slate-500">x{item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      
                      {/* Plus Minus control buttons */}
                      <div className="flex items-center border border-slate-200/80 rounded overflow-hidden bg-white shadow-3xs">
                        <button
                          id={`qty-minus-${item.product.id}`}
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="p-1 px-1.5 text-slate-500 hover:bg-slate-50 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono font-bold text-slate-900">{item.quantity}</span>
                        <button
                          id={`qty-plus-${item.product.id}`}
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="p-1 px-1.5 text-slate-500 hover:bg-slate-50 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Loyalty Customer Select */}
            <div>
              <label htmlFor="pos-customer-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Loyalty Customer Member</label>
              <div className="flex items-center space-x-2">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  id="pos-customer-select"
                  value={selectedCustomerId}
                  onChange={(e) => useERPStore.setState({ selectedCustomerId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[38px] text-xs font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Payment Settlement Method</label>
              <div className="grid grid-cols-4 gap-2">
                {(['CASH', 'CARD', 'UPI', 'CREDIT'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => useERPStore.setState({ posPaymentMethod: method })}
                    className={`p-2 rounded-xl text-[10px] font-bold uppercase tracking-wide border transition-all text-center cursor-pointer min-h-[38px] ${
                      posPaymentMethod === method
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost break down summary */}
            {cart.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-slate-150">
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-semibold uppercase tracking-wider text-[9px]">Sale Subtotal</span>
                  <span className="font-mono text-slate-800 font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-450 font-semibold uppercase tracking-wider text-[9px]">CGST + SGST tax (18%)</span>
                  <span className="font-mono text-slate-800 font-bold">+₹{cartTax.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscounts > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="font-semibold uppercase tracking-wider text-[9px]">Deducted Sales Discount</span>
                    <span className="font-mono font-bold">-₹{cartDiscounts.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
                  <span className="text-slate-900 font-black text-xs uppercase tracking-wider">Grand Total Amount</span>
                  <span className="font-mono text-indigo-700 font-black text-base">₹{cartGrandTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  id="checkout-finalize-btn"
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl shadow-lg shadow-indigo-600/15 active:scale-95 transition-all text-center cursor-pointer min-h-[44px] text-sm flex items-center justify-center gap-1.5"
                >
                  <Receipt className="w-4 h-4 text-indigo-100 animate-pulse" />
                  Finalize & Dispatch POS Invoice
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
