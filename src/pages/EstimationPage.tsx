import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Badge,
  CheckboxRow,
  Button,
  Toast,
} from '@/components/common';
import { estimationRows, estimationDeductions, typeCDetail } from '@/lib/data';

export default function EstimationPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(estimationRows);
  const [toastVisible, setToastVisible] = useState(false);

  const toggleRow = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );
  };

  const checkedSubtotal = rows.filter((r) => r.checked).reduce((sum, r) => sum + r.subtotal, 0);
  const indirect = Math.round(checkedSubtotal * estimationDeductions.indirectRate);
  const subtotalWithIndirect = checkedSubtotal + indirect;
  const depreciation = estimationDeductions.depreciation;
  const deductible = estimationDeductions.deductible;
  const finalAmount = subtotalWithIndirect - depreciation - deductible;

  const vendorEstimate = typeCDetail.estimationResult.vendorEstimate;
  const savingsPercent = (((vendorEstimate - finalAmount) / vendorEstimate) * 100).toFixed(1);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[18px] font-bold tracking-[-0.4px]">수량 내역서</h1>
        <p className="text-[12px] text-secondary mt-1">
          CLM-2026-0247 · 헬리오시티 102동 1204호 · AI 적산 결과
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-card border border-border overflow-hidden mb-[14px]">
        {/* Table Header */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border w-[40px] text-center">
                &nbsp;
              </th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left">
                공종명
              </th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left w-[100px]">
                수량 / 단위
              </th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left w-[100px]">
                단가 기준
              </th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-right w-[110px]">
                소계
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  'border-b border-border transition-colors',
                  !row.checked && 'opacity-60',
                )}
              >
                <td className="py-[11px] px-4 text-center">
                  <CheckboxRow checked={row.checked} onChange={() => toggleRow(row.id)} />
                </td>
                <td className="py-[11px] px-4">
                  <span className={clsx('text-[13px] font-semibold', !row.checked && 'line-through text-muted')}>
                    {row.name}
                  </span>
                  <div className={clsx('text-[11px] text-secondary', !row.checked && 'line-through text-muted')}>
                    {row.description}
                  </div>
                </td>
                <td className={clsx('py-[11px] px-4 text-[13px]', !row.checked && 'line-through text-muted')}>
                  {row.quantity} {row.unit}
                </td>
                <td className="py-[11px] px-4">
                  {row.standardLabel && (
                    <Badge variant={row.standardVariant === 'green' ? 'bc' : 'ba'}>
                      {row.standardLabel}
                    </Badge>
                  )}
                </td>
                <td className={clsx('py-[11px] px-4 text-[13px] font-semibold text-right', !row.checked && 'line-through text-muted')}>
                  {row.subtotal.toLocaleString()}원
                </td>
              </tr>
            ))}

            {/* Subtotal */}
            <tr className="bg-border-light">
              <td colSpan={4} className="py-[11px] px-4 text-[13px] font-bold text-right">
                소계 (간접비 {(estimationDeductions.indirectRate * 100).toFixed(1)}% 포함)
              </td>
              <td className="py-[11px] px-4 text-[13px] font-bold text-right">
                {subtotalWithIndirect.toLocaleString()}원
              </td>
            </tr>

            {/* Depreciation */}
            <tr>
              <td colSpan={4} className="py-[11px] px-4 text-[13px] font-medium text-right text-red">
                감가상각 (9.2%)
              </td>
              <td className="py-[11px] px-4 text-[13px] font-semibold text-right text-red">
                -{depreciation.toLocaleString()}원
              </td>
            </tr>

            {/* Deductible */}
            <tr className="border-b border-border">
              <td colSpan={4} className="py-[11px] px-4 text-[13px] font-medium text-right text-red">
                자기부담금
              </td>
              <td className="py-[11px] px-4 text-[13px] font-semibold text-right text-red">
                -{deductible.toLocaleString()}원
              </td>
            </tr>

            {/* Final */}
            <tr className="bg-primary-light">
              <td colSpan={4} className="py-3 px-4 text-[14px] font-bold text-right">
                최종 보험 지급액
              </td>
              <td className="py-3 px-4 text-[16px] font-bold text-right text-green">
                {finalAmount.toLocaleString()}원
              </td>
            </tr>
          </tbody>
        </table>

        {/* Savings Footer */}
        <div className="bg-amber-light px-4 py-[10px] text-center">
          <span className="text-[12px] font-bold text-amber">
            업체 견적 대비 -{savingsPercent}% 절감
          </span>
          <span className="text-[11px] text-secondary ml-2">
            ({vendorEstimate.toLocaleString()}원 → {finalAmount.toLocaleString()}원)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="green"
          onClick={() => {
            setToastVisible(true);
            setTimeout(() => navigate('/approve'), 1500);
          }}
        >
          승인 요청
        </Button>
        <Button variant="secondary" onClick={() => navigate('/type-c')}>
          적산 결과로 돌아가기
        </Button>
        <Button variant="secondary" onClick={() => navigate('/claims')}>
          청구 목록
        </Button>
      </div>

      <Toast
        message="승인 요청이 전송되었습니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
