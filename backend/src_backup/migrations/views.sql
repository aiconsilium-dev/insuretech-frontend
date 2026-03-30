-- SQL Views for insuretech backend
-- Run these after the TypeORM schema sync or migration

CREATE VIEW v_monthly_kpi AS
SELECT
  to_char(claimed_at, 'YYYY-MM') AS year_month,
  COUNT(*)::int AS total_claims,
  COUNT(*) FILTER (WHERE type = 'A')::int AS type_a,
  COUNT(*) FILTER (WHERE type = 'B')::int AS type_b,
  COUNT(*) FILTER (WHERE type = 'C')::int AS type_c,
  COUNT(*) FILTER (WHERE status = 'wait')::int AS pending_approval
FROM claims
GROUP BY 1;

CREATE VIEW v_claim_detail AS
SELECT c.*, cx.name AS complex_name, cx.builder, cx.built_at,
  p.policy_type, p.deductible, u.name AS assignee_name,
  e.total_amount AS est_total, e.final_amount AS est_final, e.vendor_estimate
FROM claims c
LEFT JOIN complexes cx ON cx.id = c.complex_id
LEFT JOIN policies p ON p.id = c.policy_id
LEFT JOIN users u ON u.id = c.assignee_id
LEFT JOIN estimations e ON e.claim_id = c.id;
