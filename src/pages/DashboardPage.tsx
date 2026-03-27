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
import { kpiData, dashboardRecentClaims, barChartData } from '@/lib/data';

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
    {
      key: 'id',
      label: '청구번호',
      width: '100px',
      render: (row) => (
        <span className="text-[11px] text-secondary">{row.id}</span>
      ),
    },
    {
      key: 'complex',
      label: '단지·내용',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.complex}</div>
          <div className="text-[11px] text-secondary">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: '접수일',
      width: '80px',
      render: (row) => (
        <span className="text-[12px] text-secondary">{row.date.slice(5).replace('-', '/')}</span>
      ),
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
      render: (row) => {
        const pct = (row.confidence * 100).toFixed(1);
        const color = row.confidence >= 0.9 ? 'text-green' : 'text-amber';
        return <span className={`font-semibold ${color}`}>{pct}%</span>;
      },
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
      <div className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">청구 관리 대시보드</div>
      <div className="text-[13px] text-secondary mb-[18px]">2026년 3월 · 전체 단지 기준</div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-[18px]">
        {kpiData.map((kpi) => (
          <KPICard
            key={kpi.variant}
            {...kpi}
            onClick={() => navigate(kpi.route ?? '/claims')}
          />
        ))}
      </div>

      {/* 2-column layout */}
      <div className="grid gap-[14px] grid-cols-1 xl:grid-cols-[1fr_300px]">
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
            {/* Savings Summary Box */}
            <div className="bg-border-light rounded-block py-[10px] px-[12px] mt-[10px]">
              <div className="text-[11px] text-secondary mb-[7px]">이번 달 손해율 절감</div>
              <div className="flex gap-3">
                <div>
                  <div className="text-[18px] font-bold text-amber">-16.8%</div>
                  <div className="text-[10px] text-secondary">A+B 직접 차단</div>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <div className="text-[18px] font-bold text-green">-11.2%</div>
                  <div className="text-[10px] text-secondary">C 과다견적 방어</div>
                </div>
              </div>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
