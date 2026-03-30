import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';
import { Estimation } from './estimation.entity';

export enum StandardSource {
  STANDARD_COST = 'standard_cost',
  PRICE_INDEX = 'price_index',
}

@Entity('estimation_items')
export class EstimationItem extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  estimationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ length: 20 })
  unit: string;

  @Column({ type: 'enum', enum: StandardSource, nullable: true })
  standardSrc: StandardSource | null;

  @Column({ type: 'int' })
  subtotal: number;

  @Column({ default: true })
  isSelected: boolean;

  @Column({ type: 'smallint', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Estimation, (estimation) => estimation.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estimation_id' })
  estimation: Estimation;
}
