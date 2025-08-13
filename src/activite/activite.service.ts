import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiviteEntity } from './entities/activite.entity';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';

@Injectable()
export class ActiviteService {
  constructor(
    @InjectRepository(ActiviteEntity)
    private readonly activiteRepository: Repository<ActiviteEntity>,
  ) {}

  async create(dto: CreateActiviteDto): Promise<ActiviteEntity> {
    // Récupérer le voyage associé
    const voyageRepo = this.activiteRepository.manager.getRepository('VoyageEntity');
    const voyage = await voyageRepo.findOne({ where: { id: dto.voyageId } });
    if (!voyage) {
      throw new NotFoundException(`Voyage #${dto.voyageId} non trouvé`);
    }
    const activite = this.activiteRepository.create({
      ...dto,
      voyage,
    });
    return this.activiteRepository.save(activite);
  }

  async findAll(): Promise<ActiviteEntity[]> {
    return this.activiteRepository.find();
  }

  async findOne(id: number): Promise<ActiviteEntity> {
    const activite = await this.activiteRepository.findOne({ where: { id } });
    if (!activite) throw new NotFoundException(`Activité #${id} non trouvée`);
    return activite;
  }

  async update(id: number, dto: UpdateActiviteDto): Promise<ActiviteEntity> {
    await this.findOne(id);
    await this.activiteRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.activiteRepository.delete(id);
  }

  async findByVoyageId(voyageId: number): Promise<ActiviteEntity[]> {
    return this.activiteRepository.find({
      where: { voyage: { id: voyageId } },
      relations: ['voyage'],
    });
  }
}