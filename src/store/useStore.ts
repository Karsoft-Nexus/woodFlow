import { create } from 'zustand';
import type { Order, Worker, ProductionStage, FinancialTransaction, Product, OrderStatus, WorkerDailyStatus, BOMItem, StockTransaction, WallDimensions, Material, MaterialCategory, Offcut, BOM, Unit } from '../types';
import { productionApi, financeApi, warehouseApi, bomApi } from '../api';

interface AppState {
  orders: Order[];
  workers: Worker[];
  productionStages: ProductionStage[];
  financeTransactions: FinancialTransaction[];
  products: Product[];
  bomItems: BOMItem[];
  stockTransactions: StockTransaction[];
  
  // Real API States (Agent 2)
  apiMaterials: Material[];
  apiCategories: MaterialCategory[];
  apiUnits: Unit[];
  apiOffcuts: Offcut[];
  apiBOMs: BOM[];
  
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  updateWorkerDailyStatus: (workerId: string, status: WorkerDailyStatus) => Promise<void>;
  startStage: (stageId: string, workerId: string) => Promise<void>;
  finishStage: (stageId: string) => Promise<void>;
  addFinancialTransaction: (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'status' | 'isContractSigned' | 'isDesignApproved'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignWorkerToStage: (stageId: string, workerId: string) => void;
  addOffcut: (productId: string, length: number, width: number, orderId: string) => void;

  // CRM / Agent 1 Actions
  assignZamerchik: (orderId: string, workerId: string, scheduledAt: string) => void;
  uploadZamerDetails: (orderId: string, dimensions: WallDimensions, sketchUrl?: string) => void;
  upload3DDesign: (orderId: string, designUrl: string) => void;
  approveDesign: (orderId: string) => void;
  createSchedule: (orderId: string, plannedStartAt: string, plannedEndAt: string) => void;
  signContract: (orderId: string, totalPrice: number, advancePayment: number, paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER') => boolean;

  // Inventory & BOM / Agent 2 Actions
  addBOMItem: (orderId: string, productId: string, requiredQuantity: number) => void;
  removeBOMItem: (bomItemId: string) => void;
  addStockTransaction: (tx: Omit<StockTransaction, 'id' | 'createdAt'>) => void;
  
  // Real API Actions (Agent 2)
  fetchInventoryAPI: () => Promise<void>;
  createMaterialAPI: (data: Omit<Material, 'id'>) => Promise<void>;
  fetchBOMsAPI: (orderId?: number) => Promise<void>;
  createBOMAPI: (data: Omit<BOM, 'id'>) => Promise<void>;
}

// Initial Mock Data
const initialWorkers: Worker[] = [
  { id: 'w1', fullName: 'Alijon Karimov', specialty: 'RASKROY', dailyStatus: 'WORKSHOP', rating: 4.8, payoutBalance: 1250000 },
  { id: 'w2', fullName: 'Sardor Azimov', specialty: 'KROMKA', dailyStatus: 'WORKSHOP', rating: 4.7, payoutBalance: 980000 },
  { id: 'w3', fullName: 'Jahongir Tojiyev', specialty: 'PRISTADKA', dailyStatus: 'WORKSHOP', rating: 4.9, payoutBalance: 1400000 },
  { id: 'w4', fullName: 'Doston Rustamov', specialty: 'SBORKA', dailyStatus: 'WORKSHOP', rating: 4.5, payoutBalance: 850000 },
  { id: 'w5', fullName: 'Bekzod Solihov', specialty: 'USTANOVKA', dailyStatus: 'INSTALLATION', rating: 4.6, payoutBalance: 1100000 },
  { id: 'w6', fullName: 'Mirjalol Umarov', specialty: 'RASKROY', dailyStatus: 'WORKSHOP', rating: 4.4, payoutBalance: 600000 },
  { id: 'w7', fullName: 'Shohruh Rahmonov', specialty: 'SBORKA', dailyStatus: 'WORKSHOP', rating: 4.8, payoutBalance: 1550000 },
  { id: 'w8', fullName: 'Farhod Olimov', specialty: 'USTANOVKA', dailyStatus: 'INSTALLATION', rating: 4.7, payoutBalance: 1200000 },
  { id: 'w9', fullName: 'Otabek Yusupov', specialty: 'KROMKA', dailyStatus: 'ABSENT', rating: 4.2, payoutBalance: 450000 },
  { id: 'w10', fullName: 'Jasur Shodiyev', specialty: 'PRISTADKA', dailyStatus: 'WORKSHOP', rating: 4.9, payoutBalance: 1800000 }
];

const initialProducts: Product[] = [
  { id: 'p1', name: 'L DSP Rossiya 2.5x1.83m Oq', category: 'PLATES', unitOfMeasure: 'LIST', quantityInStock: 45, reservedQuantity: 15, availableQuantity: 30, averagePrice: 350000, minThreshold: 10 },
  { id: 'p2', name: 'MDF Akril Turkiya Kulrang', category: 'PLATES', unitOfMeasure: 'LIST', quantityInStock: 25, reservedQuantity: 8, availableQuantity: 17, averagePrice: 650000, minThreshold: 5 },
  { id: 'p3', name: 'Kromka 19/0.4 PVC', category: 'EDGES', unitOfMeasure: 'METR', quantityInStock: 450, reservedQuantity: 120, availableQuantity: 330, averagePrice: 3500, minThreshold: 100 },
  { id: 'p4', name: 'Stolishnitsa Rossiya 3m', category: 'STOLISHNITSA', unitOfMeasure: 'PIECE', quantityInStock: 20, reservedQuantity: 5, availableQuantity: 15, averagePrice: 450000, minThreshold: 5 },
  { id: 'p5', name: 'Topsa (Petlya) Blum soft-close', category: 'FURNITURES', unitOfMeasure: 'PIECE', quantityInStock: 180, reservedQuantity: 48, availableQuantity: 132, averagePrice: 25000, minThreshold: 30 },
  { id: 'p6', name: 'Evro shrup 7x50', category: 'FURNITURES', unitOfMeasure: 'PIECE', quantityInStock: 2500, reservedQuantity: 600, availableQuantity: 1900, averagePrice: 400, minThreshold: 500 },
  { id: 'p7', name: 'Rushka Kishmish Matte Black', category: 'ACCESSORIES', unitOfMeasure: 'PIECE', quantityInStock: 120, reservedQuantity: 32, availableQuantity: 88, averagePrice: 18000, minThreshold: 20 },
  { id: 'p8', name: 'Porshun (Gazlift) 80N', category: 'ACCESSORIES', unitOfMeasure: 'PIECE', quantityInStock: 8, reservedQuantity: 6, availableQuantity: 2, averagePrice: 15000, minThreshold: 10 },
  { id: 'p9', name: 'Yelim (Glue) Kleiberit', category: 'WEIGHT_ITEMS', unitOfMeasure: 'KG', quantityInStock: 35, reservedQuantity: 10, availableQuantity: 25, averagePrice: 75000, minThreshold: 8 },
  { id: 'p10', name: 'Oyna (Zerkalo) 4mm', category: 'GLASS', unitOfMeasure: 'M_KV', quantityInStock: 15, reservedQuantity: 2, availableQuantity: 13, averagePrice: 120000, minThreshold: 5 }
];

const initialOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'WF-2026-001',
    customerName: 'Akmal Toshpo\'latov',
    customerPhone: '+998 90 123 45 67',
    source: 'TELEGRAM',
    status: 'PRODUCTION',
    totalPrice: 25000000,
    advancePayment: 12000000,
    paymentMethod: 'CARD',
    isContractSigned: true,
    contractSignedAt: '2026-06-01T10:00:00Z',
    plannedStartAt: '2026-06-02T08:00:00Z',
    plannedEndAt: '2026-06-08T18:00:00Z',
    actualStartAt: '2026-06-02T09:30:00Z',
    isDesignApproved: true,
    designApprovedAt: '2026-06-01T09:00:00Z',
    dimensions: {
      length: 4.2,
      width: 3.5,
      height: 2.8,
      has90DegreeCorners: true,
      hasGasPipes: true,
      hasWaterPipes: true,
      hasElectricalOutlets: true
    },
    design3dUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'o2',
    orderNumber: 'WF-2026-002',
    customerName: 'Zilola G\'ofurova',
    customerPhone: '+998 99 876 54 32',
    source: 'INSTAGRAM',
    status: 'DIZAYN_LOYYAHALASHDA',
    totalPrice: 18000000,
    advancePayment: 0,
    isContractSigned: false,
    plannedStartAt: '2026-06-03T08:00:00Z',
    plannedEndAt: '2026-06-12T18:00:00Z',
    isDesignApproved: false,
    assignedZamerchikId: 'w5',
    zamerScheduledAt: '2026-06-02T14:00:00Z',
    dimensions: {
      length: 3.8,
      width: 2.5,
      height: 2.7,
      has90DegreeCorners: false,
      hasGasPipes: false,
      hasWaterPipes: true,
      hasElectricalOutlets: true
    }
  },
  {
    id: 'o3',
    orderNumber: 'WF-2026-003',
    customerName: 'Farrux Shermatov',
    customerPhone: '+998 94 444 33 22',
    source: 'PHONE',
    status: 'YANGI_LID',
    totalPrice: 32000000,
    advancePayment: 0,
    isContractSigned: false,
    isDesignApproved: false
  },
  {
    id: 'o4',
    orderNumber: 'WF-2026-004',
    customerName: 'Davron Abdullayev',
    customerPhone: '+998 93 555 66 77',
    source: 'OFFICE',
    status: 'PRODUCTION',
    totalPrice: 15000000,
    advancePayment: 8000000,
    paymentMethod: 'CASH',
    isContractSigned: true,
    contractSignedAt: '2026-06-02T11:00:00Z',
    plannedStartAt: '2026-06-03T08:00:00Z',
    plannedEndAt: '2026-06-05T18:00:00Z',
    actualStartAt: '2026-06-03T09:00:00Z',
    isDesignApproved: true,
    designApprovedAt: '2026-06-02T10:00:00Z',
    dimensions: {
      length: 3.0,
      width: 2.0,
      height: 2.6,
      has90DegreeCorners: true,
      hasGasPipes: false,
      hasWaterPipes: true,
      hasElectricalOutlets: true
    },
    design3dUrl: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'o5',
    orderNumber: 'WF-2026-005',
    customerName: 'Komil Oripov',
    customerPhone: '+998 97 777 88 99',
    source: 'OFFICE',
    status: 'TAYYOR_OTK',
    totalPrice: 42000000,
    advancePayment: 20000000,
    paymentMethod: 'BANK_TRANSFER',
    isContractSigned: true,
    contractSignedAt: '2026-05-25T14:30:00Z',
    plannedStartAt: '2026-05-26T08:00:00Z',
    plannedEndAt: '2026-06-03T18:00:00Z',
    actualStartAt: '2026-05-26T09:00:00Z',
    actualEndAt: '2026-06-03T16:00:00Z',
    isDesignApproved: true,
    designApprovedAt: '2026-05-24T11:00:00Z'
  }
];

