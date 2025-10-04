// Zod schemas are defined in ./schemas to keep this file dependency-free

export interface Plot {
  id: string;
  name: string;
  area: number;
  price: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  available: boolean;
  features: string[];
  description: string;
}

export interface HouseProject {
  id: string;
  name: string;
  description: string;
  area: number;
  floors: number;
  price: number;
  image: string;
  bedrooms: number;
  features: string[];
}

export interface UserSelection {
  plotId: string | null;
  constructionFormat: 'self' | 'turnkey' | null;
  houseProjectId: string | null;
  bookingId: string | null;
}

export interface BookingData {
  calendlyUrl: string;
  selectedDate: string | null;
  selectedTime: string | null;
}

// =========================
// Pricing & Calculation
// =========================

export type PriceItemType = 'fixed' | 'per_m2' | 'percent';

export interface PriceItem {
  id: string;
  label: string;
  type: PriceItemType;
  unitPrice: number; // for per_m2 it's price per m2, for percent it's fraction (e.g. 0.05)
  quantity?: number; // for per_m2 default to input.area
  amount: number; // computed final amount in base currency
  category?: string;
}

export interface CalculationInput {
  projectName?: string;
  area: number; // m2
  floors: 1 | 2 | 3;
  wallMaterial: 'wood' | 'brick' | 'aerated_concrete';
  foundationType: 'slab' | 'strip' | 'pile';
  finishLevel: 'shell' | 'basic' | 'turnkey';
  engineeringOptions: Array<
    | 'heating_radiators'
    | 'warm_floor'
    | 'ventilation'
    | 'water_supply'
    | 'septic'
    | 'electricity'
  >;
  extras?: Array<'terrace' | 'fireplace' | 'panoramic_windows' | 'garage'>;
  promoMultiplier?: number; // discounts/markup, default 1.0
}

export interface StageEstimate {
  key: 'design' | 'foundation' | 'frame' | 'engineering' | 'finishing';
  label: string;
  weeks: number;
}

export interface CalculationResult {
  pricingVersion: string;
  baseRatePerM2: number;
  basePrice: number;
  items: PriceItem[];
  totalPrice: number;
  stages: StageEstimate[];
  durationWeeks: number;
}

export interface ProgressState {
  steps: Array<{
    key: 'selection' | 'parameters' | 'summary' | 'contacts';
    label: string;
    completed: boolean;
  }>;
  percent: number; // 0..100
}

export interface Project {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Optional user-facing name
  name?: string;
  // From existing flow
  selection?: UserSelection;
  // Calculator
  calculationInput?: CalculationInput;
  calculationResult?: CalculationResult;
  progress?: ProgressState;
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export type SheetCalculationRow = {
  timestamp: string;
  projectId: string;
  pricingVersion: string;
  area: number;
  floors: number;
  wallMaterial: string;
  foundationType: string;
  finishLevel: string;
  engineeringOptions: string;
  extras: string;
  promoMultiplier: number;
  baseRatePerM2: number;
  basePrice: number;
  totalPrice: number;
};

export type SheetLeadRow = {
  timestamp: string;
  projectId: string;
  name: string;
  phone: string;
  email: string;
  plotId: string | null;
  houseProjectId: string | null;
  constructionFormat: string | null;
};

export { zCalculationInput, zPriceItem, zStageEstimate, zCalculationResult, zProgressState, zProject, zProjectCreate } from './schemas';
export type { CalculationInputSchema, CalculationResultSchema, ProjectSchema, ProjectCreateSchema } from './schemas';
