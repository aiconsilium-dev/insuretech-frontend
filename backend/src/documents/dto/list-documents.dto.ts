import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocType } from '../entity/document.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class ListDocumentsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by claim ID', type: String, example: 'CLM-2024-001' })
  @IsOptional()
  @IsString()
  claimId?: string;

  @ApiPropertyOptional({ description: 'Filter by document type', enum: DocType, example: DocType.EXEMPTION_NOTICE })
  @IsOptional()
  @IsEnum(DocType)
  docType?: DocType;
}
