import { useState } from 'react';
import { claims } from '@/data/mockData';
import { DataTable, StatusPill, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/types/claims';

const typeAClaims = claims.filter((c) => c.type === 'A');

export default function TypeAPage() {
  const [selected, setSelected] = useState<Claim | null>(null);

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold" style={{ color: '#C9252C' }}>{row.id}</span>,
    },
    {
      key: 'complex',
      label: '단지',
      render: (row) => `${row.complex} ${row.dong}동 ${row.ho}호`,
    },
    { key: 'defectType', label: '하자 유형', width: '130px' },
    {
      key: 'contractor',
      label: '시공사',
      width: '100px',
      render: (row) => row.contractor || '—',
    },
    {
      key: 'fieldStatus',
      label: '현장조사',
      width: '100px',
      render: (row) =>
        row.fieldStatus ? (
          <StatusPill variant={row.fieldStatus === '검토완료' ? 'done' : 'transfer'}>
            {row.fieldStatus}
          </StatusPill>
        ) : (
          <span className="text-muted text-[11px]">미배정</span>
        ),
    },
    {
      key: 'defectInspector',
      label: '적출업체',
      width: '100px',
      render: (row) => row.defectInspector || <span className="text-muted">미배정</span>,
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (row) => <StatusPill variant="transfer">{row.status}</StatusPill>,
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
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#C9252C' }} />
          TYPE A — 시공사 하자 관리
        </h1>
        <p className="text-[13px] text-secondary mt-1">시공사 하자로 분류된 접수건을 관리합니다</p>
      </div>

      {/* 하자소송 현황 카드 */}
      <div className="bg-card rounded-card border-2 p-[18px]" style={{ borderColor: '#C9252C20' }}>
        <div className="flex items-center gap-3">
          <span className="text-[20px]">⚖️</span>
          <div>
            <div className="text-[14px] font-bold">현재 단지 하자소송 진행 중</div>
            <div className="text-[12px] text-secondary mt-[2px]">
              대리인: <span className="font-semibold text-txt">법무법인 더 에이치 황해</span>
              &nbsp;|&nbsp; 진행 단지: 마포래미안, 은평뉴타운
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] font-bold px-2 py-1 rounded-badge" style={{ backgroundColor: '#C9252C15', color: '#C9252C' }}>
              소송 진행중
            </span>
          </div>
        </div>
      </div>

      <DataTable
        title={`TYPE A 접수건 (${typeAClaims.length}건)`}
        columns={columns}
        data={typeAClaims}
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
              <DetailCard title="접수 정보">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">단지</span><span className="font-medium">{selected.complex} {selected.dong}동 {selected.ho}호</span></div>
                  <div className="flex justify-between"><span className="text-secondary">하자 유형</span><span className="font-medium">{selected.defectType || selected.accidentType}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">시공사</span><span className="font-medium">{selected.contractor || '미확인'}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">현장조사</span><span className="font-medium">{selected.fieldStatus || '미배정'}</span></div>
                </div>
              </DetailCard>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">추가 질의 응답</Button>
                <Button variant="secondary" size="sm">변호사 의견서 작성</Button>
                <Button variant="danger" size="sm">하자보수 청구 연계</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
