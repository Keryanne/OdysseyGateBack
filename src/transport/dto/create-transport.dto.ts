import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';

export class CreateTransportDto {
  @ApiProperty({ example: 1, description: "Id du voyage auquel rattacher le transport" })
  @IsInt()
  voyageId: number;
  @ApiProperty({ example: 'Avion' })
  @IsOptional()
  type: string;

  @ApiProperty({ example: 'AF1234' })
  @IsOptional()
  numero: string;

  @ApiProperty({ example: 'Air France' })
  @IsOptional()
  compagnie: string;

  @ApiProperty({ example: 'Paris' })
  @IsOptional()
  depart: string;

  @ApiProperty({ example: 'New York' })
  @IsOptional()
  arrivee: string;

  @ApiProperty({ example: '2025-05-22T12:00:00Z' })
  @IsOptional()
  dateDepart: Date;

  @ApiProperty({ example: '2025-05-22T20:00:00Z' })
  @IsOptional()
  dateArrivee: Date;
}
