import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Policy } from '@/policies/entity/policy.entity';
import { Claim } from '@/claims/entity/claim.entity';

@Entity('complexes')
export class Complex extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  builder: string | null;

  @Column({ type: 'date', nullable: true })
  builtAt: Date | null;

  @Column({ type: 'smallint', default: 10 })
  warrantyYr: number;

  @OneToMany(() => Policy, (policy) => policy.complex)
  policies: Policy[];

  @OneToMany(() => Claim, (claim) => claim.complex)
  claims: Claim[];
}
