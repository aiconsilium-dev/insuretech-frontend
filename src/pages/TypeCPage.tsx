import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  PhotoPlaceholder,
  ReasonBlock,
  KVRow,
  Button,
  Toast,
} from '@/components/common';
import { typeCDetail } from '@/lib/data';

export default function TypeCPage() {
  const navigate = useNavigate();
  const d = typeCDetail;
  const est = d.estimationResult;
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-[6px]">
            <Badge variant="bc">{d.badge}</Badge>
          </div>
          <p className="text-[11px] text-secondary mb-1">{d.claimId}</p>
          <h1 className="text-[18px] font-bold tracking-[-0.4px]">{d.title}</h1>
          <p className="text-[11px] text-secondary mt-1">{d.meta}</p>
        </div>
        <div>
          <span className="text-[12px] font-semibold text-green bg-green-light px-3 py-[4px] rounded-badge">
            신뢰도 {d.confidence}%
          </span>
        </div>
      </div>

      {/* 2-column detail */}
      <div className="grid grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Photos */}
          <DetailCard title="첨부 사진 — 세그멘테이션">
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

          {/* AI Classification */}
          <DetailCard title="AI 분류 근거">
            <ReasonBlock items={d.reasons} dotColor="green" />
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Estimation Result */}
          <DetailCard title="AI 적산 결과 요약">
            {/* Big amount */}
            <div className="text-center py-4">
              <div className="text-[36px] font-bold tracking-[-1px]">
                {est.totalAmount.toLocaleString()}원
              </div>
              <div className="text-[12px] text-secondary mt-1">
                AI 적산 · 산출 시간 {est.calculationTime}
              </div>
            </div>

            {/* Savings banner */}
            <div className="bg-amber-light rounded-block p-[10px_14px] text-center mb-4">
              <span className="text-[13px] font-bold text-amber">
                업체 견적 대비 -{est.savingsPercent}% 절감
              </span>
              <span className="text-[11px] text-secondary ml-2">
                ({est.vendorEstimate.toLocaleString()}원 → {est.totalAmount.toLocaleString()}원, 절감{' '}
                {est.savingsAmount.toLocaleString()}원)
              </span>
            </div>

            {/* Breakdown */}
            {est.breakdown.map((kv, idx) => (
              <KVRow
                key={idx}
                label={kv.label}
                value={kv.value}
                valueColor={kv.valueColor}
                isLast={idx === est.breakdown.length - 1}
              />
            ))}

            {/* Final total */}
            <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-border">
              <span className="text-[13px] font-bold">최종 보험 지급액</span>
              <span className="text-[16px] font-bold text-green">
                {est.finalAmount.toLocaleString()}원
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="green"
                onClick={() => {
                  setToastVisible(true);
                  navigate('/approve');
                }}
              >
                승인 및 지급
              </Button>
              <Button variant="secondary" onClick={() => navigate('/estimation')}>
                수량 내역서
              </Button>
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast
        message="승인 페이지로 이동합니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
