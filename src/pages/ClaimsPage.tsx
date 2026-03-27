import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Badge,
  StatusPill,
  Button,
  KVRow,
} from '@/components/common';
import type { Claim, PreviewData } from '@/lib/types';
import { claims, claimTabCounts } from '@/lib/data';

type TabKey = 'all' | 'a' | 'b' | 'c' | 'wait' | 'done';

const tabs: { key: TabKey; label: string; count?: number }[] = [
  { key: 'all', label: '전체', count: claimTabCounts.all },
  { key: 'a', label: 'TYPE A', count: claimTabCounts.a },
  { key: 'b', label: 'TYPE B', count: claimTabCounts.b },
  { key: 'c', label: 'TYPE C', count: claimTabCounts.c },
  { key: 'wait', label: '승인 대기', count: claimTabCounts.wait },
  { key: 'done', label: '완료' },
];

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

const borderColorMap: Record<string, string> = {
  A: 'border-l-amber',
  B: 'border-l-red',
  C: 'border-l-green',
};

type SortKey = 'date' | 'confidence' | 'status';

function getPreviewData(claim: Claim): PreviewData {
  return {
    badge: `TYPE ${claim.type}`,
    badgeVariant: badgeVariantMap[claim.type],
    title: claim.complex,
    claimId: claim.id,
    date: claim.date,
    kvRows: [
      { label: '피해 내용', value: claim.description },
      { label: '접수일', value: claim.date },
      { label: '신뢰도', value: `${(claim.confidence * 100).toFixed(1)}%` },
      { label: '상태', value: claim.statusLabel },
      ...(claim.amount ? [{ label: '금액', value: `${claim.amount.toLocaleString()}원` }] : []),
    ],
    actions: [
      {
        label: claim.actionLabel ?? '상세',
        variant: (claim.actionVariant ?? 'primary') as 'primary' | 'secondary' | 'green',
        route: claim.actionRoute,
      },
    ],
  };
}

export default function ClaimsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filtered = useMemo(() => {
    let result = [...claims];

    // Tab filter
    if (activeTab === 'a') result = result.filter((c) => c.type === 'A');
    else if (activeTab === 'b') result = result.filter((c) => c.type === 'B');
    else if (activeTab === 'c') result = result.filter((c) => c.type === 'C');
    else if (activeTab === 'wait') result = result.filter((c) => c.status === 'wait');
    else if (activeTab === 'done') result = result.filter((c) => c.dimmed);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.complex.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortKey === 'date') result.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortKey === 'confidence') result.sort((a, b) => b.confidence - a.confidence);
    else if (sortKey === 'status') result.sort((a, b) => a.statusLabel.localeCompare(b.statusLabel));

    return result;
  }, [activeTab, searchQuery, sortKey]);

  const preview = selectedClaim ? getPreviewData(selectedClaim) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px]">청구 목록</h1>
          <p className="text-[12px] text-secondary mt-1">
            전체 {claimTabCounts.all}건 ·{' '}
            <span className="text-amber font-semibold">승인 대기 {claimTabCounts.wait}건</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="단지명, 청구번호 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-[12px] px-3 py-[7px] border border-border rounded-input w-[200px] outline-none focus:border-primary transition-colors bg-card"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-[12px] px-3 py-[7px] border border-border rounded-input outline-none bg-card cursor-pointer"
          >
            <option value="date">접수일 최신순</option>
            <option value="confidence">신뢰도 높은순</option>
            <option value="status">상태별</option>
          </select>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-[14px]" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Left: List */}
        <div className="flex-1 flex flex-col bg-card rounded-card border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-0 px-4 pt-3 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  'px-3 pb-[10px] text-[12px] font-semibold tracking-[-0.1px] cursor-pointer transition-all border-b-2 flex items-center gap-[5px]',
                  activeTab === tab.key
                    ? 'text-primary border-primary'
                    : 'text-secondary border-transparent hover:text-txt',
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={clsx(
                      'text-[10px] font-bold px-[5px] py-[1px] rounded-full',
                      activeTab === tab.key
                        ? 'bg-primary text-white'
                        : 'bg-border-light text-secondary',
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[90px_1fr_80px_80px_120px_90px] bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border">
            <div>청구번호</div>
            <div>단지 · 내용</div>
            <div>접수일</div>
            <div>신뢰도</div>
            <div>상태</div>
            <div>액션</div>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full text-secondary text-[13px]">
                검색 결과가 없습니다
              </div>
            ) : (
              filtered.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={clsx(
                    'grid grid-cols-[90px_1fr_80px_80px_120px_90px] py-[11px] px-4 border-b border-border cursor-pointer items-center transition-colors hover:bg-[#F8F9FF] border-l-[3px]',
                    claim.highlighted
                      ? 'bg-amber-light border-l-red'
                      : borderColorMap[claim.type] ?? 'border-l-transparent',
                    claim.dimmed && 'opacity-75',
                    selectedClaim?.id === claim.id && 'bg-[#F8F9FF]',
                  )}
                >
                  <div className="text-[13px] font-semibold">{claim.id}</div>
                  <div>
                    <div className="text-[13px] font-semibold">{claim.complex}</div>
                    <div className="text-[11px] text-secondary">{claim.description}</div>
                  </div>
                  <div className="text-[13px]">{claim.date.slice(5)}</div>
                  <div className="text-[13px] font-semibold">
                    {(claim.confidence * 100).toFixed(1)}%
                  </div>
                  <div>
                    <StatusPill variant={statusVariantMap[claim.status] ?? 'done'}>
                      {claim.statusLabel}
                    </StatusPill>
                  </div>
                  <div>
                    <Button
                      variant={claim.actionVariant ?? 'primary'}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (claim.actionRoute) navigate(claim.actionRoute);
                      }}
                    >
                      {claim.actionLabel ?? '상세'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          <div className="bg-border-light px-4 py-[10px] text-[11px] text-secondary flex items-center gap-4 border-t border-border">
            <span>전체 {claimTabCounts.all}건 표시 중</span>
            <span>TYPE A: {claimTabCounts.a}</span>
            <span>TYPE B: {claimTabCounts.b}</span>
            <span>TYPE C: {claimTabCounts.c}</span>
          </div>
        </div>

        {/* Right: Preview Panel */}
        <div className="w-preview bg-card rounded-card border border-border flex flex-col overflow-hidden shrink-0">
          {preview ? (
            <div className="p-[16px_18px] flex-1 overflow-y-auto">
              <Badge variant={preview.badgeVariant} className="mb-2">
                {preview.badge}
              </Badge>
              <h3 className="text-[14px] font-bold mb-1">{preview.title}</h3>
              <p className="text-[11px] text-secondary mb-4">{preview.claimId}</p>
              <div className="mb-4">
                {preview.kvRows.map((kv, idx) => (
                  <KVRow
                    key={idx}
                    label={kv.label}
                    value={kv.value}
                    valueColor={kv.valueColor}
                    isLast={idx === preview.kvRows.length - 1}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {preview.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant={action.variant}
                    onClick={() => action.route && navigate(action.route)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-secondary gap-3">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#94A3B8" strokeWidth="1.5" />
              </svg>
              <span className="text-[12px]">청구 건을 선택하세요</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
