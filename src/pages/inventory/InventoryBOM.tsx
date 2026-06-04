import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  Trash2, 
  ClipboardList, 
  Search,
} from 'lucide-react';

export const InventoryBOM: React.FC = () => {
  const { 
    apiMaterials, 
    apiCategories,
    apiOffcuts,
    apiBOMs,
    orders,
    fetchInventoryAPI,
    createMaterialAPI,
    fetchBOMsAPI,
    createBOMAPI,
    isLoading
  } = useStore();

  useEffect(() => {
    fetchInventoryAPI();
  }, []);

  const [activeTab, setActiveTab] = useState<'STOCK' | 'TRANSACTIONS' | 'BOM'>('STOCK');
  
  // Tab 1: Stock states
  const [stockCategory, setStockCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');

  // Add stock transaction modal state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txForm, setTxForm] = useState({
    name: '',
    categoryId: 0,
    quantity: 10,
    unitPrice: 10000,
    low_stock_threshold: 5,
    is_sheet: false
  });

  // Tab 3: BOM Editor active order state
  const [selectedBOMOrderId, setSelectedBOMOrderId] = useState<string>(orders[0]?.id || '');
  const [newBOMItemForm, setNewBOMItemForm] = useState({
    productId: 0,
    requiredQuantity: 1
  });

  // Helper values
  const currentBOMOrder = orders.find(o => o.id === selectedBOMOrderId);
  
  // Calculate stats
  const totalStockItems = apiMaterials.length;
  const lowStockItems = apiMaterials.filter(p => Number(p.quantity) <= Number(p.low_stock_threshold));

  // Filtered products list
  const filteredProducts = apiMaterials.filter(p => {
    const matchesCategory = stockCategory === 'ALL' || String(p.category) === stockCategory;
    const matchesSearch = p.name.toLowerCase().includes(stockSearchQuery.toLowerCase());
    const matchesLowStock = !showLowStockOnly || Number(p.quantity) <= Number(p.low_stock_threshold);
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const handleStockTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.name) return;

    await createMaterialAPI({
      name: txForm.name,
      category: Number(txForm.categoryId),
      quantity: String(txForm.quantity),
      unit_price: String(txForm.unitPrice),
      low_stock_threshold: String(txForm.low_stock_threshold),
      is_sheet: txForm.is_sheet
    });

    setShowAddTxModal(false);
    setTxForm({
      name: '',
      categoryId: apiCategories[0]?.id || 0,
      quantity: 10,
      unitPrice: 10000,
      low_stock_threshold: 5,
      is_sheet: false
    });
  };

  const handleAddBOMItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBOMOrderId || !newBOMItemForm.productId) return;

    const orderIdNum = parseInt(selectedBOMOrderId.replace(/\D/g, '')) || 1;
    await createBOMAPI({
      order: orderIdNum,
      material: Number(newBOMItemForm.productId),
      required_qty: String(newBOMItemForm.requiredQuantity),
      allocated_qty: '0',
      unit_price: '0'
    });
    setNewBOMItemForm({
      ...newBOMItemForm,
      requiredQuantity: 1
    });
  };

  // Get Category label
  const getCategoryLabel = (catId: number) => {
    return apiCategories.find(c => c.id === catId)?.name || 'Noma`lum';
  };

  // Get order's BOM details
  const orderIdNum = parseInt(selectedBOMOrderId.replace(/\D/g, '')) || 1;
  const orderBOMItems = apiBOMs.filter(item => item.order === orderIdNum);
  const totalBOMCost = orderBOMItems.reduce((acc, item) => {
    const p = apiMaterials.find(prod => prod.id === item.material);
    const price = Number(p?.unit_price) || 0;
    return acc + (Number(item.required_qty) * price);
  }, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-brand-dark">
      {/* Top Header Stats */}
      <div className="bg-brand-surface border-b border-brand-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-emerald" /> Omborxona va Xomashyo Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">Materiallar bron qilish, kirim/chiqim hisobi va buyurtma BOM (retsept) tahriri.</p>
        </div>

        {/* Categories select tab */}
        <div className="flex bg-slate-900 border border-brand-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'STOCK' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ombor Qoldiqlari
          </button>
          <button 
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'TRANSACTIONS' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Offcuts (Qoldiq/Brak)
          </button>
          <button 
            onClick={() => setActiveTab('BOM')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition ${
              activeTab === 'BOM' ? 'bg-brand-emerald text-brand-dark' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            BOM (Retsept) Muharriri
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
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">Ombordagi Jami Materiallar</span>
                  <h3 className="text-xl font-black text-slate-100">{totalStockItems} ta</h3>
                </div>
              </div>

              <div className="bg-brand-surface border border-brand-border p-4.5 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase">Tugayotgan Mahsulotlar</span>
                  <h3 className="text-xl font-black text-rose-500">{lowStockItems.length} ta turda</h3>
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
                    placeholder="Material nomini qidirish..."
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
                  <option value="ALL">Barcha Toifalar</option>
                  {apiCategories.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 select-none cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                    className="accent-brand-emerald w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  Faqat tugayotgan tovarlar
                </label>
              </div>

              <button 
                onClick={() => setShowAddTxModal(true)}
                className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Yangi Xomashyo
              </button>
            </div>

            {/* Inventory table */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-4">Nomi & Toifasi</th>
                    <th className="px-5 py-4">Mavjud (Available)</th>
                    <th className="px-5 py-4">O'rtacha Tannarxi</th>
                    <th className="px-5 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {filteredProducts.map(product => {
                    const isLow = Number(product.quantity) <= Number(product.low_stock_threshold);
                    return (
                      <tr 
                        key={product.id} 
                        className={`text-slate-300 font-semibold text-xs transition hover:bg-slate-900/25 ${isLow ? 'bg-rose-500/5' : ''}`}
                      >
                        <td className="px-5 py-4.5">
                          <div className="font-extrabold text-sm text-slate-200">{product.name}</div>
                          <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{getCategoryLabel(product.category)}</span>
                        </td>
                        <td className="px-5 py-4.5 text-brand-emerald font-mono font-black">
                          {product.quantity}
                        </td>
                        <td className="px-5 py-4.5 font-bold font-mono">
                          {Number(product.unit_price).toLocaleString()} UZS
                        </td>
                        <td className="px-5 py-4.5 text-center">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 border border-rose-500/25 text-rose-500 animate-pulse-red">
                              Tugamoqda!
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 border border-emerald-500/25 text-brand-emerald">
                              Yetarli
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

        {/* Tab 2: Offcuts */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="bg-brand-surface border border-brand-border p-4 rounded-2xl flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-200">Ombor Offcuts (Qoldiq/Brak) Logi</h3>
            </div>

            <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-4">Sana</th>
                    <th className="px-5 py-4">Mahsulot</th>
                    <th className="px-5 py-4">O'lchamlari</th>
                    <th className="px-5 py-4">Miqdori</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {apiOffcuts.map(tx => {
                    const prod = apiMaterials.find(p => p.id === tx.material);
                    return (
                      <tr key={tx.id} className="text-slate-300 font-semibold text-xs hover:bg-slate-900/20">
                        <td className="px-5 py-4 font-mono text-slate-500">
                          {tx.added_date ? new Date(tx.added_date).toLocaleString('uz-UZ') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-200">{prod?.name || 'Noma\'lum'}</div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold">
                          {tx.length} x {tx.width}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold">
                          {tx.qty}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                            tx.status === 'AVAILABLE' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-brand-emerald' 
                              : tx.status === 'USED' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}>
                            {tx.status}
                          </span>
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
                  <ClipboardList className="w-4.5 h-4.5 text-brand-emerald" /> Faol Buyurtmalar
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {orders.filter(o => ['YANGI_LID', 'ZAMER_BAJARILDI', 'DIZAYN_LOYYAHALASHDA', 'DIZAYN_TASDIQLANDI', 'TZ_PLANNER_TUZILDI'].includes(o.status)).map(order => (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedBOMOrderId(order.id);
                      fetchBOMsAPI(parseInt(order.id.replace(/\D/g, '')) || 1);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer select-none ${
                      selectedBOMOrderId === order.id 
                        ? 'bg-brand-emerald/10 border-brand-emerald text-slate-100' 
                        : 'bg-brand-surface border-brand-border hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="font-mono text-[10px] font-bold text-slate-500 mb-1">{order.orderNumber}</div>
                    <div className="font-extrabold text-xs text-slate-200">{order.customerName}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOM Editor */}
            <div className="flex-1 flex flex-col h-full relative">
              {!selectedBOMOrderId ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm font-semibold">
                  Chap tomondan buyurtmani tanlang
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full">
                  <div className="p-6 border-b border-brand-border bg-brand-surface/50">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-black text-slate-100">BOM Muharriri</h2>
                        <p className="text-xs text-slate-400 mt-1">Buyurtma: <span className="font-mono font-bold text-slate-300">{currentBOMOrder?.orderNumber}</span> ({currentBOMOrder?.customerName})</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-extrabold uppercase mb-1">Jami Xomashyo Tannarxi</div>
                        <div className="text-2xl font-black text-brand-emerald font-mono">{totalBOMCost.toLocaleString()} UZS</div>
                      </div>
                    </div>

                    <form onSubmit={handleAddBOMItemSubmit} className="flex gap-3">
                      <select 
                        required
                        value={newBOMItemForm.productId}
                        onChange={(e) => setNewBOMItemForm({...newBOMItemForm, productId: Number(e.target.value)})}
                        className="flex-1 bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      >
                        <option value={0}>Material tanlang...</option>
                        {apiMaterials.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({getCategoryLabel(p.category)}) - Ombor: {p.quantity}</option>
                        ))}
                      </select>

                      <input 
                        type="number"
                        required
                        min="0.1"
                        step="0.1"
                        placeholder="Miqdor"
                        value={newBOMItemForm.requiredQuantity}
                        onChange={(e) => setNewBOMItemForm({...newBOMItemForm, requiredQuantity: Number(e.target.value)})}
                        className="w-32 bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                      />

                      <button type="submit" className="bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark px-5 py-2.5 rounded-xl font-black text-xs transition">
                        Qo'shish
                      </button>
                    </form>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-brand-dark">
                    <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-lg shadow-black/20">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900/50 border-b border-brand-border text-[11px] font-black text-slate-500 uppercase tracking-wider">
                            <th className="px-5 py-4">Xomashyo</th>
                            <th className="px-5 py-4">Kerakli Miqdor</th>
                            <th className="px-5 py-4">Tannarx (Birlik)</th>
                            <th className="px-5 py-4 text-right">Summa</th>
                            <th className="px-5 py-4 text-center">Harakat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/60">
                          {orderBOMItems.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-5 py-8 text-center text-xs font-medium text-slate-500">
                                Ushbu buyurtma uchun hali materiallar tanlanmagan.
                              </td>
                            </tr>
                          ) : (
                            orderBOMItems.map(item => {
                              const p = apiMaterials.find(prod => prod.id === item.material);
                              const price = Number(p?.unit_price) || 0;
                              const rowTotal = Number(item.required_qty) * price;
                              
                              return (
                                <tr key={item.id} className="text-slate-300 font-semibold text-xs transition hover:bg-slate-900/20">
                                  <td className="px-5 py-4">
                                    <div className="font-bold text-slate-200">{p?.name || 'Noma\'lum material'}</div>
                                    <span className="text-[10px] text-slate-500 font-medium">Birlik narxi: {price.toLocaleString()} UZS</span>
                                  </td>
                                  <td className="px-5 py-4 font-mono text-amber-500 font-bold">
                                    {item.required_qty}
                                  </td>
                                  <td className="px-5 py-4 font-mono text-slate-400">
                                    {price.toLocaleString()} UZS
                                  </td>
                                  <td className="px-5 py-4 font-mono font-black text-brand-emerald text-right">
                                    {rowTotal.toLocaleString()} UZS
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                    <button 
                                      className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition"
                                      title="O'chirish"
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-black/50">
            <div className="p-5 border-b border-brand-border flex justify-between items-center bg-slate-900/30">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-brand-emerald" /> Yangi Material Qo'shish
              </h3>
              <button 
                onClick={() => setShowAddTxModal(false)}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleStockTxSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Material Nomi</label>
                <input 
                  type="text" 
                  required
                  value={txForm.name}
                  onChange={e => setTxForm({...txForm, name: e.target.value})}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                  placeholder="Masalan: MDF Akril Oq..."
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Kategoriya</label>
                <select 
                  value={txForm.categoryId}
                  onChange={e => setTxForm({...txForm, categoryId: Number(e.target.value)})}
                  className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                >
                  <option value={0}>Tanlang</option>
                  {apiCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Miqdor</label>
                  <input 
                    type="number" 
                    required
                    min="0.1"
                    step="0.1"
                    value={txForm.quantity}
                    onChange={e => setTxForm({...txForm, quantity: Number(e.target.value)})}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Birlik Narxi</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={txForm.unitPrice}
                    onChange={e => setTxForm({...txForm, unitPrice: Number(e.target.value)})}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-emerald"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="flex-1 bg-brand-dark border border-brand-border text-slate-300 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-brand-emerald hover:bg-brand-emerald/90 text-brand-dark font-black text-xs py-2.5 rounded-xl transition"
                >
                  {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
