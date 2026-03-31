import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

/**
 * Common pagination query parameters.
 * Extend this class instead of repeating page/limit in each list DTO.
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', type: Number, default: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', type: Number, default: 10, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
