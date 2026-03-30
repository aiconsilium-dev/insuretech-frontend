import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

export enum EventStatus {
  DONE = 'done',
  NOW = 'now',
  WAIT = 'wait',
}

@Entity('claim_events')
export class ClaimEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'timestamptz', nullable: true })
  eventAt: Date | null;

  @Column({ type: 'enum', enum: EventStatus })
  status: EventStatus;

  @Column({ type: 'smallint', nullable: true })
  stepNumber: number | null;

  @Column({ type: 'smallint', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Claim, (claim) => claim.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
