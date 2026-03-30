import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Request success status', example: true })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
  })
  message: string;

  @ApiProperty({ description: 'Response payload', nullable: true })
  data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
