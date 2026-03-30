import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Approval } from './entity/approval.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Approval])],
    exports: [TypeOrmModule]
})
export class ApprovalsModule {}
