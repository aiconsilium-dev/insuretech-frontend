/**
 * Route path constants
 */

export const ROUTES = {
  HOME: '/',
  CLAIMS: '/claims',
  TYPE_A: '/type-a',
  TYPE_B: '/type-b',
  TYPE_C: '/type-c',
  FIELD: '/field',
  ESTIMATION: '/estimation',
  APPROVE: '/approve',
  OPINION: '/opinion',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
