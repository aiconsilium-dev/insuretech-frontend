import { http, HttpResponse } from 'msw';

export const authHandlers = [
  http.get('/auth', () => {
    return HttpResponse.json([]);
  }),
];