const initialBOMItems: BOMItem[] = [
  { id: 'b1', orderId: 'o1', productId: 'p1', requiredQuantity: 10, allocatedQuantity: 10, unitPriceAtReservation: 350000 },
  { id: 'b2', orderId: 'o1', productId: 'p3', requiredQuantity: 120, allocatedQuantity: 120, unitPriceAtReservation: 3500 },
  { id: 'b3', orderId: 'o1', productId: 'p5', requiredQuantity: 24, allocatedQuantity: 24, unitPriceAtReservation: 25000 },
  { id: 'b4', orderId: 'o1', productId: 'p6', requiredQuantity: 400, allocatedQuantity: 400, unitPriceAtReservation: 400 },
  { id: 'b5', orderId: 'o4', productId: 'p2', requiredQuantity: 5, allocatedQuantity: 5, unitPriceAtReservation: 650000 },
  { id: 'b6', orderId: 'o4', productId: 'p4', requiredQuantity: 50, allocatedQuantity: 50, unitPriceAtReservation: 6000 },
  { id: 'b7', orderId: 'o4', productId: 'p5', requiredQuantity: 12, allocatedQuantity: 12, unitPriceAtReservation: 25000 }
];

const initialProductionStages: ProductionStage[] = [
  // Stages for Order 1 (Akmal Toshpo'latov - PRODUCTION)
  { id: 's1_1', orderId: 'o1', stageName: 'RASKROY', status: 'DONE', assignedWorkerId: 'w1', plannedStartAt: '2026-06-02T08:00:00Z', plannedEndAt: '2026-06-03T12:00:00Z', actualStartAt: '2026-06-02T09:30:00Z', actualEndAt: '2026-06-03T11:00:00Z', stagePrice: 250000 },
  { id: 's1_2', orderId: 'o1', stageName: 'KROMKA', status: 'IN_PROGRESS', assignedWorkerId: 'w2', plannedStartAt: '2026-06-03T13:00:00Z', plannedEndAt: '2026-06-04T18:00:00Z', actualStartAt: '2026-06-03T14:00:00Z', stagePrice: 200000 },
  { id: 's1_3', orderId: 'o1', stageName: 'PRISTADKA', status: 'PENDING', plannedStartAt: '2026-06-05T08:00:00Z', plannedEndAt: '2026-06-05T18:00:00Z', stagePrice: 150000 },
  { id: 's1_4', orderId: 'o1', stageName: 'SBORKA', status: 'PENDING', plannedStartAt: '2026-06-06T08:00:00Z', plannedEndAt: '2026-06-07T18:00:00Z', stagePrice: 400000 },
  { id: 's1_5', orderId: 'o1', stageName: 'USTANOVKA', status: 'PENDING', plannedStartAt: '2026-06-08T08:00:00Z', plannedEndAt: '2026-06-08T18:00:00Z', stagePrice: 300000 },

  // Stages for Order 4 (Davron Abdullayev - PRODUCTION)
  { id: 's4_1', orderId: 'o4', stageName: 'RASKROY', status: 'DONE', assignedWorkerId: 'w6', plannedStartAt: '2026-06-03T08:00:00Z', plannedEndAt: '2026-06-03T18:00:00Z', actualStartAt: '2026-06-03T09:00:00Z', actualEndAt: '2026-06-03T17:30:00Z', stagePrice: 180000 },
  { id: 's4_2', orderId: 'o4', stageName: 'KROMKA', status: 'IN_PROGRESS', assignedWorkerId: 'w2', plannedStartAt: '2026-06-04T08:00:00Z', plannedEndAt: '2026-06-04T12:00:00Z', actualStartAt: '2026-06-04T08:30:00Z', stagePrice: 150000 },
  { id: 's4_3', orderId: 'o4', stageName: 'PRISTADKA', status: 'PENDING', plannedStartAt: '2026-06-04T13:00:00Z', plannedEndAt: '2026-06-04T18:00:00Z', stagePrice: 100000 },
  { id: 's4_4', orderId: 'o4', stageName: 'SBORKA', status: 'PENDING', plannedStartAt: '2026-06-05T08:00:00Z', plannedEndAt: '2026-06-05T12:00:00Z', stagePrice: 300000 },
  { id: 's4_5', orderId: 'o4', stageName: 'USTANOVKA', status: 'PENDING', plannedStartAt: '2026-06-05T13:00:00Z', plannedEndAt: '2026-06-05T18:00:00Z', stagePrice: 200000 }
];

