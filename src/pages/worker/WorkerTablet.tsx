import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { Worker } from '../../types';
import { productionApi } from '../../api';
import type { PayoutResponse } from '../../api';
import { 
  Lock, 
  User, 
  Play, 
  Check, 
  DollarSign, 
  Star, 
  AlertTriangle,
  LogOut,
  History,
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';

export const WorkerTablet: React.FC = () => {
  const { 
    workers, 
    productionStages, 
    orders, 
    startStage, 
    finishStage,
    products,
    addOffcut,
    financeTransactions,
    fetchInitialData,
    isLoading
  } = useStore();

  const [pin, setPin] = useState('');
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);
  const [error, setError] = useState('');
  const [payouts, setPayouts] = useState<PayoutResponse[]>([]);
  const [payoutsLoading, setPayoutsLoading] = useState(false);

  // Offcut modal states
  const [showOffcutModal, setShowOffcutModal] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [offcutProductId, setOffcutProductId] = useState('');
  const [offcutLength, setOffcutLength] = useState('');
  const [offcutWidth, setOffcutWidth] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Map worker to simple pin codes (w1 -> 1111, w2 -> 2222, etc.)
  const getPinForWorker = (id: string) => {
    const num = id.replace('w', '');
    if (num === '10') return '0000';
    return num.repeat(4).substring(0, 4);
  };

  const loadWorkerPayouts = async (workerId: string) => {
    setPayoutsLoading(true);
    try {
      const data = await productionApi.getWorkerPayouts(workerId);
      if (Array.isArray(data)) {
        setPayouts(data);
      } else {
        throw new Error("API response is not an array");
      }
    } catch (err) {
      console.warn("Failed to fetch worker payouts, generating local fallback payouts list:", err);
      // Local fallback: filter finance transactions of type EXPENSE and category WORKER_PAYOUT for this worker
      const localPayouts = financeTransactions
        .filter(t => t.workerId === workerId && t.type === 'EXPENSE' && t.category === 'WORKER_PAYOUT')
        .map(t => {
          const orderNum = orders.find(o => o.id === t.orderId)?.orderNumber || 'WF-2026-XXX';
          return {
            id: t.id,
            workerId: workerId,
            stageId: t.orderId || '',
            amount: t.amount,
            stageName: t.description.split(' haqi')[0] || 'Басқыш жумысы',
            orderNumber: orderNum,
            createdAt: t.createdAt
          };
        });
      setPayouts(localPayouts);
    } finally {
      setPayoutsLoading(false);
    }
  };

  const handlePinSubmit = () => {
    const foundWorker = workers.find(w => getPinForWorker(w.id) === pin);
    if (foundWorker) {
      if (foundWorker.dailyStatus === 'ABSENT') {
        setError('Siz бүгин "Келмеген" деп белгиленгенсиз. Илтимос, менеджерге мүрәжат этиң!');
        setPin('');
      } else {
        setActiveWorker(foundWorker);
        setError('');
        setPin('');
        loadWorkerPayouts(foundWorker.id);
      }
    } else {
      setError('Қәте PIN-код! Қайтадан урынып көриң.');
      setPin('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleLogout = () => {
    setActiveWorker(null);
    setPin('');
    setError('');
    setPayouts([]);
  };

  const handleStartClick = async (stageId: string, workerId: string) => {
    await startStage(stageId, workerId);
    if (activeWorker) {
      loadWorkerPayouts(activeWorker.id);
    }
  };

  const handleFinishClick = (stageId: string, stageName: string) => {
    if (stageName === 'RASKROY') {
      setSelectedStageId(stageId);
      const plates = products.filter(p => p.category === 'PLATES');
      if (plates.length > 0) {
        setOffcutProductId(plates[0].id);
      }
      setShowOffcutModal(true);
    } else {
      processFinish(stageId);
    }
  };

  const processFinish = async (stageId: string) => {
    await finishStage(stageId);
    if (activeWorker) {
      // Reload payouts and worker profile state
      loadWorkerPayouts(activeWorker.id);
    }
  };

  const handleSaveOffcutAndFinish = async () => {
    if (selectedStageId) {
      if (offcutProductId && offcutLength && offcutWidth) {
        addOffcut(
          offcutProductId,
          Number(offcutLength),
          Number(offcutWidth),
          productionStages.find(s => s.id === selectedStageId)?.orderId || ''
        );
      }
      await processFinish(selectedStageId);
      setShowOffcutModal(false);
      setSelectedStageId(null);
      setOffcutLength('');
      setOffcutWidth('');
    }
  };

  const handleSkipOffcutAndFinish = async () => {
    if (selectedStageId) {
      await processFinish(selectedStageId);
      setShowOffcutModal(false);
      setSelectedStageId(null);
    }
  };

  // Filter tasks based on worker daily status
  const getWorkerTasks = () => {
    if (!activeWorker) return [];

    const isInstallationWorker = activeWorker.dailyStatus === 'INSTALLATION';

    return productionStages.filter(stage => {
      if (stage.status === 'DONE') return false;

      // Stage name checks
      const isInstallStage = stage.stageName === 'USTANOVKA';
      if (isInstallationWorker && !isInstallStage) return false;
      if (!isInstallationWorker && isInstallStage) return false;

      // Assign check
      return !stage.assignedWorkerId || stage.assignedWorkerId === activeWorker.id;
    });
  };

  const getOrderNumber = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.orderNumber || '';
  };

  const getCustomerName = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.customerName || '';
  };

  // Get active worker payout balance from updated workers list
  const getUpdatedWorkerBalance = () => {
    if (!activeWorker) return 0;
    const worker = workers.find(w => w.id === activeWorker.id);
    return worker ? worker.payoutBalance : activeWorker.payoutBalance;
  };

  return (
    <div className="h-full min-h-screen bg-gradient-to-br from-brand-dark via-[#0c1220] to-brand-dark flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border/60 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Усталар Доскасы (Планшет Панели)</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Цехтағы планшет ҳәм мобиль телефонлар ушын бейимлестирилген интерфейс</p>
        </div>
        {activeWorker && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-brand-dark text-rose-450 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider transition-all duration-350 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Системадан шығыў</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Мағлыўматлар жүкленбекте...</span>
        </div>
      ) : (
        /* Main Body */
        <div className="flex-1 flex items-center justify-center">
          {!activeWorker ? (
            /* 1. PIN Lock Screen */
            <div className="w-full max-w-md bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-8 shadow-2xl flex flex-col items-center">
              <div className="p-4 bg-brand-emerald/10 text-brand-emerald rounded-full mb-4 animate-pulse">
                <Lock className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-bold text-slate-200 mb-1">Цех Системасына Кириў</h2>
              <p className="text-xs text-slate-500 mb-6 text-center font-medium">
                Уста ID Pin-кодын киргизесиз (Мәселен: w1 уста ушын "1111", w10 уста ушын "0000")
              </p>

              {/* Display Box */}
              <div className="w-full bg-brand-dark/95 border border-brand-border h-16 rounded-xl flex items-center justify-center mb-4 shadow-inner relative">
                <div className="flex gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div 
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                        pin.length > index 
                          ? 'bg-brand-emerald border-brand-emerald shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-110' 
                          : 'border-slate-700 bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 text-xs text-rose-455 font-semibold flex items-center gap-1.5 bg-rose-950/20 border border-rose-900/35 p-3 rounded-xl w-full">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-3 w-full mb-6">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="bg-brand-dark/75 hover:bg-slate-800 border border-brand-border text-slate-200 text-xl font-bold h-14 rounded-xl flex items-center justify-center transition-all active:scale-95 active:bg-brand-emerald active:text-brand-dark cursor-pointer shadow-sm"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleClear}
                  className="bg-brand-dark/75 hover:bg-slate-800 border border-brand-border text-rose-450 text-xs font-extrabold h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  ТАЗАЛАЎ
                </button>
                <button
                  onClick={() => handleKeyPress('0')}
                  className="bg-brand-dark/75 hover:bg-slate-800 border border-brand-border text-slate-200 text-xl font-bold h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="bg-brand-dark/75 hover:bg-slate-800 border border-brand-border text-slate-400 text-xs font-extrabold h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  ӨШИРИЎ
                </button>
              </div>

              <button
                onClick={handlePinSubmit}
                disabled={pin.length < 4}
                className="w-full bg-brand-emerald disabled:bg-slate-800/80 disabled:text-slate-650 hover:bg-emerald-400 text-brand-dark font-extrabold py-3.5 rounded-xl transition-all duration-200 cursor-pointer text-xs tracking-wider uppercase shadow-md"
              >
                КИРИЎ
              </button>
            </div>
          ) : (
            /* 2. Worker Dashboard */
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Worker Profile & Payout History */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-full">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-200 leading-snug">{activeWorker.fullName}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-450 mt-1">
                        <span className="font-extrabold uppercase tracking-wider text-[9px] bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded text-brand-emerald">
                          {activeWorker.specialty}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400 font-semibold">{activeWorker.dailyStatus === 'WORKSHOP' ? 'Цехта' : 'Орнатыўда'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Устаның Рейтинги</span>
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm">
                      <Star className="w-4 h-4 fill-current text-amber-500" />
                      <span>{activeWorker.rating}</span>
                    </div>
                  </div>

                  <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ислеген жумыс балансы</span>
                    <div className="text-brand-emerald font-extrabold text-xl flex items-center">
                      <DollarSign className="w-4.5 h-4.5 shrink-0" />
                      <span>{getUpdatedWorkerBalance().toLocaleString()} сум</span>
                    </div>
                  </div>
                </div>

                {/* Payouts History Card */}
                <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/80 rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <History className="w-4 h-4 text-brand-emerald" />
                    Орынланған жумыслар ҳәм Төлемлер
                  </h3>

                  {payoutsLoading ? (
                    <div className="py-8 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-brand-emerald animate-spin" />
                    </div>
                  ) : payouts.length === 0 ? (
                    <p className="text-xs text-slate-550 py-4 text-center">Орынланған жумыслар тарийхы табылмады.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                      {payouts.map(p => (
                        <div key={p.id} className="p-3 bg-brand-dark/45 border border-brand-border/60 rounded-xl flex justify-between items-center text-xs">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-350">{p.stageName}</span>
                              <span className="text-[9px] font-mono text-slate-550">{p.orderNumber}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1 font-semibold">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-brand-emerald font-mono">
                            +{p.amount.toLocaleString()} UZS
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Active Task list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-emerald" />
                    Сизге тийисли тапсырмалар
                  </h3>
                  <span className="bg-brand-border/80 border border-slate-700/60 text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {getWorkerTasks().length} актив
                  </span>
                </div>

                <div className="space-y-3">
                  {getWorkerTasks().length === 0 ? (
                    <div className="bg-brand-surface/65 backdrop-blur-md border border-brand-border/85 rounded-2xl p-10 text-center text-slate-500 text-sm font-semibold">
                      Ҳәзирги ўақытта сизге тийисли бос тапсырмалар жоқ.
                    </div>
                  ) : (
                    getWorkerTasks().map(stage => {
                      const orderNum = getOrderNumber(stage.orderId);
                      const custName = getCustomerName(stage.orderId);
                      
                      return (
                        <div 
                          key={stage.id} 
                          className={`bg-brand-surface/65 backdrop-blur-md border hover:border-slate-655 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 shadow-md ${
                            stage.status === 'IN_PROGRESS' ? 'border-brand-emerald/50 bg-gradient-to-r from-brand-emerald/5 to-transparent' : 'border-brand-border'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold font-mono text-slate-500 tracking-wider uppercase">{orderNum}</span>
                              <span className="text-[10px] bg-brand-border text-slate-300 font-extrabold px-2.5 py-0.5 rounded-md border border-slate-700/40">
                                {stage.stageName}
                              </span>
                              {stage.status === 'IN_PROGRESS' && (
                                <span className="text-[9px] bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 px-2 py-0.5 rounded-md font-extrabold animate-pulse">
                                  Орынланбақта
                                </span>
                              )}
                            </div>
                            
                            <h4 className="font-bold text-slate-200 text-sm">{custName}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-semibold">
                              <span>Дедлайн:</span>
                              <span className="text-slate-400">{new Date(stage.plannedEndAt).toLocaleString()}</span>
                            </div>
                            
                            <div className="mt-3.5 text-xs flex items-center gap-1 font-extrabold text-brand-emerald">
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Ислеген жумыс ҳақы: {stage.stagePrice.toLocaleString()} сум</span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {stage.status === 'PENDING' ? (
                              <button
                                onClick={() => handleStartClick(stage.id, activeWorker.id)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer text-xs tracking-wider uppercase shrink-0 shadow-md shadow-brand-emerald/10"
                              >
                                <Play className="w-4 h-4 fill-current" />
                                <span>Баслаў (Start)</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFinishClick(stage.id, stage.stageName)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-100 font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer text-xs tracking-wider uppercase shrink-0 shadow-md shadow-blue-900/10"
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Таўсыў (Finish)</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Offcut Modal Dialog */}
      {showOffcutModal && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-brand-surface border border-brand-border w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-brand-emerald font-extrabold">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-200">Раскройдың қалдық бөлеги</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Кесиў басқышынан кейинги буйыртпаларда қайтадан пайдаланыўға жарамлы болған ДСП/МДФ плита қалдық бөлеги қалды ма?
            </p>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Плита түри</label>
                <select
                  value={offcutProductId}
                  onChange={(e) => setOffcutProductId(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border text-slate-355 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                >
                  {products.filter(p => p.category === 'PLATES').map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.quantityInStock} дана бар)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Узынлығы (метр)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Мәселен: 1.2"
                    value={offcutLength}
                    onChange={(e) => setOffcutLength(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border text-slate-250 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Ени (метр)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Мәселен: 0.8"
                    value={offcutWidth}
                    onChange={(e) => setOffcutWidth(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border text-slate-250 text-xs rounded-lg p-3 focus:ring-brand-emerald focus:border-brand-emerald font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-brand-border/40">
              <button
                onClick={handleSkipOffcutAndFinish}
                className="flex-1 bg-brand-dark/80 hover:bg-slate-800 border border-brand-border text-slate-400 font-bold py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer"
              >
                ҚАЛДЫҚ ҚАЛМАДЫ
              </button>
              <button
                onClick={handleSaveOffcutAndFinish}
                disabled={!offcutLength || !offcutWidth}
                className="flex-1 bg-brand-emerald disabled:bg-slate-800 disabled:text-slate-600 hover:bg-emerald-400 text-brand-dark font-extrabold py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-md"
              >
                ҚАЛДЫҚТЫ САҚЛАЎ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
