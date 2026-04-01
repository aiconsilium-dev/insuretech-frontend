/**
 * Documents domain types
 */

export interface OpinionItem {
  id: string;
  claimId: string;
  type: '면책의견서' | '보완요청' | '이의신청검토' | '손해사정의견서';
  summary: string;
  date: string;
  status: '작성중' | '발송완료' | '이의신청접수' | '검토완료';
  recipient?: string;
}

export interface ApproveItem {
  claimId: string;
  accidentType: string;
  complex: string;
  dongHo: string;
  finalAmount: number;
  requestDate: string;
  status: '대기' | '승인' | '반려' | '보완요청';
  approveDate?: string;
  approver?: string;
}

export interface NotificationItem {
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

// Legacy compat types
export interface DocumentItem {
  id: string;
  claimId: string;
  summary: string;
  type: string;
  docType?: string;
  date: string;
  status: string;
  statusLabel: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary';
  actionRoute?: string;
}

export interface DocumentsListResponse {
  items: DocumentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentsQueryParams {
  claimId?: string;
  docType?: string;
  page?: number;
  limit?: number;
}
