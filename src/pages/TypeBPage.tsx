import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  StatusFlow,
  ReasonBlock,
  CaseItem,
  Button,
  Toast,
} from '@/components/common';
import { typeBDetail } from '@/lib/data';

export default function TypeBPage() {
  const navigate = useNavigate();
  const d = typeBDetail;
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="bb" className="text-[11px] py-[3px] px-[10px]">{d.badge}</Badge>
            <span className="text-[11px] text-secondary">{d.claimId}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{d.title}</h1>
          <p className="text-[13px] text-secondary">{d.meta}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setToastMsg('이전 TYPE B 건 — CLM-0242')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            이전 건
          </button>
          <span className="text-[12px] text-secondary px-1">
            {d.navCounter.current} / {d.navCounter.total}
          </span>
          <button
            onClick={() => setToastMsg('다음 TYPE B 건 — CLM-0240')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            다음 건
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Status Flow Card */}
      <div className="bg-card rounded-card border border-border mb-[14px]">
        <div className="py-[12px] px-[18px]">
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] mb-2">면책 처리 진행 상태</div>
          <StatusFlow
            items={d.statusFlowItems}
            activeIndex={activeFlowIndex}
            onChange={setActiveFlowIndex}
          />
          <div className="text-[12px] text-secondary bg-border-light rounded-[6px] py-[8px] px-[10px]">
            {d.statusFlowDescriptions[activeFlowIndex]}
          </div>
        </div>
      </div>

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Classification */}
          <DetailCard title="AI 분류 근거 — 신뢰도 95.8%">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="bb">TYPE B</Badge>
              <span className="bg-red-light text-red text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">신뢰도 95.8%</span>
            </div>
            <ReasonBlock items={d.reasons} dotColor="red" />

            {/* Clause */}
            <div className="mt-[10px] bg-red-light rounded-[6px] py-[10px] px-[12px]">
              <div className="text-[11px] font-bold text-red mb-1">적용 약관 (자동 매칭)</div>
              <div className="text-[12px] text-red leading-[1.6] opacity-90">{d.clauseText}</div>
            </div>

            {/* Cases */}
            <div className="mt-2">
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
          <DetailCard title="법률 의견서 상태" bodyClassName="px-[18px] py-3">
            <div className="bg-primary-light border border-[#c7d2fe] rounded-block py-[10px] px-[13px] text-[12px] leading-[1.8] mb-[10px]">
              <div className="font-bold text-[13px] mb-[6px] text-primary">
                {d.opinionSummary.title}
              </div>
              {d.opinionSummary.content}<br />
              <span className="text-[11px] text-secondary">{d.opinionSummary.footer}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setToastMsg('법률 의견서 PDF 다운로드')}>PDF 다운로드</Button>
              <Button variant="secondary" onClick={() => navigate('/opinion')}>
                의견서 관리
              </Button>
            </div>
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Objection Management */}
          <DetailCard title="이의신청 관리" bodyClassName="px-[18px] py-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] text-secondary">접수된 이의신청 없음</span>
              <span className="text-[11px] text-secondary bg-border-light py-[3px] px-2 rounded-badge">잔여 기간 {d.objectionRemainingDays}일</span>
            </div>
            <div className="bg-border-light rounded-block p-6 text-center text-secondary mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="text-[12px]">이의신청 기한 내 접수 시<br />자동으로 재검토 단계로 이동합니다</div>
            </div>
            <div className="bg-amber-light rounded-[6px] py-[10px] px-[12px] text-[12px] text-amber">
              이의신청 수신 시 APT Insurance 법무팀에 자동 알림이 발송됩니다.
            </div>
          </DetailCard>

          {/* Civil Documents */}
          <DetailCard title="금감원 민원 대응 자료" bodyClassName="px-[18px] py-3">
            <div className="text-[12px] text-secondary leading-[1.6] mb-3">
              면책 통보 시 자동 생성된 민원 대응 자료입니다. 금감원 민원 접수 시 즉시 활용 가능합니다.
            </div>
            <div className="flex flex-col gap-[7px]">
              {d.civilDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-[8px] px-[10px] bg-border-light rounded-[6px] text-[12px]"
                >
                  <span className="font-semibold">{doc}</span>
                  <Button variant="secondary" size="sm" className="py-[3px] px-[9px] text-[11px]" onClick={() => setToastMsg(`${doc} 다운로드`)}>다운로드</Button>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast message={toastMsg} visible={!!toastMsg} onHide={() => setToastMsg('')} />
    </div>
  );
}