const initialFinanceTransactions: FinancialTransaction[] = [
  { id: 't1', type: 'INCOME', category: 'CLIENT_PAYMENT', amount: 12000000, paymentMethod: 'CARD', orderId: 'o1', description: 'Avans: Akmal Toshpo\'latov (WF-2026-001)', createdAt: '2026-06-01T10:05:00Z' },
  { id: 't2', type: 'INCOME', category: 'CLIENT_PAYMENT', amount: 8000000, paymentMethod: 'CASH', orderId: 'o4', description: 'Avans: Davron Abdullayev (WF-2026-004)', createdAt: '2026-06-02T11:15:00Z' },
  { id: 't3', type: 'EXPENSE', category: 'INVENTORY_PURCHASE', amount: 3500000, paymentMethod: 'BANK_TRANSFER', description: 'DSP plitalari sotib olindi (MebelAlimPlas)', createdAt: '2026-06-02T14:00:00Z' },
  { id: 't4', type: 'EXPENSE', category: 'WORKER_PAYOUT', amount: 250000, paymentMethod: 'CASH', workerId: 'w1', description: 'Raskroy haqi: Alijon Karimov (WF-2026-001)', createdAt: '2026-06-03T11:30:00Z' },
  { id: 't5', type: 'EXPENSE', category: 'OTHER', amount: 1200000, paymentMethod: 'CARD', description: 'Sex ijara haqi (qisman)', createdAt: '2026-06-04T09:00:00Z' }
];

