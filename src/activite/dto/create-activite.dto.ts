import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActiviteDto {
  @ApiProperty({ example: 'Visite guidée', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Louvre, Paris' })
  @IsString()
  lieu: string;
  @ApiProperty({ example: 1, description: "Id du voyage auquel rattacher l'activité" })
  @IsInt()
  voyageId: number;
}
