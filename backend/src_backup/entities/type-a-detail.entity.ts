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

@Entity('type_a_details')
export class TypeADetail {
  @PrimaryColumn({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'defect_type' })
  defectType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'warranty_remaining' })
  warrantyRemaining: string | null;

  @Column({ type: 'bigint', nullable: true, name: 'total_claim_est' })
  totalClaimEst: number | null;

  @Column({ type: 'bigint', nullable: true, name: 'unit_claim_est' })
  unitClaimEst: number | null;

  @Column({ type: 'boolean', default: true, name: 'is_exemption' })
  isExemption: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Claim, (claim) => claim.typeADetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
