import { IsString, IsDateString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTransportDto } from 'src/transport/dto/create-transport.dto';
import { Type } from 'class-transformer';
import { CreateLogementDto } from 'src/logement/dto/create-logement.dto';
import { CreateActiviteDto } from 'src/activite/dto/create-activite.dto';

export class CreateVoyageDto {
  @ApiProperty({ example: 'Paris', description: 'Destination du voyage' })
  @IsString()
  destination: string;

  @ApiProperty({
    example: '2025-04-10',
    description: 'Date de départ (format ISO)',
  })
  @IsDateString()
  dateDepart: string;

  @ApiProperty({
    example: '2025-04-20',
    description: "Date d'arrivée (format ISO)",
  })
  @IsDateString()
  dateArrivee: string;

  @ApiProperty({ example: 2, description: 'Nombre de voyageurs' })
  @IsNumber()
  nombreVoyageurs: number;

  @ApiProperty({ example: 'Lyon', description: 'Ville de départ' })
  @IsString()
  villeDepart: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'Image de la destination (URL)',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

 @ApiPropertyOptional({
    type: [CreateTransportDto],
    description: 'Liste des transports associés au voyage',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransportDto)
  transports?: CreateTransportDto[];

  @ApiPropertyOptional({
    type: [CreateLogementDto],
    description: 'Liste des logements associés au voyage',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLogementDto)
  logements?: CreateLogementDto[];

  @ApiPropertyOptional({
    type: [CreateActiviteDto],
    description: 'Liste des activités associées au voyage',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateActiviteDto)
  activites?: CreateActiviteDto[];
}
