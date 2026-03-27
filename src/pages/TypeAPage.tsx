import { useNavigate } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  PhotoPlaceholder,
  KVRow,
  ReasonBlock,
  CaseItem,
  StageTracker,
  Timeline,
  Button,
  Toast,
} from '@/components/common';
import { typeADetail } from '@/lib/data';
import { useState } from 'react';

export default function TypeAPage() {
  const navigate = useNavigate();
  const d = typeADetail;
  const [toastMsg, setToastMsg] = useState('');

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="ba" className="text-[11px] py-[3px] px-[10px]">{d.badge}</Badge>
            <span className="bg-amber-light text-amber text-[10px] font-semibold px-2 py-[2px] rounded-badge">
              {d.subBadge}
            </span>
            <span className="text-[11px] text-secondary">{d.claimId}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{d.title}</h1>
          <p className="text-[13px] text-secondary">{d.meta}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setToastMsg('이전 TYPE A 건 — CLM-0243')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            이전 건
          </button>
          <span className="text-[12px] text-secondary px-1">
            {d.navCounter.current} / {d.navCounter.total}
          </span>
          <button
            onClick={() => setToastMsg('다음 TYPE A 건 — CLM-0238')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            다음 건
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-light border border-amber-border rounded-card py-[14px] px-[18px] mb-[14px] flex gap-[14px] items-start">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[1px]">
          <circle cx="12" cy="12" r="9" stroke="#D97706" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div>
          <div className="text-[13px] font-bold text-amber mb-1">{d.warningBanner.title}</div>
          <div className="text-[12px] text-txt leading-[1.7]">
            화재보험 보통약관 면책 조항: <strong>"설계·재료·공사상의 결함으로 생긴 손해는 보상하지 않습니다."</strong><br />
            본 건은 <strong>공동주택관리법 제37조</strong>에 따라 시공사에 하자담보책임을 청구합니다. AI가 수집한 사진·측정값은 소송 증거자료로 APT Insurance 소송팀에 전달됩니다.
          </div>
        </div>
      </div>

      {/* Stage Tracker */}
      <StageTracker title="단지 하자소송 진행 단계 — 마포래미안" stages={d.stages} />

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Evidence Photos */}
          <DetailCard title="증거 사진 (5장 / AI Annotated)" bodyClassName="p-3">
            <div className="grid grid-cols-2 gap-2">
              {d.photos.map((photo, idx) => (
                <PhotoPlaceholder
                  key={idx}
                  label={photo.label}
                  span={photo.span}
                  bgColor={photo.bg}
                  borderStyle={photo.borderStyle}
                  badges={photo.badges}
                />
              ))}
            </div>
            <div className="mt-2 text-[11px] text-secondary">
              사진 5장 · AI 측정값 · 위치 메타데이터 포함 / 소송 증거 패키지 자동 생성
            </div>
          </DetailCard>

          {/* Defect Info */}
          <DetailCard title="하자담보책임 정보 (공동주택관리법 제36조)" bodyClassName="px-[18px] py-3">
            {d.defectInfo.map((kv, idx) => (
              <KVRow
                key={idx}
                label={kv.label}
                value={kv.value}
                valueColor={kv.valueColor}
                valueFontSize={kv.valueFontSize}
                isLast={idx === d.defectInfo.length - 1}
              />
            ))}
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Classification */}
          <DetailCard title="AI 하자 분류 근거 — 신뢰도 91.2%">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="ba">시공상 하자</Badge>
              <span className="bg-primary-light text-primary text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">신뢰도 91.2%</span>
              <span className="bg-amber-light text-amber text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">보험 면책</span>
            </div>
            <ReasonBlock items={d.reasons} dotColor="amber" />
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.3px] mb-[7px]">
                인용 판례
              </div>
              {d.cases.map((c, idx) => (
                <CaseItem key={idx} caseNumber={c.caseNumber} description={c.description} />
              ))}
            </div>
          </DetailCard>

          {/* Litigation Status */}
          <DetailCard title="소송 진행 현황 및 액션" bodyClassName="px-[18px] py-3">
            <Timeline items={d.timeline} />
            <div className="flex gap-2 mt-[14px]">
              <Button variant="primary" onClick={() => setToastMsg('소송 제기 확인 — CLM-0246')}>소송 제기 요청</Button>
              <Button variant="secondary" onClick={() => setToastMsg('증거 자료 ZIP 패키지 다운로드 시작')}>증거 패키지 다운로드</Button>
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast message={toastMsg} visible={!!toastMsg} onHide={() => setToastMsg('')} />
    </div>
  );
}
