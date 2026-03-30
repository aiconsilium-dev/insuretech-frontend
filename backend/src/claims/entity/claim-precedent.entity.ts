import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

@Entity('claim_precedents')
export class ClaimPrecedent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ type: 'varchar', length: 100 })
  caseNumber: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'smallint', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Claim, (claim) => claim.precedents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
