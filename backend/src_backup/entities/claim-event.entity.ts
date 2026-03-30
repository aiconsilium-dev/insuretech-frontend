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

export enum EventStatus {
  DONE = 'done',
  NOW = 'now',
  WAIT = 'wait',
}

@Entity('claim_events')
export class ClaimEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'event_at' })
  eventAt: Date | null;

  @Column({ type: 'enum', enum: EventStatus })
  status: EventStatus;

  @Column({ type: 'smallint', nullable: true, name: 'step_number' })
  stepNumber: number | null;

  @Column({ type: 'smallint', default: 0, name: 'sort_order' })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
