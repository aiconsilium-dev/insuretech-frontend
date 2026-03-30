import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

@Entity('claim_ai_reasons')
export class ClaimAiReason extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ type: 'text' })
  reasonText: string;

  @Column({ type: 'smallint', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Claim, (claim) => claim.aiReasons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
