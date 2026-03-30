import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Complex } from '@/complexes/entity/complex.entity';
import { Claim } from '@/claims/entity/claim.entity';

export enum PolicyType {
  FIRE = 'fire',
  LIABILITY = 'liability',
  HOUSING_FIRE = 'housing_fire',
}

@Entity('policies')
export class Policy extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  complexId: string;

  @Column({ type: 'enum', enum: PolicyType })
  policyType: PolicyType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  holderName: string | null;

  @Column({ type: 'date', nullable: true })
  validFrom: Date | null;

  @Column({ type: 'date', nullable: true })
  validUntil: Date | null;

  @Column({ type: 'int', default: 0 })
  deductible: number;

  @ManyToOne(() => Complex, (complex) => complex.policies)
  @JoinColumn({ name: 'complex_id' })
  complex: Complex;

  @OneToMany(() => Claim, (claim) => claim.policy)
  claims: Claim[];
}
