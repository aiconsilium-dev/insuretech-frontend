import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Exclude } from 'class-transformer';
import { Approval } from '@/approvals/entity/approval.entity';
import { Claim } from '@/claims/entity/claim.entity';

export enum UserRole {
  ADJUSTER = 'adjuster',
  LEGAL = 'legal',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  passwordHash: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ADJUSTER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  deactivatedAt: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;

  @OneToMany(() => Claim, (claim) => claim.assignee)
  claims: Claim[];

  @OneToMany(() => Approval, (approval) => approval.approver)
  approvals: Approval[];
}
