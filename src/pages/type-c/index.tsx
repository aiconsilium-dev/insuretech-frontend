import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claims, estimationItems } from '@/data/mockData';
import { DataTable, StatusPill, Button, DetailCard } from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/types/claims';

const typeCClaims = claims.filter((c) => c.type === 'C');

export default function TypeCPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Claim | null>(null);

  const getEstimation = (claimId: string) =>
    estimationItems.find((e) => e.claimId === claimId);

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '접수번호',
      width: '100px',
      render: (row) => <span className="font-semibold" style={{ color: '#00854A' }}>{row.id}</span>,
    },
    {
      key: 'complex',
      label: '단지 / 동호',
      render: (row) => `${row.complex} ${row.dong}동 ${row.ho}호`,
    },
    { key: 'accidentType', label: '사고유형', width: '100px' },
    {
      key: 'aiAmount',
      label: 'AI 산출액',
      width: '120px',
      align: 'right',
      render: (row) =>
        row.aiAmount ? (
          <span className="font-medium">{row.aiAmount.toLocaleString()}원</span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'corrected',
      label: '보정',
      width: '70px',
      align: 'center',
      render: (row) =>
        row.corrected ? (
          <span className="text-[11px] font-semibold text-amber">보정됨</span>
        ) : (
          <span className="text-muted text-[11px]">—</span>
        ),
    },
    {
      key: 'finalAmount',
      label: '최종 산정액',
      width: '120px',
      align: 'right',
      render: (row) =>
        row.finalAmount ? (
          <span className="font-bold" style={{ color: '#00854A' }}>
            {row.finalAmount.toLocaleString()}원
          </span>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'status',
      label: '상태',
      width: '90px',
      render: (row) => {
        const variant =
          row.status === '지급완료' || row.status === '승인완료' || row.status === '산정완료'
            ? 'done'
            : 'wait';
        return <StatusPill variant={variant}>{row.status}</StatusPill>;
      },
    },
    {
      key: 'date',
      label: '접수일',
      width: '90px',
      render: (row) => row.date.slice(5).replace('-', '.'),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[20px] font-bold tracking-[-0.3px]">
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#00854A' }} />
          TYPE C — 보험금 산출 관리
        </h1>
        <p className="text-[13px] text-secondary mt-1">AI 적산 결과를 확인하고 보험금을 산출합니다</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold" style={{ color: '#00854A' }}>{typeCClaims.length}건</div>
          <div className="text-[11px] text-secondary mt-1">TYPE C 총 건수</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-amber">{typeCClaims.filter((c) => c.corrected).length}건</div>
          <div className="text-[11px] text-secondary mt-1">보정 완료</div>
        </div>
        <div className="bg-card rounded-card border border-border p-4 text-center">
          <div className="text-[22px] font-bold text-primary">{typeCClaims.filter((c) => c.status === '승인대기').length}건</div>
          <div className="text-[11px] text-secondary mt-1">승인 대기</div>
        </div>
      </div>

      <DataTable
        title={`TYPE C 접수건 (${typeCClaims.length}건)`}
        columns={columns}
        data={typeCClaims}
        onRowClick={(row) => setSelected(row)}
      />

      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-card border-l border-border z-50 overflow-y-auto shadow-lg">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold">{selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-secondary hover:text-txt text-[18px] cursor-pointer">✕</button>
              </div>

              {(() => {
                const est = getEstimation(selected.id);
                if (!est) return <div className="text-[13px] text-secondary py-4 text-center">적산 데이터가 없습니다</div>;
                return (
                  <>
                    <DetailCard title="공종별 적산 상세">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 text-secondary font-semibold">공종</th>
                            <th className="text-right py-2 text-secondary font-semibold">수량</th>
                            <th className="text-right py-2 text-secondary font-semibold">단가</th>
                            <th className="text-right py-2 text-secondary font-semibold">금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          {est.items.map((item, i) => (
                            <tr key={i} className="border-b border-border last:border-0">
                              <td className="py-2"><div className="font-medium">{item.name}</div><div className="text-[10px] text-muted">{item.description}</div></td>
                              <td className="text-right py-2">{item.quantity}{item.unit}</td>
                              <td className="text-right py-2">{item.unitPrice.toLocaleString()}</td>
                              <td className="text-right py-2 font-medium">{item.subtotal.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </DetailCard>
                    <DetailCard title="보험금 계산">
                      <div className="space-y-2 text-[13px]">
                        <div className="flex justify-between"><span className="text-secondary">AI 산출 손해액</span><span className="font-medium">{est.aiTotal.toLocaleString()}원</span></div>
                        {est.adjustedTotal && est.adjustedTotal !== est.aiTotal && (
                          <div className="flex justify-between"><span className="text-secondary">보정 후 손해액</span><span className="font-semibold text-amber">{est.adjustedTotal.toLocaleString()}원</span></div>
                        )}
                        <div className="flex justify-between"><span className="text-secondary">자기부담금</span><span className="font-medium text-red">-{est.deductible.toLocaleString()}원</span></div>
                        <div className="border-t border-border pt-2 flex justify-between">
                          <span className="font-bold">보험금</span>
                          <span className="font-bold text-[15px]" style={{ color: '#00854A' }}>
                            {est.insuranceAmount ? `${est.insuranceAmount.toLocaleString()}원` : '미산정'}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted mt-1">보험금 = 손해액 - 자기부담금</div>
                      </div>
                    </DetailCard>
                  </>
                );
              })()}

              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm" onClick={() => navigate('/estimation')}>AI 적산 확인</Button>
                <Button variant="secondary" size="sm">금액 보정</Button>
                <Button variant="green" size="sm" onClick={() => navigate('/approve')}>승인 요청</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
