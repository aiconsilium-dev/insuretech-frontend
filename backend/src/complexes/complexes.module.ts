import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complex } from './entity/complex.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Complex])],
    exports: [TypeOrmModule]
})
export class ComplexesModule {}
