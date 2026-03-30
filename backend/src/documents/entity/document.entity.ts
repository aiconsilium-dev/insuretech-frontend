import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from '@/claims/entity/claim.entity';

export enum DocType {
  EXEMPTION_NOTICE = 'exemption_notice',
  LITIGATION_BRIEF = 'litigation_brief',
  ADJUSTMENT_OPINION = 'adjustment_opinion',
  CIVIL_RESPONSE = 'civil_response',
}

export enum DocStatus {
  DRAFT = 'draft',
  WAIT = 'wait',
  DONE = 'done',
  TRANSFER = 'transfer',
}

@Entity('documents')
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ type: 'enum', enum: DocType })
  docType: DocType;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true })
  fileUrl: string | null;

  @Column({ type: 'enum', enum: DocStatus, nullable: true })
  status: DocStatus | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @ManyToOne(() => Claim, (claim) => claim.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
