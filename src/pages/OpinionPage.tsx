import { useState } from 'react';
import clsx from 'clsx';
import { opinionItems } from '@/data/mockData';
import { DataTable, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { OpinionItem } from '@/types/documents';

const statusColorMap: Record<string, string> = {
  '작성중': '#D97706',
  '발송완료': '#059669',
  '이의신청접수': '#DC2626',
  '검토완료': '#4F46E5',
};

const typeColorMap: Record<string, string> = {
  '면책의견서': '#64748B',
  '보완요청': '#4F46E5',
  '이의신청검토': '#DC2626',
  '손해사정의견서': '#00854A',
};

type TabType = 'opinions' | 'objections';

export default function OpinionPage() {
  const [tab, setTab] = useState<TabType>('opinions');
  const [selected, setSelected] = useState<OpinionItem | null>(null);

  const opinions = opinionItems.filter(
    (o) => o.type === '면책의견서' || o.type === '보완요청' || o.type === '손해사정의견서',
  );
  const objections = opinionItems.filter((o) => o.type === '이의신청검토');
  const currentData = tab === 'opinions' ? opinions : objections;

  const columns: Column<OpinionItem>[] = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      render: (row) => <span className="font-medium text-secondary">{row.id}</span>,
    },
    {
      key: 'claimId',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold text-primary">{row.claimId}</span>,
    },
    {
      key: 'type',
      label: '유형',
      width: '120px',
      render: (row) => {
        const color = typeColorMap[row.type] || '#64748B';
        return (
          <span className="text-[11px] font-semibold px-2 py-[2px] rounded-badge inline-block" style={{ backgroundColor: color + '15', color }}>
            {row.type}
          </span>
        );
      },
    },
    { key: 'summary', label: '요약' },
    {
      key: 'date',
      label: '날짜',
      width: '90px',
      render: (row) => row.date.slice(5).replace('-', '.'),
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
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
      width: '140px',
      render: (row) => {
        if (row.status === '작성중') return <div onClick={(e) => e.stopPropagation()}><Button variant="primary" size="sm">작성 계속</Button></div>;
        if (row.status === '이의신청접수') return <div onClick={(e) => e.stopPropagation()}><Button variant="danger" size="sm">검토</Button></div>;
        if (row.status === '발송완료') return <div onClick={(e) => e.stopPropagation()}><Button variant="secondary" size="sm">PDF 보기</Button></div>;
        return null;
      },
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">의견서 관리</h1>
        <p className="text-[13px] text-secondary mt-1">면책 의견서를 관리하고 이의신청을 검토합니다</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-txt">{opinionItems.length}</div>
          <div className="text-[11px] text-secondary mt-1">전체 의견서</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-green">{opinionItems.filter((o) => o.status === '발송완료').length}</div>
          <div className="text-[11px] text-secondary mt-1">발송 완료</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-amber">{opinionItems.filter((o) => o.status === '작성중').length}</div>
          <div className="text-[11px] text-secondary mt-1">작성 중</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-red">{objections.length}</div>
          <div className="text-[11px] text-secondary mt-1">이의신청</div>
        </div>
      </div>

      <div className="flex gap-1 bg-border-light rounded-block p-1 w-fit">
        <button
          onClick={() => setTab('opinions')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'opinions' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          면책 의견서 ({opinions.length})
        </button>
        <button
          onClick={() => setTab('objections')}
          className={clsx(
            'px-4 py-[6px] text-[12px] font-medium rounded-btn transition-all cursor-pointer',
            tab === 'objections' ? 'bg-white shadow-subtle text-primary' : 'text-secondary hover:text-txt',
          )}
        >
          이의신청 ({objections.length})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={currentData}
        onRowClick={(row) => setSelected(row)}
        footer={
          <div className="px-4 py-3 text-[12px] text-secondary border-t border-border flex items-center justify-between">
            <span>{currentData.length}건</span>
            <Button variant="primary" size="sm">의견서 작성</Button>
          </div>
        }
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
              <DetailCard title="의견서 정보">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">접수번호</span><span className="font-semibold text-primary">{selected.claimId}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">유형</span><span className="font-medium">{selected.type}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">요약</span><span className="font-medium text-right max-w-[200px]">{selected.summary}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">날짜</span><span className="font-medium">{selected.date}</span></div>
                  <div className="flex justify-between"><span className="text-secondary">상태</span><span className="font-semibold" style={{ color: statusColorMap[selected.status] }}>{selected.status}</span></div>
                  {selected.recipient && (
                    <div className="flex justify-between"><span className="text-secondary">수신자</span><span className="font-medium">{selected.recipient}</span></div>
                  )}
                </div>
              </DetailCard>
              <div className="flex flex-wrap gap-2">
                {selected.status === '작성중' && <Button variant="primary" size="sm">작성 계속</Button>}
                {(selected.status === '작성중' || selected.status === '검토완료') && <Button variant="green" size="sm">발송</Button>}
                {selected.type === '이의신청검토' && <Button variant="danger" size="sm">이의신청 검토</Button>}
                <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>닫기</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
