import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogementDto {
  @ApiProperty({ example: 'Hôtel XYZ' })
  @IsString()
  @IsOptional()
  nom: string;

  @ApiProperty({ example: '12 rue de la Paix, Paris' })
  @IsString()
  @IsOptional()
  adresse: string;
  @ApiProperty({ example: 1, description: "Id du voyage auquel rattacher le logement" })
  @IsInt()
  voyageId: number;
}
