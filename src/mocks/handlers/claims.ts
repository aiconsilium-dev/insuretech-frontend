import { http, HttpResponse } from 'msw';

export const claimsHandlers = [
  http.get('/claims', () => {
    return HttpResponse.json([]);
  }),
];
