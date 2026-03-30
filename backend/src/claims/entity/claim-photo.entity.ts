import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Claim } from './claim.entity';

@Entity('claim_photos')
export class ClaimPhoto extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  claimId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  label: string | null;

  @Column({ type: 'text' })
  fileUrl: string;

  @Column({ type: 'smallint', default: 0 })
  sortOrder: number;

  @Column({ type: 'jsonb', default: [] })
  annotations: object[];

  @ManyToOne(() => Claim, (claim) => claim.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_id' })
  claim: Claim;
}
