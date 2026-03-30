import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Claim } from './claim.entity';
import { EstimationItem } from './estimation-item.entity';

@Entity('estimations')
export class Estimation {
  @PrimaryColumn({ type: 'varchar', length: 20, name: 'claim_id' })
  claimId: string;

  @Column({ type: 'int', name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'int', nullable: true, name: 'calc_seconds' })
  calcSeconds: number | null;

  @Column({ type: 'int', nullable: true, name: 'vendor_estimate' })
  vendorEstimate: number | null;

  @Column({ type: 'int', default: 0 })
  depreciation: number;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true, name: 'indirect_rate' })
  indirectRate: number | null;

  @Column({ type: 'int', name: 'final_amount' })
  finalAmount: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Claim, (claim) => claim.estimation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @OneToMany(() => EstimationItem, (item) => item.estimation)
  items: EstimationItem[];
}
