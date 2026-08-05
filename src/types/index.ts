/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'ACCOUNTANT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  code: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId: string;
  price: number;
  cost: number;
  unit: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  rackLocation: string;
  minStockAlert: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  cost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  items: PurchaseItem[];
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  orderDate: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactName?: string;
  phone: string;
  email: string;
  address?: string;
  outstandingBalance: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  outstandingBalance: number;
  points?: number;
}

export interface POSCartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
  discountPercent?: number;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  date: string;
  status: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID';
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'CREDIT';
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  referenceId?: string;
  journalNumber: string;
  debitedAccount: string;
  creditedAccount: string;
  amount: number;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
}
