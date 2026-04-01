import { useState } from 'react';
import clsx from 'clsx';
import { approveItems } from '@/data/mockData';
import { DataTable, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { ApproveItem } from '@/types/documents';

const statusColorMap: Record<string, string> = {
  '대기': '#D97706',
  '승인': '#059669',
  '반려': '#DC2626',
  '보완요청': '#4F46E5',
};

type TabType = 'pending' | 'history';

export default function ApprovePage() {
  const [tab, setTab] = useState<TabType>('pending');
  const [selected, setSelected] = useState<ApproveItem | null>(null);

  const pending = approveItems.filter((a) => a.status === '대기');
  const history = approveItems.filter((a) => a.status !== '대기');
  const currentData = tab === 'pending' ? pending : history;

  const columns: Column<ApproveItem>[] = [
    {
      key: 'claimId',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold text-primary">{row.claimId}</span>,
    },
    {
      key: 'complex',
      label: '단지',
      render: (row) => `${row.complex} ${row.dongHo}`,
    },
    { key: 'accidentType', label: '유형', width: '110px' },
    {
      key: 'finalAmount',
      label: '최종 산정액',
      width: '130px',
      align: 'right',
      render: (row) => <span className="font-bold">{row.finalAmount.toLocaleString()}원</span>,
    },
    {
      key: 'requestDate',
      label: '요청일',
      width: '100px',
      render: (row) => row.requestDate.slice(5).replace('-', '.'),
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (row) => {
        const color = statusColorMap[row.status] || '#64748B';
        return (
          <span className="text-[11px] font-semibold px-2 py-[2px] rounded-badge inline-block" style={{ backgroundColor: color + '15', color }}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'action',
      label: '액션',
      width: '220px',
      render: (row) => {
        if (row.status !== '대기') {
          return <span className="text-[11px] text-secondary">{row.approveDate} · {row.approver}</span>;
        }
        return (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="green" size="sm">승인</Button>
            <Button variant="danger" size="sm">반려</Button>
            <Button variant="secondary" size="sm">보완요청</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">승인·결재</h1>
        <p className="text-[13px] text-secondary mt-1">보험금 최종 승인을 처리합니다</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-amber">{pending.length}</div>
          <div className="text-[11px] text-secondary mt-1">승인 대기</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-green">{approveItems.filter((a) => a.status === '승인').length}</div>
          <div className="text-[11px] text-secondary mt-1">승인 완료</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-primary">{pending.reduce((sum, a) => sum + a.finalAmount, 0).toLocaleString()}원</div>
          <div className="text-[11px] text-secondary mt-1">대기 합계</div>
        </div>
      </div>

      <div className="flex gap-1 bg-border-light rounded-block p-1 w-fit">
        <button
          onClick={() => setTab('pending')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'pending' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          승인 대기 ({pending.length})
        </button>
        <button
          onClick={() => setTab('history')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'history' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          승인 이력 ({history.length})
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
          <div className="fixed top-0 right-0 bottom-0 w-[400px] bg-card border-l border-border z-50 overflow-y-auto shadow-lg">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold">{selected.claimId}</h2>
                <button onClick={() => setSelected(null)} className="text-secondary hover:text-txt text-[18px] cursor-pointer">✕</button>
              </div>
              <DetailCard title="승인 정보">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">단지</span><span className="font-medium">{selected.complex} {selected.dongHo}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">유형</span><span className="font-medium">{selected.accidentType}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">최종 산정액</span><span className="font-bold text-green">{selected.finalAmount.toLocaleString()}원</span></div>
                  <div className="flex justify-between"><span className="text-secondary">요청일</span><span className="font-medium">{selected.requestDate}</span></div>
                  {selected.approver && (
                    <div className="flex justify-between"><span className="text-secondary">승인자</span><span className="font-medium">{selected.approver}</span></div>
                  )}
                </div>
              </DetailCard>
              {selected.status === '대기' && (
                <div className="flex gap-2">
                  <Button variant="green" size="sm">승인</Button>
                  <Button variant="danger" size="sm">반려</Button>
                  <Button variant="primary" size="sm">보완요청</Button>
                </div>
              )}
              <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>닫기</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
