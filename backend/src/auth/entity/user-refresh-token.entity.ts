import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { User } from '@/users/entity/user.entity';

@Entity('user_refresh_tokens')
export class UserRefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  refreshToken: string;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
