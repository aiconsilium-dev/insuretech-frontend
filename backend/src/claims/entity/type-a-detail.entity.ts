import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

@Entity('type_a_details')
export class TypeADetail extends BaseEntity {
  @PrimaryColumn({ length: 20 })
  claimId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  defectType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  warrantyRemaining: string | null;

  @Column({ type: 'bigint', nullable: true })
  totalClaimEst: number | null;

  @Column({ type: 'bigint', nullable: true })
  unitClaimEst: number | null;

  @Column({ default: true })
  isExemption: boolean;

  @OneToOne(() => Claim, (claim) => claim.typeADetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
