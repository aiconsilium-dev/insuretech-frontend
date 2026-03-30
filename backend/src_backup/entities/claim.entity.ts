import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Complex } from './complex.entity';
import { Policy } from './policy.entity';
import { User } from './user.entity';
import { ClaimPhoto } from './claim-photo.entity';
import { ClaimAiReason } from './claim-ai-reason.entity';
import { ClaimPrecedent } from './claim-precedent.entity';
import { ClaimEvent } from './claim-event.entity';
import { Document } from './document.entity';
import { Approval } from './approval.entity';
import { TypeADetail } from './type-a-detail.entity';
import { TypeBDetail } from './type-b-detail.entity';
import { Estimation } from './estimation.entity';

export enum ClaimType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum ClaimStatus {
  WAIT = 'wait',
  DONE = 'done',
  SENT = 'sent',
  TRANSFER = 'transfer',
  PAID = 'paid',
}

@Index(['type'])
@Index(['status'])
@Index(['claimedAt'])
@Index(['complexId'])
@Entity('claims')
export class Claim {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'uuid', name: 'complex_id' })
  complexId: string;

  @Column({ type: 'uuid', nullable: true, name: 'policy_id' })
  policyId: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'assignee_id' })
  assigneeId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'claimant_name' })
  claimantName: string | null;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ClaimType })
  type: ClaimType;

  @Column({ type: 'enum', enum: ClaimStatus })
  status: ClaimStatus;

  @Column({ type: 'int', nullable: true })
  amount: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true, name: 'ai_confidence' })
  aiConfidence: number | null;

  @Column({ type: 'timestamptz', name: 'claimed_at' })
  claimedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Complex, (complex) => complex.claims)
  @JoinColumn({ name: 'complex_id' })
  complex: Complex;

  @ManyToOne(() => Policy, (policy) => policy.claims, { nullable: true })
  @JoinColumn({ name: 'policy_id' })
  policy: Policy | null;

  @ManyToOne(() => User, (user) => user.claims, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User | null;

  @OneToMany(() => ClaimPhoto, (photo) => photo.claim)
  photos: ClaimPhoto[];

  @OneToMany(() => ClaimAiReason, (reason) => reason.claim)
  aiReasons: ClaimAiReason[];

  @OneToMany(() => ClaimPrecedent, (precedent) => precedent.claim)
  precedents: ClaimPrecedent[];

  @OneToMany(() => ClaimEvent, (event) => event.claim)
  events: ClaimEvent[];

  @OneToMany(() => Document, (doc) => doc.claim)
  documents: Document[];

  @OneToMany(() => Approval, (approval) => approval.claim)
  approvals: Approval[];

  @OneToOne(() => TypeADetail, (detail) => detail.claim)
  typeADetail: TypeADetail | null;

  @OneToOne(() => TypeBDetail, (detail) => detail.claim)
  typeBDetail: TypeBDetail | null;

  @OneToOne(() => Estimation, (estimation) => estimation.claim)
  estimation: Estimation | null;
}
