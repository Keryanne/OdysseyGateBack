import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogementEntity } from './entities/logement.entity';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Injectable()
export class LogementService {
  constructor(
    @InjectRepository(LogementEntity)
    private readonly logementRepository: Repository<LogementEntity>,
  ) {}

  async create(dto: CreateLogementDto): Promise<LogementEntity> {
    const logement = this.logementRepository.create(dto);
    return this.logementRepository.save(logement);
  }

  async findAll(): Promise<LogementEntity[]> {
    return this.logementRepository.find();
  }

  async findOne(id: number): Promise<LogementEntity> {
    const logement = await this.logementRepository.findOne({ where: { id } });
    if (!logement) throw new NotFoundException(`Logement #${id} non trouvé`);
    return logement;
  }

  async update(id: number, dto: UpdateLogementDto): Promise<LogementEntity> {
    await this.findOne(id);
    await this.logementRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.logementRepository.delete(id);
  }
}
