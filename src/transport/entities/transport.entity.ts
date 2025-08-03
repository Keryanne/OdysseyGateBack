import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { VoyageEntity } from 'src/voyage/entities/voyage.entity';

@Entity('transports')
export class TransportEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Identifiant unique du transport' })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Avion',
    description: 'Type de transport (Avion, Train, etc.)',
  })
  type: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'AF1234', description: 'Numéro de vol/train, etc.' })
  numero: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Air France', description: 'Compagnie de transport' })
  compagnie: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'Paris', description: 'Ville de départ' })
  depart: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'New York', description: "Ville d'arrivée" })
  arrivee: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2025-05-22T12:00:00Z',
    description: 'Date et heure de départ',
  })
  dateDepart: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2025-05-22T20:00:00Z',
    description: "Date et heure d'arrivée",
  })
  dateArrivee: Date;

  @ManyToOne(() => VoyageEntity, (voyage) => voyage.transports, { onDelete: 'CASCADE' })
  voyage: VoyageEntity;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
