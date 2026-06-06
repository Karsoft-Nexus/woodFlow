import React, { useEffect } from 'react';
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
  ArrowRightLeft,
  Loader2,
  Clock
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
  { status: 'YANGI_LID', label: 'Жаңа Лид', color: 'border-t-blue-500 bg-blue-950/10' },
  { status: 'ZAMER_BELGILANDI', label: 'Өлшеўши Бириктирилди', color: 'border-t-indigo-500 bg-indigo-950/10' },
  { status: 'ZAMER_BAJARILDI', label: 'Өлшеў Орынланды', color: 'border-t-violet-500 bg-violet-950/10' },
  { status: 'DIZAYN_LOYYAHALASHDA', label: '3D Жойбарлаўда', color: 'border-t-purple-500 bg-purple-950/10' },
  { status: 'DIZAYN_TASDIQLANDI', label: 'Дизайн Тастыйықланды', color: 'border-t-pink-500 bg-pink-950/10' },
  { status: 'TZ_PLANNER_TUZILDI', label: 'Киши ТТ Дүзилди', color: 'border-t-cyan-500 bg-cyan-950/10' },
  { status: 'SHARTNOMA_IMZOLANDI', label: 'Шәртнама Қол Қойылды', color: 'border-t-teal-500 bg-teal-950/10' },
  { status: 'PRODUCTION', label: 'Өндиристе', color: 'border-t-emerald-500 bg-emerald-950/10' },
  { status: 'TAYYOR_OTK', label: 'Таяр (ӨТК)', color: 'border-t-amber-500 bg-amber-950/10' },
  { status: 'YOPILDI_USTANOVKA', label: 'Орнатылды (Жабылды)', color: 'border-t-slate-500 bg-slate-900/40' }
];

