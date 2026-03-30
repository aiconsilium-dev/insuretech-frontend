import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Complex } from './complex.entity';
import { Claim } from './claim.entity';

export enum PolicyType {
  FIRE = 'fire',
  LIABILITY = 'liability',
  HOUSING_FIRE = 'housing_fire',
}

@Entity('policies')
export class Policy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'complex_id' })
  complexId: string;

  @Column({ type: 'enum', enum: PolicyType, name: 'policy_type' })
  policyType: PolicyType;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'holder_name' })
  holderName: string | null;

  @Column({ type: 'date', nullable: true, name: 'valid_from' })
  validFrom: Date | null;

  @Column({ type: 'date', nullable: true, name: 'valid_until' })
  validUntil: Date | null;

  @Column({ type: 'int', default: 0 })
  deductible: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Complex, (complex) => complex.policies)
  @JoinColumn({ name: 'complex_id' })
  complex: Complex;

  @OneToMany(() => Claim, (claim) => claim.policy)
  claims: Claim[];
}
