import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActiviteDto {
  @ApiProperty({ example: 'Visite guidée', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Louvre, Paris' })
  @IsString()
  lieu: string;
}
