import { http, HttpResponse } from 'msw';

export const opinionsHandlers = [
  http.get('/opinions', () => {
    return HttpResponse.json([]);
  }),
];
