import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Claim } from './entity/claim.entity';
import { ClaimPhoto } from './entity/claim-photo.entity';
import { ClaimAiReason } from './entity/claim-ai-reason.entity';
import { ClaimPrecedent } from './entity/claim-precedent.entity';
import { ClaimEvent } from './entity/claim-event.entity';
import { TypeADetail } from './entity/type-a-detail.entity';
import { TypeBDetail } from './entity/type-b-detail.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Claim, ClaimPhoto, ClaimAiReason, ClaimPrecedent, ClaimEvent, TypeADetail, TypeBDetail])],
    exports: [TypeOrmModule]
})
export class ClaimsModule {}
