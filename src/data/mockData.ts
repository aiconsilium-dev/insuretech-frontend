/**
 * Mock data for 보험사/손해사정사 어드민
 */

import type { Claim } from '@/types/claims';
import type { EstimationItem } from '@/types/estimation';
import type { ApproveItem, OpinionItem, NotificationItem } from '@/types/documents';
import type { KPIData, BarItem, TimelineItemData, StageData, CaseItemData, KVRowData } from '@/types/ui';

// ── 접수 목록 (10건) ──
export const claims: Claim[] = [
  {
    id: 'CLM-0401',
    source: '입주민',
    complex: '래미안 원베일리',
    dong: '101',
    ho: '1502',
    accidentType: '균열·파손',
    type: null,
    status: '분류대기',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-04-01',
    description: '거실 천장 균열 및 도장 파손',
  },
  {
    id: 'CLM-0398',
    source: '관리사무소',
    complex: '헬리오시티',
    dong: '102',
    ho: '1204',
    accidentType: '누수·침수',
    type: 'C',
    status: '산정완료',
    aiAmount: 920000,
    adjustedAmount: 850000,
    finalAmount: 850000,
    deductible: 50000,
    date: '2026-03-31',
    description: '천장 급배수 누수로 인한 세대 내 피해',
    corrected: true,
  },
  {
    id: 'CLM-0395',
    source: '입주민',
    complex: '마포래미안',
    dong: '803',
    ho: '501',
    accidentType: '벽면균열',
    type: 'A',
    status: '현장조사중',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-03-30',
    description: '외벽 수직 관통균열 0.8mm',
    defectType: '주요 구조부 균열',
    contractor: '○○건설',
    fieldStatus: '조사중',
    fieldAssignDate: '2026-03-30',
  },
  {
    id: 'CLM-0390',
    source: '관리사무소',
    complex: '송도더샵',
    dong: 'A',
    ho: '공용',
    accidentType: '놀이터사고',
    type: 'C',
    status: '심사중',
    aiAmount: 1500000,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 100000,
    date: '2026-03-28',
    description: '어린이 놀이터 안전시설 파손으로 인한 부상',
  },
  {
    id: 'CLM-0385',
    source: '입주민',
    complex: '잠실파크리오',
    dong: '205',
    ho: '1205',
    accidentType: '타일파손',
    type: 'B',
    status: '면책통보',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-03-25',
    description: '세탁기 배수 연결 불량으로 타일 파손',
    exemptionReason: '입주민 과실',
    exemptionBasis: '보험약관 제4조 제2항 제3호',
    opinionSent: true,
  },
  {
    id: 'CLM-0382',
    source: '입주민',
    complex: '은평뉴타운',
    dong: '301',
    ho: '901',
    accidentType: '급배수 누수',
    type: 'C',
    status: '승인대기',
    aiAmount: 1240000,
    adjustedAmount: 1240000,
    finalAmount: 1240000,
    deductible: 50000,
    date: '2026-03-22',
    description: '엘리베이터 홀 급배수 배관 누수',
    corrected: false,
  },
  {
    id: 'CLM-0378',
    source: '관리사무소',
    complex: '분당파크뷰',
    dong: '502',
    ho: '공용',
    accidentType: '바닥재 파손',
    type: 'B',
    status: '완료',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-03-20',
    description: '지하주차장 바닥재 파손',
    exemptionReason: '자연노화',
    exemptionBasis: '보험약관 면책조항 해당',
    opinionSent: true,
  },
  {
    id: 'CLM-0375',
    source: '입주민',
    complex: '래미안 원베일리',
    dong: '101',
    ho: '301',
    accidentType: '욕실 배관 누수',
    type: 'C',
    status: '지급완료',
    aiAmount: 607850,
    adjustedAmount: 607850,
    finalAmount: 607850,
    deductible: 30000,
    date: '2026-03-18',
    description: '욕실 배관 누수로 인한 하부 세대 피해',
    corrected: false,
  },
  {
    id: 'CLM-0370',
    source: '관리사무소',
    complex: '마포래미안',
    dong: '805',
    ho: '공용',
    accidentType: '외벽 타일 탈락',
    type: 'A',
    status: '접수',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-03-15',
    description: '외벽 타일 대면적 탈락 — 시공 하자 의심',
    defectType: '외장재 하자',
    contractor: '○○건설',
  },
  {
    id: 'CLM-0365',
    source: '입주민',
    complex: '헬리오시티',
    dong: '103',
    ho: '805',
    accidentType: '창호 결로',
    type: 'B',
    status: '면책통보',
    aiAmount: null,
    adjustedAmount: null,
    finalAmount: null,
    deductible: 0,
    date: '2026-03-12',
    description: '창호 결로 및 곰팡이 발생',
    exemptionReason: '보험 면책조항 해당',
    exemptionBasis: '자연현상으로 인한 결로는 면책',
    opinionSent: true,
  },
];

