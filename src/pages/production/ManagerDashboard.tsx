import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Clock, 
  UserX, 
  Warehouse, 
  Truck, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { 
    orders, 
    workers, 
    productionStages, 
    updateWorkerDailyStatus,
    assignWorkerToStage,
    fetchProductionBoard,
    isLoading
  } = useStore();

  useEffect(() => {
    fetchProductionBoard();
  }, []);

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

  // Daily Operations list (stages planned to end today, currently in progress, or pending in production)
  const dailyOps = productionStages.filter(stage => {
    const plannedEnd = new Date(stage.plannedEndAt).toDateString();
    const today = new Date().toDateString();
    // Check if the order is currently in PRODUCTION status
    const order = orders.find(o => o.id === stage.orderId);
    if (!order || order.status !== 'PRODUCTION') return false;
    
    return (plannedEnd === today || stage.status === 'IN_PROGRESS' || stage.status === 'PENDING') && stage.status !== 'DONE';
  });

  // Find attendance conflicts: workers who are assigned to active/pending stages but are marked ABSENT
  const attendanceConflicts = productionStages.filter(stage => {
    if (stage.status === 'DONE') return false;
    // Check if order is in production
    const order = orders.find(o => o.id === stage.orderId);
    if (!order || order.status !== 'PRODUCTION') return false;

    if (stage.assignedWorkerId) {
      const worker = workers.find(w => w.id === stage.assignedWorkerId);
      return worker?.dailyStatus === 'ABSENT';
    }
    return false;
  }).map(stage => {
    const worker = workers.find(w => w.id === stage.assignedWorkerId);
    const order = orders.find(o => o.id === stage.orderId);
    return {
      stageId: stage.id,
      stageName: stage.stageName,
      workerName: worker?.fullName || 'Уста',
      orderNumber: order?.orderNumber || '',
      customerName: order?.customerName || '',
    };
  });

  const getOrderNumber = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.orderNumber || 'Буйыртпа';
  };

  const getCustomerName = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.customerName || 'Клиент';
  };

  // Helper to filter workers based on daily status compatibility
  const getCompatibleWorkersForStage = (stageName: string) => {
    if (stageName === 'USTANOVKA') {
      return workers.filter(w => w.dailyStatus === 'INSTALLATION');
    }
    return workers.filter(w => w.dailyStatus === 'WORKSHOP');
  };

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto bg-gradient-to-br from-brand-dark via-[#0c1220] to-brand-dark">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
            Менеджер Басқарыў Панели
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Өндирис қуўатлылығы, режелестириў ҳәм жумысшылар даўаматының анализи</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Мағлыўматлар жүкленбекте...</span>
        </div>
      ) : (
        <>
          {/* Attendance Conflicts Alert Banner */}
          {attendanceConflicts.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2 shadow-lg animate-pulse-red">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>ИТИБАР: Жумысшылар даўаматында келиспеўшилик анықланды!</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc pl-5">
                {attendanceConflicts.map((c, idx) => (
                  <li key={idx}>
                    <strong>{c.workerName}</strong> бүгин <strong>"Келмеген (Absent)"</strong> деп белгиленген, бирақ ол <strong>{c.orderNumber} ({c.customerName})</strong> буйыртпасының <strong>{c.stageName}</strong> басқышына бириктирилген!
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 hover:border-brand-emerald/30 rounded-xl p-5 flex items-center justify-between transition-all duration-300 group shadow-lg">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Актив буйыртпалар</span>
                <h3 className="text-2xl font-extrabold text-slate-200 mt-1 group-hover:text-brand-emerald transition-colors">{activeOrders.length} та</h3>
              </div>
              <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-lg group-hover:bg-brand-emerald/20 transition-all duration-300">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 hover:border-blue-500/30 rounded-xl p-5 flex items-center justify-between transition-all duration-300 group shadow-lg">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Цехта (Workshop)</span>
                <h3 className="text-2xl font-extrabold text-slate-200 mt-1 group-hover:text-blue-400 transition-colors">{inWorkshop} уста</h3>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-all duration-300">
                <Warehouse className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 hover:border-indigo-500/30 rounded-xl p-5 flex items-center justify-between transition-all duration-300 group shadow-lg">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Орнатыўда (Installation)</span>
                <h3 className="text-2xl font-extrabold text-slate-200 mt-1 group-hover:text-indigo-400 transition-colors">{onInstallation} уста</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500/20 transition-all duration-300">
                <Truck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/60 hover:border-rose-500/30 rounded-xl p-5 flex items-center justify-between transition-all duration-300 group shadow-lg">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Кешиккен басқышлар</span>
                <h3 className="text-2xl font-extrabold text-rose-500 mt-1">{overdueStages.length} та</h3>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-450 rounded-lg group-hover:bg-rose-500/20 transition-all duration-300">
                <AlertCircle className="w-6 h-6 animate-pulse text-rose-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 & 2: Gantt Chart and Daily Ops */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gantt Timeline */}
              <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-emerald" />
                  Жойбар Басқышларының Графиги (Гант)
                </h2>
                
                <div className="space-y-6">
                  {activeOrders.length === 0 ? (
                    <div className="border border-dashed border-slate-800/80 rounded-xl py-12 text-center">
                      <p className="text-slate-500 text-sm font-semibold">Хәзирги ўақытта өндиристе буйыртпалар жоқ.</p>
                    </div>
                  ) : (
                    activeOrders.map(order => {
                      const stages = productionStages.filter(s => s.orderId === order.id);
                      
                      // Find order timeframe
                      const startTimes = stages.map(s => new Date(s.plannedStartAt).getTime());
                      const endTimes = stages.map(s => new Date(s.plannedEndAt).getTime());
                      
                      const startVal = startTimes.length ? Math.min(...startTimes) : (order.plannedStartAt ? new Date(order.plannedStartAt).getTime() : Date.now());
                      const endVal = endTimes.length ? Math.max(...endTimes) : (order.plannedEndAt ? new Date(order.plannedEndAt).getTime() : (Date.now() + 7 * 24 * 60 * 60 * 1000));
                      const totalRange = Math.max(endVal - startVal, 1);

                      return (
                        <div key={order.id} className="border-b border-brand-border/40 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wide">{order.orderNumber}</span>
                              <h4 className="font-bold text-sm text-slate-200">{order.customerName}</h4>
                            </div>
                            <span className="text-xs font-semibold text-slate-400 bg-brand-dark/45 border border-brand-border/60 px-3 py-1 rounded-lg">
                              Реже: {new Date(startVal).toLocaleDateString()} - {new Date(endVal).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Detailed Gantt Chart */}
                          <div className="mt-4 space-y-3 bg-brand-dark/35 border border-brand-border/60 rounded-xl p-4 shadow-inner">
                            {/* Timeline Header (Days Axis) */}
                            <div className="flex text-[9px] text-slate-500 font-bold font-mono border-b border-brand-border/40 pb-1.5 uppercase tracking-wider">
                              <div className="w-28 shrink-0">Басқыш / Жумысшы</div>
                              <div className="flex-1 grid grid-cols-10 gap-1 text-center">
                                {Array.from({ length: 10 }).map((_, i) => {
                                  const d = new Date(startVal + i * (totalRange / 9));
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

                                const worker = stage.assignedWorkerId ? workers.find(w => w.id === stage.assignedWorkerId) : null;
                                const workerName = worker ? worker.fullName.split(' ')[0] : 'Бириктирилмеген';
                                const isWorkerAbsent = worker?.dailyStatus === 'ABSENT';

                                return (
                                  <div key={stage.id} className="flex items-center text-xs">
                                    {/* Stage Name */}
                                    <div className="w-28 shrink-0 pr-2">
                                      <span className="font-bold text-slate-350">{stage.stageName}</span>
                                      <span className={`block text-[9px] font-semibold truncate ${isWorkerAbsent ? 'text-rose-455 font-bold animate-pulse' : 'text-slate-500'}`}>
                                        {isWorkerAbsent ? '⚠️ ' : '👤 '}{workerName}
                                      </span>
                                    </div>

                                    {/* Timeline Track */}
                                    <div className="flex-1 h-9 bg-brand-dark/75 rounded-lg border border-brand-border/40 relative overflow-hidden">
                                      {/* Planned Bar */}
                                      <div 
                                        className="absolute h-3 bg-slate-800 border border-slate-700/60 rounded top-1"
                                        style={{ left: `${plannedLeft}%`, width: `${plannedWidth}%` }}
                                        title={`Reja: ${new Date(stage.plannedStartAt).toLocaleString()} - ${new Date(stage.plannedEndAt).toLocaleString()}`}
                                      />

                                      {/* Actual Bar */}
                                      {hasActual && (
                                        <div 
                                          className={`absolute h-3 rounded bottom-1 ${
                                            stage.status === 'DONE' 
                                              ? 'bg-brand-emerald/75 border border-brand-emerald/40 shadow-[0_0_6px_rgba(16,185,129,0.2)]' 
                                              : isLate 
                                                ? 'bg-rose-500/80 border border-rose-500 animate-pulse-red' 
                                                : 'bg-emerald-500/75 border border-brand-emerald animate-pulse'
                                          }`}
                                          style={{ left: `${actualLeft}%`, width: `${actualWidth}%` }}
                                          title={`Amalda: ${new Date(stage.actualStartAt!).toLocaleString()} - ${stage.actualEndAt ? new Date(stage.actualEndAt).toLocaleString() : 'Katta jarayonda'}`}
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
              <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-emerald" />
                  Бүгинги Әмелий Операциялар (Daily Ops)
                </h2>

                <div className="divide-y divide-brand-border/45">
                  {dailyOps.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm font-semibold">
                      Бүгин жуўмақланатуғын операциялар жоқ.
                    </div>
                  ) : (
                    dailyOps.map(stage => {
                      const orderNum = getOrderNumber(stage.orderId);
                      const custName = getCustomerName(stage.orderId);
                      const isLate = new Date() > new Date(stage.plannedEndAt);
                      const compatibleWorkers = getCompatibleWorkersForStage(stage.stageName);
                      
                      const assignedWorker = stage.assignedWorkerId ? workers.find(w => w.id === stage.assignedWorkerId) : null;
                      const isAbsentConflict = assignedWorker?.dailyStatus === 'ABSENT';

                      return (
                        <div key={stage.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-[10px] font-bold font-mono text-slate-500">{orderNum}</span>
                              <span className="text-[10px] bg-brand-border/90 border border-slate-700/60 px-2 py-0.5 rounded-md text-slate-300 font-extrabold tracking-wider">{stage.stageName}</span>
                              {isLate && (
                                <span className="text-[9px] bg-rose-500/10 text-rose-455 border border-rose-500/20 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-bold">
                                  <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                                  Кешикпекте
                                </span>
                              )}
                              {isAbsentConflict && (
                                <span className="text-[9px] bg-rose-500/15 text-rose-400 border border-rose-500/35 px-2 py-0.5 rounded-md flex items-center gap-0.5 font-extrabold animate-pulse">
                                  <UserX className="w-3 h-3 text-rose-500" />
                                  Келмеген уста!
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-slate-200 mt-1">{custName}</h4>
                            <span className="text-xs text-slate-500 block mt-0.5 font-medium">
                              Дедлайн: {new Date(stage.plannedEndAt).toLocaleString()}
                            </span>
                          </div>

                          {/* Worker Assignment Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 shrink-0">Жуўапкер уста:</span>
                            <select
                              value={stage.assignedWorkerId || ''}
                              onChange={(e) => assignWorkerToStage(stage.id, e.target.value)}
                              className={`bg-brand-dark border ${
                                isAbsentConflict ? 'border-rose-500/50 text-rose-400 focus:ring-rose-500' : 'border-brand-border text-slate-300 focus:ring-brand-emerald'
                              } text-xs rounded-lg p-2.5 focus:border-brand-emerald cursor-pointer shadow-sm`}
                            >
                              <option value="">Уста бириктириў...</option>
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
              <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl flex flex-col h-full">
                <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-emerald" />
                  Күнлик Даўамат
                </h2>
                <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                  Менеджер ҳәр күни ертеңгилик усталардың бар екенлигин тастыйықлаўы керек. Бул олардың басқышларға бириктирилиўине тәсир етеди.
                </p>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-6 font-bold">
                  <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-2.5 text-blue-400 shadow-sm">
                    <div className="font-extrabold text-lg">{inWorkshop}</div>
                    <div className="text-[10px] text-blue-500 uppercase tracking-wider mt-0.5">Цехта</div>
                  </div>
                  <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-2.5 text-indigo-400 shadow-sm">
                    <div className="font-extrabold text-lg">{onInstallation}</div>
                    <div className="text-[10px] text-indigo-500 uppercase tracking-wider mt-0.5">Орнатыўда</div>
                  </div>
                  <div className="bg-rose-950/20 border border-rose-900/30 rounded-xl p-2.5 text-rose-455 shadow-sm">
                    <div className="font-extrabold text-lg">{absent}</div>
                    <div className="text-[10px] text-rose-500 uppercase tracking-wider mt-0.5">Келмеген</div>
                  </div>
                </div>

                {/* Worker Attendance list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[480px] scrollbar-thin">
                  {workers.map(worker => {
                    const isBusyAndAbsent = productionStages.some(
                      s => s.status !== 'DONE' && 
                      s.assignedWorkerId === worker.id && 
                      orders.find(o => o.id === s.orderId)?.status === 'PRODUCTION'
                    ) && worker.dailyStatus === 'ABSENT';

                    return (
                      <div 
                        key={worker.id} 
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                          isBusyAndAbsent 
                            ? 'bg-rose-950/15 border-rose-500/40 shadow-rose-950/10' 
                            : 'bg-brand-dark/45 border-brand-border/60 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">{worker.fullName}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider bg-brand-border/60 px-1.5 py-0.5 rounded">{worker.specialty}</span>
                            {isBusyAndAbsent && (
                              <span className="text-[9px] text-rose-455 font-bold animate-pulse">⚠️ Актив жумыста!</span>
                            )}
                          </div>
                        </div>

                        {/* Attendance Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateWorkerDailyStatus(worker.id, 'WORKSHOP')}
                            title="Цехта (Workshop)"
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border ${
                              worker.dailyStatus === 'WORKSHOP' 
                                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 shadow-md shadow-blue-900/10' 
                                : 'bg-transparent border-transparent text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <Warehouse className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateWorkerDailyStatus(worker.id, 'INSTALLATION')}
                            title="Орнатыўда (Installation)"
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border ${
                              worker.dailyStatus === 'INSTALLATION' 
                                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 shadow-md shadow-indigo-900/10' 
                                : 'bg-transparent border-transparent text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateWorkerDailyStatus(worker.id, 'ABSENT')}
                            title="Келмеген (Absent)"
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 border ${
                              worker.dailyStatus === 'ABSENT' 
                                ? 'bg-rose-600/20 border-rose-500/40 text-rose-450 shadow-md shadow-rose-900/10' 
                                : 'bg-transparent border-transparent text-slate-600 hover:text-slate-450'
                            }`}
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
