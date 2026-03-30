import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from '@/claims/entity/claim.entity';
import { EstimationItem } from './estimation-item.entity';

@Entity('estimations')
export class Estimation extends BaseEntity {
  @PrimaryColumn({ length: 20 })
  claimId: string;

  @Column({ type: 'int' })
  totalAmount: number;

  @Column({ type: 'int', nullable: true })
  calcSeconds: number | null;

  @Column({ type: 'int', nullable: true })
  vendorEstimate: number | null;

  @Column({ type: 'int', default: 0 })
  depreciation: number;

  @Column({ type: 'decimal', precision: 4, scale: 3, nullable: true })
  indirectRate: number | null;

  @Column({ type: 'int' })
  finalAmount: number;

  @OneToOne(() => Claim, (claim) => claim.estimation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;

  @OneToMany(() => EstimationItem, (item) => item.estimation)
  items: EstimationItem[];
}
