import { useNavigate } from 'react-router-dom';
import { KPICard, DataTable, StatusPill, Button } from '@/components/common';
import type { Column } from '@/components/common';
import { claims, notifications, getDashboardStats } from '@/data/mockData';
import type { Claim } from '@/types/claims';

const typeColorMap: Record<string, string> = {
  A: '#C9252C',
  B: '#64748B',
  C: '#00854A',
};

const statusVariantMap: Record<string, 'done' | 'sent' | 'wait' | 'transfer'> = {
  '접수': 'wait',
  '분류대기': 'wait',
  '현장조사중': 'transfer',
  '산정중': 'sent',
  '산정완료': 'done',
  '심사중': 'sent',
  '승인대기': 'wait',
  '승인완료': 'done',
  '지급완료': 'done',
  '면책통보': 'sent',
  '반려': 'wait',
  '완료': 'done',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const recentClaims = claims.slice(0, 5);

  const columns: Column<Claim>[] = [
    { key: 'id', label: '접수번호', width: '110px' },
    {
      key: 'source',
      label: '소스',
      width: '90px',
      render: (row) => (
        <span className="text-[12px]">
          {row.source === '입주민' ? '🏠 입주민' : '🏢 관리소'}
        </span>
      ),
    },
    { key: 'accidentType', label: '유형', width: '110px' },
    {
      key: 'type',
      label: 'TYPE',
      width: '80px',
      align: 'center',
      render: (row) =>
        row.type ? (
          <span
            className="text-[11px] font-bold px-2 py-[2px] rounded-badge"
            style={{
              backgroundColor: typeColorMap[row.type] + '15',
              color: typeColorMap[row.type],
            }}
          >
            {row.type}
          </span>
        ) : (
          <span className="text-muted text-[11px]">—</span>
        ),
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] || 'wait'}>
          {row.status}
        </StatusPill>
      ),
    },
    {
      key: 'finalAmount',
      label: '금액',
      width: '110px',
      align: 'right',
      render: (row) =>
        row.finalAmount ? (
          <span className="font-semibold">
            {row.finalAmount.toLocaleString()}원
          </span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'date',
      label: '날짜',
      width: '90px',
      render: (row) => row.date.slice(5).replace('-', '.'),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">통합 대시보드</h1>
        <p className="text-[13px] text-secondary mt-1">
          보험사·손해사정사 접수건 현황을 한눈에 파악합니다
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          label="전체 접수"
          value={`${stats.totalClaims}건`}
          description="이번 달"
          variant="total"
          onClick={() => navigate('/claims')}
        />
        <KPICard
          label="현장조사 대기"
          value={`${stats.fieldWaiting}건`}
          description="배정 필요"
          variant="type-a"
          onClick={() => navigate('/field')}
        />
        <KPICard
          label="보험금 승인 대기"
          value={`${stats.approveWaiting}건`}
          description="결재 필요"
          variant="type-b"
          onClick={() => navigate('/approve')}
        />
        <KPICard
          label="이번 달 지급액"
          value={`${(stats.paidAmount / 10000).toLocaleString()}만원`}
          description="누적 지급"
          variant="type-c"
          onClick={() => navigate('/approve')}
        />
      </div>

      {/* Source & Type Distribution */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-card border border-border p-[18px]">
          <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-3">
            소스별 접수 현황
          </div>
          <div className="flex gap-6">
            <div className="flex-1 text-center py-3 bg-[#F0F9FF] rounded-block">
              <div className="text-[24px] font-bold text-[#0061AF]">{stats.residentCount}</div>
              <div className="text-[11px] text-secondary mt-1">🏠 입주민 접수</div>
            </div>
            <div className="flex-1 text-center py-3 bg-[#FFF7ED] rounded-block">
              <div className="text-[24px] font-bold text-amber">{stats.officeCount}</div>
              <div className="text-[11px] text-secondary mt-1">🏢 관리사무소 접수</div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-card border border-border p-[18px]">
          <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-3">
            TYPE별 분포
          </div>
          <div className="space-y-2">
            {[
              { label: 'TYPE A (시공사 하자)', count: stats.typeACount, color: '#C9252C' },
              { label: 'TYPE B (면책)', count: stats.typeBCount, color: '#64748B' },
              { label: 'TYPE C (보험금 산출)', count: stats.typeCCount, color: '#00854A' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-[140px] text-[12px] font-medium truncate">{item.label}</div>
                <div className="flex-1 h-[22px] bg-border-light rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${Math.max((item.count / 10) * 100, 8)}%`,
                      backgroundColor: item.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div className="text-[13px] font-bold w-[40px] text-right">{item.count}건</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <DataTable
        title="최근 접수"
        columns={columns}
        data={recentClaims}
        onRowClick={() => navigate('/claims')}
        headerRight={
          <Button variant="secondary" size="sm" onClick={() => navigate('/claims')}>
            전체 보기 →
          </Button>
        }
      />

      {/* Notifications */}
      <div className="bg-card rounded-card border border-border p-[18px]">
        <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-3">
          알림
        </div>
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 px-3 rounded-block bg-border-light"
            >
              <span className="text-[14px]">
                {n.type === 'info' ? '📋' : n.type === 'success' ? '✅' : '⚠️'}
              </span>
              <span className="text-[13px] flex-1">{n.message}</span>
              <span className="text-[11px] text-muted">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
