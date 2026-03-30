import { ApiProperty } from '@nestjs/swagger';

interface IPageMetaDtoParameters {
  itemCount: number;
  pageOptionsDto: any; // Using any to avoid circular dependency issues with PageOptionsDto
}

export class PageMetaDto {
  @ApiProperty({ description: 'Current page number' })
  readonly page: number;

  @ApiProperty({ description: 'Number of items per page' })
  readonly limit: number;

  @ApiProperty({ description: 'Total number of items' })
  readonly totalCount: number;

  @ApiProperty({ description: 'Total number of pages' })
  readonly totalPages: number;

  constructor({ itemCount, pageOptionsDto }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.totalCount = itemCount;
    this.totalPages = Math.ceil(this.totalCount / this.limit);
  }
}
