export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  dashboard: {
    all: () => ['dashboard'] as const,
    kpi: () => ['dashboard', 'kpi'] as const,
  },
  claims: {
    all: () => ['claims'] as const,
    list: (filters?: Record<string, unknown>) => ['claims', 'list', filters] as const,
    detail: (id: string) => ['claims', 'detail', id] as const,
    estimation: (id: string) => ['claims', 'estimation', id] as const,
  },
  fieldChecks: {
    all: () => ['fieldChecks'] as const,
    list: () => ['fieldChecks', 'list'] as const,
  },
  estimations: {
    all: () => ['estimations'] as const,
    list: () => ['estimations', 'list'] as const,
  },
  approvals: {
    all: () => ['approvals'] as const,
    list: () => ['approvals', 'list'] as const,
  },
  opinions: {
    all: () => ['opinions'] as const,
    list: () => ['opinions', 'list'] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
    list: () => ['notifications', 'list'] as const,
  },
};
