import { authHandlers } from './auth';
import { claimsHandlers } from './claims';
import { fieldChecksHandlers } from './fieldChecks';
import { estimationsHandlers } from './estimations';
import { approvalsHandlers } from './approvals';
import { opinionsHandlers } from './opinions';

export const handlers = [
  ...authHandlers,
  ...claimsHandlers,
  ...fieldChecksHandlers,
  ...estimationsHandlers,
  ...approvalsHandlers,
  ...opinionsHandlers,
];
