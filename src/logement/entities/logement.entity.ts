import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VoyageEntity } from '../../voyage/entities/voyage.entity';

@Entity('logements')
export class LogementEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Identifiant unique du logement' })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Hôtel XYZ', description: 'Nom du logement' })
  nom: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: '12 rue de la Paix, Paris',
    description: 'Adresse du logement',
    required: false,
  })
  adresse?: string;

  @ManyToOne(() => VoyageEntity, (voyage) => voyage.transports, { onDelete: 'CASCADE' })
  voyage: VoyageEntity;

}
