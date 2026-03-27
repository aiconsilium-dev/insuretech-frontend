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

const tabs: { key: TabKey; label: string; count?: number; countStyle?: string }[] = [
  { key: 'all', label: '전체', count: claimTabCounts.all, countStyle: 'bg-border-light text-secondary' },
  { key: 'a', label: 'TYPE A', count: claimTabCounts.a, countStyle: 'bg-amber-light text-amber' },
  { key: 'b', label: 'TYPE B', count: claimTabCounts.b, countStyle: 'bg-red-light text-red' },
  { key: 'c', label: 'TYPE C', count: claimTabCounts.c, countStyle: 'bg-green-light text-green' },
  { key: 'wait', label: '승인 대기', count: claimTabCounts.wait, countStyle: 'bg-red-light text-red' },
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

    if (activeTab === 'a') result = result.filter((c) => c.type === 'A');
    else if (activeTab === 'b') result = result.filter((c) => c.type === 'B');
    else if (activeTab === 'c') result = result.filter((c) => c.type === 'C');
    else if (activeTab === 'wait') result = result.filter((c) => c.status === 'wait');
    else if (activeTab === 'done') result = result.filter((c) => c.dimmed);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.complex.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    if (sortKey === 'date') result.sort((a, b) => b.date.localeCompare(a.date));
    else if (sortKey === 'confidence') result.sort((a, b) => b.confidence - a.confidence);
    else if (sortKey === 'status') result.sort((a, b) => a.statusLabel.localeCompare(b.statusLabel));

    return result;
  }, [activeTab, searchQuery, sortKey]);

  const preview = selectedClaim ? getPreviewData(selectedClaim) : null;

  const closePreview = () => setSelectedClaim(null);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-[14px] gap-3">
        <div>
          <div className="text-[18px] font-bold tracking-[-0.4px] mb-[2px]">청구 목록</div>
          <div className="text-[13px] text-secondary">
            이번 달 247건 · 승인 대기 <span className="text-red font-bold">3건</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute left-[10px] top-1/2 -translate-y-1/2 text-secondary">
              <circle cx="11" cy="11" r="7" stroke="#94A3B8" strokeWidth="1.8" />
              <path d="M20 20l-3-3" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="단지명·청구번호·내용 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-[7px] px-3 pl-8 border border-border rounded-btn text-[13px] font-sans w-[220px] outline-none bg-card text-txt transition-colors focus:border-primary"
            />
          </div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="py-[7px] px-[10px] border border-border rounded-btn text-[12px] font-sans bg-card text-txt outline-none cursor-pointer"
          >
            <option value="date">접수일 최신순</option>
            <option value="confidence">신뢰도 높은순</option>
            <option value="status">상태별</option>
          </select>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-[14px] h-[calc(100vh-160px)]">
        {/* Left: List */}
        <div className="flex-1 min-w-0 flex flex-col bg-card rounded-card border border-border overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-between px-4 border-b border-border shrink-0">
            <div className="flex gap-0" style={{ borderBottom: 'none' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={clsx(
                    'py-[9px] px-[14px] text-[12px] font-semibold cursor-pointer transition-all border-b-2 -mb-px whitespace-nowrap tracking-[-0.1px] bg-transparent border-none',
                    activeTab === tab.key
                      ? 'text-primary border-b-primary'
                      : 'text-secondary border-b-transparent',
                  )}
                  style={{
                    borderBottom: `2px solid ${activeTab === tab.key ? '#4F46E5' : 'transparent'}`,
                    marginBottom: '-1px',
                  }}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={clsx(
                        'text-[10px] py-[1px] px-[6px] rounded-[10px] ml-[3px]',
                        tab.countStyle,
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[90px_1fr_80px_80px_120px_90px] px-4 py-2 bg-border-light text-[10px] font-bold text-secondary uppercase tracking-[0.4px] shrink-0 border-b border-border">
            <span>청구번호</span>
            <span>단지·내용</span>
            <span>접수일</span>
            <span>신뢰도</span>
            <span>상태</span>
            <span className="text-right">액션</span>
          </div>

          {/* Rows */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-secondary py-12">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-[10px] opacity-30">
                  <circle cx="11" cy="11" r="7" stroke="#64748B" strokeWidth="1.5" />
                  <path d="M20 20l-3-3" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                검색 결과가 없습니다
              </div>
            ) : (
              filtered.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className={clsx(
                    'grid grid-cols-[1fr_90px] md:grid-cols-[90px_1fr_80px_80px_120px_90px] py-[11px] px-4 border-b border-border cursor-pointer items-center transition-colors hover:bg-[#F8F9FF] border-l-[3px]',
                    claim.highlighted
                      ? 'bg-amber-light border-l-red'
                      : claim.dimmed
                        ? 'border-l-border'
                        : borderColorMap[claim.type] ?? 'border-l-transparent',
                    claim.dimmed && 'opacity-75',
                    selectedClaim?.id === claim.id && !claim.highlighted && 'bg-primary-light',
                  )}
                >
                  <div className="hidden md:block text-[11px] text-secondary">{claim.id}</div>
                  <div>
                    <div className="text-[13px] font-semibold">{claim.complex}</div>
                    <div className="text-[11px] text-secondary">{claim.description}</div>
                    <div className="md:hidden text-[11px] text-secondary mt-[2px]">{claim.id} · {claim.date.slice(5).replace('-', '/')}</div>
                  </div>
                  <div className="hidden md:block text-[12px] text-secondary">{claim.date.slice(5).replace('-', '/')}</div>
                  <div className={clsx(
                    'hidden md:block text-[13px] font-bold',
                    claim.confidence >= 0.9 ? 'text-green' : 'text-amber',
                  )}>
                    {(claim.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="hidden md:block">
                    <StatusPill variant={statusVariantMap[claim.status] ?? 'done'}>
                      {claim.statusLabel}
                    </StatusPill>
                  </div>
                  <div className="text-right">
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
          <div className="px-4 py-[9px] bg-border-light border-t border-border flex justify-between items-center shrink-0 text-[11px] text-secondary">
            <span>전체 247건 표시 중</span>
            <div className="flex gap-4">
              <span>TYPE A <strong className="text-amber">38건</strong></span>
              <span>TYPE B <strong className="text-red">61건</strong></span>
              <span>TYPE C <strong className="text-green">148건</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Preview Panel (hidden on tablet/mobile) */}
        <div className="hidden xl:flex w-[300px] shrink-0 bg-card rounded-card border border-border overflow-hidden flex-col transition-all">
          {preview ? (
            <>
              {/* Preview Header */}
              <div className="py-[14px] px-[16px] border-b border-border flex justify-between items-start">
                <div>
                  <div className="mb-[5px]">
                    <Badge variant={preview.badgeVariant}>{preview.badge}</Badge>
                  </div>
                  <div className="text-[14px] font-bold tracking-[-0.3px] leading-[1.4]">{preview.title}</div>
                  <div className="text-[11px] text-secondary mt-[2px]">{preview.claimId}</div>
                </div>
                <button
                  onClick={closePreview}
                  className="border-none bg-bg rounded-[5px] w-6 h-6 cursor-pointer flex items-center justify-center text-secondary shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {/* Preview Body */}
              <div className="py-[12px] px-[16px] flex-1 overflow-y-auto">
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
              {/* Preview Actions */}
              <div className="py-[12px] px-[16px] border-t border-border flex gap-[7px]">
                {preview.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant={action.variant}
                    fullWidth
                    onClick={() => action.route && navigate(action.route)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-[32px] px-[20px] text-center text-secondary">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="opacity-25 mb-3">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#64748B" strokeWidth="1.5" />
              </svg>
              <div className="text-[13px] font-semibold mb-1">청구 건을 선택하세요</div>
              <div className="text-[12px] leading-[1.6]">행을 클릭하면<br />요약 정보가 여기 표시됩니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
