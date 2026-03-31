import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface MonthlyKpiRow {
  year_month: string;
  total_claims: number;
  type_a: number;
  type_b: number;
  type_c: number;
  pending_approval: number;
}

export interface KpiData {
  totalClaims: number;
  typeA: number;
  typeB: number;
  typeC: number;
  pendingApproval: number;
  lossRateAb: number;
  lossRateC: number;
}

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getMonthlyKpi(): Promise<KpiData> {
    const rows = await this.dataSource.query<MonthlyKpiRow[]>(
      `SELECT * FROM v_monthly_kpi WHERE year_month = to_char(NOW(), 'YYYY-MM')`,
    );

    const row = rows[0];

    // TODO: lossRateAb / lossRateC should be calculated from real data
    //       (e.g. compare this month vs. last month) rather than hard-coded.
    return {
      totalClaims: row?.total_claims ?? 0,
      typeA: row?.type_a ?? 0,
      typeB: row?.type_b ?? 0,
      typeC: row?.type_c ?? 0,
      pendingApproval: row?.pending_approval ?? 0,
      lossRateAb: -16.8,
      lossRateC: -11.2,
    };
  }
}
