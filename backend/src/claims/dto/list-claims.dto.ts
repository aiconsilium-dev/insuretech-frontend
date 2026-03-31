import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ClaimStatus, ClaimType } from '../entity/claim.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class ListClaimsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by claim type', enum: ClaimType, example: ClaimType.A })
  @IsOptional()
  @IsEnum(ClaimType)
  type?: ClaimType;

  @ApiPropertyOptional({ description: 'Filter by claim status', enum: ClaimStatus, example: ClaimStatus.WAIT })
  @IsOptional()
  @IsEnum(ClaimStatus)
  status?: ClaimStatus;

  @ApiPropertyOptional({ description: 'Search by complex name, claim id, or description', type: String, example: '강남' })
  @IsOptional()
  @IsString()
  search?: string;
}
