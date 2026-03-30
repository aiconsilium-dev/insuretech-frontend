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
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'enum', enum: DocType, name: 'doc_type' })
  docType: DocType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'text', nullable: true, name: 'file_url' })
  fileUrl: string | null;

  @Column({ type: 'enum', enum: DocStatus, nullable: true })
  status: DocStatus | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'reviewed_by' })
  reviewedBy: string | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'reviewed_at' })
  reviewedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Claim, (claim) => claim.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
