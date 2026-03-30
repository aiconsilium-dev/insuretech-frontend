import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estimation } from './entity/estimation.entity';
import { EstimationItem } from './entity/estimation-item.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Estimation, EstimationItem])],
    exports: [TypeOrmModule]
})
export class EstimationsModule {}
