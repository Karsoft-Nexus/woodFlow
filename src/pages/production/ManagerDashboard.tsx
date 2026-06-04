import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Clock, 
  UserX, 
  Warehouse, 
  Truck, 
  AlertTriangle 
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { 
    orders, 
    workers, 
    productionStages, 
    updateWorkerDailyStatus,
    assignWorkerToStage
  } = useStore();

  const activeOrders = orders.filter(o => o.status === 'PRODUCTION');

  // Daily attendance stats
  const inWorkshop = workers.filter(w => w.dailyStatus === 'WORKSHOP').length;
  const onInstallation = workers.filter(w => w.dailyStatus === 'INSTALLATION').length;
  const absent = workers.filter(w => w.dailyStatus === 'ABSENT').length;

  // Checking overdue stages for late alerts
  const overdueStages = productionStages.filter(stage => {
    if (stage.status !== 'DONE') {
      const plannedEnd = new Date(stage.plannedEndAt);
      return new Date() > plannedEnd;
    }
    return false;
  });

  // Daily Operations list (stages planned to end today or are currently in progress)
  const dailyOps = productionStages.filter(stage => {
    const plannedEnd = new Date(stage.plannedEndAt).toDateString();
    const today = new Date().toDateString();
    return (plannedEnd === today || stage.status === 'IN_PROGRESS') && stage.status !== 'DONE';
  });

  const getOrderNumber = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.orderNumber || 'Buyurtma';
  };

  const getCustomerName = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.customerName || 'Mijoz';
  };

  // Helper to filter workers based on daily status compatibility
  const getCompatibleWorkersForStage = (stageName: string) => {
    if (stageName === 'USTANOVKA') {
      return workers.filter(w => w.dailyStatus === 'INSTALLATION');
    }
    return workers.filter(w => w.dailyStatus === 'WORKSHOP');
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Menejer Nazorat Paneli</h1>
        <p className="text-slate-400 mt-1">Ishlab chiqarish quvvati, rejalashtirish va ishchilar davomati tahlili</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Faol Buyurtmalar</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{activeOrders.length} ta</h3>
          </div>
          <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sexda (Workshop)</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{inWorkshop} ta usta</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Warehouse className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">O'rnatishda (Installation)</span>
            <h3 className="text-2xl font-bold text-slate-200 mt-1">{onInstallation} ta usta</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kechikkan Bosqichlar</span>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">{overdueStages.length} ta</h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Gantt Chart and Daily Ops */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gantt Timeline */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-emerald" />
              Loyiha Bosqichlari Timeline (Gantt)
            </h2>
            
            <div className="space-y-6">
              {activeOrders.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Hozirda ishlab chiqarishda buyurtmalar mavjud emas.</p>
              ) : (
                activeOrders.map(order => {
                  const stages = productionStages.filter(s => s.orderId === order.id);
                  const startVal = order.plannedStartAt ? new Date(order.plannedStartAt).getTime() : Date.now();
                  const endVal = order.plannedEndAt ? new Date(order.plannedEndAt).getTime() : (Date.now() + 7 * 24 * 60 * 60 * 1000);
                  const totalRange = Math.max(endVal - startVal, 1);

                  return (
                    <div key={order.id} className="border-b border-brand-border/60 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="text-xs font-mono text-slate-500">{order.orderNumber}</span>
                          <h4 className="font-semibold text-sm text-slate-200">{order.customerName}</h4>
                        </div>
                        <span className="text-xs text-slate-400">
                          Reja: {order.plannedStartAt ? new Date(order.plannedStartAt).toLocaleDateString() : ''} - {order.plannedEndAt ? new Date(order.plannedEndAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {/* Detailed Gantt Chart */}
                      <div className="mt-4 space-y-3 bg-brand-dark/40 border border-brand-border/60 rounded-xl p-4">
                        {/* Timeline Header (Days) */}
                        <div className="flex text-[10px] text-slate-500 font-mono border-b border-brand-border/40 pb-1">
                          <div className="w-24 shrink-0 font-bold">Bosqich</div>
                          <div className="flex-1 grid grid-cols-7 gap-1 text-center">
                            {Array.from({ length: 7 }).map((_, i) => {
                              const d = new Date(startVal + i * 24 * 60 * 60 * 1000);
                              return (
                                <div key={i} className="truncate">
                                  {d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stages Bars */}
                        <div className="space-y-3">
                          {stages.map(stage => {
                            const isLate = stage.status !== 'DONE' && new Date() > new Date(stage.plannedEndAt);
                            
                            // Calculate percentages for Planned bar
                            const plannedStart = new Date(stage.plannedStartAt).getTime();
                            const plannedEnd = new Date(stage.plannedEndAt).getTime();
                            const plannedLeft = Math.max(0, Math.min(100, ((plannedStart - startVal) / totalRange) * 100));
                            const plannedWidth = Math.max(2, Math.min(100 - plannedLeft, ((plannedEnd - plannedStart) / totalRange) * 100));

                            // Calculate percentages for Actual bar
                            const hasActual = !!stage.actualStartAt;
                            const actualStart = stage.actualStartAt ? new Date(stage.actualStartAt).getTime() : 0;
                            const actualEnd = stage.actualEndAt ? new Date(stage.actualEndAt).getTime() : Date.now();
                            const actualLeft = hasActual ? Math.max(0, Math.min(100, ((actualStart - startVal) / totalRange) * 100)) : 0;
                            const actualWidth = hasActual ? Math.max(2, Math.min(100 - actualLeft, ((actualEnd - actualStart) / totalRange) * 100)) : 0;

                            const workerName = stage.assignedWorkerId 
                              ? workers.find(w => w.id === stage.assignedWorkerId)?.fullName.split(' ')[0] 
                              : 'Biriktirilmagan';

                            return (
                              <div key={stage.id} className="flex items-center text-xs">
                                {/* Stage Name */}
                                <div className="w-24 shrink-0 font-bold text-slate-300">
                                  {stage.stageName}
                                  <span className="block text-[9px] text-slate-500 font-normal truncate">
                                    👤 {workerName}
                                  </span>
                                </div>

                                {/* Timeline Track */}
                                <div className="flex-1 h-9 bg-brand-dark/80 rounded border border-brand-border/40 relative overflow-hidden">
                                  {/* Planned Bar */}
                                  <div 
                                    className="absolute h-3 bg-slate-700/60 border border-slate-600/30 rounded-sm top-1"
                                    style={{ left: `${plannedLeft}%`, width: `${plannedWidth}%` }}
                                    title={`Reja: ${new Date(stage.plannedStartAt).toLocaleString()} - ${new Date(stage.plannedEndAt).toLocaleString()}`}
                                  />

                                  {/* Actual Bar */}
                                  {hasActual && (
                                    <div 
                                      className={`absolute h-3 rounded-sm bottom-1 ${
                                        stage.status === 'DONE' 
                                          ? 'bg-brand-emerald/70 border border-brand-emerald/30' 
                                          : isLate 
                                            ? 'bg-rose-500/80 border border-rose-500 animate-pulse-red' 
                                            : 'bg-emerald-500/80 border border-brand-emerald animate-pulse'
                                      }`}
                                      style={{ left: `${actualLeft}%`, width: `${actualWidth}%` }}
                                      title={`Amalda: ${new Date(stage.actualStartAt!).toLocaleString()} - ${stage.actualEndAt ? new Date(stage.actualEndAt).toLocaleString() : 'Davom etmoqda'}`}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Daily Ops View */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-emerald" />
              Bugungi Tezkor Operatsiyalar (Daily Ops)
            </h2>

            <div className="divide-y divide-brand-border/60">
              {dailyOps.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">Bugun yakunlanadigan operatsiyalar yo'q.</p>
              ) : (
                dailyOps.map(stage => {
                  const orderNum = getOrderNumber(stage.orderId);
                  const custName = getCustomerName(stage.orderId);
                  const isLate = new Date() > new Date(stage.plannedEndAt);
                  const compatibleWorkers = getCompatibleWorkersForStage(stage.stageName);

                  return (
                    <div key={stage.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">{orderNum}</span>
                          <span className="text-xs bg-brand-border px-2 py-0.5 rounded text-slate-300 font-bold">{stage.stageName}</span>
                          {isLate && (
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                              Kechikmoqda
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm text-slate-200 mt-1">{custName}</h4>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Dedlayn: {new Date(stage.plannedEndAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Worker Assignment Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Mas'ul usta:</span>
                        <select
                          value={stage.assignedWorkerId || ''}
                          onChange={(e) => assignWorkerToStage(stage.id, e.target.value)}
                          className="bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                        >
                          <option value="">Usta biriktirish...</option>
                          {compatibleWorkers.map(worker => (
                            <option key={worker.id} value={worker.id}>
                              {worker.fullName} ({worker.specialty})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Daily Attendance and Workers */}
        <div className="space-y-6">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 flex flex-col h-full">
            <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-emerald" />
              Kunlik Yo'qlama & Davomat
            </h2>
            <p className="text-xs text-slate-500 mb-4">Menejer har kuni ertalab ustalar jismoniy holatini tasdiqlashi lozim.</p>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-6">
              <div className="bg-blue-950/20 border border-blue-900/40 rounded p-2 text-blue-400">
                <div className="font-bold text-base">{inWorkshop}</div>
                <div>Sexda</div>
              </div>
              <div className="bg-indigo-950/20 border border-indigo-900/40 rounded p-2 text-indigo-400">
                <div className="font-bold text-base">{onInstallation}</div>
                <div>O'rnatishda</div>
              </div>
              <div className="bg-rose-950/20 border border-rose-900/40 rounded p-2 text-rose-400">
                <div className="font-bold text-base">{absent}</div>
                <div>Kelmagan</div>
              </div>
            </div>

            {/* Worker Attendance list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[480px]">
              {workers.map(worker => (
                <div key={worker.id} className="p-3 bg-brand-dark/40 border border-brand-border rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-slate-200">{worker.fullName}</h4>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{worker.specialty}</span>
                  </div>

                  {/* Attendance Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateWorkerDailyStatus(worker.id, 'WORKSHOP')}
                      title="Sexda (Workshop)"
                      className={`p-1.5 rounded cursor-pointer transition-colors ${worker.dailyStatus === 'WORKSHOP' ? 'bg-blue-600/20 border border-blue-500 text-blue-400' : 'bg-transparent text-slate-600 hover:text-slate-400'}`}
                    >
                      <Warehouse className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateWorkerDailyStatus(worker.id, 'INSTALLATION')}
                      title="O'rnatishda (Installation)"
                      className={`p-1.5 rounded cursor-pointer transition-colors ${worker.dailyStatus === 'INSTALLATION' ? 'bg-indigo-600/20 border border-indigo-500 text-indigo-400' : 'bg-transparent text-slate-600 hover:text-slate-400'}`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateWorkerDailyStatus(worker.id, 'ABSENT')}
                      title="Kelmagan (Absent)"
                      className={`p-1.5 rounded cursor-pointer transition-colors ${worker.dailyStatus === 'ABSENT' ? 'bg-rose-600/20 border border-rose-500 text-rose-400' : 'bg-transparent text-slate-600 hover:text-slate-400'}`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
