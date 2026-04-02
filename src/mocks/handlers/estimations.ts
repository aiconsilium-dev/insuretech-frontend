import { http, HttpResponse } from 'msw';

export const estimationsHandlers = [
  http.get('/estimations', () => {
    return HttpResponse.json([]);
  }),
];
