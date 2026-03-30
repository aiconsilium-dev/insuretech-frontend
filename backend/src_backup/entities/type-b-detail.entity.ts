import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Claim } from './claim.entity';

@Entity('type_b_details')
export class TypeBDetail {
  @PrimaryColumn({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'text', nullable: true, name: 'applicable_clause' })
  applicableClause: string | null;

  @Column({ type: 'date', nullable: true, name: 'objection_deadline' })
  objectionDeadline: Date | null;

  @Column({ type: 'smallint', default: 0, name: 'current_step' })
  currentStep: number;

  @Column({ type: 'jsonb', default: [], name: 'flow_steps' })
  flowSteps: object[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Claim, (claim) => claim.typeBDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
