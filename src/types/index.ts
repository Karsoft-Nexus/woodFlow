// ==========================================================================
// 1. CRM & ORDER TYPES
// ==========================================================================
export type LeadSource = 'TELEGRAM' | 'INSTAGRAM' | 'PHONE' | 'OFFICE';

export type OrderStatus =
  | 'YANGI_LID'
  | 'ZAMER_BELGILANDI'
  | 'ZAMER_BAJARILDI'
  | 'DIZAYN_LOYYAHALASHDA'
  | 'DIZAYN_TASDIQLANDI'
  | 'TZ_PLANNER_TUZILDI'
  | 'SHARTNOMA_IMZOLANDI'
  | 'PRODUCTION'
  | 'TAYYOR_OTK'
  | 'YOPILDI_USTANOVKA';

export interface WallDimensions {
  length: number; // metrlarda
  width: number;  // metrlarda
  height: number; // metrlarda
  has90DegreeCorners: boolean;
  hasGasPipes: boolean;
  hasWaterPipes: boolean;
  hasElectricalOutlets: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  source: LeadSource;
  status: OrderStatus;
  
  // Zamer details
  assignedZamerchikId?: string;
  zamerScheduledAt?: string;
  dimensions?: WallDimensions;
  zamerSketchUrl?: string;
  
  // 3D design details
  design3dUrl?: string;
  isDesignApproved: boolean;
  designApprovedAt?: string;
  
  // Schedule metadata
  plannedStartAt?: string;
  plannedEndAt?: string;
  actualStartAt?: string;
  actualEndAt?: string;
  
  // Financials
  totalPrice: number;
  advancePayment: number;
  paymentMethod?: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  isContractSigned: boolean;
  contractSignedAt?: string;
  contractPdfUrl?: string;
}

// ==========================================================================
// 2. INVENTORY & BOM TYPES
// ==========================================================================
export type ProductCategory = 'PLATES' | 'STOLISHNITSA' | 'EDGES' | 'FURNITURES' | 'ACCESSORIES' | 'WEIGHT_ITEMS' | 'GLASS';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unitOfMeasure: 'LIST' | 'METR' | 'PIECE' | 'KG' | 'M_KV';
  quantityInStock: number;
  reservedQuantity: number;
  availableQuantity: number; // quantityInStock - reservedQuantity
  averagePrice: number;
  minThreshold: number; // ogohlantirish uchun minimal miqdor
}

export interface BOMItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  requiredQuantity: number;
  allocatedQuantity: number;
  unitPriceAtReservation: number;
}

export interface StockTransaction {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  transactionType: 'KIRIM' | 'CHIQIM';
  createdAt: string;
  notes?: string;
}

// ==========================================================================
// 2.1 INVENTORY & BOM TYPES (Alimplas API Schema)
// ==========================================================================
export interface MaterialCategory {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
  short_name: string;
}

export interface Material {
  id: number;
  name: string;
  is_sheet: boolean;
  length?: string | null;
  width?: string | null;
  thickness?: string | null;
  barcode?: string | null;
  min_threshold: string;
  category: number;
  unit: number;
  
  // Read-only fields
  category_name?: string;
  unit_code?: string;
  area_m2?: string;
  average_price?: string;
  total_stock?: string;
  available_stock?: string;
}

export interface Offcut {
  id: number;
  material: number;
  length: string;
  width: string;
  qty: number;
  status: 'AVAILABLE' | 'USED' | 'SCRAP';
  added_date?: string;
}

export interface BOM {
  id?: number;
  order: number;
  material: number;
  required_qty: string;
  allocated_qty?: string;
  unit_price?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

// ==========================================================================
// 3. WORKER & PRODUCTION STAGES
// ==========================================================================
export type WorkerDailyStatus = 'WORKSHOP' | 'INSTALLATION' | 'ABSENT';

export type StageName = 'RASKROY' | 'KROMKA' | 'PRISTADKA' | 'SBORKA' | 'USTANOVKA';

export type StageStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Worker {
  id: string;
  fullName: string;
  specialty: string;
  dailyStatus: WorkerDailyStatus;
  rating: number;
  payoutBalance: number;
}

export interface ProductionStage {
  id: string;
  orderId: string;
  stageName: StageName;
  status: StageStatus;
  assignedWorkerId?: string;
  assignedWorker?: Worker;
  
  // Dates
  plannedStartAt: string;
  plannedEndAt: string;
  actualStartAt?: string;
  actualEndAt?: string;
  
  // Payout configuration
  stagePrice: number; // ishbay beriladigan haq miqdori
}

// ==========================================================================
// 4. FINANCIAL LEDGER TYPES
// ==========================================================================
export interface FinancialTransaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'CLIENT_PAYMENT' | 'INVENTORY_PURCHASE' | 'WORKER_PAYOUT' | 'TAX' | 'OTHER';
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  orderId?: string;
  workerId?: string;
  description: string;
  createdAt: string;
}
