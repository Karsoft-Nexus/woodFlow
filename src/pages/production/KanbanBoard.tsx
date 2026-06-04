import React from 'react';
import { useStore } from '../../store/useStore';
import type { OrderStatus, Order } from '../../types';
import { 
  MessageSquare, 
  Phone, 
  Briefcase, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  CheckCircle, 
  ArrowRightLeft 
} from 'lucide-react';

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const columns: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'YANGI_LID', label: 'Yangi Lid', color: 'border-t-blue-500 bg-blue-950/20' },
  { status: 'ZAMER_BELGILANDI', label: "O'lchov Belgilandi", color: 'border-t-indigo-500 bg-indigo-950/20' },
  { status: 'ZAMER_BAJARILDI', label: "O'lchov Yuklandi", color: 'border-t-violet-500 bg-violet-950/20' },
  { status: 'DIZAYN_LOYYAHALASHDA', label: '3D Loyihalashda', color: 'border-t-purple-500 bg-purple-950/20' },
  { status: 'DIZAYN_TASDIQLANDI', label: 'Dizayn Tasdiqlandi', color: 'border-t-pink-500 bg-pink-950/20' },
  { status: 'TZ_PLANNER_TUZILDI', label: 'Kichik TZ Tuzildi', color: 'border-t-cyan-500 bg-cyan-950/20' },
  { status: 'SHARTNOMA_IMZOLANDI', label: 'Shartnoma Imzolandi', color: 'border-t-teal-500 bg-teal-950/20' },
  { status: 'PRODUCTION', label: 'Ishlab Chiqarishda', color: 'border-t-emerald-500 bg-emerald-950/20' },
  { status: 'TAYYOR_OTK', label: 'Tayyor (OTK)', color: 'border-t-amber-500 bg-amber-950/20' },
  { status: 'YOPILDI_USTANOVKA', label: 'O\'rnatildi (Yopildi)', color: 'border-t-slate-500 bg-slate-900/50' }
];

