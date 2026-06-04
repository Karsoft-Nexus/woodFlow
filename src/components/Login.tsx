import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, Phone, KeyRound, AlertTriangle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isLoading, error } = useStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    
    // Clean phone number format if needed or send directly
    await login(phone, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-brand-dark px-4 overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Glassmorphic Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_40px_0_rgba(99,102,241,0.1)]">
          {/* Card Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>

          {/* Header */}
          <div className="text-center mb-8 mt-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 animate-bounce">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tizimga kirish</h1>
            <p className="text-sm text-gray-400 mt-2 font-medium">woodFlow CRM & Production portal</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-shake">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Xatolik yuz berdi</p>
                <p className="text-rose-400/80 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Telefon raqam</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-200">
                  <Phone size={18} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Parol</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-200">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Kutilmoqda...
                </>
              ) : (
                'Tizimga kirish'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
