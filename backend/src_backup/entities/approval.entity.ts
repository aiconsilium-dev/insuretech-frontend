import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Claim } from './claim.entity';
import { User } from './user.entity';

export enum Decision {
  APPROVE = 'approve',
  MODIFY = 'modify',
  RECLASSIFY = 'reclassify',
  REJECT = 'reject',
}

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'uuid', name: 'approver_id' })
  approverId: string;

  @Column({ type: 'enum', enum: Decision })
  decision: Decision;

  @Column({ type: 'int', nullable: true, name: 'approved_amount' })
  approvedAmount: number | null;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()', name: 'decided_at' })
  decidedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.approvals)
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @ManyToOne(() => User, (user) => user.approvals)
  @JoinColumn({ name: 'approver_id' })
  approver: User;
}
