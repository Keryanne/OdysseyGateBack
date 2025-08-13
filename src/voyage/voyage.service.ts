import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoyageEntity } from './entities/voyage.entity';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { TransportEntity } from '../transport/entities/transport.entity';
import { LogementEntity } from '../logement/entities/logement.entity';
import { ActiviteEntity } from '../activite/entities/activite.entity';

@Injectable()
export class VoyageService {
  constructor(
    @InjectRepository(VoyageEntity)
    private readonly voyageRepository: Repository<VoyageEntity>,
  ) {}

  async createVoyage(
    dto: CreateVoyageDto,
    userId: number,
  ): Promise<VoyageEntity> {
    const depart = new Date(dto.dateDepart);
    const arrivee = new Date(dto.dateArrivee);
    if (isNaN(depart.getTime()) || isNaN(arrivee.getTime())) {
      throw new InternalServerErrorException('Invalid date format.');
    }

    const user = await this.voyageRepository.manager.findOne(UserEntity, {
      where: { id: userId },
    });
    if (!user) {
      throw new InternalServerErrorException(
        `User with id ${userId} not found.`,
      );
    }

    const voyage = this.voyageRepository.create({
      destination: dto.destination,
      dateDepart: depart,
      dateArrivee: arrivee,
      nombreVoyageurs: dto.nombreVoyageurs,
      villeDepart: dto.villeDepart,
      imageUrl: dto.imageUrl,
      user,
    });

     // --- Transports ---
  if (dto.transports?.length > 0) {
    voyage.transports = dto.transports.map((t) => {
      const transport = new TransportEntity();
      transport.type = t.type;
      transport.compagnie = t.compagnie;
      transport.dateDepart = t.dateDepart ? new Date(t.dateDepart) : undefined;
      transport.dateArrivee = t.dateArrivee ? new Date(t.dateArrivee) : undefined;
      transport.depart = t.depart;
      transport.arrivee = t.arrivee;
      return transport;
    });
  }

  // --- Logements ---
  if (dto.logements?.length > 0) {
    voyage.logements = dto.logements.map((l) => {
      const logement = new LogementEntity();
      logement.nom = l.nom;
      logement.adresse = l.adresse;
      return logement;
    });
  }

  // --- Activités ---
  if (dto.activites?.length > 0) {
    voyage.activites = dto.activites.map((a) => {
      const activite = new ActiviteEntity();
      activite.description = a.description;
      activite.lieu = a.lieu;
      return activite;
    });
  }

    return this.voyageRepository.save(voyage);
  }

  async getVoyagesByUser(userId: number): Promise<VoyageEntity[]> {
    return this.voyageRepository.find({ where: { user: { id: userId } } });
  }

  async getVoyageById(id: number): Promise<VoyageEntity> {
  const voyage = await this.voyageRepository.findOne({
    where: { id },
    relations: ['user', 'transports', 'logements', 'activites'],
  });

  if (!voyage) {
    throw new NotFoundException(`Voyage #${id} non trouvé`);
  }

  return voyage;
}

}
