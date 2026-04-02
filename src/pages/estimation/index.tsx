import { useState } from 'react';
import clsx from 'clsx';
import { estimationItems } from '@/data/mockData';
import { DataTable, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { EstimationItem } from '@/types/estimation';

export default function EstimationPage() {
  const [selected, setSelected] = useState<EstimationItem | null>(null);

  const columns: Column<EstimationItem>[] = [
    {
      key: 'claimId',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold text-primary">{row.claimId}</span>,
    },
    { key: 'complex', label: '단지', width: '120px' },
    { key: 'dongHo', label: '동/호', width: '110px' },
    { key: 'accidentType', label: '사고유형', width: '100px' },
    {
      key: 'aiTotal',
      label: 'AI 산출액',
      width: '120px',
      align: 'right',
      render: (row) => <span className="font-medium">{row.aiTotal.toLocaleString()}원</span>,
    },
    {
      key: 'adjustedTotal',
      label: '보정액',
      width: '120px',
      align: 'right',
      render: (row) =>
        row.adjustedTotal && row.adjustedTotal !== row.aiTotal ? (
          <span className="font-semibold text-amber">{row.adjustedTotal.toLocaleString()}원</span>
        ) : (
          <span className="text-muted text-[11px]">—</span>
        ),
    },
    {
      key: 'insuranceAmount',
      label: '보험금',
      width: '120px',
      align: 'right',
      render: (row) =>
        row.insuranceAmount ? (
          <span className="font-bold" style={{ color: '#00854A' }}>{row.insuranceAmount.toLocaleString()}원</span>
        ) : (
          <span className="text-muted">미산정</span>
        ),
    },
    {
      key: 'confirmed',
      label: '확정',
      width: '70px',
      align: 'center',
      render: (row) =>
        row.confirmed ? (
          <span className="text-[11px] font-semibold text-green">✓ 확정</span>
        ) : (
          <span className="text-[11px] text-amber font-semibold">미확정</span>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">적산·산정</h1>
        <p className="text-[13px] text-secondary mt-1">AI 적산 결과를 확인하고, 손해사정사가 보정하여 최종 확정합니다</p>
      </div>

      <div className="bg-card rounded-card border border-border p-[18px]">
        <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-3">보험금 계산 공식</div>
        <div className="flex items-center gap-3 text-[13px]">
          <div className="bg-primary-light text-primary font-mono px-3 py-2 rounded-block text-[12px]">
            손해액 = Σ(공종 × 수량 × 단가)
          </div>
          <span className="text-secondary">→</span>
          <div className="bg-green-light text-green font-mono px-3 py-2 rounded-block text-[12px]">
            보험금 = 손해액 − 자기부담금
          </div>
        </div>
        <div className="text-[11px] text-muted mt-2">* 단가 기준: 표준품셈, 물가정보지 (한국물가정보)</div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-primary">{estimationItems.length}</div>
          <div className="text-[11px] text-secondary mt-1">전체 적산</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-green">{estimationItems.filter((e) => e.confirmed).length}</div>
          <div className="text-[11px] text-secondary mt-1">확정 완료</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-amber">{estimationItems.filter((e) => !e.confirmed).length}</div>
          <div className="text-[11px] text-secondary mt-1">미확정</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-txt">{estimationItems.filter((e) => e.adjustedTotal && e.adjustedTotal !== e.aiTotal).length}</div>
          <div className="text-[11px] text-secondary mt-1">보정 건수</div>
        </div>
      </div>

      <DataTable title="AI 적산 결과" columns={columns} data={estimationItems} onRowClick={(row) => setSelected(row)} />

      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[500px] bg-card border-l border-border z-50 overflow-y-auto shadow-lg">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold">{selected.claimId} — 적산 상세</h2>
                <button onClick={() => setSelected(null)} className="text-secondary hover:text-txt text-[18px] cursor-pointer">✕</button>
              </div>
              <DetailCard title="공종별 단가·수량·금액">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-secondary font-semibold">공종</th>
                      <th className="text-center py-2 text-secondary font-semibold">기준</th>
                      <th className="text-right py-2 text-secondary font-semibold">수량</th>
                      <th className="text-right py-2 text-secondary font-semibold">단가</th>
                      <th className="text-right py-2 text-secondary font-semibold">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2"><div className="font-medium">{item.name}</div><div className="text-[10px] text-muted">{item.description}</div></td>
                        <td className="text-center py-2">
                          <span className="text-[10px] font-semibold px-[6px] py-[1px] rounded-badge bg-primary-light text-primary">{item.standardLabel}</span>
                        </td>
                        <td className="text-right py-2">{item.quantity} {item.unit}</td>
                        <td className="text-right py-2">{item.unitPrice.toLocaleString()}</td>
                        <td className="text-right py-2 font-medium">{item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border">
                      <td colSpan={4} className="py-2 font-bold text-right">합계</td>
                      <td className="py-2 text-right font-bold">{selected.items.reduce((s, i) => s + i.subtotal, 0).toLocaleString()}원</td>
                    </tr>
                  </tfoot>
                </table>
              </DetailCard>
              <DetailCard title="보험금 산정">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="text-secondary">AI 산출 손해액</span><span>{selected.aiTotal.toLocaleString()}원</span></div>
                  {selected.adjustedTotal && (
                    <div className="flex justify-between">
                      <span className="text-secondary">{selected.adjustedTotal !== selected.aiTotal ? '보정 후 손해액' : '손해액 (보정 없음)'}</span>
                      <span className={clsx('font-semibold', selected.adjustedTotal !== selected.aiTotal && 'text-amber')}>{selected.adjustedTotal.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between"><span className="text-secondary">자기부담금</span><span className="text-red font-medium">-{selected.deductible.toLocaleString()}원</span></div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-bold">최종 보험금</span>
                    <span className="font-bold text-[15px]" style={{ color: '#00854A' }}>
                      {selected.insuranceAmount ? `${selected.insuranceAmount.toLocaleString()}원` : '미산정'}
                    </span>
                  </div>
                </div>
              </DetailCard>
              <div className="flex gap-2">
                {!selected.confirmed && (
                  <>
                    <Button variant="primary" size="sm">금액 보정</Button>
                    <Button variant="green" size="sm">최종 확정</Button>
                  </>
                )}
                <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>닫기</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
