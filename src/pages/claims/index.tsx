import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { DataTable, StatusPill, Button } from '@/components/common';
import type { Column } from '@/components/common';
import { claims } from '@/data/mockData';
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

type SourceFilter = '전체' | '입주민' | '관리사무소';
type TypeFilter = '전체' | '미분류' | 'A' | 'B' | 'C';
type StatusFilter = '전체' | '접수' | '분류대기' | '현장조사' | '산정' | '승인대기' | '완료';

export default function ClaimsPage() {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('전체');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('전체');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체');
  const [search, setSearch] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      if (sourceFilter !== '전체' && c.source !== sourceFilter) return false;
      if (typeFilter === '미분류' && c.type !== null) return false;
      if (typeFilter === 'A' && c.type !== 'A') return false;
      if (typeFilter === 'B' && c.type !== 'B') return false;
      if (typeFilter === 'C' && c.type !== 'C') return false;
      if (statusFilter === '현장조사' && c.status !== '현장조사중') return false;
      if (statusFilter === '산정' && !['산정중', '산정완료'].includes(c.status)) return false;
      if (statusFilter === '접수' && c.status !== '접수') return false;
      if (statusFilter === '분류대기' && c.status !== '분류대기') return false;
      if (statusFilter === '승인대기' && c.status !== '승인대기') return false;
      if (statusFilter === '완료' && !['완료', '지급완료'].includes(c.status)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.id.toLowerCase().includes(q) &&
          !c.complex.toLowerCase().includes(q) &&
          !`${c.dong}동 ${c.ho}호`.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [sourceFilter, typeFilter, statusFilter, search]);

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold text-primary">{row.id}</span>,
    },
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
    {
      key: 'dongHo',
      label: '동/호',
      width: '100px',
      render: (row) => `${row.dong}동 ${row.ho}호`,
    },
    { key: 'accidentType', label: '사고유형', width: '100px' },
    {
      key: 'type',
      label: 'TYPE',
      width: '70px',
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
            TYPE {row.type}
          </span>
        ) : (
          <span className="text-muted text-[11px]">미분류</span>
        ),
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] || 'wait'}>
          {row.status}
        </StatusPill>
      ),
    },
    {
      key: 'aiAmount',
      label: 'AI산출액',
      width: '110px',
      align: 'right',
      render: (row) =>
        row.aiAmount ? (
          <span className="font-medium">{row.aiAmount.toLocaleString()}원</span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'date',
      label: '접수일',
      width: '90px',
      render: (row) => row.date.slice(5).replace('-', '.'),
    },
    {
      key: 'action',
      label: '액션',
      width: '120px',
      render: (row) => {
        if (row.type === null) {
          return (
            <select
              className="text-[11px] border border-border rounded-btn px-2 py-1 bg-white cursor-pointer"
              defaultValue=""
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => e.stopPropagation()}
            >
              <option value="" disabled>TYPE 분류</option>
              <option value="A">TYPE A</option>
              <option value="B">TYPE B</option>
              <option value="C">TYPE C</option>
            </select>
          );
        }
        if (row.status === '현장조사중' || row.status === '접수') {
          return (
            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/field'); }}>
              현장조사 배정
            </Button>
          );
        }
        if (row.status === '산정완료') {
          return (
            <Button variant="green" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/approve'); }}>
              승인 요청
            </Button>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">접수 관리</h1>
        <p className="text-[13px] text-secondary mt-1">전체 접수 목록을 조회하고 관리합니다</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-card border border-border p-4 flex flex-wrap gap-3 items-center">
        <FilterGroup
          label="소스"
          options={['전체', '입주민', '관리사무소'] as const}
          value={sourceFilter}
          onChange={setSourceFilter}
        />
        <div className="w-px h-6 bg-border" />
        <FilterGroup
          label="TYPE"
          options={['전체', '미분류', 'A', 'B', 'C'] as const}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <div className="w-px h-6 bg-border" />
        <FilterGroup
          label="상태"
          options={['전체', '접수', '분류대기', '현장조사', '산정', '승인대기', '완료'] as const}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <div className="flex-1" />
        <input
          type="text"
          placeholder="접수번호, 단지명, 동호수 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-[12px] border border-border rounded-input px-3 py-[6px] w-[220px] outline-none focus:border-primary focus:shadow-ring-primary transition-all"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => setSelectedClaim(row)}
        footer={
          <div className="px-4 py-3 text-[12px] text-secondary border-t border-border">
            총 {filtered.length}건
          </div>
        }
      />

      {/* Detail Slide Panel */}
      {selectedClaim && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedClaim(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-card border-l border-border z-50 overflow-y-auto shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold">{selectedClaim.id}</h2>
                <button onClick={() => setSelectedClaim(null)} className="text-secondary hover:text-txt text-[18px] cursor-pointer">✕</button>
              </div>
              <div className="space-y-3">
                <InfoRow label="단지" value={selectedClaim.complex} />
                <InfoRow label="동/호" value={`${selectedClaim.dong}동 ${selectedClaim.ho}호`} />
                <InfoRow label="소스" value={selectedClaim.source} />
                <InfoRow label="사고유형" value={selectedClaim.accidentType} />
                <InfoRow label="TYPE" value={selectedClaim.type ? `TYPE ${selectedClaim.type}` : '미분류'} />
                <InfoRow label="상태" value={selectedClaim.status} />
                <InfoRow label="접수일" value={selectedClaim.date} />
                <InfoRow label="설명" value={selectedClaim.description} />
                {selectedClaim.aiAmount != null && (
                  <InfoRow label="AI 산출액" value={`${selectedClaim.aiAmount.toLocaleString()}원`} />
                )}
                {selectedClaim.finalAmount != null && (
                  <InfoRow label="최종 금액" value={`${selectedClaim.finalAmount.toLocaleString()}원`} />
                )}
                {selectedClaim.exemptionReason && (
                  <InfoRow label="면책 사유" value={selectedClaim.exemptionReason} />
                )}
                {selectedClaim.contractor && (
                  <InfoRow label="시공사" value={selectedClaim.contractor} />
                )}
              </div>
              <div className="mt-5 flex gap-2">
                {selectedClaim.type === null && <Button variant="primary" size="sm">TYPE 분류</Button>}
                <Button variant="secondary" size="sm" onClick={() => setSelectedClaim(null)}>닫기</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-[12px] text-secondary w-[80px] shrink-0">{label}</span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-secondary font-semibold mr-1">{label}</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={clsx(
            'text-[11px] px-[10px] py-[4px] rounded-badge font-medium cursor-pointer transition-all',
            value === opt
              ? 'bg-primary text-white'
              : 'bg-border-light text-secondary hover:bg-border hover:text-txt',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