const initialStockTransactions: StockTransaction[] = [
  { id: 'st1', productId: 'p1', quantity: 60, unitPrice: 350000, transactionType: 'KIRIM', createdAt: '2026-05-20T10:00:00Z', notes: 'Boshlang\'ich ombor kirimi' },
  { id: 'st2', productId: 'p3', quantity: 600, unitPrice: 3500, transactionType: 'KIRIM', createdAt: '2026-05-20T10:00:00Z', notes: 'Boshlang\'ich ombor kirimi' },
  { id: 'st3', productId: 'p5', quantity: 250, unitPrice: 25000, transactionType: 'KIRIM', createdAt: '2026-05-20T10:00:00Z', notes: 'Boshlang\'ich ombor kirimi' },
  { id: 'st4', productId: 'p1', quantity: 15, unitPrice: 350000, transactionType: 'CHIQIM', createdAt: '2026-06-01T10:30:00Z', notes: 'Buyurtma: WF-2026-001' }
];

export const useStore = create<AppState>((set, get) => ({
  orders: initialOrders,
  workers: initialWorkers,
  productionStages: initialProductionStages,
  financeTransactions: initialFinanceTransactions,
  products: initialProducts,
  bomItems: initialBOMItems,
  stockTransactions: initialStockTransactions,
  
  apiMaterials: [],
  apiCategories: [],
  apiUnits: [],
  apiOffcuts: [],
  apiBOMs: [],
  
  isLoading: false,
  error: null,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const boardData = await productionApi.getBoardData();
      const transactions = await financeApi.getTransactions();
      set({
        orders: boardData && Array.isArray(boardData.orders) ? boardData.orders : initialOrders,
        workers: boardData && Array.isArray(boardData.workers) ? boardData.workers : initialWorkers,
        productionStages: boardData && Array.isArray(boardData.productionStages) ? boardData.productionStages : initialProductionStages,
        financeTransactions: Array.isArray(transactions) ? transactions : initialFinanceTransactions,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn("API initialization failed, using initial mock data:", err);
      // Keep mock data which is already initialized in state
      set({ isLoading: false, error: err.message || "Failed to load API data" });
    }
  },

  updateWorkerDailyStatus: async (workerId, status) => {
    try {
      await productionApi.setDailyStatus(workerId, status);
    } catch (err) {
      console.warn("API setDailyStatus failed, falling back to local store update:", err);
    }
    set((state) => ({
      workers: state.workers.map((w) =>
        w.id === workerId ? { ...w, dailyStatus: status } : w
      ),
    }));
  },

  startStage: async (stageId, workerId) => {
    const now = new Date().toISOString();
    try {
      await productionApi.startStage(stageId, workerId);
    } catch (err) {
      console.warn("API startStage failed, falling back to local store update:", err);
    }
    set((state) => {
      const stage = state.productionStages.find((s) => s.id === stageId);
      if (!stage) return {};

      let updatedProducts = state.products;
      let newTransactions = state.stockTransactions;

      // PRD 3.3: Sexda arra (Raskroy) boshlanishi bilan zaxiradagi materiallar ombordan haqiqiy chegiriladi (Deducted)
      if (stage.stageName === 'RASKROY' && stage.status === 'PENDING') {
        const orderBom = state.bomItems.filter(b => b.orderId === stage.orderId);
        
        updatedProducts = state.products.map(p => {
          const bom = orderBom.find(b => b.productId === p.id);
          if (bom) {
            const qty = bom.allocatedQuantity || bom.requiredQuantity;
            return {
              ...p,
              quantityInStock: Math.max(0, p.quantityInStock - qty),
              reservedQuantity: Math.max(0, p.reservedQuantity - qty),
              availableQuantity: Math.max(0, p.quantityInStock - qty - (p.reservedQuantity - qty))
            };
          }
          return p;
        });

        const txs: StockTransaction[] = orderBom.map(bom => ({
          id: 'st_' + Math.random().toString(36).substr(2, 9),
          productId: bom.productId,
          quantity: bom.allocatedQuantity || bom.requiredQuantity,
          unitPrice: bom.unitPriceAtReservation,
          transactionType: 'CHIQIM',
          createdAt: now,
          notes: `Raskroy jarayoni boshlandi. Materiallar ombordan chegirildi (Order: ${stage.orderId})`
        }));
        newTransactions = [...txs, ...newTransactions];
      }

      return {
        products: updatedProducts,
        stockTransactions: newTransactions,
        productionStages: state.productionStages.map((s) =>
          s.id === stageId
            ? { ...s, status: 'IN_PROGRESS', assignedWorkerId: workerId, actualStartAt: now }
            : s
        ),
      };
    });
  },

  finishStage: async (stageId) => {
    const now = new Date().toISOString();
    try {
      await productionApi.finishStage(stageId);
    } catch (err) {
      console.warn("API finishStage failed, falling back to local store update:", err);
    }
    set((state) => {
      const stage = state.productionStages.find((s) => s.id === stageId);
      if (!stage) return {};

      const workerId = stage.assignedWorkerId;
      const payout = stage.stagePrice;

      // Update worker balance
      const updatedWorkers = workerId
        ? state.workers.map((w) =>
            w.id === workerId
              ? { ...w, payoutBalance: w.payoutBalance + payout }
              : w
          )
        : state.workers;

      // Add financial transaction (Salary expense)
      const workerName = state.workers.find((w) => w.id === workerId)?.fullName || 'Usta';
      const orderNum = state.orders.find((o) => o.id === stage.orderId)?.orderNumber || '';
      
      const newTx: FinancialTransaction = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        type: 'EXPENSE',
        category: 'WORKER_PAYOUT',
        amount: payout,
        paymentMethod: 'CASH',
        workerId: workerId,
        orderId: stage.orderId,
        description: `${stage.stageName} haqi: ${workerName} (${orderNum})`,
        createdAt: now,
      };

      // Check if this was the last stage (USTANOVKA) to mark order as complete
      let updatedOrders = state.orders;
      if (stage.stageName === 'USTANOVKA') {
        updatedOrders = state.orders.map((o) =>
          o.id === stage.orderId ? { ...o, status: 'YOPILDI_USTANOVKA', actualEndAt: now } : o
        );
      } else if (stage.stageName === 'SBORKA') {
        updatedOrders = state.orders.map((o) =>
          o.id === stage.orderId ? { ...o, status: 'TAYYOR_OTK' } : o
        );
      }

      return {
        workers: updatedWorkers,
        productionStages: state.productionStages.map((s) =>
          s.id === stageId ? { ...s, status: 'DONE', actualEndAt: now } : s
        ),
        financeTransactions: [newTx, ...state.financeTransactions],
        orders: updatedOrders,
      };
    });
  },

  addFinancialTransaction: async (tx) => {
    const now = new Date().toISOString();
    let serverTx: FinancialTransaction | null = null;
    try {
      serverTx = await financeApi.addTransaction(tx);
    } catch (err) {
      console.warn("API addTransaction failed, falling back to local store update:", err);
    }

    const newTx: FinancialTransaction = serverTx || {
      ...tx,
      id: 't_' + Math.random().toString(36).substr(2, 9),
      createdAt: now,
    };

    set((state) => ({
      financeTransactions: [newTx, ...state.financeTransactions],
    }));
  },

  addOrder: (orderData) => {
    const id = 'o' + (get().orders.length + 1);
    const orderNumber = `WF-2026-${String(get().orders.length + 1).padStart(3, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      status: 'YANGI_LID',
      isContractSigned: false,
      isDesignApproved: false
    };

    set((state) => ({
      orders: [newOrder, ...state.orders]
    }));
  },

  updateOrderStatus: (orderId, status) => {
    const now = new Date().toISOString();
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      const isTransitioningToProduction = order && order.status !== 'PRODUCTION' && status === 'PRODUCTION';
      
      const hasStages = state.productionStages.some((s) => s.orderId === orderId);
      let newStages = state.productionStages;

      if (status === 'PRODUCTION' && !hasStages) {
        const plannedStart = order?.plannedStartAt || now;
        const plannedEnd = order?.plannedEndAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const stagesToAdd: ProductionStage[] = [
          { id: `s_${orderId}_1`, orderId, stageName: 'RASKROY', status: 'PENDING', plannedStartAt: plannedStart, plannedEndAt: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000).toISOString(), stagePrice: 200000 },
          { id: `s_${orderId}_2`, orderId, stageName: 'KROMKA', status: 'PENDING', plannedStartAt: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000).toISOString(), plannedEndAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), stagePrice: 150000 },
          { id: `s_${orderId}_3`, orderId, stageName: 'PRISTADKA', status: 'PENDING', plannedStartAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), plannedEndAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), stagePrice: 120000 },
          { id: `s_${orderId}_4`, orderId, stageName: 'SBORKA', status: 'PENDING', plannedStartAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), plannedEndAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), stagePrice: 350000 },
          { id: `s_${orderId}_5`, orderId, stageName: 'USTANOVKA', status: 'PENDING', plannedStartAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), plannedEndAt: plannedEnd, stagePrice: 250000 }
        ];
        newStages = [...state.productionStages, ...stagesToAdd];
      }

      let updatedProducts = state.products;
      if (isTransitioningToProduction) {
        const orderBom = state.bomItems.filter(b => b.orderId === orderId);
        updatedProducts = state.products.map(p => {
          const bomItemsForProduct = orderBom.filter(b => b.productId === p.id);
          if (bomItemsForProduct.length > 0) {
            const qtyToReserve = bomItemsForProduct.reduce((sum, b) => sum + (b.allocatedQuantity || b.requiredQuantity), 0);
            const nextReserved = p.reservedQuantity + qtyToReserve;
            const nextAvailable = Math.max(0, p.quantityInStock - nextReserved);
            return {
              ...p,
              reservedQuantity: nextReserved,
              availableQuantity: nextAvailable
            };
          }
          return p;
        });
      }

      return {
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status, actualStartAt: status === 'PRODUCTION' ? now : o.actualStartAt } : o
        ),
        productionStages: newStages,
        products: updatedProducts,
      };
    });
  },

  assignWorkerToStage: (stageId, workerId) => {
    set((state) => ({
      productionStages: state.productionStages.map((s) =>
        s.id === stageId ? { ...s, assignedWorkerId: workerId } : s
      ),
    }));
  },

  addOffcut: (productId, length, width, orderId) => {
    const now = new Date().toISOString();
    set((state) => {
      const product = state.products.find(p => p.id === productId);
      if (!product) return {};

      const area = Number((length * width).toFixed(2));
      
      const newTx: StockTransaction = {
        id: 'st_' + Math.random().toString(36).substr(2, 9),
        productId,
        quantity: area,
        unitPrice: product.averagePrice,
        transactionType: 'KIRIM',
        createdAt: now,
        notes: `Raskroy bo'lak qoldig'i (${length}m x ${width}m). Order: ${orderId}`
      };

      const updatedProducts = state.products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            quantityInStock: p.quantityInStock + area,
            availableQuantity: p.availableQuantity + area
          };
        }
        return p;
      });

      return {
        products: updatedProducts,
        stockTransactions: [newTx, ...state.stockTransactions]
      };
    });
  },

  // CRM / Agent 1 Actions
  assignZamerchik: (orderId, workerId, scheduledAt) => {
    set((state) => ({
      orders: state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'ZAMER_BELGILANDI', 
          assignedZamerchikId: workerId, 
          zamerScheduledAt: scheduledAt 
        } : o
      )
    }));
  },

  uploadZamerDetails: (orderId, dimensions, sketchUrl) => {
    set((state) => ({
      orders: state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'ZAMER_BAJARILDI', 
          dimensions, 
          zamerSketchUrl: sketchUrl || 'https://images.unsplash.com/photo-1581404917879-53e1925d88df?auto=format&fit=crop&w=400&q=80' 
        } : o
      )
    }));
  },

  upload3DDesign: (orderId, designUrl) => {
    set((state) => ({
      orders: state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'DIZAYN_LOYYAHALASHDA', 
          design3dUrl: designUrl 
        } : o
      )
    }));
  },

  approveDesign: (orderId) => {
    const now = new Date().toISOString();
    set((state) => ({
      orders: state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'DIZAYN_TASDIQLANDI', 
          isDesignApproved: true, 
          designApprovedAt: now 
        } : o
      )
    }));
  },

  createSchedule: (orderId, plannedStartAt, plannedEndAt) => {
    set((state) => ({
      orders: state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'TZ_PLANNER_TUZILDI', 
          plannedStartAt, 
          plannedEndAt 
        } : o
      )
    }));
  },

  signContract: (orderId, totalPrice, advancePayment, paymentMethod) => {
    const now = new Date().toISOString();
    
    // Perform transaction validations: deduct inventory based on BOM
    const state = get();
    const orderBOM = state.bomItems.filter(item => item.orderId === orderId);
    
    // Check if there are sufficient products in stock
    let hasSufficientStock = true;
    for (const product of state.products) {
      const bomDemand = orderBOM.find(b => b.productId === product.id);
      if (bomDemand) {
        const required = bomDemand.requiredQuantity;
        if (product.availableQuantity < required) {
          hasSufficientStock = false;
          break;
        }
      }
    }

    if (!hasSufficientStock) {
      return false; // Not enough stock to allocate BOM
    }

    // Update orders and products
    set((state) => {
      // 1. Order updates
      const updatedOrders = state.orders.map((o) => 
        o.id === orderId ? { 
          ...o, 
          status: 'SHARTNOMA_IMZOLANDI' as OrderStatus, 
          isContractSigned: true, 
          contractSignedAt: now,
          totalPrice,
          advancePayment,
          paymentMethod,
          contractPdfUrl: '#print-layout'
        } : o
      );

      // 2. Add income transaction
      const orderNum = state.orders.find(o => o.id === orderId)?.orderNumber || '';
      const clientName = state.orders.find(o => o.id === orderId)?.customerName || '';
      const newIncomeTx: FinancialTransaction = {
        id: 't_' + Math.random().toString(36).substr(2, 9),
        type: 'INCOME',
        category: 'CLIENT_PAYMENT',
        amount: advancePayment,
        paymentMethod,
        orderId,
        description: `Avans to'lovi: ${clientName} (${orderNum})`,
        createdAt: now
      };

      // 3. Allocate BOM items
      const updatedBOM = state.bomItems.map(bom => {
        if (bom.orderId === orderId) {
          return { ...bom, allocatedQuantity: bom.requiredQuantity };
        }
        return bom;
      });

      // 4. Update products & write stock transactions
      const newStockTxs: StockTransaction[] = [];
      const updatedProducts = state.products.map(p => {
        const bom = orderBOM.find(b => b.productId === p.id);
        if (bom) {
          newStockTxs.push({
            id: 'st_' + Math.random().toString(36).substr(2, 9),
            productId: p.id,
            quantity: bom.requiredQuantity,
            unitPrice: p.averagePrice,
            transactionType: 'CHIQIM',
            createdAt: now,
            notes: `Buyurtma zaxirasi: ${orderNum}`
          });
          return {
            ...p,
            reservedQuantity: p.reservedQuantity + bom.requiredQuantity,
            availableQuantity: p.quantityInStock - (p.reservedQuantity + bom.requiredQuantity)
          };
        }
        return p;
      });

      return {
        orders: updatedOrders,
        financeTransactions: [newIncomeTx, ...state.financeTransactions],
        bomItems: updatedBOM,
        products: updatedProducts,
        stockTransactions: [...newStockTxs, ...state.stockTransactions]
      };
    });

    // Automatically transition to PRODUCTION stage if signed
    get().updateOrderStatus(orderId, 'PRODUCTION');
    return true;
  },

  // Inventory & BOM / Agent 2 Actions
  addBOMItem: (orderId, productId, requiredQuantity) => {
    set((state) => {
      const product = state.products.find(p => p.id === productId);
      const newBOM: BOMItem = {
        id: 'b_' + Math.random().toString(36).substr(2, 9),
        orderId,
        productId,
        requiredQuantity,
        allocatedQuantity: 0,
        unitPriceAtReservation: product?.averagePrice || 0
      };
      return {
        bomItems: [...state.bomItems, newBOM]
      };
    });
  },

  removeBOMItem: (bomItemId) => {
    set((state) => ({
      bomItems: state.bomItems.filter(item => item.id !== bomItemId)
    }));
  },

  addStockTransaction: (tx) => {
    const now = new Date().toISOString();
    const id = 'st_' + Math.random().toString(36).substr(2, 9);
    
    set((state) => {
      const updatedProducts = state.products.map(p => {
        if (p.id === tx.productId) {
          const qtyDiff = tx.transactionType === 'KIRIM' ? tx.quantity : -tx.quantity;
          const newQty = Math.max(0, p.quantityInStock + qtyDiff);
          return {
            ...p,
            quantityInStock: newQty,
            availableQuantity: newQty - p.reservedQuantity
          };
        }
        return p;
      });

      const newTx: StockTransaction = {
        ...tx,
        id,
        createdAt: now
      };

      return {
        products: updatedProducts,
        stockTransactions: [newTx, ...state.stockTransactions]
      };
    });
  },

  // ==========================================
  // REAL API ACTIONS FOR INVENTORY (Agent 2)
  // ==========================================
  fetchInventoryAPI: async () => {
    set({ isLoading: true, error: null });
    try {
      const results = await Promise.allSettled([
        warehouseApi.getMaterials(),
        warehouseApi.getCategories(),
        warehouseApi.getOffcuts(),
        warehouseApi.getUnits()
      ]);
      
      const extractArray = (promiseRes: any, name: string) => {
        if (promiseRes.status !== 'fulfilled') {
          console.error(`API Fetch Failed for ${name}:`, promiseRes.reason);
          return [];
        }
        const res = promiseRes.value;
        return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.results) ? res.results : []));
      };

      set({ 
        apiMaterials: extractArray(results[0], 'materials'), 
        apiCategories: extractArray(results[1], 'categories'),
        apiOffcuts: extractArray(results[2], 'offcuts'),
        apiUnits: extractArray(results[3], 'units'),
        isLoading: false 
      });
    } catch (err: any) {
      console.error("Failed to fetch API Inventory:", err);
      set({ isLoading: false, error: err.message || "Xatolik yuz berdi" });
    }
  },

  createMaterialAPI: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await warehouseApi.createMaterial(data);
      // Re-fetch everything to update the list
      await get().fetchInventoryAPI();
    } catch (err: any) {
      console.error("Failed to create material:", err);
      set({ isLoading: false, error: err.message || "Material qo'shishda xatolik yuz berdi" });
    }
  },

  fetchBOMsAPI: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bomApi.getBOMs(orderId);
      const extractArray = (res: any) => Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.results) ? res.results : []));
      set({ 
        apiBOMs: extractArray(response),
        isLoading: false 
      });
    } catch (err: any) {
      console.error("Failed to fetch BOMs:", err);
      set({ isLoading: false, error: err.message || "BOM yuklashda xatolik" });
    }
  },

  createBOMAPI: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await bomApi.createBOM(data);
      if (data.order) {
        await get().fetchBOMsAPI(data.order);
      }
    } catch (err: any) {
      console.error("Failed to create BOM:", err);
      set({ isLoading: false, error: err.message || "BOM saqlashda xatolik yuz berdi" });
    }
  }
}));
