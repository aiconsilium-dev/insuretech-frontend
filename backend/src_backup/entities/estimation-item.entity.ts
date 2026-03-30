import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Estimation } from './estimation.entity';

export enum StandardSource {
  STANDARD_COST = 'standard_cost',
  PRICE_INDEX = 'price_index',
}

@Entity('estimation_items')
export class EstimationItem {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, name: 'estimation_id' })
  estimationId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'enum', enum: StandardSource, nullable: true, name: 'standard_src' })
  standardSrc: StandardSource | null;

  @Column({ type: 'int' })
  subtotal: number;

  @Column({ type: 'boolean', default: true, name: 'is_selected' })
  isSelected: boolean;

  @Column({ type: 'smallint', default: 0, name: 'sort_order' })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Estimation, (estimation) => estimation.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'estimation_id' })
  estimation: Estimation;
}
