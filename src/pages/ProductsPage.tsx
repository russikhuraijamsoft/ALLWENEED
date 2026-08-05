/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useERPStore } from '../store/erpStore';
import { useForm } from 'react-hook-form';
import {
  Tag,
  Plus,
  Package,
  Layers,
  FolderPlus,
  Coins,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ProductFormType {
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

export default function ProductsPage() {
  const {
    products,
    categories,
    brands,
    addProduct,
    updateProduct,
    addCategory,
    addBrand
  } = useERPStore();

  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'CATEGORIES' | 'BRANDS'>('PRODUCTS');
  const [searchQuery, setSearchQuery] = useState('');

  // Category State forms
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Brand State forms
  const [newBrdName, setNewBrdName] = useState('');
  const [newBrdDesc, setNewBrdDesc] = useState('');

  // React Hook Form for Product Creation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormType>({
    defaultValues: {
      sku: '',
      barcode: '',
      name: '',
      description: '',
      categoryId: categories[0]?.id || '',
      brandId: brands[0]?.id || '',
      price: 0,
      cost: 0,
      unit: 'UNIT',
      status: 'ACTIVE'
    }
  });

  const handleProductSubmit = (data: ProductFormType) => {
    addProduct(data);
    reset();
  };

  const handleCategoryAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) return;
    addCategory({ name: newCatName, code: newCatCode, description: newCatDesc });
    setNewCatName('');
    setNewCatCode('');
    setNewCatDesc('');
  };

  const handleBrandAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrdName) return;
    addBrand({ name: newBrdName, description: newBrdDesc });
    setNewBrdName('');
    setNewBrdDesc('');
  };

  // Filter products based on search
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q));
  });

  return (
    <div className="space-y-6" id="products-catalog-container">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Master Materials & Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain catalogs, product specifications, unit measures, groupings, and pricing tiers.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          <button
            id="tab-products-btn"
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PRODUCTS' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Products
          </button>
          <button
            id="tab-categories-btn"
            onClick={() => setActiveTab('CATEGORIES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CATEGORIES' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Categories
          </button>
          <button
            id="tab-brands-btn"
            onClick={() => setActiveTab('BRANDS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'BRANDS' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Brands
          </button>
        </div>
      </div>

      {activeTab === 'PRODUCTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* New Product Insertion Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24 self-start">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Plus className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Define Master Product</h3>
            </div>

            <form onSubmit={handleSubmit(handleProductSubmit)} className="space-y-4 text-xs font-sans" id="product-input-form">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Basmati Rice Gold"
                  {...register('name', { required: 'Product name is required' })}
                />
                {errors.name && <span className="text-red-500 mt-1 block font-mono">{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">SKU identifier</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="GRS-RICE-5KG"
                    {...register('sku', { required: 'SKU is required' })}
                  />
                  {errors.sku && <span className="text-red-500 mt-1 block font-mono">{errors.sku.message}</span>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Barcode (EAN)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="890123456"
                    {...register('barcode')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Taxable Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="Cost price"
                    {...register('cost', { required: 'Cost is required', min: { value: 0.1, message: 'Cost must be greater than zero' } })}
                  />
                  {errors.cost && <span className="text-red-500 mt-1 block font-mono">{errors.cost.message}</span>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Retail Selling price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                    placeholder="POS Selling Price"
                    {...register('price', { required: 'Price is required', min: { value: 1, message: 'Price must be greater than zero' } })}
                  />
                  {errors.price && <span className="text-red-500 mt-1 block font-mono">{errors.price.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category Class</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[36px]"
                    {...register('categoryId')}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Brand Maker</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[36px]"
                    {...register('brandId')}
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Unit Measure</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[36px]"
                    {...register('unit')}
                  >
                    <option value="UNIT">UNIT / PCS</option>
                    <option value="BAG">BAG / SACK</option>
                    <option value="JAR">JAR / CAN</option>
                    <option value="BOX">BOX / CRATE</option>
                    <option value="KG">KILOGRAM</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Catalog Status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 h-[36px]"
                    {...register('status')}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Specification Details</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Notes, size guidelines, nutrient weight description..."
                  {...register('description')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer text-center min-h-[40px]"
              >
                Add Master Product
              </button>
            </form>
          </div>

          {/* Product list representation */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Search filtering */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent outline-none text-xs text-slate-800 placeholder-slate-400"
                placeholder="Lookup product by name, SKU ID, or barcode reader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* List Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">SKU / BARCODE</th>
                      <th className="py-3 px-4">PRODUCT NAME</th>
                      <th className="py-3 px-4">CATEGORY CODE</th>
                      <th className="py-3 px-4">ACQUISITION COST</th>
                      <th className="py-3 px-4">PRICE TIER (MRP)</th>
                      <th className="py-3 px-4">UNIT</th>
                      <th className="py-3 px-4 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 font-sans">
                          No product registries match your filtering criteria. Define one to populate the columns.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const cat = categories.find((c) => c.id === p.categoryId);
                        return (
                          <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 leading-tight">
                              <div>{p.sku}</div>
                              <span className="text-[10px] text-slate-400 font-normal">UPC: {p.barcode || 'N/A'}</span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800 font-sans max-w-xs truncate">{p.name}</td>
                            <td className="py-3.5 px-4 font-mono">
                              <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                                {cat?.code || 'GEN'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-900 font-medium">₹{p.cost.toFixed(2)}</td>
                            <td className="py-3.5 px-4 font-mono text-indigo-700 font-bold">₹{p.price.toFixed(2)}</td>
                            <td className="py-3.5 px-4">
                              <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100/50 rounded px-1.5 py-0.5">
                                {p.unit}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                              }`}>
                                <CheckCircle className="w-3 h-3" />
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Categories configuration panel */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleCategoryAdd} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4 text-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <FolderPlus className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Define Classification Category</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Packed Beverages"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ERP Standard Code (3 Letters)</label>
              <input
                type="text"
                required
                maxLength={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 font-mono uppercase"
                placeholder="BEV"
                value={newCatCode}
                onChange={(e) => setNewCatCode(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category Description</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                placeholder="General description outlines..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer min-h-[40px]"
            >
              Add Category Group
            </button>
          </form>

          {/* List display */}
          <div className="bg-white border border-slate-200 rounded-2xl md:col-span-2 overflow-hidden text-xs">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">CODE</th>
                  <th className="py-3 px-4">CATEGORY NAME</th>
                  <th className="py-3 px-4">REMARKS & DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/20 text-slate-800">
                    <td className="py-3 px-4 font-mono font-black text-indigo-600">{c.code}</td>
                    <td className="py-3 px-4 font-semibold">{c.name}</td>
                    <td className="py-3 px-4 text-slate-500">{c.description || 'No notes added.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Brands Panel */}
      {activeTab === 'BRANDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleBrandAdd} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-4 text-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <FolderPlus className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">Define Brand Manufacturer</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brand / Maker Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Britannia Foods"
                value={newBrdName}
                onChange={(e) => setNewBrdName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brand Remarks</label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
                placeholder="B2B contacts or remarks list..."
                value={newBrdDesc}
                onChange={(e) => setNewBrdDesc(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer min-h-[40px]"
            >
              Add Brand Maker
            </button>
          </form>

          {/* Brands list */}
          <div className="bg-white border border-slate-200 rounded-2xl md:col-span-2 overflow-hidden text-xs">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">BRAND MASTER ID</th>
                  <th className="py-3 px-4">NAME / CORPORATE BRAND</th>
                  <th className="py-3 px-4">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/20 text-slate-800">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{b.id}</td>
                    <td className="py-3 px-4 font-semibold">{b.name}</td>
                    <td className="py-3 px-4 text-slate-500">{b.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
