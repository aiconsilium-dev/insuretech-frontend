import { http, HttpResponse } from 'msw';

export const approvalsHandlers = [
  http.get('/approvals', () => {
    return HttpResponse.json([]);
  }),
];
