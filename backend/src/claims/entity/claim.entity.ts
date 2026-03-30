import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Complex } from '@/complexes/entity/complex.entity';
import { Policy } from '@/policies/entity/policy.entity';
import { User } from '@/users/entity/user.entity';
import { ClaimPhoto } from './claim-photo.entity';
import { ClaimAiReason } from './claim-ai-reason.entity';
import { ClaimPrecedent } from './claim-precedent.entity';
import { ClaimEvent } from './claim-event.entity';
import { Document } from '@/documents/entity/document.entity';
import { Approval } from '@/approvals/entity/approval.entity';
import { TypeADetail } from './type-a-detail.entity';
import { TypeBDetail } from './type-b-detail.entity';
import { Estimation } from '@/estimations/entity/estimation.entity';

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

@Index()
@Entity('claims')
export class Claim extends BaseEntity {
  @PrimaryColumn({ length: 20 })
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  complexId: string;

  @Column({ type: 'uuid', nullable: true })
  policyId: string | null;

  @Column({ type: 'uuid', nullable: true })
  assigneeId: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  claimantName: string | null;

  @Column({ type: 'text' })
  description: string;

  @Index()
  @Column({ type: 'enum', enum: ClaimType })
  type: ClaimType;

  @Index()
  @Column({ type: 'enum', enum: ClaimStatus })
  status: ClaimStatus;

  @Column({ type: 'int', nullable: true })
  amount: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true })
  aiConfidence: number | null;

  @Index()
  @Column({ type: 'timestamptz' })
  claimedAt: Date;

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
