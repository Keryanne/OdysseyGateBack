import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogementDto {
  @ApiProperty({ example: 'Hôtel XYZ' })
  @IsString()
  nom: string;

  @ApiProperty({ example: '12 rue de la Paix, Paris' })
  @IsString()
  adresse: string;
}