export const KanbanBoard: React.FC = () => {
  const { orders, productionStages, updateOrderStatus } = useStore();

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'TELEGRAM': return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'INSTAGRAM': return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-green-400" />;
      default: return <Briefcase className="w-4 h-4 text-slate-400" />;
    }
  };

  const isOrderLate = (order: Order) => {
    if (order.status !== 'PRODUCTION') return false;
    
    // Check if any active production stage for this order is delayed
    const stages = productionStages.filter(s => s.orderId === order.id);
    const now = new Date();
    
    return stages.some(stage => {
      if (stage.status !== 'DONE') {
        const plannedEnd = new Date(stage.plannedEndAt);
        return now > plannedEnd;
      }
      return false;
    });
  };

  const getActiveStage = (orderId: string) => {
    const stages = productionStages.filter(s => s.orderId === orderId);
    const active = stages.find(s => s.status === 'IN_PROGRESS');
    if (active) return `${active.stageName} (Bajarilmoqda)`;
    const pending = stages.find(s => s.status === 'PENDING');
    if (pending) return `${pending.stageName} (Kutilmoqda)`;
    return 'Bosqichlar yo\'q';
  };

  const handleNextStatus = (order: Order) => {
    const statusOrder: OrderStatus[] = [
      'YANGI_LID',
      'ZAMER_BELGILANDI',
      'ZAMER_BAJARILDI',
      'DIZAYN_LOYYAHALASHDA',
      'DIZAYN_TASDIQLANDI',
      'TZ_PLANNER_TUZILDI',
      'SHARTNOMA_IMZOLANDI',
      'PRODUCTION',
      'TAYYOR_OTK',
      'YOPILDI_USTANOVKA'
    ];
    
    const currentIndex = statusOrder.indexOf(order.status);
    if (currentIndex < statusOrder.length - 1) {
      updateOrderStatus(order.id, statusOrder[currentIndex + 1]);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Ishlab Chiqarish Kanban Doskasi</h1>
          <p className="text-slate-400 mt-1">Buyurtmalar va lidxonlik quvuri (CRM-dan yopilgungacha bo'lgan barcha bosqichlar)</p>
        </div>
        <div className="flex items-center gap-3 bg-brand-surface border border-brand-border px-4 py-2 rounded-lg text-sm text-slate-300">
          <ArrowRightLeft className="w-4 h-4 text-brand-emerald" />
          <span>Statuslarni o'zgartirish uchun kartalardagi <strong>"Keyingi"</strong> tugmasini bosing</span>
        </div>
      </div>

      {/* Columns Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-stretch select-none">
        {columns.map(({ status, label, color }) => {
          const columnOrders = orders.filter(o => o.status === status);
          
          return (
            <div 
              key={status} 
              className={`flex-shrink-0 w-80 rounded-xl border border-brand-border flex flex-col p-4 ${color}`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-border/60">
                <span className="font-semibold text-slate-200 text-sm tracking-wide">{label}</span>
                <span className="bg-brand-border text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {columnOrders.length}
                </span>
              </div>

              {/* Card List */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {columnOrders.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-lg p-6 text-slate-600 text-sm">
                    Buyurtmalar mavjud emas
                  </div>
                ) : (
                  columnOrders.map(order => {
                    const late = isOrderLate(order);
                    
                    return (
                      <div 
                        key={order.id} 
                        className={`bg-brand-surface border ${late ? 'border-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.1)]' : 'border-brand-border hover:border-slate-700'} rounded-lg p-4 transition-all duration-200 relative group flex flex-col justify-between`}
                      >
                        {/* Late Warning Glow Pin */}
                        {late && (
                          <div className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </div>
                        )}

                        <div>
                          {/* Order Meta */}
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-slate-500 tracking-wider">{order.orderNumber}</span>
                            <div className="flex items-center gap-1.5 bg-brand-dark/80 px-2 py-0.5 rounded border border-brand-border">
                              {getSourceIcon(order.source)}
                              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">{order.source}</span>
                            </div>
                          </div>

                          {/* Customer Name */}
                          <h3 className="font-semibold text-slate-200 text-sm mb-1 leading-tight group-hover:text-brand-emerald transition-colors">
                            {order.customerName}
                          </h3>
                          <p className="text-xs text-slate-500 mb-3">{order.customerPhone}</p>

                          {/* Status Details */}
                          {order.status === 'PRODUCTION' && (
                            <div className="mb-3 px-2 py-1.5 rounded bg-brand-dark border border-brand-border text-xs flex flex-col gap-1">
                              <span className="text-slate-500">Hozirgi etapi:</span>
                              <span className={`font-semibold ${late ? 'text-rose-400' : 'text-slate-300'} flex items-center gap-1`}>
                                {late && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse-red rounded-full" />}
                                {getActiveStage(order.id)}
                              </span>
                            </div>
                          )}

                          {order.plannedEndAt && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-3">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>Dedlayn: {new Date(order.plannedEndAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-2 pt-3 border-t border-brand-border/60 flex items-center justify-between">
                          <div className="flex items-center text-slate-200 font-semibold text-xs">
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                            <span>{(order.totalPrice / 1000000).toFixed(1)} mln UZS</span>
                          </div>

                          {order.status !== 'YOPILDI_USTANOVKA' && (
                            <button
                              onClick={() => handleNextStatus(order)}
                              className="flex items-center gap-1 bg-brand-border hover:bg-brand-emerald hover:text-brand-dark text-slate-300 text-[11px] font-bold py-1 px-2.5 rounded transition-all duration-200 group-hover:border-transparent cursor-pointer"
                            >
                              <span>Keyingi</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          
                          {order.status === 'YOPILDI_USTANOVKA' && (
                            <div className="flex items-center gap-1 text-brand-emerald text-[11px] font-bold bg-brand-emerald/10 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3" />
                              <span>Yopildi</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
