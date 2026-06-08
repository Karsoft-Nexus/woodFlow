import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import type { FinancialTransaction } from '../../types';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';

export const FinanceLedger: React.FC = () => {
  const { t } = useTranslation();
  const { financeTransactions, addFinancialTransaction, orders, fetchInitialData, isLoading } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState<FinancialTransaction['category']>('CLIENT_PAYMENT');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'BANK_TRANSFER'>('CASH');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Calculate totals
  const totalIncome = financeTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = financeTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    await addFinancialTransaction({
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
      case 'CLIENT_PAYMENT': return t('finance.cat_client_payment');
      case 'INVENTORY_PURCHASE': return t('finance.cat_inventory_purchase');
      case 'WORKER_PAYOUT': return t('finance.cat_worker_payout');
      case 'TAX': return t('finance.cat_tax');
      default: return t('finance.cat_other');
    }
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-gradient-to-br from-brand-dark via-[#0c1220] to-brand-dark">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
            {t('finance.title')}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">{t('finance.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="flex items-center justify-center gap-2 bg-brand-emerald hover:bg-emerald-400 hover:scale-[1.02] text-brand-dark font-extrabold px-5 py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md shadow-brand-emerald/10 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('finance.btn_new_tx')}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
          <span className="text-sm font-semibold text-slate-400">{t('finance.loading')}</span>
        </div>
      ) : (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 rounded-xl p-5 flex items-center justify-between shadow-lg hover:border-brand-emerald/30 transition-all duration-300 group">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{t('finance.balance_label')}</span>
                <h3 className="text-2xl font-extrabold text-brand-emerald mt-1 group-hover:scale-105 transition-transform duration-350 origin-left">{netBalance.toLocaleString()} UZS</h3>
              </div>
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-lg group-hover:bg-brand-emerald/20 transition-colors duration-300">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 rounded-xl p-5 flex items-center justify-between shadow-lg hover:border-blue-500/30 transition-all duration-300 group">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{t('finance.income_label')}</span>
                <h3 className="text-2xl font-extrabold text-slate-200 mt-1">{totalIncome.toLocaleString()} UZS</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-455 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 rounded-xl p-5 flex items-center justify-between shadow-lg hover:border-rose-500/30 transition-all duration-300 group">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{t('finance.expense_label')}</span>
                <h3 className="text-2xl font-extrabold text-slate-200 mt-1">{totalExpense.toLocaleString()} UZS</h3>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-455 rounded-lg group-hover:bg-rose-500/20 transition-colors duration-300">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Transaction History Table */}
            <div className={`bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl transition-all duration-300 ${isAddOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-emerald" />
                {t('finance.table_title')}
              </h2>

              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-brand-border/60 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">{t('finance.col_type')}</th>
                      <th className="pb-3 font-semibold">{t('finance.col_category_note')}</th>
                      <th className="pb-3 font-semibold">{t('finance.col_payment_type')}</th>
                      <th className="pb-3 font-semibold">{t('finance.col_date')}</th>
                      <th className="pb-3 font-semibold text-right">{t('finance.col_amount')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40 text-xs">
                    {financeTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                          {t('finance.no_transactions')}
                        </td>
                      </tr>
                    ) : (
                      financeTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-brand-dark/20 transition-colors duration-200">
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border ${
                              tx.type === 'INCOME' 
                                ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-455'
                            }`}>
                              {tx.type === 'INCOME' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {tx.type === 'INCOME' ? t('finance.type_income') : t('finance.type_expense')}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="font-bold text-slate-200">{getCategoryLabel(tx.category)}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 font-medium leading-relaxed max-w-xs truncate" title={tx.description}>
                              {tx.description}
                            </div>
                          </td>
                          <td className="py-4 text-slate-400 font-bold font-mono text-[10px]">{tx.paymentMethod}</td>
                          <td className="py-4 text-slate-500 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-655" />
                              <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className={`py-4 text-right font-extrabold font-mono text-xs ${tx.type === 'INCOME' ? 'text-brand-emerald' : 'text-rose-455'}`}>
                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString()} UZS
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Transaction Dialog/Form */}
            <div className={`bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl ${isAddOpen ? 'block' : 'hidden'}`}>
              <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-emerald" />
                {t('finance.form_title')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">{t('finance.form_type')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setType('INCOME'); setCategory('CLIENT_PAYMENT'); }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        type === 'INCOME' 
                          ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald shadow-inner' 
                          : 'bg-brand-dark/60 border-brand-border text-slate-450 hover:text-slate-350'
                      }`}
                    >
                      {t('finance.btn_income')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setType('EXPENSE'); setCategory('INVENTORY_PURCHASE'); }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        type === 'EXPENSE' 
                          ? 'bg-rose-500/10 border-rose-500 text-rose-455 shadow-inner' 
                          : 'bg-brand-dark/60 border-brand-border text-slate-450 hover:text-slate-350'
                      }`}
                    >
                      {t('finance.btn_expense')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{t('finance.form_category')}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FinancialTransaction['category'])}
                    className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                  >
                    {type === 'INCOME' ? (
                      <>
                        <option value="CLIENT_PAYMENT">{t('finance.opt_client_payment')}</option>
                        <option value="OTHER">{t('finance.opt_other_income')}</option>
                      </>
                    ) : (
                      <>
                        <option value="INVENTORY_PURCHASE">{t('finance.opt_inventory_purchase')}</option>
                        <option value="WORKER_PAYOUT">{t('finance.opt_worker_payout')}</option>
                        <option value="TAX">{t('finance.opt_tax')}</option>
                        <option value="OTHER">{t('finance.opt_other_expense')}</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{t('finance.form_payment_method')}</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                  >
                    <option value="CASH">{t('finance.opt_cash')}</option>
                    <option value="CARD">{t('finance.opt_card')}</option>
                    <option value="BANK_TRANSFER">{t('finance.opt_bank')}</option>
                  </select>
                </div>

                {type === 'INCOME' && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{t('finance.form_order')}</label>
                    <select
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                    >
                      <option value="">{t('finance.opt_select_order')}</option>
                      {orders.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.orderNumber} - {o.customerName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{t('finance.form_amount')}</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t('finance.form_amount_placeholder')}
                    className="w-full bg-brand-dark border border-brand-border text-slate-250 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald font-semibold shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">{t('finance.form_description')}</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('finance.form_description_placeholder')}
                    rows={3}
                    className="w-full bg-brand-dark border border-brand-border text-slate-250 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald shadow-sm leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer text-xs tracking-wider uppercase shadow-md shadow-brand-emerald/10"
                >
                  {t('finance.btn_save')}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
