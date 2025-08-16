import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogementService } from './logement.service';
import { LogementEntity } from './entities/logement.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

type MockRepository<T = any> = {
  [P in keyof Omit<Repository<T>, 'manager'>]?: jest.Mock;
} & {
  manager: {
    getRepository: jest.Mock;
  };
};

describe('LogementService', () => {
  let service: LogementService;
  let logementRepositoryMock: MockRepository<LogementEntity>;
  let voyageRepoMock: any;

  beforeEach(async () => {
    voyageRepoMock = {
      findOne: jest.fn(),
    };

    logementRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      manager: {
        getRepository: jest.fn().mockReturnValue(voyageRepoMock),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogementService,
        {
          provide: getRepositoryToken(LogementEntity),
          useValue: logementRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LogementService>(LogementService);
  });

  it('should create a logement for an existing voyage', async () => {
    const dto: CreateLogementDto = {
      nom: 'Hotel',
      adresse: '123 rue',
      voyageId: 1,
    };
    const voyage = { id: 1 };
    voyageRepoMock.findOne.mockResolvedValue(voyage);
    logementRepositoryMock.create.mockImplementation((data) => data);
    logementRepositoryMock.save.mockResolvedValue({ ...dto, id: 1, voyage });

    const result = await service.create(dto);

    expect(logementRepositoryMock.manager.getRepository).toHaveBeenCalledWith('VoyageEntity');
    expect(voyageRepoMock.findOne).toHaveBeenCalledWith({ where: { id: dto.voyageId } });
    expect(logementRepositoryMock.create).toHaveBeenCalledWith({ ...dto, voyage });
    expect(logementRepositoryMock.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
    expect(result.nom).toBe('Hotel');
  });

  it('should throw NotFoundException if voyage does not exist', async () => {
    const dto: CreateLogementDto = {
      nom: 'Hotel',
      adresse: '123 rue',
      voyageId: 99,
    };
    voyageRepoMock.findOne.mockResolvedValue(undefined);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should return all logements', async () => {
    const logements = [{ id: 1 }, { id: 2 }];
    logementRepositoryMock.find.mockResolvedValue(logements);

    const result = await service.findAll();

    expect(logementRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(logements);
  });

  it('should return logement by id', async () => {
    const logement = { id: 1, nom: 'Hotel' };
    logementRepositoryMock.findOne.mockResolvedValue(logement);

    const result = await service.findOne(1);

    expect(logementRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(logement);
  });

  it('should throw NotFoundException if logement not found', async () => {
    logementRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update logement', async () => {
    const logement = { id: 1, nom: 'Hotel' };
    logementRepositoryMock.findOne.mockResolvedValue(logement);
    logementRepositoryMock.update.mockResolvedValue(undefined);
    logementRepositoryMock.findOne.mockResolvedValue({ ...logement, nom: 'Updated Hotel' });

    const dto: UpdateLogementDto = { nom: 'Updated Hotel' } as any;
    const result = await service.update(1, dto);

    expect(logementRepositoryMock.update).toHaveBeenCalledWith(1, dto);
    expect(result.nom).toBe('Updated Hotel');
  });

  it('should remove logement', async () => {
    const logement = { id: 1, nom: 'Hotel' };
    logementRepositoryMock.findOne.mockResolvedValue(logement);
    logementRepositoryMock.delete.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(logementRepositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when removing logement not found', async () => {
    logementRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should find logements by voyage id', async () => {
    const logements = [{ id: 1 }, { id: 2 }];
    logementRepositoryMock.find.mockResolvedValue(logements);

    const result = await service.findByVoyageId(1);

    expect(logementRepositoryMock.find).toHaveBeenCalledWith({
      where: { voyage: { id: 1 } },
      relations: ['voyage'],
    });
    expect(result).toEqual(logements);
  });
});