/**
 * Claims domain types — 보험사/손해사정사 어드민 모델
 */

export type ClaimType = 'A' | 'B' | 'C';
export type ClaimSource = '입주민' | '관리사무소';
export type ClaimStatus =
  | '접수'
  | '분류대기'
  | '현장조사중'
  | '산정중'
  | '산정완료'
  | '심사중'
  | '승인대기'
  | '승인완료'
  | '지급완료'
  | '면책통보'
  | '반려'
  | '완료';

export type FieldCheckStatus = '배정대기' | '조사중' | '보고서접수' | '검토완료';

export interface Claim {
  id: string;
  source: ClaimSource;
  complex: string;
  dong: string;
  ho: string;
  accidentType: string;
  type: ClaimType | null;
  status: ClaimStatus;
  aiAmount: number | null;
  adjustedAmount: number | null;
  finalAmount: number | null;
  deductible: number;
  date: string;
  description: string;
  confidence?: number;
  // TYPE A specific
  defectType?: string;
  contractor?: string;
  defectInspector?: string;
  // TYPE B specific
  exemptionReason?: string;
  exemptionBasis?: string;
  opinionSent?: boolean;
  // TYPE C specific
  corrected?: boolean;
  // Field check
  fieldStatus?: FieldCheckStatus;
  fieldAssignDate?: string;
  fieldReportDate?: string;
  fieldPhotos?: string[];
  fieldNote?: string;
  fieldDamageLevel?: string;
}

// Legacy compat — kept for API layer
export type LegacyClaimStatus = 'done' | 'sent' | 'wait' | 'transfer' | 'paid';

// API response shapes
export interface ClaimListItem {
  id: string;
  complexName: string;
  description: string;
  claimedAt: string;
  type: ClaimType;
  status: string;
  aiConfidence: number;
  amount?: number;
}

export interface ClaimsListResponse {
  items: ClaimListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ClaimComplex {
  id: string;
  name: string;
  address: string;
  builder: string;
  builtAt: string;
  warrantyYr: number;
}

export interface ClaimPolicy {
  id: string;
  policyType: string;
  holderName: string;
  validFrom: string;
  validUntil: string;
  deductible: number;
}

export interface ClaimAssignee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ClaimPhoto {
  id: number;
  label: string;
  fileUrl: string;
  sortOrder: number;
  annotations: string;
}

export interface ClaimAiReason {
  id: number;
  reasonText: string;
  sortOrder: number;
}

export interface ClaimPrecedent {
  id: number;
  caseNumber: string;
  description: string;
  sortOrder: number;
}

export interface ClaimEvent {
  id: number;
  title: string;
  eventAt: string;
  status: string;
  stepNumber: number;
  sortOrder: number;
}

export interface TypeADetail {
  claimId: string;
  defectType: string;
  warrantyRemaining: string;
  totalClaimEst: number;
  unitClaimEst: number;
  isExemption: boolean;
}

export interface TypeBDetail {
  claimId: string;
  exemptionClause: string;
  objectionDeadlineDays: number;
  legalOpinionStatus: string;
}

export interface ClaimEstimation {
  claimId: string;
  totalAmount: number;
  vendorEstimate: number;
  savingsPercent: number;
  savingsAmount: number;
  calculationTime: string;
  breakdown: Array<{
    label: string;
    value: string;
    valueColor?: string;
  }>;
  finalAmount: number;
}

export interface ClaimDetail {
  id: string;
  description: string;
  claimedAt: string;
  type: ClaimType;
  status: string;
  aiConfidence: number;
  amount?: number;
  claimantName?: string;
  complex?: ClaimComplex;
  policy?: ClaimPolicy;
  assignee?: ClaimAssignee;
  photos?: ClaimPhoto[];
  aiReasons?: ClaimAiReason[];
  precedents?: ClaimPrecedent[];
  events?: ClaimEvent[];
  typeADetail?: TypeADetail;
  typeBDetail?: TypeBDetail;
  estimation?: ClaimEstimation;
  items?: unknown[];
}

export interface ClaimsQueryParams {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApprovalPayload {
  decision: string;
  approvedAmount?: number;
  comment?: string;
}
