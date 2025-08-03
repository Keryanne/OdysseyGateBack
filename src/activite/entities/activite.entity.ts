import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VoyageEntity } from 'src/voyage/entities/voyage.entity';

@Entity('activites')
export class ActiviteEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "Identifiant unique de l'activité" })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Visite guidée',
    description: "Description de l'activité",
  })
  description: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Louvre, Paris',
    description: "Lieu de l'activité",
    required: false,
  })
  lieu?: string;

  @ManyToOne(() => VoyageEntity, (voyage) => voyage.transports, { onDelete: 'CASCADE' })
  voyage: VoyageEntity;
}
