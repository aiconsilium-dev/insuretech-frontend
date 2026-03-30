import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    default: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Disable pagination and return all records',
    default: false,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly pagination?: boolean = true;
}
