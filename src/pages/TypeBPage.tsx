import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  StatusFlow,
  ReasonBlock,
  CaseItem,
  Button,
} from '@/components/common';
import { typeBDetail } from '@/lib/data';

export default function TypeBPage() {
  const navigate = useNavigate();
  const d = typeBDetail;
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-[6px]">
            <Badge variant="bb">{d.badge}</Badge>
          </div>
          <p className="text-[11px] text-secondary mb-1">{d.claimId}</p>
          <h1 className="text-[18px] font-bold tracking-[-0.4px]">{d.title}</h1>
          <p className="text-[11px] text-secondary mt-1">{d.meta}</p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-secondary">
          <button
            onClick={() => navigate(-1)}
            className="px-2 py-1 border border-border rounded-btn cursor-pointer hover:bg-border-light transition-colors"
          >
            ← 이전 건
          </button>
          <span className="font-semibold text-txt">
            {d.navCounter.current} / {d.navCounter.total}
          </span>
          <button className="px-2 py-1 border border-border rounded-btn cursor-pointer hover:bg-border-light transition-colors">
            다음 건 →
          </button>
        </div>
      </div>

      {/* Status Flow Card */}
      <DetailCard title="면책 처리 진행 상태" className="mb-[14px]">
        <StatusFlow
          items={d.statusFlowItems}
          activeIndex={activeFlowIndex}
          onChange={setActiveFlowIndex}
        />
        <p className="text-[12px] text-secondary leading-[1.6] mt-2">
          {d.statusFlowDescriptions[activeFlowIndex]}
        </p>
      </DetailCard>

      {/* 2-column detail */}
      <div className="grid grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Classification */}
          <DetailCard title="AI 분류 근거">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="bb">TYPE B — 면책</Badge>
              <span className="text-[10px] font-semibold text-green bg-green-light px-2 py-[2px] rounded-badge">
                신뢰도 {d.aiConfidence}%
              </span>
            </div>
            <ReasonBlock items={d.reasons} dotColor="red" />

            {/* Clause */}
            <div className="mt-3 bg-red-light rounded-block p-[10px_12px] text-[12px] text-red font-medium">
              {d.clauseText}
            </div>

            {/* Cases */}
            <div className="mt-3">
              {d.cases.map((c, idx) => (
                <CaseItem
                  key={idx}
                  caseNumber={c.caseNumber}
                  description={c.description}
                  numberColor={c.numberColor}
                />
              ))}
            </div>
          </DetailCard>

          {/* Legal Opinion */}
          <DetailCard title="법률 의견서 상태">
            <div className="bg-primary-light rounded-block p-[12px_14px] mb-3">
              <div className="text-[13px] font-bold text-primary mb-1">
                {d.opinionSummary.title}
              </div>
              <div className="text-[12px] text-secondary leading-[1.6]">
                {d.opinionSummary.content}
              </div>
              <div className="text-[10px] text-secondary mt-2">{d.opinionSummary.footer}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">PDF 다운로드</Button>
              <Button variant="secondary" onClick={() => navigate('/opinion')}>
                의견서 관리
              </Button>
            </div>
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Objection Management */}
          <DetailCard title="이의신청 관리">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-secondary">이의신청 잔여 기간</span>
              <span className="text-[14px] font-bold text-amber">
                {d.objectionRemainingDays}일 남음
              </span>
            </div>
            <div className="bg-border-light rounded-block p-[20px] flex flex-col items-center justify-center text-secondary gap-2 mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#94A3B8" strokeWidth="1.5" />
              </svg>
              <span className="text-[11px]">접수된 이의신청이 없습니다</span>
            </div>
            <div className="bg-amber-light rounded-block p-[10px_12px] text-[11px] text-amber font-medium">
              이의신청 기한 경과 시 자동으로 최종 종결 처리됩니다
            </div>
          </DetailCard>

          {/* Civil Complaint Response Documents */}
          <DetailCard title="금감원 민원 대응 자료">
            {d.civilDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-border-light rounded-block p-[10px_12px] mb-2 last:mb-0"
              >
                <span className="text-[12px] font-medium">{doc}</span>
                <Button variant="secondary" size="sm">
                  다운로드
                </Button>
              </div>
            ))}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
