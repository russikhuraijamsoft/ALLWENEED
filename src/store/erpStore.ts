/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import {
  User,
  Category,
  Brand,
  Product,
  InventoryItem,
  PurchaseOrder,
  Supplier,
  Customer,
  Invoice,
  LedgerEntry,
  Account,
  POSCartItem
} from '../types';

interface ERPState {
  // Auth
  currentUser: User | null;
  login: (email: string, role: string) => boolean;
  logout: () => void;

  // Master Lists
  categories: Category[];
  brands: Brand[];
  products: Product[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  customers: Customer[];
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  accounts: Account[];
  ledger: LedgerEntry[];

  // POS State
  cart: POSCartItem[];
  selectedCustomerId: string;
  posPaymentMethod: 'CASH' | 'CARD' | 'UPI' | 'CREDIT';

  // Actions for Master Data
  addCategory: (category: Omit<Category, 'id'>) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  updateInventory: (id: string, updated: Partial<InventoryItem>) => void;
  
  // Actions for Contacts
  addSupplier: (supplier: Omit<Supplier, 'id' | 'outstandingBalance'>) => void;
  updateSupplier: (id: string, updated: Partial<Supplier>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'outstandingBalance'>) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;

  // Actions for Purchases
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'totalAmount'>) => void;
  receivePurchaseOrder: (poId: string) => void;

  // Actions for POS Cart & Checkout
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutPOS: () => string | null; // Returns invoiceNumber on success

  // Actions for Accounting
  addManualJournal: (entry: Omit<LedgerEntry, 'id' | 'journalNumber'>) => void;
}

// Pre-seeded core Master Accounts
const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1', code: '1010', name: 'Cash on Hand', type: 'ASSET', balance: 15000 },
  { id: 'acc-2', code: '1020', name: 'Bank Operating Account', type: 'ASSET', balance: 125000 },
  { id: 'acc-3', code: '1400', name: 'Inventory Asset', type: 'ASSET', balance: 3500 },
  { id: 'acc-4', code: '1200', name: 'Accounts Receivable', type: 'ASSET', balance: 1200 },
  { id: 'acc-5', code: '2100', name: 'Accounts Payable', type: 'LIABILITY', balance: 0 },
  { id: 'acc-6', code: '4150', name: 'Sales Revenue', type: 'REVENUE', balance: 0 },
  { id: 'acc-7', code: '5100', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', balance: 0 },
  { id: 'acc-8', code: '5200', name: 'General & Administrative Expenses', type: 'EXPENSE', balance: 0 },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Grocery & Staples', code: 'GRS', description: 'Grains, oils, sugar, salt' },
  { id: 'cat-2', name: 'Personal Care', code: 'PRC', description: 'Soaps, creams, toothpaste' },
  { id: 'cat-3', name: 'Beverages', code: 'BEV', description: 'Soft drinks, energy juices, tea' },
  { id: 'cat-4', name: 'Household & Cleaning', code: 'HHC', description: 'Detergents, floor cleaners' }
];

const INITIAL_BRANDS: Brand[] = [
  { id: 'brd-1', name: 'Universal Foods', description: 'Baseline staples brand' },
  { id: 'brd-2', name: 'Nestle', description: 'Packaged beverage and snacks' },
  { id: 'brd-3', name: 'Unilever', description: 'Hygiene and personal care' }
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-1', sku: 'GRS-WHT-10KG', barcode: '8901234567890', name: 'Whole Wheat Flour 10Kg', description: 'Premium stone-ground wheat flour', categoryId: 'cat-1', brandId: 'brd-1', price: 450, cost: 380, unit: 'BAG', status: 'ACTIVE' },
  { id: 'prod-2', sku: 'BEV-NES-200G', barcode: '8901234567801', name: 'Nescafe Instant Coffee 200g', description: 'Rich aroma pure coffee powder', categoryId: 'cat-3', brandId: 'brd-2', price: 620, cost: 510, unit: 'JAR', status: 'ACTIVE' },
  { id: 'prod-3', sku: 'PRC-SOAP-125G', barcode: '8901234567812', name: 'Life Soap Bar 125g', description: 'Antibacterial hand soap', categoryId: 'cat-2', brandId: 'brd-3', price: 40, cost: 31, unit: 'UNIT', status: 'ACTIVE' }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', productId: 'prod-1', quantity: 45, rackLocation: 'Aisle 3, Rack B', minStockAlert: 10, batchNumber: 'B-WHT-202', expiryDate: '2026-12-01' },
  { id: 'inv-2', productId: 'prod-2', quantity: 18, rackLocation: 'Aisle 1, Rack D', minStockAlert: 5, batchNumber: 'B-NES-77', expiryDate: '2027-04-15' },
  { id: 'inv-3', productId: 'prod-3', quantity: 120, rackLocation: 'Aisle 2, Rack A', minStockAlert: 20, batchNumber: 'B-SOAP-9', expiryDate: '2028-10-30' }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Aggarwal Staples Dist', code: 'SUP-001', contactName: 'Raj Aggarwal', phone: '+91 9876543210', email: 'raj@aggarwalstaples.com', address: 'Grain Market, Sector 26, Delhi', outstandingBalance: 0 },
  { id: 'sup-2', name: 'Hindustan Fast Foods', code: 'SUP-002', contactName: 'Aman Shah', phone: '+91 9911223344', email: 'b2b@hindustanfoods.com', address: 'Okhla Phase 3, Industrial Area', outstandingBalance: 0 }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Walk-In Customer', phone: '0000000000', email: 'walkin@store.com', address: 'N/A', outstandingBalance: 0, points: 15 },
  { id: 'cust-2', name: 'Gopal Sriram', phone: '+91 9812493399', email: 'gopal@sriram.me', address: 'C-42, Rajouri Garden, New Delhi', outstandingBalance: 450, points: 145 }
];