export const KanbanBoard: React.FC = () => {
  const { orders, productionStages, updateOrderStatus, fetchOrders, isLoading } = useStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'TELEGRAM': return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'INSTAGRAM': return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-green-400" />;
      default: return <Briefcase className="w-4 h-4 text-slate-400" />;
    }
  };

  const isOrderLate = (order: Order) => {
    if (order.status === 'YOPILDI_USTANOVKA') return false;
    
    const now = new Date();
    
    // Check production stages if in PRODUCTION
    if (order.status === 'PRODUCTION') {
      const stages = productionStages.filter(s => s.orderId === order.id);
      if (stages.length > 0) {
        return stages.some(stage => {
          if (stage.status !== 'DONE') {
            const plannedEnd = new Date(stage.plannedEndAt);
            return now > plannedEnd;
          }
          return false;
        });
      }
    }
    
    // Fallback to order-level deadline
    if (order.plannedEndAt) {
      const plannedEnd = new Date(order.plannedEndAt);
      return now > plannedEnd;
    }
    
    return false;
  };

  const getLateDuration = (order: Order) => {
    if (order.status === 'YOPILDI_USTANOVKA') return '';
    const now = new Date();
    let plannedEnd: Date | null = null;

    if (order.status === 'PRODUCTION') {
      const activeStage = productionStages.find(s => s.orderId === order.id && s.status !== 'DONE');
      if (activeStage) {
        plannedEnd = new Date(activeStage.plannedEndAt);
      }
    }

    if (!plannedEnd && order.plannedEndAt) {
      plannedEnd = new Date(order.plannedEndAt);
    }

    if (plannedEnd && now > plannedEnd) {
      const diffMs = now.getTime() - plannedEnd.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 24) {
        return `${diffHours} саат кешикти`;
      }
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} күн кешикти`;
    }
    return '';
  };

  const getActiveStage = (orderId: string) => {
    const stages = productionStages.filter(s => s.orderId === orderId);
    const active = stages.find(s => s.status === 'IN_PROGRESS');
    if (active) return `${active.stageName} (Орынланбақта)`;
    const pending = stages.find(s => s.status === 'PENDING');
    if (pending) return `${pending.stageName} (Күтилмекте)`;
    return 'Басқышлар жоқ';
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
    <div className="h-full flex flex-col p-6 overflow-hidden bg-gradient-to-br from-brand-dark via-[#0c1220] to-brand-dark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
            Өндирис Канбан Доскасы
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Буйыртпалар ҳәм лидлер ағымы (CRM-нен жабылғанға шекемги барлық басқышлар)
          </p>
        </div>
        <div className="flex items-center gap-3 bg-brand-surface/40 backdrop-blur-md border border-brand-border/60 px-4 py-2.5 rounded-xl text-xs text-slate-300 shadow-lg">
          <ArrowRightLeft className="w-4 h-4 text-brand-emerald animate-pulse" />
          <span>Статусларды өткериў ушын карточкалардағы <strong>"Кейинги"</strong> түймесин басың</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Мағлыўматлар жүкленбекте...</span>
        </div>
      ) : (
        /* Columns Container */
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-stretch select-none scrollbar-thin">
          {columns.map(({ status, label, color }) => {
            const columnOrders = orders.filter(o => o.status === status);
            
            return (
              <div 
                key={status} 
                className={`flex-shrink-0 w-80 rounded-xl border border-brand-border/80 flex flex-col p-4 transition-all duration-300 backdrop-blur-sm ${color}`}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-brand-border/40">
                  <span className="font-bold text-slate-200 text-xs tracking-wider uppercase">{label}</span>
                  <span className="bg-brand-border/80 border border-slate-700/50 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-inner">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Card List */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent">
                  {columnOrders.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800/80 rounded-xl p-6 text-slate-600 text-xs font-semibold">
                      Буйыртпалар жоқ
                    </div>
                  ) : (
                    columnOrders.map(order => {
                      const late = isOrderLate(order);
                      const lateMsg = getLateDuration(order);
                      
                      return (
                        <div 
                          key={order.id} 
                          className={`bg-brand-surface/75 backdrop-blur-md border group ${
                            late 
                              ? 'border-rose-500/80 shadow-[0_0_12px_rgba(244,63,94,0.15)] bg-gradient-to-b from-[#1b1016]/40 to-brand-surface/80 hover:border-rose-500' 
                              : 'border-brand-border hover:border-slate-600 hover:shadow-md'
                          } rounded-xl p-4 transition-all duration-300 relative flex flex-col justify-between`}
                        >
                          {/* Late Warning Glow Pin */}
                          {late && (
                            <div className="absolute top-3 right-3 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                            </div>
                          )}

                          <div>
                            {/* Order Meta */}
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-[10px] font-bold font-mono text-slate-500 tracking-wider uppercase">{order.orderNumber}</span>
                              <div className="flex items-center gap-1.5 bg-brand-dark/90 px-2 py-0.5 rounded-md border border-brand-border/60">
                                {getSourceIcon(order.source)}
                                <span className="text-[9px] text-slate-400 font-extrabold tracking-wider">{order.source}</span>
                              </div>
                            </div>

                            {/* Customer Name */}
                            <h3 className="font-bold text-slate-200 text-sm mb-1 leading-snug group-hover:text-brand-emerald transition-colors">
                              {order.customerName}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mb-3">{order.customerPhone}</p>

                            {/* Status Details */}
                            {order.status === 'PRODUCTION' && (
                              <div className={`mb-3 px-2.5 py-2 rounded-lg border text-xs flex flex-col gap-1 ${
                                late ? 'bg-rose-950/20 border-rose-500/30' : 'bg-brand-dark/50 border-brand-border/60'
                              }`}>
                                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Хәзирги басқышы:</span>
                                <span className={`font-bold ${late ? 'text-rose-400' : 'text-slate-300'} flex items-center gap-1.5`}>
                                  {late && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
                                  {getActiveStage(order.id)}
                                </span>
                              </div>
                            )}

                            {/* Late Warning Info Bar */}
                            {late && lateMsg && (
                              <div className="mb-3 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-rose-500" />
                                <span>{lateMsg}</span>
                              </div>
                            )}

                            {order.plannedEndAt && (
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-3 font-semibold">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>Дедлайн: {new Date(order.plannedEndAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* Bottom Actions */}
                          <div className="mt-2 pt-3 border-t border-brand-border/50 flex items-center justify-between">
                            <div className="flex items-center text-slate-200 font-bold text-xs">
                              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                              <span>{(order.totalPrice / 1000000).toFixed(1)} млн UZS</span>
                            </div>

                            {order.status !== 'YOPILDI_USTANOVKA' && (
                              <button
                                onClick={() => handleNextStatus(order)}
                                className="flex items-center gap-1 bg-brand-border/80 hover:bg-brand-emerald hover:text-brand-dark text-slate-300 hover:scale-[1.03] text-[10px] font-extrabold py-1.5 px-3 rounded-lg border border-transparent hover:border-brand-emerald/30 transition-all duration-300 cursor-pointer shadow-sm shadow-black/10"
                              >
                                <span>Кейинги</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            
                            {order.status === 'YOPILDI_USTANOVKA' && (
                              <div className="flex items-center gap-1 text-brand-emerald text-[10px] font-extrabold bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded-lg shadow-sm">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Жабылды</span>
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
      )}
    </div>
  );
};
