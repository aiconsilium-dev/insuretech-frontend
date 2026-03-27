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
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="bc" className="text-[11px] py-[3px] px-[10px]">{d.badge}</Badge>
            <span className="text-[11px] text-secondary">{d.claimId}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{d.title}</h1>
          <p className="text-[13px] text-secondary">{d.meta}</p>
        </div>
        <span className="bg-green-light text-green text-[11px] font-semibold py-1 px-3 rounded-[5px]">
          신뢰도 {d.confidence}%
        </span>
      </div>

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Photos */}
          <DetailCard title="첨부 사진 — 세그멘테이션 결과" bodyClassName="p-3">
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
          <DetailCard title="AI 적산 결과 요약 — 산출 6분 41초">
            {/* Big amount */}
            <div className="text-center pt-[14px] pb-[10px]">
              <div className="text-[36px] font-bold text-txt tracking-[-1px]">
                {est.totalAmount.toLocaleString()}원
              </div>
              <div className="text-[12px] text-secondary mt-1">
                AI 산출 적정 보험금 (표준노임단가 기준)
              </div>
            </div>

            {/* Savings banner */}
            <div className="bg-amber-light rounded-[6px] py-[9px] px-[12px] text-[12px] text-amber flex justify-between mb-[14px] border border-amber-border">
              <span>업체 견적 {est.vendorEstimate.toLocaleString()}원 대비</span>
              <strong>-{est.savingsPercent}% ({est.savingsAmount.toLocaleString()}원 절감)</strong>
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
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-border" style={{ fontSize: '15px', fontWeight: 700 }}>
              <span>지급 보험금</span>
              <span className="text-green">{est.finalAmount.toLocaleString()}원</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-[14px]">
              <Button
                variant="green"
                onClick={() => {
                  setToastVisible(true);
                  navigate('/approve');
                }}
              >
                승인 및 지급 처리
              </Button>
              <Button variant="secondary" onClick={() => navigate('/estimation')}>
                수량 내역서 상세
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
