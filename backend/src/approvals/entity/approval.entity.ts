import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from '@/claims/entity/claim.entity';
import { User } from '@/users/entity/user.entity';

export enum Decision {
  APPROVE = 'approve',
  MODIFY = 'modify',
  RECLASSIFY = 'reclassify',
  REJECT = 'reject',
}

@Entity('approvals')
export class Approval extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ type: 'uuid' })
  approverId: string;

  @Column({ type: 'enum', enum: Decision })
  decision: Decision;

  @Column({ type: 'int', nullable: true })
  approvedAmount: number | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  decidedAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.approvals)
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn({ name: 'approver_id' })
  approver: User;
}
