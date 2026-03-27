import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DetailCard,
  RadioOption,
  Timeline,
  Button,
  Modal,
  Toast,
} from '@/components/common';
import { typeCDetail, approveTimeline } from '@/lib/data';

export default function ApprovePage() {
  const navigate = useNavigate();
  const est = typeCDetail.estimationResult;
  const [selectedOption, setSelectedOption] = useState(0);
  const [comment, setComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const radioOptions = [
    'AI 산출액 그대로 승인 (607,850원)',
    '금액 수정 후 승인',
    '재분류 요청',
  ];

  const handleApprove = () => {
    setModalOpen(false);
    setToastVisible(true);
    setTimeout(() => navigate('/claims'), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[18px] font-bold tracking-[-0.4px]">손해사정사 최종 승인</h1>
        <p className="text-[12px] text-secondary mt-1">
          CLM-2026-0247 · 헬리오시티 102동 1204호 천장 급배수 누수
        </p>
      </div>

      {/* 2-column */}
      <div className="grid grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Result */}
          <DetailCard title="AI 산출 결과 최종 확인">
            <div className="text-center py-5">
              <div className="text-[38px] font-bold tracking-[-1px]">
                {est.totalAmount.toLocaleString()}원
              </div>
              <div className="text-[12px] text-secondary mt-1">
                AI 적산 결과 · 업체 견적 대비 -{est.savingsPercent}% 절감
              </div>
            </div>
          </DetailCard>

          {/* Options */}
          <DetailCard title="처리 옵션">
            {radioOptions.map((label, idx) => (
              <RadioOption
                key={idx}
                label={label}
                selected={selectedOption === idx}
                onChange={() => setSelectedOption(idx)}
              />
            ))}
            <div className="mt-3">
              <label className="text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] block mb-2">
                검토 의견 (선택)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="검토 의견을 입력하세요..."
                className="w-full h-[80px] text-[13px] p-3 border border-border rounded-input resize-none outline-none focus:border-primary transition-colors"
              />
            </div>
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Legal Opinion */}
          <DetailCard title="법률 의견서 첨부">
            <div className="bg-primary-light rounded-block p-[12px_14px]">
              <div className="flex items-center gap-2 mb-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 2v6h6"
                    stroke="#4F46E5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[12px] font-semibold text-primary">
                  손해사정 의견서.pdf
                </span>
              </div>
              <div className="text-[11px] text-secondary">
                2026-03-14 생성 · APT Insurance 법무팀 검토 완료
              </div>
            </div>
          </DetailCard>

          {/* Timeline */}
          <DetailCard title="처리 이력">
            <Timeline items={approveTimeline} />
          </DetailCard>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="green"
              fullWidth
              onClick={() => setModalOpen(true)}
            >
              최종 승인
            </Button>
            <Button variant="danger" onClick={() => navigate('/claims')}>
              반려
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        title="최종 승인 확인"
        description={`CLM-2026-0247 헬리오시티 건에 대해\n보험 지급액 ${est.totalAmount.toLocaleString()}원을\n최종 승인하시겠습니까?`}
        confirmLabel="승인"
        cancelLabel="취소"
        onConfirm={handleApprove}
        onCancel={() => setModalOpen(false)}
      />

      <Toast
        message="최종 승인이 완료되었습니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
