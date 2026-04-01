import { useState } from 'react';
import clsx from 'clsx';
import { claims } from '@/data/mockData';
import { DataTable, StatusPill, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/types/claims';

const fieldClaims = claims.filter(
  (c) => c.fieldStatus || c.status === '현장조사중' || c.status === '접수' || c.status === '분류대기',
);

const statusColorMap: Record<string, string> = {
  '배정대기': '#D97706',
  '조사중': '#0061AF',
  '보고서접수': '#4F46E5',
  '검토완료': '#059669',
};

type TabType = 'waiting' | 'completed';

export default function FieldCheckPage() {
  const [tab, setTab] = useState<TabType>('waiting');
  const [selected, setSelected] = useState<Claim | null>(null);

  const waitingClaims = fieldClaims.filter(
    (c) => !c.fieldStatus || c.fieldStatus === '배정대기' || c.fieldStatus === '조사중',
  );
  const completedClaims = fieldClaims.filter(
    (c) => c.fieldStatus === '보고서접수' || c.fieldStatus === '검토완료',
  );

  const currentData = tab === 'waiting' ? waitingClaims : completedClaims;

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold" style={{ color: '#0061AF' }}>{row.id}</span>,
    },
    {
      key: 'source',
      label: '소스',
      width: '90px',
      render: (row) => <span className="text-[12px]">{row.source === '입주민' ? '🏠 입주민' : '🏢 관리소'}</span>,
    },
    {
      key: 'complex',
      label: '단지 / 동호',
      render: (row) => `${row.complex} ${row.dong}동 ${row.ho}호`,
    },
    { key: 'accidentType', label: '사고유형', width: '100px' },
    {
      key: 'fieldAssignDate',
      label: '배정일',
      width: '90px',
      render: (row) => row.fieldAssignDate ? row.fieldAssignDate.slice(5).replace('-', '.') : '—',
    },
    {
      key: 'fieldStatus',
      label: '조사상태',
      width: '100px',
      render: (row) => {
        const status = row.fieldStatus || '배정대기';
        const color = statusColorMap[status] || '#64748B';
        return (
          <span className="text-[11px] font-semibold px-2 py-[2px] rounded-badge inline-block" style={{ backgroundColor: color + '15', color }}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'action',
      label: '액션',
      width: '140px',
      render: (row) => {
        if (!row.fieldStatus || row.fieldStatus === '배정대기') {
          return <Button variant="primary" size="sm" onClick={(e) => e.stopPropagation()}>현장조사 요청 발송</Button>;
        }
        if (row.fieldStatus === '보고서접수') {
          return <Button variant="green" size="sm" onClick={(e) => e.stopPropagation()}>보고서 확인</Button>;
        }
        return null;
      },
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#0061AF' }} />
          현장조사 관리
        </h1>
        <p className="text-[13px] text-secondary mt-1">관리사무소에 현장조사를 요청하고 보고서를 관리합니다</p>
      </div>

      {/* Status Flow */}
      <div className="bg-card rounded-card border border-border p-[18px]">
        <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-3">현장조사 프로세스</div>
        <div className="flex items-center justify-between max-w-[600px]">
          {['배정대기', '조사중', '보고서접수', '검토완료'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: statusColorMap[step] }}>
                {i + 1}
              </div>
              <span className="text-[12px] font-medium">{step}</span>
              {i < 3 && <div className="w-12 h-[2px] bg-border ml-2" />}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-border-light rounded-block p-1 w-fit">
        <button
          onClick={() => setTab('waiting')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'waiting' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          조사 대기 ({waitingClaims.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'completed' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          조사 완료 ({completedClaims.length})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={currentData}
        onRowClick={(row) => setSelected(row)}
        footer={<div className="px-4 py-3 text-[12px] text-secondary border-t border-border">{currentData.length}건</div>}
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
              <DetailCard title="조사 정보">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">단지</span><span className="font-medium">{selected.complex}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">동/호</span><span className="font-medium">{selected.dong}동 {selected.ho}호</span></div>
                  <div className="flex justify-between"><span className="text-secondary">사고유형</span><span className="font-medium">{selected.accidentType}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">배정일</span><span className="font-medium">{selected.fieldAssignDate || '미배정'}</span></div>
                  <div className="flex justify-between">
                    <span className="text-secondary">조사상태</span>
                    <span className="font-semibold" style={{ color: statusColorMap[selected.fieldStatus || '배정대기'] }}>
                      {selected.fieldStatus || '배정대기'}
                    </span>
                  </div>
                </div>
              </DetailCard>
              {(selected.fieldStatus === '보고서접수' || selected.fieldStatus === '검토완료') && (
                <DetailCard title="조사 보고서">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-border-light rounded-block flex items-center justify-center text-[11px] text-muted">
                          사진 {i}
                        </div>
                      ))}
                    </div>
                    <div className="text-[12px]">
                      <div className="font-semibold mb-1">소견서</div>
                      <div className="text-secondary">현장 확인 결과, {selected.accidentType} 손상이 확인됨. 손상 정도는 중간 수준으로 판단됨.</div>
                    </div>
                    <div className="text-[12px]">
                      <div className="font-semibold mb-1">손상정도</div>
                      <div className="text-amber font-medium">중간</div>
                    </div>
                  </div>
                </DetailCard>
              )}
              <div className="flex gap-2">
                <Button variant="primary" size="sm">현장조사 요청 발송</Button>
                <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>닫기</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
