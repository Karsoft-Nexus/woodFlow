import { create } from 'zustand';
import type { Order, Worker, ProductionStage, FinancialTransaction, Product, OrderStatus, WorkerDailyStatus, BOMItem, StockTransaction, WallDimensions } from '../types';
import { productionService as productionApi } from '../services/production/production.service';
import { financeService as financeApi } from '../services/finance/finance.service';
import { ordersService as ordersApi } from '../services/orders/orders.service';
import { authService as authApi } from '../services/auth/auth.service';
import { inventoryService as inventoryApi } from '../services/inventory/inventory.service';
import { bomService as bomApi } from '../services/bom/bom.service';
import { warehouseService as warehouseTransactionApi } from '../services/warehouse/warehouse.service';

function mapBackendOrderToFrontend(bo: any): Order {
  const statusMap: Record<string, OrderStatus> = {
    'LEAD_NEW': 'YANGI_LID',
    'MEASURE_ASSIGNED': 'ZAMER_BELGILANDI',
    'MEASURE_DONE': 'ZAMER_BAJARILDI',
    'DESIGNING': 'DIZAYN_LOYYAHALASHDA',
    'DESIGN_APPROVED': 'DIZAYN_TASDIQLANDI',
    'CONTRACT_PENDING': 'TZ_PLANNER_TUZILDI',
    'CONTRACT_SIGNED': 'SHARTNOMA_IMZOLANDI',
    'PRODUCTION': 'PRODUCTION',
    'READY': 'TAYYOR_OTK',
    'INSTALLED': 'YOPILDI_USTANOVKA'
  };

  let dimensions: WallDimensions | undefined = undefined;
  if (bo.zamer_dimensions) {
    try {
      dimensions = typeof bo.zamer_dimensions === 'string' ? JSON.parse(bo.zamer_dimensions) : bo.zamer_dimensions;
    } catch (e) {
      console.warn("Failed to parse zamer_dimensions:", bo.zamer_dimensions);
    }
  }

  const customerName = bo.customer_detail 
    ? `${bo.customer_detail.first_name || ''} ${bo.customer_detail.last_name || ''}`.trim()
    : 'Mijoz';

  return {
    id: String(bo.id),
    orderNumber: bo.contract_number || `WF-2026-${String(bo.id).padStart(3, '0')}`,
    customerName,
    customerPhone: bo.customer_detail?.phone || '',
    source: bo.source || 'OFFICE',
    status: statusMap[bo.status] || 'YANGI_LID',
    assignedZamerchikId: bo.zamerchik ? String(bo.zamerchik) : undefined,
    zamerScheduledAt: bo.zamer_scheduled_at || bo.deadline || undefined,
    dimensions,
    zamerSketchUrl: bo.zamer_photos_url || undefined,
    design3dUrl: bo.design_3d_url || undefined,
    isDesignApproved: bo.status === 'DESIGN_APPROVED' || bo.is_contract_signed || ['CONTRACT_SIGNED', 'PRODUCTION', 'READY', 'INSTALLED'].includes(bo.status),
    designApprovedAt: bo.signed_at || undefined,
    plannedStartAt: bo.created_at,
    plannedEndAt: bo.deadline || undefined,
    totalPrice: bo.total_price ? Number(bo.total_price) : 0,
    advancePayment: bo.advance_payment ? Number(bo.advance_payment) : 0,
    paymentMethod: bo.payment_method || undefined,
    isContractSigned: bo.is_contract_signed || bo.status === 'CONTRACT_SIGNED' || ['PRODUCTION', 'READY', 'INSTALLED'].includes(bo.status),
    contractSignedAt: bo.signed_at || undefined,
    contractPdfUrl: bo.contract_pdf_url || undefined
  };
}