export const useERPStore = create<ERPState>((set, get) => ({
  // Authentication Init with simple LocalStorage check or generic admin user
  currentUser: (() => {
    try {
      const stored = localStorage.getItem('erp_user');
      return stored ? JSON.parse(stored) : { id: 'usr-1', name: 'Admin Officer', email: 'admin@allweneed.com', role: 'ADMIN' };
    } catch {
      return { id: 'usr-1', name: 'Admin Officer', email: 'admin@allweneed.com', role: 'ADMIN' };
    }
  })(),

  login: (email: string, role: string) => {
    // Exact ERP auth router mapping
    const lookupName = email.split('@')[0];
    const user: User = {
      id: 'usr-' + Date.now().toString(),
      name: lookupName.charAt(0).toUpperCase() + lookupName.slice(1) || 'Staff User',
      email: email,
      role: role as any
    };
    localStorage.setItem('erp_user', JSON.stringify(user));
    set({ currentUser: user });
    return true;
  },

  logout: () => {
    localStorage.removeItem('erp_user');
    set({ currentUser: null });
  },

  // Master Data Sets
  categories: INITIAL_CATEGORIES,
  brands: INITIAL_BRANDS,
  products: INITIAL_PRODUCTS,
  inventory: INITIAL_INVENTORY,
  suppliers: INITIAL_SUPPLIERS,
  customers: INITIAL_CUSTOMERS,
  invoices: [],
  purchaseOrders: [
    {
      id: 'po-1',
      poNumber: 'PO-2026-0001',
      supplierId: 'sup-1',
      items: [
        { productId: 'prod-1', quantity: 20, cost: 380 }
      ],
      status: 'RECEIVED',
      orderDate: '2026-06-01',
      receivedDate: '2026-06-02',
      totalAmount: 7600,
      notes: 'Monthly standard grains procurement'
    }
  ],
  accounts: INITIAL_ACCOUNTS,
  ledger: [
    {
      id: 'led-1',
      date: '2026-06-02',
      description: 'Pre-seeded Product Grain Stock Opening Balance',
      journalNumber: 'JV-0001',
      debitedAccount: '1400', // Inventory Asset
      creditedAccount: '1010', // Cash
      amount: 7600
    }
  ],

  // POS CART STUFF
  cart: [],
  selectedCustomerId: 'cust-1',
  posPaymentMethod: 'CASH',

  // Master Data Adders
  addCategory: (cat) => {
    const newCat = { ...cat, id: 'cat-' + Date.now() };
    set((state) => ({ categories: [...state.categories, newCat] }));
  },

  addBrand: (brd) => {
    const newBrd = { ...brd, id: 'brd-' + Date.now() };
    set((state) => ({ brands: [...state.brands, newBrd] }));
  },

  addProduct: (prod) => {
    const newId = 'prod-' + Date.now();
    const newProd = { ...prod, id: newId };
    const newInv: InventoryItem = {
      id: 'inv-' + Date.now(),
      productId: newId,
      quantity: 0,
      rackLocation: 'Unassigned',
      minStockAlert: 5
    };
    set((state) => ({
      products: [...state.products, newProd],
      inventory: [...state.inventory, newInv]
    }));
  },

  updateProduct: (id, updated) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p))
    }));
  },

  updateInventory: (id, updated) => {
    set((state) => ({
      inventory: state.inventory.map((inv) => (inv.id === id ? { ...inv, ...updated } : inv))
    }));
  },

  // Contact Mutators
  addSupplier: (sup) => {
    const newSup: Supplier = {
      ...sup,
      id: 'sup-' + Date.now(),
      outstandingBalance: 0
    };
    set((state) => ({ suppliers: [...state.suppliers, newSup] }));
  },

  updateSupplier: (id, updated) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updated } : s))
    }));
  },

  addCustomer: (cust) => {
    const newCust: Customer = {
      ...cust,
      id: 'cust-' + Date.now(),
      outstandingBalance: 0,
      points: 0
    };
    set((state) => ({ customers: [...state.customers, newCust] }));
  },

  updateCustomer: (id, updated) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...c, ...updated } : c))
    }));
  },

  // Purchases Flow
  addPurchaseOrder: (poIn) => {
    const id = 'po-' + Date.now();
    const poNumber = `PO-2026-${String(get().purchaseOrders.length + 1).padStart(4, '0')}`;
    const totalAmount = poIn.items.reduce((sum, item) => sum + item.quantity * item.cost, 0);

    const newPO: PurchaseOrder = {
      ...poIn,
      id,
      poNumber,
      totalAmount
    };

    set((state) => ({
      purchaseOrders: [newPO, ...state.purchaseOrders]
    }));
  },

  receivePurchaseOrder: (poId) => {
    const state = get();
    const po = state.purchaseOrders.find((p) => p.id === poId);
    if (!po || po.status === 'RECEIVED') return;

    // Update Status to RECEIVED
    const updatedPOs = state.purchaseOrders.map((p) =>
      p.id === poId ? { ...p, status: 'RECEIVED' as const, receivedDate: new Date().toISOString().split('T')[0] } : p
    );

    // Increase Inventories matching items
    const updatedInventory = [...state.inventory];
    po.items.forEach((poItem) => {
      const idx = updatedInventory.findIndex((inv) => inv.productId === poItem.productId);
      if (idx !== -1) {
        updatedInventory[idx] = {
          ...updatedInventory[idx],
          quantity: updatedInventory[idx].quantity + poItem.quantity
        };
      } else {
        updatedInventory.push({
          id: 'inv-' + Date.now() + Math.random(),
          productId: poItem.productId,
          quantity: poItem.quantity,
          rackLocation: 'Aisle General',
          minStockAlert: 5
        });
      }
    });

    // Double Entry: Debit Inventory Asset, Credit Accounts Payable (liability account if balance, or Cash)
    const journalNumber = `JV-P${String(state.ledger.length + 1).padStart(4, '0')}`;
    const newLedgerEntry: LedgerEntry = {
      id: 'led-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: `Purchase Goods Receipt PO ${po.poNumber}`,
      journalNumber,
      debitedAccount: '1400', // Inventory Asset
      creditedAccount: '2100', // Accounts Payable
      amount: po.totalAmount
    };

    // Reflect outstanding liability check on Supplier
    const updatedSuppliers = state.suppliers.map((s) =>
      s.id === po.supplierId ? { ...s, outstandingBalance: s.outstandingBalance + po.totalAmount } : s
    );

    // Update balances on Account Ledger objects
    const updatedAccounts = state.accounts.map((acc) => {
      if (acc.code === '1400') {
        return { ...acc, balance: acc.balance + po.totalAmount };
      }
      if (acc.code === '2100') {
        return { ...acc, balance: acc.balance + po.totalAmount };
      }
      return acc;
    });

    set({
      purchaseOrders: updatedPOs,
      inventory: updatedInventory,
      suppliers: updatedSuppliers,
      ledger: [newLedgerEntry, ...state.ledger],
      accounts: updatedAccounts
    });
  },

  // POS state edits
  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existing = cart.find((item) => item.product.id === product.id);

    if (existing) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      });
    } else {
      set({
        cart: [...cart, { product, quantity, customPrice: product.price, discountPercent: 0 }]
      });
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.product.id !== productId) });
  },

  updateCartQty: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    });
  },

  clearCart: () => {
    set({ cart: [], selectedCustomerId: 'cust-1', posPaymentMethod: 'CASH' });
  },

  checkoutPOS: () => {
    const { cart, selectedCustomerId, posPaymentMethod, products, inventory, accounts, ledger, invoices, customers } = get();
    if (cart.length === 0) return null;

    // Out of Stock Guards checks:
    let stockAlerts = false;
    cart.forEach((item) => {
      const stock = inventory.find((i) => i.productId === item.product.id);
      if (!stock || stock.quantity < item.quantity) {
        stockAlerts = true;
      }
    });

    // We allow checkout but deduct properly (ERP registers negative values if needed, but best if warns or prevents). We allow in this complete engine with deductions.

    const subtotal = cart.reduce((sum, item) => sum + (item.customPrice || item.product.price) * item.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.18); // 18% standard GST simulation
    const discountAmount = cart.reduce((sum, item) => {
      const p = item.customPrice || item.product.price;
      return sum + p * item.quantity * ((item.discountPercent || 0) / 100);
    }, 0);
    const totalAmount = subtotal + taxAmount - discountAmount;

    const invoiceNumber = `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const invoiceItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.customPrice || item.product.price,
      discount: item.discountPercent || 0
    }));

    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber,
      customerId: selectedCustomerId,
      items: invoiceItems,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: posPaymentMethod === 'CREDIT' ? 'UNPAID' : 'PAID',
      paymentMethod: posPaymentMethod
    };

    // Calculate COGS: sum of product.cost * quantity
    const totalCOGS = cart.reduce((sum, item) => sum + item.product.cost * item.quantity, 0);

    // Deduct stock levels in inventory state
    const updatedInventory = inventory.map((inv) => {
      const cartItem = cart.find((item) => item.product.id === inv.productId);
      if (cartItem) {
        return { ...inv, quantity: Math.max(0, inv.quantity - cartItem.quantity) };
      }
      return inv;
    });

    // Adjust Account Balances double-entry mapping
    const ledgerIdBase = Date.now();
    const journalNumber = `JV-S${String(ledger.length + 1).padStart(4, '0')}`;

    // Ledger 1: Debit Cash on Hand / Bank / Receivables, Credit Sales Revenue
    const isCreditSale = posPaymentMethod === 'CREDIT';
    const cashAccountCode = posPaymentMethod === 'CARD' || posPaymentMethod === 'UPI' ? '1020' : '1010';
    const debitedMainAccCode = isCreditSale ? '1200' : cashAccountCode; // 1200 = Accounts Receivable

    const saleLedger: LedgerEntry = {
      id: 'led-s1-' + ledgerIdBase,
      date: new Date().toISOString().split('T')[0],
      description: `POS Checkout Invoice ${invoiceNumber}`,
      journalNumber,
      debitedAccount: debitedMainAccCode,
      creditedAccount: '4150', // Sales Revenue
      amount: totalAmount
    };

    // Ledger 2: Debit Cost of Goods Sold, Credit Inventory Asset
    const cogsLedger: LedgerEntry = {
      id: 'led-s2-' + ledgerIdBase,
      date: new Date().toISOString().split('T')[0],
      description: `COGS Posting for POS INV ${invoiceNumber}`,
      journalNumber,
      debitedAccount: '5100', // COGS
      creditedAccount: '1400', // Inventory Asset
      amount: totalCOGS
    };

    // Accounts modifications
    const updatedAccounts = accounts.map((acc) => {
      if (acc.code === debitedMainAccCode) {
        return { ...acc, balance: acc.balance + totalAmount };
      }
      if (acc.code === '4150') {
        return { ...acc, balance: acc.balance + totalAmount };
      }
      if (acc.code === '5100') {
        return { ...acc, balance: acc.balance + totalCOGS };
      }
      if (acc.code === '1400') {
        return { ...acc, balance: Math.max(0, acc.balance - totalCOGS) };
      }
      return acc;
    });

    // Update Customer details if not general walk-in
    const updatedCustomers = customers.map((c) => {
      if (c.id === selectedCustomerId) {
        return {
          ...c,
          points: (c.points || 0) + Math.floor(totalAmount / 100),
          outstandingBalance: isCreditSale ? c.outstandingBalance + totalAmount : c.outstandingBalance
        };
      }
      return c;
    });

    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
      inventory: updatedInventory,
      accounts: updatedAccounts,
      ledger: [saleLedger, cogsLedger, ...state.ledger],
      customers: updatedCustomers,
      cart: [],
      selectedCustomerId: 'cust-1',
      posPaymentMethod: 'CASH'
    }));

    return invoiceNumber;
  },

  addManualJournal: (entry) => {
    const journalNumber = `JV-M${String(get().ledger.length + 1).padStart(4, '0')}`;
    const newEntry: LedgerEntry = {
      ...entry,
      id: 'led-m-' + Date.now(),
      journalNumber
    };

    const updatedAccounts = get().accounts.map((acc) => {
      if (acc.code === entry.debitedAccount) {
        return { ...acc, balance: acc.balance + entry.amount };
      }
      if (acc.code === entry.creditedAccount) {
        // Correcting balance logic based on account type
        if (acc.type === 'LIABILITY' || acc.type === 'EQUITY' || acc.type === 'REVENUE') {
          return { ...acc, balance: acc.balance + entry.amount };
        } else {
          return { ...acc, balance: acc.balance - entry.amount };
        }
      }
      return acc;
    });

    set((state) => ({
      ledger: [newEntry, ...state.ledger],
      accounts: updatedAccounts
    }));
  }
}));
