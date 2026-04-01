/**
 * Estimation domain types
 */

export interface EstimationItemRow {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  standardLabel: string;
}

export interface EstimationItem {
  id: number;
  claimId: string;
  complex: string;
  dongHo: string;
  accidentType: string;
  items: EstimationItemRow[];
  aiTotal: number;
  adjustedTotal: number | null;
  confirmed: boolean;
  deductible: number;
  insuranceAmount: number | null;
}

// Legacy compat
export interface EstimationRow {
  id: number;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  standardLabel: string;
  standardVariant: 'primary' | 'green';
  subtotal: number;
  checked: boolean;
}

export interface EstimationDetail {
  claimId: string;
  totalAmount: number;
  vendorEstimate?: number;
  savingsPercent?: number;
  savingsAmount?: number;
  calculationTime?: string;
  depreciation?: number;
  deductible?: number;
  indirectRate?: number;
  items: EstimationRow[];
}
