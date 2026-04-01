import { useState } from 'react';
import { claims } from '@/data/mockData';
import { DataTable, StatusPill, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/types/claims';

const typeBClaims = claims.filter((c) => c.type === 'B');

const exemptionReasonCounts = typeBClaims.reduce(
  (acc, c) => {
    const reason = c.exemptionReason || '기타';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>,
);

export default function TypeBPage() {
  const [selected, setSelected] = useState<Claim | null>(null);

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold" style={{ color: '#64748B' }}>{row.id}</span>,
    },
    {
      key: 'complex',
      label: '단지 / 동호',
      render: (row) => `${row.complex} ${row.dong}동 ${row.ho}호`,
    },
    { key: 'accidentType', label: '사고유형', width: '100px' },
    {
      key: 'exemptionReason',
      label: '면책 사유',
      width: '130px',
      render: (row) => <span className="text-[12px] font-medium">{row.exemptionReason || '—'}</span>,
    },
    {
      key: 'exemptionBasis',
      label: '근거',
      width: '180px',
      render: (row) => <span className="text-[11px] text-secondary">{row.exemptionBasis || '—'}</span>,
    },
    {
      key: 'opinionSent',
      label: '의견서',
      width: '80px',
      align: 'center',
      render: (row) =>
        row.opinionSent ? (
          <StatusPill variant="done">발송</StatusPill>
        ) : (
          <span className="text-muted text-[11px]">미발송</span>
        ),
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (row) => (
        <StatusPill variant={row.status === '완료' ? 'done' : 'sent'}>
          {row.status}
        </StatusPill>
      ),
    },
    {
      key: 'date',
      label: '접수일',
      width: '90px',
      render: (row) => row.date.slice(5).replace('-', '.'),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#64748B' }} />
          TYPE B — 면책 관리
        </h1>
        <p className="text-[13px] text-secondary mt-1">면책으로 분류된 접수건의 사유를 관리하고 의견서를 발송합니다</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '자연노화', icon: '🕐' },
          { label: '입주민 과실', icon: '👤' },
          { label: '보험 면책조항 해당', icon: '📋' },
          { label: '기타', icon: '📁' },
        ].map((item) => (
          <div key={item.label} className="bg-card rounded-card border border-border p-4 text-center">
            <div className="text-[18px] mb-1">{item.icon}</div>
            <div className="text-[20px] font-bold text-txt">{exemptionReasonCounts[item.label] || 0}건</div>
            <div className="text-[11px] text-secondary mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <DataTable
        title={`TYPE B 접수건 (${typeBClaims.length}건)`}
        columns={columns}
        data={typeBClaims}
        onRowClick={(row) => setSelected(row)}
      />

      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[420px] bg-card border-l border-border z-50 overflow-y-auto shadow-lg">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold">{selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-secondary hover:text-txt text-[18px] cursor-pointer">✕</button>
              </div>
              <DetailCard title="면책 정보">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">단지</span><span className="font-medium">{selected.complex}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">사고유형</span><span className="font-medium">{selected.accidentType}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">면책 사유</span><span className="font-semibold">{selected.exemptionReason || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">근거</span><span className="font-medium text-[12px]">{selected.exemptionBasis || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">의견서</span><span className="font-medium">{selected.opinionSent ? '발송 완료' : '미발송'}</span></div>
                </div>
              </DetailCard>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">면책 의견서 발송</Button>
                <Button variant="secondary" size="sm">이의신청 검토</Button>
                <Button variant="danger" size="sm">금감원 대응</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
