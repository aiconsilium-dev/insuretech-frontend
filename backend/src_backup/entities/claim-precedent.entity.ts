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

@Entity('claim_precedents')
export class ClaimPrecedent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'varchar', length: 100, name: 'case_number' })
  caseNumber: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'smallint', default: 0, name: 'sort_order' })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.precedents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
