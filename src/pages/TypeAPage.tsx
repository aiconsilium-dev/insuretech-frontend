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
} from '@/components/common';
import { typeADetail } from '@/lib/data';

export default function TypeAPage() {
  const navigate = useNavigate();
  const d = typeADetail;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-[6px]">
            <Badge variant="ba">{d.badge}</Badge>
            <span className="text-[10px] font-semibold text-secondary bg-border-light px-2 py-[2px] rounded-badge">
              {d.subBadge}
            </span>
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

      {/* Warning Banner */}
      <div className="bg-amber-light border border-amber-border rounded-block p-[14px_16px] mb-[14px] flex gap-3 items-start">
        <svg className="w-5 h-5 text-amber shrink-0 mt-[1px]" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.6 14.86A2 2 0 003.41 21h17.18a2 2 0 001.72-2.98l-8.6-14.86a2 2 0 00-3.42-.3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <div className="text-[13px] font-bold text-amber mb-1">{d.warningBanner.title}</div>
          <div className="text-[12px] text-secondary leading-[1.6]">{d.warningBanner.content}</div>
        </div>
      </div>

      {/* Stage Tracker */}
      <StageTracker title={`단지 하자소송 진행 단계 — 마포래미안`} stages={d.stages} />

      {/* 2-column detail */}
      <div className="grid grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Evidence Photos */}
          <DetailCard title="증거 사진 (5장)">
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
          </DetailCard>

          {/* Defect Info */}
          <DetailCard title="하자담보책임 정보">
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
          {/* AI Classification Basis */}
          <DetailCard title="AI 하자 분류 근거">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="ba">TYPE A — 하자소송</Badge>
              <span className="text-[10px] font-semibold text-green bg-green-light px-2 py-[2px] rounded-badge">
                신뢰도 {d.aiConfidence}%
              </span>
              <span className="text-[10px] font-semibold text-red bg-red-light px-2 py-[2px] rounded-badge">
                보험 면책
              </span>
            </div>
            <ReasonBlock items={d.reasons} dotColor="amber" />
            <div className="mt-3">
              <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.4px] mb-2">
                인용 판례
              </div>
              {d.cases.map((c, idx) => (
                <CaseItem key={idx} caseNumber={c.caseNumber} description={c.description} />
              ))}
            </div>
          </DetailCard>

          {/* Litigation Status */}
          <DetailCard title="소송 진행 현황">
            <Timeline items={d.timeline} />
            <div className="flex gap-2 mt-4">
              <Button variant="primary">소송 제기</Button>
              <Button variant="secondary">증거 패키지</Button>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
