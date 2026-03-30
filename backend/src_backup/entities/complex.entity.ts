import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Policy } from './policy.entity';
import { Claim } from './claim.entity';

@Entity('complexes')
export class Complex {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  builder: string | null;

  @Column({ type: 'date', nullable: true, name: 'built_at' })
  builtAt: Date | null;

  @Column({ type: 'smallint', default: 10, name: 'warranty_yr' })
  warrantyYr: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Policy, (policy) => policy.complex)
  policies: Policy[];

  @OneToMany(() => Claim, (claim) => claim.complex)
  claims: Claim[];
}
