import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  Plus, 
  Ruler, 
  Clipboard, 
  DollarSign, 
  Printer, 
  Check, 
  ArrowRight,
  Phone,
  MessageSquare,
  Share2,
  Home,
  AlertCircle
} from 'lucide-react';
import type { LeadSource, OrderStatus } from '../../types';


export const OrdersCRM: React.FC = () => {
  const { t } = useTranslation();
  const { 
    orders, 
    workers, 
    addOrder, 
    assignZamerchik, 
    uploadZamerDetails, 
    upload3DDesign, 
    approveDesign, 
    createSchedule, 
    signContract 
  } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal forms states
  const [showAddLead, setShowAddLead] = useState(false);
  const [leadForm, setLeadForm] = useState({
    customerName: '',
    customerPhone: '',
    source: 'TELEGRAM' as LeadSource,
    totalPrice: 15000000
  });

  // Assign Zamerchik state
  const [zamerForm, setZamerForm] = useState({
    workerId: '',
    scheduledAt: ''
  });

  // Upload Zamer details state
  const [zamerDetailsForm, setZamerDetailsForm] = useState({
    length: 3.5,
    width: 2.5,
    height: 2.7,
    has90DegreeCorners: true,
    hasGasPipes: false,
    hasWaterPipes: true,
    hasElectricalOutlets: true
  });

  // 3D Design URL state
  const [designUrlInput, setDesignUrlInput] = useState('');

  // Schedule dates state
  const [scheduleForm, setScheduleForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Contract form state
  const [contractForm, setContractForm] = useState({
    totalPrice: 15000000,
    advancePayment: 7500000,
    paymentMethod: 'CARD' as 'CASH' | 'CARD' | 'BANK_TRANSFER'
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'YANGI_LID') return o.status === 'YANGI_LID';
    if (filterStatus === 'ZAMER') return ['ZAMER_BELGILANDI', 'ZAMER_BAJARILDI'].includes(o.status);
    if (filterStatus === 'DIZAYN') return ['DIZAYN_LOYYAHALASHDA', 'DIZAYN_TASDIQLANDI'].includes(o.status);
    if (filterStatus === 'TZ_SHARTNOMA') return ['TZ_PLANNER_TUZILDI', 'SHARTNOMA_IMZOLANDI'].includes(o.status);
    if (filterStatus === 'PRODUCTION') return ['PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(o.status);
    return true;
  });

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.customerName || !leadForm.customerPhone) return;

    addOrder({
      customerName: leadForm.customerName,
      customerPhone: leadForm.customerPhone,
      source: leadForm.source,
      totalPrice: Number(leadForm.totalPrice),
      advancePayment: 0
    });


    setLeadForm({ customerName: '', customerPhone: '', source: 'TELEGRAM', totalPrice: 15000000 });
    setShowAddLead(false);
  };

  const handleAssignZamer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !zamerForm.workerId || !zamerForm.scheduledAt) return;
    assignZamerchik(selectedOrderId, zamerForm.workerId, zamerForm.scheduledAt);
  };

  const handleUploadZamer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    uploadZamerDetails(selectedOrderId, zamerDetailsForm);
  };

  const handleUploadDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    const url = designUrlInput || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';
    upload3DDesign(selectedOrderId, url);
    setDesignUrlInput('');
  };

  const handleCreateScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    createSchedule(
      selectedOrderId, 
      new Date(scheduleForm.startDate).toISOString(), 
      new Date(scheduleForm.endDate).toISOString()
    );
  };

  const handleSignContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    const success = signContract(
      selectedOrderId,
      Number(contractForm.totalPrice),
      Number(contractForm.advancePayment),
      contractForm.paymentMethod
    );
    if (!success) {
      alert(t('orders.alert_no_materials'));
    }
  };

  // Helper render status badges
  const getStatusBadge = (status: OrderStatus) => {
    const configs: Record<OrderStatus, { bg: string, label: string }> = {
      YANGI_LID: { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', label: t('orders.new_lead') },
      ZAMER_BELGILANDI: { bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', label: t('orders.status_zamer_assigned') },
      ZAMER_BAJARILDI: { bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400', label: t('orders.status_zamer_done') },
      DIZAYN_LOYYAHALASHDA: { bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400', label: t('orders.status_3d') },
      DIZAYN_TASDIQLANDI: { bg: 'bg-pink-500/10 border-pink-500/20 text-pink-400', label: t('orders.status_design_approved') },
      TZ_PLANNER_TUZILDI: { bg: 'bg-teal-500/10 border-teal-500/20 text-teal-400', label: t('orders.status_tz_done') },
      SHARTNOMA_IMZOLANDI: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', label: t('orders.status_contract_signed') },
      PRODUCTION: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-brand-emerald', label: t('orders.status_production') },
      TAYYOR_OTK: { bg: 'bg-green-500/10 border-green-500/20 text-green-400', label: t('orders.status_ready') },
      YOPILDI_USTANOVKA: { bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400', label: t('orders.status_closed') }
    };
    const c = configs[status] || configs.YANGI_LID;
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.bg}`}>{c.label}</span>;
  };

  const getSourceIcon = (source: LeadSource) => {
    switch (source) {
      case 'TELEGRAM': return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'INSTAGRAM': return <Share2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'PHONE': return <Phone className="w-3.5 h-3.5 text-green-400" />;
      case 'OFFICE': return <Home className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // HTML print contract generator
  const triggerPrintContract = () => {
    if (!selectedOrder) return;
    const printDiv = document.getElementById('print-contract-container');
    if (!printDiv) return;

    const todayStr = new Date().toLocaleDateString('uz-UZ');
    const deadlineStr = selectedOrder.plannedEndAt ? new Date(selectedOrder.plannedEndAt).toLocaleDateString('uz-UZ') : t('orders.agreed_deadline');
    const advancePercent = selectedOrder.totalPrice > 0 ? Math.round((selectedOrder.advancePayment / selectedOrder.totalPrice) * 100) : 30;

    printDiv.innerHTML = `
      <div style="font-family: serif; color: black; background: white; padding: 40px; max-width: 800px; margin: auto;">
        <h2 style="text-align: center; text-transform: uppercase; margin-bottom: 20px;">${t('orders.contract_title')}</h2>
        <p style="text-align: center; font-weight: bold; margin-bottom: 30px;">${t('orders.contract_number')} ${selectedOrder.orderNumber}</p>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <span>${t('orders.city')}</span>
          <span>${t('orders.date')} ${todayStr} ${t('orders.year')}</span>
        </div>

        <p><strong>${t('orders.parties_title')}</strong></p>
        <p>${t('orders.parties_desc', { customerName: selectedOrder.customerName })}</p>

        <p><strong>${t('orders.subject_title')}</strong></p>
        <p>${t('orders.subject_desc1')}</p>
        <p>${t('orders.subject_desc2', { length: selectedOrder.dimensions?.length || 3.0, width: selectedOrder.dimensions?.width || 2.5, height: selectedOrder.dimensions?.height || 2.7 })}</p>

        <p><strong>${t('orders.payment_title')}</strong></p>
        <p>${t('orders.payment_desc1', { totalPrice: selectedOrder.totalPrice.toLocaleString() })}</p>
        <p>${t('orders.payment_desc2', { advancePercent, advancePayment: selectedOrder.advancePayment.toLocaleString() })}</p>
        <p>${t('orders.payment_desc3', { remaining: (selectedOrder.totalPrice - selectedOrder.advancePayment).toLocaleString() })}</p>

        <p><strong>${t('orders.penalty_title')}</strong></p>
        <p>${t('orders.penalty_desc1', { deadline: deadlineStr })}</p>
        <p>${t('orders.penalty_desc2')}</p>

        <p><strong>${t('orders.warranty_title')}</strong></p>
        <p>${t('orders.warranty_desc1')}</p>

        <br/><br/>
        <div style="display: flex; justify-content: space-between; margin-top: 50px;">
          <div style="width: 45%;">
            <p><strong>${t('orders.contractor')}</strong></p>
            <p>${t('orders.company_name')}</p>
            <p>${t('orders.signature')} _____________________</p>
          </div>
          <div style="width: 45%;">
            <p><strong>${t('orders.customer')}</strong></p>
            <p>${selectedOrder.customerName}</p>
            <p>${t('orders.phone_label')} ${selectedOrder.customerPhone}</p>
            <p>${t('orders.signature')} _____________________</p>
          </div>
        </div>
      </div>
    `;

    window.print();
  };

  // Fetch zamerchik list (workers with dailyStatus = WORKSHOP)
  const zamerchiks = workers.filter(w => w.dailyStatus !== 'ABSENT');

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Printable Area */}
      <div id="print-contract-container"></div>

      {/* Sidebar List */}
      <div className="w-80 border-r border-brand-border bg-slate-900/30 flex flex-col h-full">
        {/* Header Search / Filter */}
        <div className="p-4 border-b border-brand-border space-y-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-emerald" /> {t('orders.title')}
            </h1>
            <button 
              onClick={() => setShowAddLead(true)}
              className="p-1.5 bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-brand-emerald"
          >
            <option value="ALL">{t('orders.all_statuses')}</option>
            <option value="YANGI_LID">{t('orders.new_leads')}</option>
            <option value="ZAMER">{t('orders.measurement_stage')}</option>
            <option value="DIZAYN">{t('orders.design_stage')}</option>
            <option value="TZ_SHARTNOMA">{t('orders.tz_contracts')}</option>
            <option value="PRODUCTION">{t('orders.in_production')}</option>
          </select>
        </div>

        {/* Order Scroll list */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 font-medium">
              {t('orders.no_orders')}
            </div>
          ) : (
            filteredOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`p-3 rounded-xl border transition cursor-pointer select-none ${
                  selectedOrderId === order.id 
                    ? 'bg-brand-emerald/10 border-brand-emerald text-slate-100' 
                    : 'bg-brand-surface border-brand-border hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className="font-bold text-xs tracking-wide font-mono text-slate-400">
                    {order.orderNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getSourceIcon(order.source)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <div className="font-extrabold text-sm text-slate-200 mb-1">{order.customerName}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-500" /> {order.customerPhone}
                </div>
                {order.totalPrice > 0 && (
                  <div className="mt-2 text-xs font-black text-brand-emerald flex items-center">
                    <DollarSign className="w-3.5 h-3.5 -ml-0.5" />
                    {order.totalPrice.toLocaleString()} UZS
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main View Details Column */}
      <div className="flex-1 overflow-y-auto bg-brand-dark p-6 space-y-6">
        {selectedOrder ? (
          <>
            {/* Header Order Summary */}
            <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black tracking-widest text-brand-emerald font-mono bg-brand-emerald/10 px-2.5 py-1 rounded-md">
                    {selectedOrder.orderNumber}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <h2 className="text-xl font-black text-slate-100">{selectedOrder.customerName}</h2>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-slate-500" /> {selectedOrder.customerPhone}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 font-bold block mb-1">{t('orders.source')}</span>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-brand-border rounded-xl text-xs font-extrabold text-slate-300">
                  {getSourceIcon(selectedOrder.source)}
                  {selectedOrder.source}
                </div>
              </div>
            </div>

            {/* Steps Visual Tracker */}
            <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('orders.lead_stages')}</h3>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: t('orders.new_lead'), active: true },
                  { label: t('orders.measurement'), active: ['ZAMER_BELGILANDI', 'ZAMER_BAJARILDI', 'DIZAYN_LOYYAHALASHDA', 'DIZAYN_TASDIQLANDI', 'TZ_PLANNER_TUZILDI', 'SHARTNOMA_IMZOLANDI', 'PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(selectedOrder.status) },
                  { label: t('orders.design_3d'), active: ['DIZAYN_LOYYAHALASHDA', 'DIZAYN_TASDIQLANDI', 'TZ_PLANNER_TUZILDI', 'SHARTNOMA_IMZOLANDI', 'PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(selectedOrder.status) },
                  { label: t('orders.tz_planning'), active: ['TZ_PLANNER_TUZILDI', 'SHARTNOMA_IMZOLANDI', 'PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(selectedOrder.status) },
                  { label: t('orders.contract_production'), active: ['SHARTNOMA_IMZOLANDI', 'PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(selectedOrder.status) }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs transition ${
                      step.active 
                        ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                        : 'bg-slate-900 border-brand-border text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] font-extrabold mt-2 text-center ${step.active ? 'text-slate-200' : 'text-slate-500'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Actions Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Action Form Column */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 border-b border-brand-border pb-3">
                  <Clipboard className="w-4 h-4 text-brand-emerald" /> {t('orders.current_stage_actions')}
                </h3>

                {selectedOrder.status === 'YANGI_LID' && (
                  <form onSubmit={handleAssignZamer} className="space-y-4">
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-400 flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {t('orders.assign_zamerchik_hint')}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.select_zamerchik')}</label>
                      <select 
                        value={zamerForm.workerId}
                        onChange={(e) => setZamerForm({ ...zamerForm, workerId: e.target.value })}
                        required
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      >
                        <option value="">{t('orders.select_zamerchik_placeholder')}</option>
                        {zamerchiks.map(w => (
                          <option key={w.id} value={w.id}>{w.fullName} ({w.specialty})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.measurement_date_time')}</label>
                      <input 
                        type="datetime-local"
                        value={zamerForm.scheduledAt}
                        onChange={(e) => setZamerForm({ ...zamerForm, scheduledAt: e.target.value })}
                        required
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {t('orders.assign_zamerchik')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {selectedOrder.status === 'ZAMER_BELGILANDI' && (
                  <form onSubmit={handleUploadZamer} className="space-y-4">
                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-xs text-yellow-400 flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {t('orders.fill_measurement_hint')}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.length_m')}</label>
                        <input 
                          type="number" step="0.1" 
                          value={zamerDetailsForm.length}
                          onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, length: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.width_m')}</label>
                        <input 
                          type="number" step="0.1" 
                          value={zamerDetailsForm.width}
                          onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, width: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.height_m')}</label>
                        <input 
                          type="number" step="0.1" 
                          value={zamerDetailsForm.height}
                          onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, height: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm font-bold text-slate-200 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-brand-border/60 pt-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase block mb-1">{t('orders.room_features')}</label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={zamerDetailsForm.has90DegreeCorners}
                            onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, has90DegreeCorners: e.target.checked })}
                            className="accent-brand-emerald rounded border-slate-700 w-4 h-4 bg-slate-900"
                          />
                          {t('orders.corners_90')}
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={zamerDetailsForm.hasGasPipes}
                            onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, hasGasPipes: e.target.checked })}
                            className="accent-brand-emerald rounded border-slate-700 w-4 h-4 bg-slate-900"
                          />
                          {t('orders.gas_pipes')}
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={zamerDetailsForm.hasWaterPipes}
                            onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, hasWaterPipes: e.target.checked })}
                            className="accent-brand-emerald rounded border-slate-700 w-4 h-4 bg-slate-900"
                          />
                          {t('orders.water_pipes')}
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={zamerDetailsForm.hasElectricalOutlets}
                            onChange={(e) => setZamerDetailsForm({ ...zamerDetailsForm, hasElectricalOutlets: e.target.checked })}
                            className="accent-brand-emerald rounded border-slate-700 w-4 h-4 bg-slate-900"
                          />
                          {t('orders.electrical_outlets')}
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {t('orders.upload_measurement')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {['ZAMER_BAJARILDI', 'DIZAYN_LOYYAHALASHDA'].includes(selectedOrder.status) && (
                  <div className="space-y-4">
                    <form onSubmit={handleUploadDesign} className="space-y-4">
                      <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs text-purple-400 flex gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {t('orders.upload_design_hint')}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.design_link')}</label>
                        <input 
                          type="text" 
                          placeholder="https://image-link.com/render.jpg"
                          value={designUrlInput}
                          onChange={(e) => setDesignUrlInput(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                      >
                        {t('orders.upload_design')}
                      </button>
                    </form>

                    {selectedOrder.status === 'DIZAYN_LOYYAHALASHDA' && selectedOrder.design3dUrl && (
                      <div className="border-t border-brand-border/60 pt-4">
                        <button 
                          onClick={() => approveDesign(selectedOrderId)}
                          className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-sm py-3 rounded-xl transition flex items-center justify-center gap-2"
                        >
                          {t('orders.design_approved')} <Check className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedOrder.status === 'DIZAYN_TASDIQLANDI' && (
                  <form onSubmit={handleCreateScheduleSubmit} className="space-y-4">
                    <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-xl text-xs text-pink-400 flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {t('orders.schedule_hint')}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.production_start')}</label>
                      <input 
                        type="date"
                        value={scheduleForm.startDate}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, startDate: e.target.value })}
                        required
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.deadline')}</label>
                      <input 
                        type="date"
                        value={scheduleForm.endDate}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, endDate: e.target.value })}
                        required
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {t('orders.approve_tz')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {selectedOrder.status === 'TZ_PLANNER_TUZILDI' && (
                  <form onSubmit={handleSignContractSubmit} className="space-y-4">
                    <div className="p-3 bg-teal-500/5 border border-teal-500/10 rounded-xl text-xs text-teal-400 flex gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {t('orders.contract_hint')}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.total_sum')}</label>
                      <input 
                        type="number"
                        value={contractForm.totalPrice}
                        onChange={(e) => setContractForm({ ...contractForm, totalPrice: Number(e.target.value) })}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2 text-sm font-bold text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.advance_sum')}</label>
                      <input 
                        type="number"
                        value={contractForm.advancePayment}
                        onChange={(e) => setContractForm({ ...contractForm, advancePayment: Number(e.target.value) })}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2 text-sm font-bold text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.payment_type')}</label>
                      <select 
                        value={contractForm.paymentMethod}
                        onChange={(e) => setContractForm({ ...contractForm, paymentMethod: e.target.value as any })}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none"
                      >
                        <option value="CARD">{t('orders.card')}</option>
                        <option value="CASH">{t('orders.cash')}</option>
                        <option value="BANK_TRANSFER">{t('orders.bank_transfer')}</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={triggerPrintContract}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 border border-brand-border"
                      >
                        <Printer className="w-4 h-4" /> {t('orders.print_contract')}
                      </button>
                      <button 
                        type="submit"
                        className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        {t('orders.sign_accept')}
                      </button>
                    </div>
                  </form>
                )}

                {['PRODUCTION', 'TAYYOR_OTK', 'YOPILDI_USTANOVKA'].includes(selectedOrder.status) && (
                  <div className="p-4 bg-slate-900 border border-brand-border rounded-xl text-center space-y-3">
                    <Check className="w-10 h-10 text-brand-emerald mx-auto bg-brand-emerald/10 p-2 rounded-full" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{t('orders.contract_signed')}</h4>
                      <p className="text-xs text-slate-500 mt-1">{t('orders.production_process')}</p>
                    </div>
                    {selectedOrder.totalPrice > 0 && (
                      <div className="p-3 bg-brand-dark/40 rounded-lg text-xs font-mono text-left space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('orders.total_price')}</span>
                          <span className="text-slate-300 font-black">{selectedOrder.totalPrice.toLocaleString()} UZS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('orders.paid_advance')}</span>
                          <span className="text-brand-emerald font-black">{selectedOrder.advancePayment.toLocaleString()} UZS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('orders.remaining_payment')}</span>
                          <span className="text-yellow-400 font-black">{(selectedOrder.totalPrice - selectedOrder.advancePayment).toLocaleString()} UZS</span>
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={triggerPrintContract}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" /> {t('orders.reprint_contract')}
                    </button>
                  </div>
                )}

              </div>

              {/* Data / Visual Information Column */}
              <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl space-y-5">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 border-b border-brand-border pb-3">
                  <Ruler className="w-4 h-4 text-brand-emerald" /> {t('orders.project_drawings')}
                </h3>

                {selectedOrder.dimensions ? (
                  <div className="space-y-4">
                    {/* Dimension Badges */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900 border border-brand-border p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">{t('orders.length')}</span>
                        <span className="text-sm font-black text-slate-200">{selectedOrder.dimensions.length} {t('orders.meter')}</span>
                      </div>
                      <div className="bg-slate-900 border border-brand-border p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">{t('orders.width')}</span>
                        <span className="text-sm font-black text-slate-200">{selectedOrder.dimensions.width} {t('orders.meter')}</span>
                      </div>
                      <div className="bg-slate-900 border border-brand-border p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase mb-0.5">{t('orders.height')}</span>
                        <span className="text-sm font-black text-slate-200">{selectedOrder.dimensions.height} {t('orders.meter')}</span>
                      </div>
                    </div>

                    {/* Room Attributes */}
                    <div className="p-3.5 bg-slate-900 border border-brand-border rounded-xl space-y-2 text-xs font-semibold text-slate-400">
                      <div className="flex justify-between">
                        <span>{t('orders.corners_angle')}</span>
                        <span className={selectedOrder.dimensions.has90DegreeCorners ? 'text-brand-emerald' : 'text-rose-500'}>
                          {selectedOrder.dimensions.has90DegreeCorners ? t('orders.straight') : t('orders.uneven')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('orders.gas_pipes_label')}</span>
                        <span className={selectedOrder.dimensions.hasGasPipes ? 'text-yellow-400' : 'text-slate-500'}>
                          {selectedOrder.dimensions.hasGasPipes ? t('orders.present_warn') : t('orders.absent')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('orders.water_pipes_label')}</span>
                        <span className={selectedOrder.dimensions.hasWaterPipes ? 'text-brand-emerald' : 'text-slate-500'}>
                          {selectedOrder.dimensions.hasWaterPipes ? t('orders.present') : t('orders.absent')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('orders.outlets_label')}</span>
                        <span className={selectedOrder.dimensions.hasElectricalOutlets ? 'text-brand-emerald' : 'text-slate-500'}>
                          {selectedOrder.dimensions.hasElectricalOutlets ? t('orders.present') : t('orders.absent')}
                        </span>
                      </div>
                    </div>

                    {/* 3D Design Render */}
                    {selectedOrder.design3dUrl ? (
                      <div className="space-y-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase block">{t('orders.approved_model')}</span>
                        <div className="relative rounded-xl overflow-hidden border border-brand-border bg-slate-950 aspect-video">
                          <img 
                            src={selectedOrder.design3dUrl} 
                            alt={t('orders.render_alt')} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 border border-dashed border-brand-border rounded-xl text-center text-xs text-slate-500 font-bold">
                        {t('orders.no_model')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-brand-border rounded-xl text-center text-xs text-slate-500 font-bold">
                    {t('orders.no_measurements')}
                  </div>
                )}
              </div>

            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold text-sm">
            {t('orders.no_order_selected')}
          </div>
        )}
      </div>

      {/* Add Lead Dialog Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-slate-900/50">
              <h2 className="text-base font-black text-slate-100">{t('orders.add_lead')}</h2>
              <button 
                onClick={() => setShowAddLead(false)}
                className="text-slate-500 hover:text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.full_name')}</label>
                <input 
                  type="text"
                  placeholder={t('orders.name_placeholder')}
                  required
                  value={leadForm.customerName}
                  onChange={(e) => setLeadForm({ ...leadForm, customerName: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.phone')}</label>
                <input 
                  type="text"
                  placeholder="+998 90 123 45 67"
                  required
                  value={leadForm.customerPhone}
                  onChange={(e) => setLeadForm({ ...leadForm, customerPhone: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.source_label')}</label>
                  <select 
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value as any })}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none"
                  >
                    <option value="TELEGRAM">{t('orders.telegram')}</option>
                    <option value="INSTAGRAM">{t('orders.instagram')}</option>
                    <option value="PHONE">{t('orders.phone_call')}</option>
                    <option value="OFFICE">{t('orders.office_visit')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">{t('orders.expected_sum')}</label>
                  <input 
                    type="number"
                    value={leadForm.totalPrice}
                    onChange={(e) => setLeadForm({ ...leadForm, totalPrice: Number(e.target.value) })}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-sm font-bold text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddLead(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl border border-brand-border transition"
                >
                  {t('orders.cancel')}
                </button>
                <button 
                  type="submit"
                  className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark text-xs font-black px-5 py-2 rounded-xl transition"
                >
                  {t('orders.create_lead')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
