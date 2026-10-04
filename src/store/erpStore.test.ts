import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useERPStore } from './erpStore';

const store = () => useERPStore.getState();
const product = (id: string) => store().products.find((p) => p.id === id)!;
const stockOf = (productId: string) => store().inventory.find((i) => i.productId === productId)?.quantity;
const balanceOf = (code: string) => store().accounts.find((a) => a.code === code)!.balance;
const customer = (id: string) => store().customers.find((c) => c.id === id)!;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-15T10:00:00Z'));
  useERPStore.setState(useERPStore.getInitialState(), true);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('POS cart', () => {
  it('merges repeated adds, removes on zero qty, and resets on clear', () => {
    store().addToCart(product('prod-1'));
    store().addToCart(product('prod-1'), 2);
    store().addToCart(product('prod-3'));
    expect(store().cart.map((i) => [i.product.id, i.quantity])).toEqual([
      ['prod-1', 3],
      ['prod-3', 1],
    ]);

    store().updateCartQty('prod-3', 0);
    expect(store().cart.map((i) => i.product.id)).toEqual(['prod-1']);

    useERPStore.setState({ selectedCustomerId: 'cust-2', posPaymentMethod: 'UPI' });
    store().clearCart();
    expect(store().cart).toEqual([]);
    expect(store().selectedCustomerId).toBe('cust-1');
    expect(store().posPaymentMethod).toBe('CASH');
  });
});

describe('checkoutPOS', () => {
  it('returns null and changes nothing when the cart is empty', () => {
    const before = useERPStore.getState();
    expect(store().checkoutPOS()).toBeNull();
    expect(store().invoices).toBe(before.invoices);
    expect(store().ledger).toBe(before.ledger);
  });

  it('creates a paid invoice, deducts stock, and posts sale + COGS entries for a cash sale', () => {
    store().addToCart(product('prod-1'), 2); // 2 x 450, cost 380
    store().addToCart(product('prod-3'), 5); // 5 x 40, cost 31

    expect(store().checkoutPOS()).toBe('INV-2026-0001');

    const [invoice] = store().invoices;
    expect(invoice).toMatchObject({
      invoiceNumber: 'INV-2026-0001',
      customerId: 'cust-1',
      subtotal: 1100,
      taxAmount: 198,
      discountAmount: 0,
      totalAmount: 1298,
      status: 'PAID',
      paymentMethod: 'CASH',
      date: '2026-07-15',
    });

    expect(stockOf('prod-1')).toBe(43);
    expect(stockOf('prod-3')).toBe(115);

    const [saleEntry, cogsEntry] = store().ledger;
    expect(saleEntry).toMatchObject({ debitedAccount: '1010', creditedAccount: '4150', amount: 1298, journalNumber: 'JV-S0002' });
    expect(cogsEntry).toMatchObject({ debitedAccount: '5100', creditedAccount: '1400', amount: 915, journalNumber: 'JV-S0002' });

    expect(balanceOf('1010')).toBe(15000 + 1298);
    expect(balanceOf('4150')).toBe(1298);
    expect(balanceOf('5100')).toBe(915);
    expect(balanceOf('1400')).toBe(3500 - 915);

    expect(customer('cust-1').points).toBe(15 + 12);
    expect(store().cart).toEqual([]);
  });

  it('books a credit sale to receivables and the customer balance', () => {
    useERPStore.setState({ selectedCustomerId: 'cust-2', posPaymentMethod: 'CREDIT' });
    store().addToCart(product('prod-2')); // 620, tax 112

    store().checkoutPOS();

    expect(store().invoices[0]).toMatchObject({ customerId: 'cust-2', totalAmount: 732, status: 'UNPAID', paymentMethod: 'CREDIT' });
    expect(store().ledger[0]).toMatchObject({ debitedAccount: '1200', creditedAccount: '4150', amount: 732 });
    expect(balanceOf('1200')).toBe(1200 + 732);
    expect(balanceOf('1010')).toBe(15000);
    expect(customer('cust-2')).toMatchObject({ outstandingBalance: 450 + 732, points: 145 + 7 });
    expect(store().selectedCustomerId).toBe('cust-1');
    expect(store().posPaymentMethod).toBe('CASH');
  });

  it.each(['CARD', 'UPI'] as const)('debits the bank account for %s payments', (method) => {
    useERPStore.setState({ posPaymentMethod: method });
    store().addToCart(product('prod-3')); // 40, tax 7

    store().checkoutPOS();

    expect(store().ledger[0]).toMatchObject({ debitedAccount: '1020', amount: 47 });
    expect(balanceOf('1020')).toBe(125000 + 47);
    expect(balanceOf('1010')).toBe(15000);
  });

  it('numbers invoices sequentially and never drives stock negative', () => {
    store().addToCart(product('prod-2'), 20); // only 18 in stock
    expect(store().checkoutPOS()).toBe('INV-2026-0001');
    expect(stockOf('prod-2')).toBe(0);

    store().addToCart(product('prod-3'));
    expect(store().checkoutPOS()).toBe('INV-2026-0002');
  });
});

describe('purchase orders', () => {
  const createOrderedPO = () => {
    store().addPurchaseOrder({
      supplierId: 'sup-2',
      items: [
        { productId: 'prod-2', quantity: 10, cost: 510 },
        { productId: 'prod-new', quantity: 3, cost: 100 },
      ],
      status: 'ORDERED',
      orderDate: '2026-07-14',
    });
    return store().purchaseOrders[0];
  };

  it('computes the PO number and total when adding a purchase order', () => {
    const po = createOrderedPO();
    expect(po).toMatchObject({ poNumber: 'PO-2026-0002', totalAmount: 5400, status: 'ORDERED' });
  });

  it('receiving a PO adds stock, posts inventory/payable entries, and updates the supplier balance', () => {
    const po = createOrderedPO();

    store().receivePurchaseOrder(po.id);

    expect(store().purchaseOrders.find((p) => p.id === po.id)).toMatchObject({ status: 'RECEIVED', receivedDate: '2026-07-15' });
    expect(stockOf('prod-2')).toBe(18 + 10);
    expect(stockOf('prod-new')).toBe(3);

    expect(store().ledger[0]).toMatchObject({ debitedAccount: '1400', creditedAccount: '2100', amount: 5400, journalNumber: 'JV-P0002' });
    expect(balanceOf('1400')).toBe(3500 + 5400);
    expect(balanceOf('2100')).toBe(5400);
    expect(store().suppliers.find((s) => s.id === 'sup-2')!.outstandingBalance).toBe(5400);
  });

  it('ignores already-received and unknown POs', () => {
    const po = createOrderedPO();
    store().receivePurchaseOrder(po.id);
    const afterFirst = useERPStore.getState();

    store().receivePurchaseOrder(po.id);
    store().receivePurchaseOrder('po-missing');

    expect(store().inventory).toBe(afterFirst.inventory);
    expect(store().ledger).toBe(afterFirst.ledger);
    expect(store().accounts).toBe(afterFirst.accounts);
  });
});
