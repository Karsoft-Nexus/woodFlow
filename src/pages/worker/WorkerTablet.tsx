import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { Worker } from '../../types';
import { 
  Lock, 
  User, 
  Play, 
  Check, 
  DollarSign, 
  Star, 
  AlertTriangle,
  RefreshCw,
  LogOut
} from 'lucide-react';

export const WorkerTablet: React.FC = () => {
  const { 
    workers, 
    productionStages, 
    orders, 
    startStage, 
    finishStage,
    products,
    addOffcut
  } = useStore();

  const [pin, setPin] = useState('');
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);
  const [error, setError] = useState('');

  // Offcut modal states
  const [showOffcutModal, setShowOffcutModal] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [offcutProductId, setOffcutProductId] = useState('');
  const [offcutLength, setOffcutLength] = useState('');
  const [offcutWidth, setOffcutWidth] = useState('');

  // Map worker to simple pin codes (w1 -> 1111, w2 -> 2222, etc.)
  const getPinForWorker = (id: string) => {
    const num = id.replace('w', '');
    return num.repeat(4).substring(0, 4);
  };

  const handlePinSubmit = () => {
    const foundWorker = workers.find(w => getPinForWorker(w.id) === pin);
    if (foundWorker) {
      if (foundWorker.dailyStatus === 'ABSENT') {
        setError('Siz bugun "Kelmagan" deb belgilangansiz. Iltimos, menejerga murojaat qiling!');
        setPin('');
      } else {
        setActiveWorker(foundWorker);
        setError('');
        setPin('');
      }
    } else {
      setError('Noto\'g\'ri PIN-kod! Qaytadan urinib ko\'ring.');
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
      finishStage(stageId);
    }
  };

  const handleSaveOffcutAndFinish = () => {
    if (selectedStageId) {
      if (offcutProductId && offcutLength && offcutWidth) {
        addOffcut(
          offcutProductId,
          Number(offcutLength),
          Number(offcutWidth),
          productionStages.find(s => s.id === selectedStageId)?.orderId || ''
        );
      }
      finishStage(selectedStageId);
      setShowOffcutModal(false);
      setSelectedStageId(null);
      setOffcutLength('');
      setOffcutWidth('');
    }
  };

  const handleSkipOffcutAndFinish = () => {
    if (selectedStageId) {
      finishStage(selectedStageId);
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

      const isInstallStage = stage.stageName === 'USTANOVKA';
      if (isInstallationWorker && !isInstallStage) return false;
      if (!isInstallationWorker && isInstallStage) return false;

      return !stage.assignedWorkerId || stage.assignedWorkerId === activeWorker.id;
    });
  };

  const getOrderNumber = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.orderNumber || '';
  };

  const getCustomerName = (orderId: string) => {
    return orders.find(o => o.id === orderId)?.customerName || '';
  };

  return (
    <div className="h-full min-h-screen bg-brand-dark flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Ustalar Doskasi (Planshet Paneli)</h1>
          <p className="text-xs text-slate-500 mt-0.5">Sexdagi planshet va mobil telefonlar uchun moslashtirilgan interfeys</p>
        </div>
        {activeWorker && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-brand-dark text-rose-400 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Tizimdan Chiqish</span>
          </button>
        )}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center">
        {!activeWorker ? (
          /* 1. PIN Lock Screen */
          <div className="w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <div className="p-4 bg-brand-emerald/10 text-brand-emerald rounded-full mb-4">
              <Lock className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-200 mb-1">Sex Tizimiga Kirish</h2>
            <p className="text-xs text-slate-500 mb-6 text-center">Usta ID Pin-kodini kiriting (Masalan: w1 usta uchun "1111", w2 uchun "2222")</p>

            {/* Display Box */}
            <div className="w-full bg-brand-dark border border-brand-border h-16 rounded-xl flex items-center justify-center mb-4 relative">
              <div className="flex gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div 
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 ${pin.length > index ? 'bg-brand-emerald border-brand-emerald' : 'border-slate-700 bg-transparent'}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 text-xs text-rose-400 font-semibold flex items-center gap-1.5 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg w-full">
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
                  className="bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-200 text-xl font-bold h-14 rounded-xl flex items-center justify-center transition-colors active:bg-brand-emerald active:text-brand-dark cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="bg-brand-dark hover:bg-slate-800 border border-brand-border text-rose-400 text-sm font-bold h-14 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                TOZALASH
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-200 text-xl font-bold h-14 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-400 text-sm font-bold h-14 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                O'CHIRISH
              </button>
            </div>

            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4}
              className="w-full bg-brand-emerald disabled:bg-slate-800 disabled:text-slate-600 hover:bg-emerald-400 text-brand-dark font-extrabold py-3.5 rounded-xl transition-colors cursor-pointer text-sm tracking-wider"
            >
              KIRISH
            </button>
          </div>
        ) : (
          /* 2. Worker Dashboard */
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Worker Profile Card */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-full">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-200">{activeWorker.fullName}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <span className="font-semibold uppercase tracking-wider text-[10px] bg-brand-border px-2 py-0.5 rounded text-brand-emerald">{activeWorker.specialty}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-semibold">{activeWorker.dailyStatus === 'WORKSHOP' ? 'Sexda' : 'O\'rnatishda'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-border/60 pt-4 flex justify-between items-center">
                <span className="text-slate-500 text-xs font-semibold">Reyting</span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{activeWorker.rating}</span>
                </div>
              </div>

              <div className="border-t border-brand-border/60 pt-4 flex justify-between items-center">
                <span className="text-slate-500 text-xs font-semibold">Ishbay Balans</span>
                <div className="text-brand-emerald font-extrabold text-lg flex items-center">
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>{activeWorker.payoutBalance.toLocaleString()} so'm</span>
                </div>
              </div>
            </div>

            {/* Task list Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-brand-emerald" />
                  Sizga Tegishli Topshiriqlar
                </h3>
                <span className="bg-brand-border text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {getWorkerTasks().length} ta faol
                </span>
              </div>

              <div className="space-y-3">
                {getWorkerTasks().length === 0 ? (
                  <div className="bg-brand-surface border border-brand-border rounded-xl p-8 text-center text-slate-500 text-sm">
                    Ayni paytda siz uchun hech qanday bo'sh topshiriq mavjud emas.
                  </div>
                ) : (
                  getWorkerTasks().map(stage => {
                    const orderNum = getOrderNumber(stage.orderId);
                    const custName = getCustomerName(stage.orderId);
                    
                    return (
                      <div 
                        key={stage.id} 
                        className="bg-brand-surface border border-brand-border hover:border-slate-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono text-slate-500">{orderNum}</span>
                            <span className="text-xs bg-brand-border text-slate-300 font-bold px-2 py-0.5 rounded">{stage.stageName}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-200 text-sm">{custName}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <span>Rejalashtirilgan dedlayn:</span>
                            <span className="font-semibold text-slate-400">{new Date(stage.plannedEndAt).toLocaleString()}</span>
                          </div>
                          
                          <div className="mt-3 text-xs flex items-center gap-1.5 font-bold text-brand-emerald">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Bajarilgandan so'ng: {stage.stagePrice.toLocaleString()} so'm</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {stage.status === 'PENDING' ? (
                            <button
                              onClick={() => startStage(stage.id, activeWorker.id)}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-emerald hover:bg-emerald-400 text-brand-dark font-extrabold px-6 py-3.5 rounded-xl transition-colors cursor-pointer text-sm tracking-wide shrink-0"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>Boshlash (Start)</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFinishClick(stage.id, stage.stageName)}
                              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-slate-100 font-extrabold px-6 py-3.5 rounded-xl transition-colors cursor-pointer text-sm tracking-wide shrink-0"
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Tugatish (Finish)</span>
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

      {/* Offcut Modal Dialog */}
      {showOffcutModal && (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-surface border border-brand-border w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-200">Arra (Raskroy) qoldiq bo'lagi</h3>
            <p className="text-xs text-slate-500">
              Ushbu kesish jarayonidan keyin keyingi buyurtmalarda ishlatishga yaroqli bo'lgan plita qoldiq bo'lagi qoldimi?
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Plita Turi</label>
                <select
                  value={offcutProductId}
                  onChange={(e) => setOffcutProductId(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald cursor-pointer"
                >
                  {products.filter(p => p.category === 'PLATES').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Bo'yi (metr)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Masalan: 1.2"
                    value={offcutLength}
                    onChange={(e) => setOffcutLength(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Eni (metr)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Masalan: 0.8"
                    value={offcutWidth}
                    onChange={(e) => setOffcutWidth(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-border text-slate-300 text-xs rounded-lg p-2.5 focus:ring-brand-emerald focus:border-brand-emerald"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSkipOffcutAndFinish}
                className="flex-1 bg-brand-dark hover:bg-slate-800 border border-brand-border text-slate-400 font-bold py-2.5 rounded-lg text-xs tracking-wider transition-colors cursor-pointer"
              >
                QOLDIQ QOLMADI
              </button>
              <button
                onClick={handleSaveOffcutAndFinish}
                disabled={!offcutLength || !offcutWidth}
                className="flex-1 bg-brand-emerald disabled:bg-slate-800 disabled:text-slate-600 hover:bg-emerald-400 text-brand-dark font-extrabold py-2.5 rounded-lg text-xs tracking-wider transition-colors cursor-pointer"
              >
                QOLDIQNI SAQLASH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
