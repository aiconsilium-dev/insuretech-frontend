import { http, HttpResponse } from 'msw';

export const fieldChecksHandlers = [
  http.get('/fieldChecks', () => {
    return HttpResponse.json([]);
  }),
];