// ── 적산 데이터 ──
export const estimationItems: EstimationItem[] = [
  {
    id: 1,
    claimId: 'CLM-0398',
    complex: '헬리오시티',
    dongHo: '102동 1204호',
    accidentType: '누수·침수',
    items: [
      { name: '방수층 보수', description: '탄성도막 방수', quantity: 3.1, unit: '㎡', unitPrice: 25500, subtotal: 79050, standardLabel: '표준품셈' },
      { name: '천장 재도장', description: '퍼티 + 도장 2회', quantity: 12.3, unit: '㎡', unitPrice: 10140, subtotal: 124722, standardLabel: '물가정보지' },
      { name: '균열주입', description: '에폭시 수지', quantity: 4.7, unit: 'm', unitPrice: 22320, subtotal: 104904, standardLabel: '표준품셈' },
      { name: '석고보드 교체', description: '9.5T 석고보드', quantity: 2.4, unit: '㎡', unitPrice: 17800, subtotal: 42720, standardLabel: '표준품셈' },
    ],
    aiTotal: 920000,
    adjustedTotal: 850000,
    confirmed: true,
    deductible: 50000,
    insuranceAmount: 800000,
  },
  {
    id: 2,
    claimId: 'CLM-0390',
    complex: '송도더샵',
    dongHo: 'A동 공용',
    accidentType: '놀이터사고',
    items: [
      { name: '안전매트 교체', description: '고무안전매트', quantity: 8.0, unit: '㎡', unitPrice: 85000, subtotal: 680000, standardLabel: '물가정보지' },
      { name: '울타리 보수', description: '안전울타리', quantity: 12.0, unit: 'm', unitPrice: 35000, subtotal: 420000, standardLabel: '표준품셈' },
      { name: '도장 보수', description: '놀이기구 도장', quantity: 1.0, unit: '식', unitPrice: 400000, subtotal: 400000, standardLabel: '견적' },
    ],
    aiTotal: 1500000,
    adjustedTotal: null,
    confirmed: false,
    deductible: 100000,
    insuranceAmount: null,
  },
  {
    id: 3,
    claimId: 'CLM-0382',
    complex: '은평뉴타운',
    dongHo: '301동 901호',
    accidentType: '급배수 누수',
    items: [
      { name: '배관 교체', description: 'PVC 배관', quantity: 5.2, unit: 'm', unitPrice: 45000, subtotal: 234000, standardLabel: '표준품셈' },
      { name: '천장 복구', description: '석고보드+도장', quantity: 6.8, unit: '㎡', unitPrice: 28000, subtotal: 190400, standardLabel: '표준품셈' },
      { name: '바닥 방수', description: '우레탄 방수', quantity: 4.5, unit: '㎡', unitPrice: 32000, subtotal: 144000, standardLabel: '물가정보지' },
      { name: '벽지 교체', description: '실크벽지', quantity: 18.0, unit: '㎡', unitPrice: 12000, subtotal: 216000, standardLabel: '물가정보지' },
      { name: '간접노무비', description: '10.5%', quantity: 1.0, unit: '식', unitPrice: 82362, subtotal: 82362, standardLabel: '표준품셈' },
    ],
    aiTotal: 1240000,
    adjustedTotal: 1240000,
    confirmed: true,
    deductible: 50000,
    insuranceAmount: 1190000,
  },
  {
    id: 4,
    claimId: 'CLM-0375',
    complex: '래미안 원베일리',
    dongHo: '101동 301호',
    accidentType: '욕실 배관 누수',
    items: [
      { name: '방수층 보수', description: '탄성도막 방수', quantity: 3.1, unit: '㎡', unitPrice: 25500, subtotal: 79050, standardLabel: '표준품셈' },
      { name: '재도장', description: '퍼티+도장 2회', quantity: 12.3, unit: '㎡', unitPrice: 24290, subtotal: 298767, standardLabel: '물가정보지' },
      { name: '균열주입', description: '에폭시 수지', quantity: 4.7, unit: 'm', unitPrice: 39766, subtotal: 186900, standardLabel: '표준품셈' },
    ],
    aiTotal: 607850,
    adjustedTotal: 607850,
    confirmed: true,
    deductible: 30000,
    insuranceAmount: 577850,
  },
];

