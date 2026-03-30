import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

@Entity('type_b_details')
export class TypeBDetail extends BaseEntity {
  @PrimaryColumn({ length: 20 })
  claimId: string;

  @Column({ type: 'text', nullable: true })
  applicableClause: string | null;

  @Column({ type: 'date', nullable: true })
  objectionDeadline: Date | null;

  @Column({ type: 'smallint', default: 0 })
  currentStep: number;

  @Column({ type: 'jsonb', default: [] })
  flowSteps: object[];

  @OneToOne(() => Claim, (claim) => claim.typeBDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