interface AppState {
  orders: Order[];
  workers: Worker[];
  productionStages: ProductionStage[];
  financeTransactions: FinancialTransaction[];
  products: Product[];
  bomItems: BOMItem[];
  stockTransactions: StockTransaction[];
  isLoading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchOrders: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  fetchProductionBoard: () => Promise<void>;
  fetchFinance: () => Promise<void>;
  updateWorkerDailyStatus: (workerId: string, status: WorkerDailyStatus) => Promise<void>;
  startStage: (stageId: string, workerId: string) => Promise<void>;
  finishStage: (stageId: string) => Promise<void>;
  addFinancialTransaction: (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'status' | 'isContractSigned' | 'isDesignApproved'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignWorkerToStage: (stageId: string, workerId: string) => Promise<void>;
  addOffcut: (productId: string, length: number, width: number, orderId: string) => Promise<void>;

  // CRM / Agent 1 Actions
  assignZamerchik: (orderId: string, workerId: string, scheduledAt: string) => Promise<void>;
  uploadZamerDetails: (orderId: string, dimensions: WallDimensions, sketchUrl?: string) => Promise<void>;
  upload3DDesign: (orderId: string, designUrl: string) => Promise<void>;
  approveDesign: (orderId: string) => Promise<void>;
  createSchedule: (orderId: string, plannedStartAt: string, plannedEndAt: string) => Promise<void>;
  signContract: (orderId: string, totalPrice: number, advancePayment: number, paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER') => Promise<boolean>;

  // Inventory & BOM / Agent 2 Actions
  addBOMItem: (orderId: string, productId: string, requiredQuantity: number) => Promise<void>;
  removeBOMItem: (bomItemId: string) => Promise<void>;
  addStockTransaction: (tx: Omit<StockTransaction, 'id' | 'createdAt'>) => Promise<void>;
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
  isLoading: false,
  error: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ phone, password });
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true, isLoading: false });
        return true;
      }
      throw new Error("No token returned from server");
    } catch (err: any) {
      console.error("Login failed:", err);
      const errMsg = err.response?.data?.errors?.[0] || err.message || "Login processing failed";
      set({ isLoading: false, error: errMsg });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const backendOrders = await ordersApi.getOrders();
      let ordersList = initialOrders;
      if (Array.isArray(backendOrders) && backendOrders.length > 0) {
        ordersList = backendOrders.map(mapBackendOrderToFrontend);
      }
      set({ orders: ordersList, isLoading: false, error: null });
    } catch (err: any) {
      console.warn("API initialization failed, using initial mock data:", err);
      set({ isLoading: false, error: err.message || "Failed to load orders data" });
    }
  },

  fetchInventory: async () => {
    set({ isLoading: true });
    try {
      const [materialsRes, bomRes] = await Promise.allSettled([
        inventoryApi.getMaterials(),
        bomApi.getBOMs()
      ]);
      
      let fetchedProducts = initialProducts;
      if (materialsRes.status === 'fulfilled' && materialsRes.value.data) {
        fetchedProducts = materialsRes.value.data.map((m: any) => ({
          id: String(m.id),
          name: m.name,
          category: (m.category_name ? String(m.category_name).toUpperCase() : 'PLATES') as any,
          unitOfMeasure: (m.unit_code ? String(m.unit_code).toUpperCase() : 'PIECE') as any,
          quantityInStock: m.total_stock ? Number(m.total_stock) : 0,
          reservedQuantity: (m.total_stock && m.available_stock) ? Number(m.total_stock) - Number(m.available_stock) : 0,
          availableQuantity: m.available_stock ? Number(m.available_stock) : 0,
          averagePrice: m.average_price ? Number(m.average_price) : 0,
          minThreshold: m.min_threshold ? Number(m.min_threshold) : 10
        }));
      }

      let fetchedBOMs = initialBOMItems;
      if (bomRes.status === 'fulfilled' && bomRes.value.data) {
        fetchedBOMs = bomRes.value.data.map((b: any) => ({
          id: String(b.id),
          orderId: String(b.order),
          productId: String(b.material),
          requiredQuantity: b.required_qty ? Number(b.required_qty) : 0,
          allocatedQuantity: b.actual_allocated_qty ? Number(b.actual_allocated_qty) : 0,
          unitPriceAtReservation: 0
        }));
      }

      set({
        products: fetchedProducts.length > 0 ? fetchedProducts : initialProducts,
        bomItems: fetchedBOMs.length > 0 ? fetchedBOMs : initialBOMItems,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn("API initialization failed:", err);
      set({ isLoading: false, error: err.message || "Failed to load inventory data" });
    }
  },

  fetchProductionBoard: async () => {
    set({ isLoading: true });
    try {
      const boardData = await productionApi.getBoardData();
      let ordersList = initialOrders;
      if (boardData && Array.isArray(boardData.orders) && boardData.orders.length > 0) {
        ordersList = boardData.orders.map(mapBackendOrderToFrontend);
      }
      set({
        orders: ordersList,
        workers: Array.isArray(boardData.workers) ? boardData.workers : initialWorkers,
        productionStages: Array.isArray(boardData.productionStages) ? (boardData.productionStages as unknown as ProductionStage[]) : initialProductionStages,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn("API initialization failed:", err);
      set({ isLoading: false, error: err.message || "Failed to load production data" });
    }
  },

  fetchFinance: async () => {
    set({ isLoading: true });
    try {
      const transactions = await financeApi.getTransactions();
      set({
        financeTransactions: Array.isArray(transactions) ? transactions : initialFinanceTransactions,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.warn("API initialization failed:", err);
      set({ isLoading: false, error: err.message || "Failed to load finance data" });
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
    try {
      await productionApi.startStage(stageId, workerId);
      await get().fetchProductionBoard();
    } catch (err) {
      console.error("API startStage failed:", err);
      throw err;
    }
  },

  finishStage: async (stageId) => {
    try {
      await productionApi.finishStage(stageId);
      await get().fetchProductionBoard();
    } catch (err) {
      console.error("API finishStage failed:", err);
      throw err;
    }
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

  addOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const clientNameParts = orderData.customerName.trim().split(' ');
      const first_name = clientNameParts[0] || 'Mijoz';
      const last_name = clientNameParts.slice(1).join(' ') || '';
      
      let customerId: number;
      try {
        const customer = await ordersApi.createCustomer({
          first_name,
          last_name,
          phone: orderData.customerPhone,
          address: ''
        });
        customerId = customer.data.id;
      } catch (cErr) {
        console.warn("Failed to create customer, using a fallback default customer ID:", cErr);
        customerId = 1; // Default fallback
      }

      const backendOrder = await ordersApi.createOrder({
        customer: customerId,
        source: orderData.source,
        product_type: 'OTHER',
        total_price: String(orderData.totalPrice),
        advance_payment: String(orderData.advancePayment || 0),
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 weeks default
      });

      const newOrder = mapBackendOrderToFrontend(backendOrder.data);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to add order to API:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const orderIdNum = parseInt(orderId.replace(/\D/g, '')) || Number(orderId);
      await ordersApi.updateOrder(orderIdNum, { status });
      await get().fetchOrders();
    } catch (err: any) {
      console.error("API call to update status failed:", err);
      throw err;
    }
  },

  assignWorkerToStage: async (stageId, workerId) => {
    try {
      await get().startStage(stageId, workerId);
    } catch (err) {
      console.error("assignWorkerToStage failed", err);
    }
  },

  addOffcut: async (productId, length, width) => {
    try {
      await inventoryApi.createOffcut({
        material: Number(productId),
        length: String(length),
        width: String(width),
        quantity: "1"
      } as any);
      await get().fetchInventory();
    } catch (err) {
      console.error("API createOffcut failed:", err);
      throw err;
    }
  },

  // CRM / Agent 1 Actions
  assignZamerchik: async (orderId, workerId, scheduledAt) => {
    set({ isLoading: true });
    try {
      try {
        await ordersApi.assignZamer(Number(orderId), { zamerchik: Number(workerId), zamer_scheduled_at: scheduledAt });
      } catch (apiErr) {
        console.warn("Custom assign-zamer action failed, attempting direct PATCH:", apiErr);
        await ordersApi.updateOrder(Number(orderId), {
          zamerchik: Number(workerId),
          status: 'MEASURE_ASSIGNED'
        });
      }
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { 
            ...o, 
            status: 'ZAMER_BELGILANDI', 
            assignedZamerchikId: workerId, 
            zamerScheduledAt: scheduledAt 
          } : o
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to assign zamerchik:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  uploadZamerDetails: async (orderId, dimensions, sketchUrl) => {
    set({ isLoading: true });
    try {
      const url = sketchUrl || 'https://images.unsplash.com/photo-1581404917879-53e1925d88df?auto=format&fit=crop&w=400&q=80';
      try {
        await ordersApi.uploadZamer(Number(orderId), { zamer_dimensions: JSON.stringify(dimensions), zamer_photos_url: url });
      } catch (apiErr) {
        console.warn("Custom upload-zamer action failed, attempting direct PATCH:", apiErr);
        await ordersApi.updateOrder(Number(orderId), {
          zamer_dimensions: JSON.stringify(dimensions),
          zamer_photos_url: url,
          status: 'MEASURE_DONE'
        });
      }
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { 
            ...o, 
            status: 'ZAMER_BAJARILDI', 
            dimensions, 
            zamerSketchUrl: url 
          } : o
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to upload zamer details:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  upload3DDesign: async (orderId, designUrl) => {
    set({ isLoading: true });
    try {
      try {
        await ordersApi.uploadDesign(Number(orderId), { design_3d_url: designUrl });
      } catch (apiErr) {
        console.warn("Custom upload-design action failed, attempting direct PATCH:", apiErr);
        await ordersApi.updateOrder(Number(orderId), {
          design_3d_url: designUrl,
          status: 'DESIGNING'
        });
      }
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { 
            ...o, 
            status: 'DIZAYN_LOYYAHALASHDA', 
            design3dUrl: designUrl 
          } : o
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to upload 3D design:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  approveDesign: async (orderId) => {
    const now = new Date().toISOString();
    set({ isLoading: true });
    try {
      try {
        await ordersApi.approveDesign(Number(orderId));
      } catch (apiErr) {
        console.warn("Custom approve-design action failed, attempting direct PATCH:", apiErr);
        await ordersApi.updateOrder(Number(orderId), {
          status: 'DESIGN_APPROVED'
        });
      }
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { 
            ...o, 
            status: 'DIZAYN_TASDIQLANDI', 
            isDesignApproved: true, 
            designApprovedAt: now 
          } : o
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to approve design:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  createSchedule: async (orderId, plannedStartAt, plannedEndAt) => {
    set({ isLoading: true });
    try {
      await ordersApi.updateOrder(Number(orderId), {
        deadline: plannedEndAt.split('T')[0],
        status: 'CONTRACT_PENDING'
      });
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === orderId ? { 
            ...o, 
            status: 'TZ_PLANNER_TUZILDI', 
            plannedStartAt, 
            plannedEndAt 
          } : o
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error("Failed to create schedule:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signContract: async (orderId, totalPrice, advancePayment, paymentMethod) => {
    set({ isLoading: true });
    try {
      await ordersApi.signContract(Number(orderId), {
        total_price: String(totalPrice),
        advance_payment: String(advancePayment),
        payment_method: paymentMethod
      });
      await get().fetchOrders();
      return true;
    } catch (err: any) {
      console.error("Failed to sign contract:", err);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  // Inventory & BOM / Agent 2 Actions
  addBOMItem: async (orderId, productId, requiredQuantity) => {
    try {
      const serverBOM = await bomApi.createBOM({
        order: Number(orderId),
        material: Number(productId),
        required_qty: String(requiredQuantity)
      } as any);

      set((state) => {
        const product = state.products.find(p => p.id === productId);
        const newBOM: BOMItem = {
          id: String(serverBOM.data.id),
          orderId,
          productId,
          requiredQuantity,
          allocatedQuantity: serverBOM.data.actual_allocated_qty ? Number(serverBOM.data.actual_allocated_qty) : 0,
          unitPriceAtReservation: product?.averagePrice || 0
        };
        return {
          bomItems: [...state.bomItems, newBOM]
        };
      });
    } catch (err: any) {
      console.error("Failed to add BOM item to API:", err);
      throw err;
    }
  },

  removeBOMItem: async (bomItemId) => {
    try {
      await bomApi.deleteBOM(Number(bomItemId));
      set((state) => ({
        bomItems: state.bomItems.filter(item => item.id !== bomItemId)
      }));
    } catch (err: any) {
      console.error("Failed to delete BOM item from API:", err);
      throw err;
    }
  },

  addStockTransaction: async (tx) => {
    try {
      const serverTx = await warehouseTransactionApi.createTransaction({
        material: Number(tx.productId),
        transaction_type: tx.transactionType === 'KIRIM' ? 'MATERIAL_BUY' : 'PRODUCTION_USE', // Example mapping
        quantity: String(tx.quantity),
        unit_price: String(tx.unitPrice),
        description: tx.notes || ''
      } as any);

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
          id: String(serverTx.data.id),
          createdAt: serverTx.data.created_at || new Date().toISOString()
        };

        return {
          stockTransactions: [newTx, ...state.stockTransactions],
          products: updatedProducts
        };
      });
    } catch (err: any) {
      console.error("Failed to add stock transaction to API:", err);
      throw err;
    }
  },

}));