// ── 승인 데이터 ──
export const approveItems: ApproveItem[] = [
  {
    claimId: 'CLM-0382',
    accidentType: '급배수 누수',
    complex: '은평뉴타운',
    dongHo: '301동 901호',
    finalAmount: 1190000,
    requestDate: '2026-03-25',
    status: '대기',
  },
  {
    claimId: 'CLM-0398',
    accidentType: '누수·침수',
    complex: '헬리오시티',
    dongHo: '102동 1204호',
    finalAmount: 800000,
    requestDate: '2026-03-31',
    status: '대기',
  },
  {
    claimId: 'CLM-0375',
    accidentType: '욕실 배관 누수',
    complex: '래미안 원베일리',
    dongHo: '101동 301호',
    finalAmount: 577850,
    requestDate: '2026-03-20',
    status: '승인',
    approveDate: '2026-03-21',
    approver: '김지수 손해사정사',
  },
  {
    claimId: 'CLM-0390',
    accidentType: '놀이터사고',
    complex: '송도더샵',
    dongHo: 'A동 공용',
    finalAmount: 1400000,
    requestDate: '2026-03-29',
    status: '대기',
  },
];

// ── 의견서 데이터 ──
export const opinionItems: OpinionItem[] = [
  {
    id: 'OPN-001',
    claimId: 'CLM-0385',
    type: '면책의견서',
    summary: '잠실파크리오 타일파손 — 입주민 과실 면책',
    date: '2026-03-25',
    status: '발송완료',
    recipient: '홍○○',
  },
  {
    id: 'OPN-002',
    claimId: 'CLM-0378',
    type: '면책의견서',
    summary: '분당파크뷰 바닥재 파손 — 자연노화 면책',
    date: '2026-03-20',
    status: '발송완료',
    recipient: '분당파크뷰 관리사무소',
  },
  {
    id: 'OPN-003',
    claimId: 'CLM-0365',
    type: '면책의견서',
    summary: '헬리오시티 창호 결로 — 면책조항 해당',
    date: '2026-03-12',
    status: '발송완료',
    recipient: '박○○',
  },
  {
    id: 'OPN-004',
    claimId: 'CLM-0385',
    type: '이의신청검토',
    summary: '잠실파크리오 타일파손 — 이의신청 접수',
    date: '2026-04-01',
    status: '이의신청접수',
  },
  {
    id: 'OPN-005',
    claimId: 'CLM-0398',
    type: '손해사정의견서',
    summary: '헬리오시티 누수 — 손해사정 의견서',
    date: '2026-03-31',
    status: '발송완료',
    recipient: '헬리오시티 관리사무소',
  },
  {
    id: 'OPN-006',
    claimId: 'CLM-0382',
    type: '보완요청',
    summary: '은평뉴타운 급배수 — 추가 사진 요청',
    date: '2026-03-24',
    status: '작성중',
  },
];

// ── 알림 데이터 ──
export const notifications: NotificationItem[] = [
  { message: '101동 1502호 방문요청 접수', time: '10분 전', type: 'info' },
  { message: 'CLM-0398 현장조사 보고서 도착', time: '1시간 전', type: 'success' },
  { message: 'CLM-0385 이의신청 접수', time: '3시간 전', type: 'warning' },
];

// ── 대시보드 KPI 헬퍼 ──
export function getDashboardStats() {
  const thisMonth = claims.filter((c) => c.date >= '2026-03-01');
  const fieldWaiting = claims.filter(
    (c) => c.status === '현장조사중' || c.fieldStatus === '배정대기' || c.fieldStatus === '조사중',
  );
  const approveWaiting = approveItems.filter((a) => a.status === '대기');
  const paidThisMonth = claims
    .filter((c) => c.status === '지급완료' && c.date >= '2026-03-01')
    .reduce((sum, c) => sum + (c.finalAmount || 0), 0);

  const residentCount = claims.filter((c) => c.source === '입주민').length;
  const officeCount = claims.filter((c) => c.source === '관리사무소').length;

  const typeACount = claims.filter((c) => c.type === 'A').length;
  const typeBCount = claims.filter((c) => c.type === 'B').length;
  const typeCCount = claims.filter((c) => c.type === 'C').length;

  return {
    totalClaims: thisMonth.length,
    fieldWaiting: fieldWaiting.length,
    approveWaiting: approveWaiting.length,
    paidAmount: paidThisMonth + 32450000,
    residentCount,
    officeCount,
    typeACount,
    typeBCount,
    typeCCount,
  };
}

// ── Legacy compat exports (used by common components like BarChart) ──
export const kpiData: KPIData[] = [
  { label: '전체 접수', value: 47, description: '이번 달', variant: 'total', route: '/claims' },
  { label: 'TYPE A', value: 2, description: '시공사 하자', chipLabel: '소송중', variant: 'type-a', route: '/type-a' },
  { label: 'TYPE B', value: 3, description: '면책', chipLabel: '면책', variant: 'type-b', route: '/type-b' },
  { label: 'TYPE C', value: 4, description: '보험금 산출', chipLabel: 'AI', variant: 'type-c', route: '/type-c' },
];

export const barChartData: BarItem[] = [
  { label: 'TYPE A', value: 2, color: 'amber' },
  { label: 'TYPE B', value: 3, color: 'red' },
  { label: 'TYPE C', value: 4, color: 'green' },
];
