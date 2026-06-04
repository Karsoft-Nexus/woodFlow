import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { FinancialTransaction } from '../../types';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  Calendar
} from 'lucide-react';

export const FinanceLedger: React.FC = () => {
  const { financeTransactions, addFinancialTransaction, orders } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState<FinancialTransaction['category']>('CLIENT_PAYMENT');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'BANK_TRANSFER'>('CASH');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');

  // Calculate totals
  const totalIncome = financeTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = financeTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    addFinancialTransaction({
      type,
      category,
      amount: Number(amount),
      paymentMethod,
      description,
      orderId: orderId || undefined
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setOrderId('');
    setIsAddOpen(false);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'CLIENT_PAYMENT': return 'Mijoz to\'lovi';
      case 'INVENTORY_PURCHASE': return 'Ombor xaridi';
      case 'WORKER_PAYOUT': return 'Ustalar ish haqi';
      case 'TAX': return 'Soliq';
      default: return 'Boshqa xarajat';
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Kassa va Moliya</h1>
          <p className="text-slate-400 mt-1">Lokal moliyaviy kirim-chiqimlar jurnali, balans va xarajatlar tahlili</p>
        </div>
        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="flex items-center gap-2 bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold px-4 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi Tranzaksiya</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kassa Qoldig'i (Balans)</span>
            <h3 className="text-2xl font-extrabold text-brand-emerald mt-1">{netBalance.toLocaleString()} UZS</h3>
          </div>
          <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Jami Kirimlar</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{totalIncome.toLocaleString()} UZS</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Jami Chiqimlar</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{totalExpense.toLocaleString()} UZS</h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Transaction History Table */}
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-emerald" />
            Tranzaksiyalar Tarixi
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Turi</th>
                  <th className="pb-3 font-semibold">Kategoriya / Izoh</th>
                  <th className="pb-3 font-semibold">To'lov Turi</th>
                  <th className="pb-3 font-semibold">Sana</th>
                  <th className="pb-3 font-semibold text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-sm">
                {financeTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-brand-dark/25 transition-colors">
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${tx.type === 'INCOME' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-rose-500/10 text-rose-400'}`}>
                        {tx.type === 'INCOME' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {tx.type === 'INCOME' ? 'Kirim' : 'Chiqim'}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200">{getCategoryLabel(tx.category)}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tx.description}</div>
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-xs">{tx.paymentMethod}</td>
                    <td className="py-3.5 text-slate-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className={`py-3.5 text-right font-bold font-mono ${tx.type === 'INCOME' ? 'text-brand-emerald' : 'text-rose-400'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString()} UZS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Transaction Dialog/Form */}
        <div className={`bg-brand-surface border border-brand-border rounded-xl p-6 ${isAddOpen ? 'block' : 'hidden lg:block'}`}>
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-emerald" />
            Yangi Tranzaksiya Qo'shish
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Turi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setType('INCOME'); setCategory('CLIENT_PAYMENT'); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${type === 'INCOME' ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' : 'bg-brand-dark border-brand-border text-slate-400'}`}
                >
                  KIRIM (Income)
                </button>
                <button
                  type="button"
                  onClick={() => { setType('EXPENSE'); setCategory('INVENTORY_PURCHASE'); }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border cursor-pointer transition-colors ${type === 'EXPENSE' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-brand-dark border-brand-border text-slate-400'}`}
                >
                  CHIQIM (Expense)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FinancialTransaction['category'])}
                className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
              >
                {type === 'INCOME' ? (
                  <>
                    <option value="CLIENT_PAYMENT">Mijoz to'lovi (Client Payment)</option>
                    <option value="OTHER">Boshqa kirimlar</option>
                  </>
                ) : (
                  <>
                    <option value="INVENTORY_PURCHASE">Ombor xaridi (Inventory Purchase)</option>
                    <option value="WORKER_PAYOUT">Ustalar ish haqi (Salary)</option>
                    <option value="TAX">Soliqlar (Taxes)</option>
                    <option value="OTHER">Boshqa xarajatlar</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">To'lov Usuli</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
              >
                <option value="CASH">Naqd (CASH)</option>
                <option value="CARD">Karta (CARD)</option>
                <option value="BANK_TRANSFER">Hisob-raqam (BANK TRANSFER)</option>
              </select>
            </div>

            {type === 'INCOME' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Buyurtma (ixtiyoriy)</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                >
                  <option value="">Buyurtmani tanlash...</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Summa (UZS)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Masalan: 5000000"
                className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Tavsif (Description)</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tranzaksiya tafsilotlarini yozing..."
                rows={3}
                className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold py-2.5 rounded-lg transition-colors cursor-pointer text-xs tracking-wider uppercase"
            >
              Saqlash
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
