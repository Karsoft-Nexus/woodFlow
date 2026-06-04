import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Trash2, 
  ClipboardList, 
  DollarSign, 
  Search,
  ShoppingCart
} from 'lucide-react';
import type { ProductCategory } from '../../types';


export const InventoryBOM: React.FC = () => {
  const { 
    products, 
    bomItems, 
    orders, 
    stockTransactions, 
    addStockTransaction, 
    addBOMItem, 
    removeBOMItem 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'TRANSACTIONS' | 'BOM'>('STOCK');
  
  // Tab 1: Stock states
  const [stockCategory, setStockCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');

  // Add stock transaction modal state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txForm, setTxForm] = useState({
    productId: products[0]?.id || '',
    transactionType: 'KIRIM' as 'KIRIM' | 'CHIQIM',
    quantity: 10,
    unitPrice: products[0]?.averagePrice || 10000,
    notes: ''
  });

  // Tab 3: BOM Editor active order state
  const [selectedBOMOrderId, setSelectedBOMOrderId] = useState<string>(orders[0]?.id || '');
  const [newBOMItemForm, setNewBOMItemForm] = useState({
    productId: products[0]?.id || '',
    requiredQuantity: 1
  });

  // Helper values
  const currentBOMOrder = orders.find(o => o.id === selectedBOMOrderId);
  
  // Calculate stats
  const totalStockItems = products.reduce((acc, p) => acc + p.quantityInStock, 0);
  const lowStockItems = products.filter(p => p.quantityInStock <= p.minThreshold);
  const totalReservedItems = products.reduce((acc, p) => acc + p.reservedQuantity, 0);

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesCategory = stockCategory === 'ALL' || p.category === stockCategory;
    const matchesSearch = p.name.toLowerCase().includes(stockSearchQuery.toLowerCase());
    const matchesLowStock = !showLowStockOnly || p.quantityInStock <= p.minThreshold;
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const handleStockTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.productId) return;

    addStockTransaction({
      productId: txForm.productId,
      transactionType: txForm.transactionType,
      quantity: Number(txForm.quantity),
      unitPrice: Number(txForm.unitPrice),
      notes: txForm.notes
    });

    setShowAddTxModal(false);
    setTxForm({
      productId: products[0]?.id || '',
      transactionType: 'KIRIM',
      quantity: 10,
      unitPrice: products[0]?.averagePrice || 10000,
      notes: ''
    });
  };

  const handleAddBOMItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBOMOrderId || !newBOMItemForm.productId) return;

    addBOMItem(selectedBOMOrderId, newBOMItemForm.productId, Number(newBOMItemForm.requiredQuantity));
    setNewBOMItemForm({
      ...newBOMItemForm,
      requiredQuantity: 1
    });
  };

  // Get Category label in Karakalpak
  const getCategoryLabel = (category: ProductCategory) => {
    switch (category) {
      case 'PLATES': return 'Плита материаллары (ДСП/МДФ)';
      case 'STOLISHNITSA': return 'Столешницалар';
      case 'EDGES': return 'Мебель лентасы (Кромка)';
      case 'FURNITURES': return 'Фурнитуралар (Петля, Шуруп)';
      case 'ACCESSORIES': return 'Аксессуарлар (Ручка, Поршень)';
      case 'WEIGHT_ITEMS': return 'Аўырлықтағы шийки затлар (Желим, кг)';
      case 'GLASS': return 'Айна ҳәм Шишелер';
      default: return category;
    }
  };

  // Get order's BOM details
  const orderBOMItems = bomItems.filter(item => item.orderId === selectedBOMOrderId);
  const totalBOMCost = orderBOMItems.reduce((acc, item) => {
    const p = products.find(prod => prod.id === item.productId);
    const price = p?.averagePrice || 0;
    return acc + (item.requiredQuantity * price);
  }, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-brand-dark">
      {/* Top Header Stats */}
      <div className="bg-brand-surface border-b border-brand-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-emerald" /> Омбор ҳәм Шийки Зат Басқарыўы
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Материалларды броньлаў, кирис/шығыс есабы ҳәм буйыртпа ТТ (рецепт) редакторлаў.</p>
        </div>

        {/* Categories select tab */}
        <div className="flex bg-slate-900 border border-brand-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'STOCK' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Омбор қалдықлары
          </button>
          <button 
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'TRANSACTIONS' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Кирис-шығыс тарийхы
          </button>
          <button 
            onClick={() => setActiveTab('BOM')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'BOM' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ТТ (Рецепт) редакторы
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-hidden">
        
        {/* Tab 1: Ombor Qoldiqlari */}
        {activeTab === 'STOCK' && (
          <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-brand-surface border border-brand-border p-4.5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">Омбордағы жәми материаллар</span>
                  <h3 className="text-xl font-black text-slate-100">{totalStockItems} та</h3>
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-4.5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">Резервке (Броньға) алынған</span>
                  <h3 className="text-xl font-black text-slate-100">{totalReservedItems} та</h3>
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-4.5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">Таўсылып атырған өнимлер</span>
                  <h3 className="text-xl font-black text-rose-500">{lowStockItems.length} та түрде</h3>
                </div>
              </div>
            </div>

            {/* Filters and search bar */}
            <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Материал атын излеў..."
                    value={stockSearchQuery}
                    onChange={(e) => setStockSearchQuery(e.target.value)}
                    className="bg-brand-dark border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald w-64"
                  />
                </div>

                <select 
                  value={stockCategory}
                  onChange={(e) => setStockCategory(e.target.value)}
                  className="bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
                >
                  <option value="ALL">Барлық категориялар</option>
                  <option value="PLATES">Плиталар (ДСП/МДФ)</option>
                  <option value="STOLISHNITSA">Столешницалар</option>
                  <option value="EDGES">Кромка</option>
                  <option value="FURNITURES">Фурнитуралар (Петля, Шуруп)</option>
                  <option value="ACCESSORIES">Аксессуарлар (Ручка, Поршень)</option>
                  <option value="WEIGHT_ITEMS">Аўырлықтағы шийки затлар (Желим, кг)</option>
                  <option value="GLASS">Айна ҳәм Шишелер</option>
                </select>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 select-none cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                    className="accent-brand-emerald w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  Тек таўсылып атырған товарлар
                </label>
              </div>

              <button 
                onClick={() => setShowAddTxModal(true)}
                className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Кирис / Шығыс етиў
              </button>
            </div>

            {/* Inventory table */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-4">Аты ҳәм Категориясы</th>
                    <th className="px-5 py-4">Хәзирги қалдық</th>
                    <th className="px-5 py-4">Резерв (Бронь)</th>
                    <th className="px-5 py-4">Бар (Маўжыт)</th>
                    <th className="px-5 py-4">Орташа өз баҳасы</th>
                    <th className="px-5 py-4 text-center">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {filteredProducts.map(product => {
                    const isLow = product.quantityInStock <= product.minThreshold;
                    return (
                      <tr 
                        key={product.id} 
                        className={`text-slate-300 font-semibold text-xs transition hover:bg-slate-900/25 ${isLow ? 'bg-rose-500/5' : ''}`}
                      >
                        <td className="px-5 py-4.5">
                          <div className="font-extrabold text-sm text-slate-200">{product.name}</div>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{getCategoryLabel(product.category)}</span>
                        </td>
                        <td className="px-5 py-4.5 font-mono">
                          {product.quantityInStock} {product.unitOfMeasure}
                        </td>
                        <td className="px-5 py-4.5 text-yellow-500 font-mono">
                          {product.reservedQuantity} {product.unitOfMeasure}
                        </td>
                        <td className="px-5 py-4.5 text-brand-emerald font-mono font-black">
                          {product.availableQuantity} {product.unitOfMeasure}
                        </td>
                        <td className="px-5 py-4.5 font-bold font-mono">
                          {product.averagePrice.toLocaleString()} UZS
                        </td>
                        <td className="px-5 py-4.5 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 border border-rose-500/25 text-rose-500 animate-pulse-red">
                              Таўсылмақта!
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 border border-emerald-500/25 text-brand-emerald">
                              Жетерли
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Kirim-Chiqim Tarixi */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-200">Барлық омбор жумысларының журналы</h3>
              <button 
                onClick={() => setShowAddTxModal(true)}
                className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs px-4 py-2 rounded-xl transition"
              >
                Жаңа жумыс қосыў
              </button>
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-4">Сәне / Ўақыт</th>
                    <th className="px-5 py-4">Өним аты</th>
                    <th className="px-5 py-4">Әмелият</th>
                    <th className="px-5 py-4">Муғдары</th>
                    <th className="px-5 py-4">Баҳасы (Бирлик)</th>
                    <th className="px-5 py-4">Түсиниклер / Толық мағлыўмат</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {stockTransactions.map(tx => {
                    const prod = products.find(p => p.id === tx.productId);
                    const isKirim = tx.transactionType === 'KIRIM';
                    return (
                      <tr key={tx.id} className="text-slate-300 font-semibold text-xs hover:bg-slate-900/20">
                        <td className="px-5 py-4 font-mono text-slate-500">
                          {new Date(tx.createdAt).toLocaleString('uz-UZ')}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-200">{prod?.name || 'Намәлим өним'}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{tx.productId}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                            isKirim 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-brand-emerald' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}>
                            {isKirim ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {isKirim ? 'КИРИС' : 'ШЫҒЫС'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold">
                          {isKirim ? '+' : '-'}{tx.quantity} {prod?.unitOfMeasure}
                        </td>
                        <td className="px-5 py-4 font-mono">
                          {tx.unitPrice.toLocaleString()} UZS
                        </td>
                        <td className="px-5 py-4 text-slate-400 italic max-w-xs truncate">
                          {tx.notes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: BOM (Retsept) Muharriri */}
        {activeTab === 'BOM' && (
          <div className="h-full flex overflow-hidden">
            {/* Active Orders List */}
            <div className="w-80 border-r border-brand-border bg-slate-900/25 flex flex-col h-full">
              <div className="p-4 border-b border-brand-border">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-4.5 h-4.5 text-brand-emerald" /> Актив буйыртпалар
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {orders.filter(o => ['YANGI_LID', 'ZAMER_BAJARILDI', 'DIZAYN_LOYYAHALASHDA', 'DIZAYN_TASDIQLANDI', 'TZ_PLANNER_TUZILDI'].includes(o.status)).map(order => (
                  <div 
                    key={order.id}
                    onClick={() => setSelectedBOMOrderId(order.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer select-none ${
                      selectedBOMOrderId === order.id 
                        ? 'bg-brand-emerald/10 border-brand-emerald text-slate-100' 
                        : 'bg-brand-surface border-brand-border hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="font-mono text-[10px] font-bold text-slate-500 mb-1">{order.orderNumber}</div>
                    <div className="font-extrabold text-xs text-slate-200">{order.customerName}</div>
                    <div className="mt-2 text-[10px] font-semibold text-slate-500 flex justify-between">
                      <span>Status:</span>
                      <span className="text-brand-emerald">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOM Editor Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {currentBOMOrder ? (
                <>
                  <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase mb-1">Буйыртпа мағлыўматы</span>
                      <h3 className="text-base font-black text-slate-100">{currentBOMOrder.customerName} ({currentBOMOrder.orderNumber})</h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Түри: {currentBOMOrder.source} • Status: {currentBOMOrder.status}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-extrabold block mb-1">Шийки заттың жәми өз баҳасы</span>
                      <span className="text-lg font-black text-brand-emerald font-mono flex items-center justify-end">
                        <DollarSign className="w-5 h-5 -mr-1" /> {totalBOMCost.toLocaleString()} UZS
                      </span>
                    </div>
                  </div>

                  {/* Add BOM Item Form */}
                  <div className="bg-brand-surface border border-brand-border p-5 rounded-2xl">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Материалды / Шийки затты рецептке қосыў</h4>
                    <form onSubmit={handleAddBOMItemSubmit} className="flex flex-col md:flex-row items-end gap-4">
                      
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Материал түрин таңлаң</label>
                        <select 
                          value={newBOMItemForm.productId}
                          onChange={(e) => setNewBOMItemForm({ ...newBOMItemForm, productId: e.target.value })}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.quantityInStock} {p.unitOfMeasure} бар)</option>
                          ))}
                        </select>
                      </div>

                      <div className="w-32 space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Муғдары</label>
                        <input 
                          type="number" 
                          min="0.01"
                          step="0.01"
                          value={newBOMItemForm.requiredQuantity}
                          onChange={(e) => setNewBOMItemForm({ ...newBOMItemForm, requiredQuantity: Number(e.target.value) })}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Рецептке қосыў
                      </button>
                    </form>
                  </div>

                  {/* Order's BOM Table */}
                  <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                          <th className="px-5 py-4">Өним аты</th>
                          <th className="px-5 py-4">Керекли муғдар</th>
                          <th className="px-5 py-4">Броньланған</th>
                          <th className="px-5 py-4">Бирлик баҳа</th>
                          <th className="px-5 py-4">Жәми баҳа</th>
                          <th className="px-5 py-4 text-center">Өшириў</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {orderBOMItems.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-xs text-slate-500 font-bold">
                              Материаллар рецептке бириктирилмеген. Жоқарыдан қосыўыңыз мүмкин.
                            </td>
                          </tr>
                        ) : (
                          orderBOMItems.map(item => {
                            const p = products.find(prod => prod.id === item.productId);
                            const price = p?.averagePrice || 0;
                            return (
                              <tr key={item.id} className="text-slate-300 font-semibold text-xs hover:bg-slate-900/20">
                                <td className="px-5 py-4">
                                  <div className="font-bold text-slate-200">{p?.name || 'Намәлим'}</div>
                                  <span className="text-[10px] text-slate-500 font-mono">{item.productId}</span>
                                </td>
                                <td className="px-5 py-4 font-mono font-bold">
                                  {item.requiredQuantity} {p?.unitOfMeasure}
                                </td>
                                <td className="px-5 py-4 text-yellow-500 font-mono">
                                  {item.allocatedQuantity} {p?.unitOfMeasure}
                                </td>
                                <td className="px-5 py-4 font-mono">
                                  {price.toLocaleString()} UZS
                                </td>
                                <td className="px-5 py-4 font-mono font-bold text-slate-100">
                                  {(item.requiredQuantity * price).toLocaleString()} UZS
                                </td>
                                <td className="px-5 py-4 text-center">
                                  <button 
                                    onClick={() => removeBOMItem(item.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-slate-500 font-bold text-sm">
                  Киши ТТ / Жойбарлаў басқышындағы буйыртpa таңланбаған.
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Kirim / Chiqim Qo'shish Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-slate-900/50">
              <h2 className="text-base font-black text-slate-100">Омборға Кирис / Шығыс әмелиятлары</h2>
              <button 
                onClick={() => setShowAddTxModal(false)}
                className="text-slate-500 hover:text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleStockTxSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase">Материал / Товар</label>
                <select 
                  value={txForm.productId}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    setTxForm({ 
                      ...txForm, 
                      productId: e.target.value,
                      unitPrice: prod?.averagePrice || 10000 
                    });
                  }}
                  required
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.unitOfMeasure})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Әмелият түри</label>
                  <select 
                    value={txForm.transactionType}
                    onChange={(e) => setTxForm({ ...txForm, transactionType: e.target.value as any })}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none"
                  >
                    <option value="KIRIM">Кирис (Кассадан материалға)</option>
                    <option value="CHIQIM">Шығыс (Цехқа шығыў)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase">Муғдары (Қалдық болса бөлшек сан киргизиң)</label>
                  <input 
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={txForm.quantity}
                    onChange={(e) => setTxForm({ ...txForm, quantity: Number(e.target.value) })}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase">Бирлик баҳасы (UZS)</label>
                <input 
                  type="number"
                  required
                  value={txForm.unitPrice}
                  onChange={(e) => setTxForm({ ...txForm, unitPrice: Number(e.target.value) })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2 text-xs font-bold text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase">Түсиник (Жеткерип бериўши / Себеби)</label>
                <input 
                  type="text"
                  placeholder="Мәселен: МебельАлимПлас ЖШЖ тәрепинен жеткерилди"
                  value={txForm.notes}
                  onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddTxModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl border border-brand-border transition"
                >
                  Бийкар етиў
                </button>
                <button 
                  type="submit"
                  className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark text-xs font-black px-5 py-2 rounded-xl transition"
                >
                  Әмелге асырыў
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
