import { useNavigate } from 'react-router-dom';
import {
  DataTable,
  StatusPill,
  Button,
} from '@/components/common';
import type { Column } from '@/components/common';
import type { OpinionItem } from '@/lib/types';
import { opinions } from '@/lib/data';

const statusVariantMap: Record<string, 'done' | 'sent' | 'wait' | 'transfer'> = {
  done: 'done',
  sent: 'sent',
  wait: 'wait',
  transfer: 'transfer',
  paid: 'done',
};

export default function OpinionPage() {
  const navigate = useNavigate();

  const columns: Column<OpinionItem>[] = [
    { key: 'claimId', label: '청구번호', width: '110px' },
    { key: 'summary', label: '사건 요약' },
    { key: 'type', label: '의견서 유형', width: '140px' },
    {
      key: 'date',
      label: '생성일',
      width: '110px',
    },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] ?? 'done'}>
          {row.statusLabel}
        </StatusPill>
      ),
    },
    {
      key: 'action',
      label: '액션',
      width: '90px',
      render: (row) => (
        <Button
          variant={row.actionVariant}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (row.actionRoute) navigate(row.actionRoute);
          }}
        >
          {row.actionLabel}
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[18px] font-bold tracking-[-0.4px]">법률 의견서</h1>
        <p className="text-[12px] text-secondary mt-1">
          AI 생성 법률 의견서 관리 · 전체 {opinions.length}건
        </p>
      </div>

      <DataTable<OpinionItem>
        title="법률 의견서 목록"
        columns={columns}
        data={opinions}
        onRowClick={(row) => {
          if (row.actionRoute) navigate(row.actionRoute);
        }}
      />
    </div>
  );
}
