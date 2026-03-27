import { useNavigate } from 'react-router-dom';
import {
  KPICard,
  Badge,
  StatusPill,
  DataTable,
  DetailCard,
  BarChart,
  Button,
} from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/lib/types';
import { kpiData, dashboardRecentClaims, barChartData, lossRateSummary } from '@/lib/data';

const typeToRoute: Record<string, string> = {
  A: '/type-a',
  B: '/type-b',
  C: '/type-c',
};

const badgeVariantMap: Record<string, 'ba' | 'bb' | 'bc'> = {
  A: 'ba',
  B: 'bb',
  C: 'bc',
};

const statusVariantMap: Record<string, 'done' | 'sent' | 'wait' | 'transfer'> = {
  done: 'done',
  sent: 'sent',
  wait: 'wait',
  transfer: 'transfer',
  paid: 'done',
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const columns: Column<Claim>[] = [
    { key: 'id', label: '청구번호', width: '100px' },
    {
      key: 'complex',
      label: '단지 · 내용',
      render: (row) => (
        <div>
          <div className="font-semibold text-[13px]">{row.complex}</div>
          <div className="text-[11px] text-secondary">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: '접수일',
      width: '90px',
      render: (row) => row.date.slice(5),
    },
    {
      key: 'type',
      label: '유형',
      width: '90px',
      render: (row) => (
        <Badge variant={badgeVariantMap[row.type]}>TYPE {row.type}</Badge>
      ),
    },
    {
      key: 'confidence',
      label: '신뢰도',
      width: '80px',
      render: (row) => (
        <span className="font-semibold">{(row.confidence * 100).toFixed(1)}%</span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] ?? 'done'}>
          {row.statusLabel}
        </StatusPill>
      ),
    },
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] font-bold tracking-[-0.4px]">대시보드</h1>
        <p className="text-[12px] text-secondary mt-1">2026년 3월 — APT Insurance AI 청구 관리 현황</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-3 mb-[14px]">
        {kpiData.map((kpi) => (
          <KPICard
            key={kpi.variant}
            {...kpi}
            onClick={() => navigate(kpi.route ?? '/claims')}
          />
        ))}
      </div>

      {/* 2-column layout */}
      <div className="grid gap-[14px]" style={{ gridTemplateColumns: '1fr 300px' }}>
        {/* Left: Recent Claims Table */}
        <DataTable<Claim>
          title="최근 청구 내역"
          columns={columns}
          data={dashboardRecentClaims}
          onRowClick={(row) => navigate(typeToRoute[row.type] ?? '/claims')}
          headerRight={
            <Button variant="secondary" size="sm" onClick={() => navigate('/claims')}>
              전체 보기
            </Button>
          }
        />

        {/* Right: Loss Rate + Savings */}
        <div className="flex flex-col gap-[14px]">
          <DetailCard title="TYPE별 손해율 절감">
            <BarChart items={barChartData} />
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex justify-between items-center py-[6px]">
                <span className="text-[12px] text-secondary">
                  {lossRateSummary.directBlock.label}
                </span>
                <span className="text-[15px] font-bold text-red">
                  {lossRateSummary.directBlock.value}
                </span>
              </div>
              <div className="flex justify-between items-center py-[6px]">
                <span className="text-[12px] text-secondary">
                  {lossRateSummary.overEstimate.label}
                </span>
                <span className="text-[15px] font-bold text-green">
                  {lossRateSummary.overEstimate.value}
                </span>
              </div>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
