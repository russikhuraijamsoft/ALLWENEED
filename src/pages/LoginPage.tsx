/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { useERPStore } from '../store/erpStore';
import { useNavigate } from 'react-router-dom';
import { Store, ShieldAlert, KeyRound, CornerRightDown } from 'lucide-react';

interface LoginSchemaType {
  email: string;
  password: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'ACCOUNTANT';
}

export default function LoginPage() {
  const login = useERPStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchemaType>({
    defaultValues: {
      email: 'admin@allweneed.com',
      password: 'password123',
      role: 'ADMIN'
    }
  });

  const onSubmit = (data: LoginSchemaType) => {
    // Authenticate and swap route
    const success = login(data.email, data.role);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleShortcutSelect = (email: string, role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'ACCOUNTANT') => {
    setValue('email', email);
    setValue('role', role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden" id="erp-login-container">
      {/* Dynamic graphic ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full filter blur-[120px]"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-500/20 shadow-xl border border-indigo-400">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider font-sans">
              All We Need
            </h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest leading-none mt-1">
              Enterprise Resource Planning Shell
            </p>
          </div>
        </div>

        {/* Login Credentials Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Portal Security Verification</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="login-form">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
                Work Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                placeholder="you@allweneed.com"
                {...register('email', { required: 'Please enter a valid business email address.' })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
                Master Security Password
              </label>
              <input
                id="login-password"
                type="password"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                placeholder="••••••••••••"
                {...register('password', { required: 'Passwords must contain at least 5 alphanumeric characters.', minLength: { value: 5, message: 'Password must be at least 5 characters long.' } })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role dropdown Selector */}
            <div className="space-y-1.5">
              <label htmlFor="login-role" className="text-xs font-bold text-slate-400 tracking-wider uppercase block">
                Assigned Staff Role
              </label>
              <select
                id="login-role"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer h-[44px]"
                {...register('role', { required: 'Please select an authorized user role.' })}
              >
                <option value="ADMIN">ADMINISTRATOR (Full Rights)</option>
                <option value="MANAGER">MANAGER (Inventory & Stock)</option>
                <option value="CASHIER">CASHIER (POS Billing Entry)</option>
                <option value="ACCOUNTANT">ACCOUNTANT (Accounting Ledger)</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-98 disabled:opacity-50 cursor-pointer text-center min-h-[44px]"
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In To ERP Terminal'}
            </button>
          </form>

          {/* Quick Simulation credentials */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-1">
              <CornerRightDown className="w-3.5 h-3.5 text-indigo-500" />
              Quick Sandbox Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleShortcutSelect('cashier@allweneed.com', 'CASHIER')}
                className="text-left bg-slate-950/70 hover:bg-indigo-950 border border-slate-850 hover:border-indigo-850 p-2 rounded-lg text-slate-400 hover:text-indigo-200 transition-all cursor-pointer"
              >
                <p className="font-semibold font-sans text-slate-200">Cashier Terminal</p>
                <p className="font-mono text-[10px]">cashier@allweneed.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleShortcutSelect('accountant@allweneed.com', 'ACCOUNTANT')}
                className="text-left bg-slate-950/70 hover:bg-slate-850 border border-slate-850 p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <p className="font-semibold font-sans text-slate-200">Accountant Desk</p>
                <p className="font-mono text-[10px]">account@allweneed.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info text */}
        <p className="text-center text-xs text-slate-600">
          All We Need Store ERP System • Secure Sandbox Connection active.
        </p>

      </div>
    </div>
  );
}
