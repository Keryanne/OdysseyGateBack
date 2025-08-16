import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActiviteService } from './activite.service';
import { ActiviteEntity } from './entities/activite.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';

type MockRepository<T = any> = {
  [P in keyof Omit<Repository<T>, 'manager'>]?: jest.Mock;
} & {
  manager: {
    getRepository: jest.Mock;
  };
};

describe('ActiviteService', () => {
  let service: ActiviteService;
  let activiteRepositoryMock: MockRepository<ActiviteEntity>;
  let voyageRepoMock: any;

  beforeEach(async () => {
    voyageRepoMock = {
      findOne: jest.fn(),
    };

    activiteRepositoryMock = {
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
        ActiviteService,
        {
          provide: getRepositoryToken(ActiviteEntity),
          useValue: activiteRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ActiviteService>(ActiviteService);
  });

  it('should create an activite for an existing voyage', async () => {
    const dto: CreateActiviteDto = {
      description: 'Visite du musée',
      lieu: 'Musée du Louvre',
      voyageId: 1,
    };
    const voyage = { id: 1 };
    voyageRepoMock.findOne.mockResolvedValue(voyage);
    activiteRepositoryMock.create.mockImplementation((data) => data);
    activiteRepositoryMock.save.mockResolvedValue({ ...dto, id: 1, voyage });

    const result = await service.create(dto);

    expect(activiteRepositoryMock.manager.getRepository).toHaveBeenCalledWith('VoyageEntity');
    expect(voyageRepoMock.findOne).toHaveBeenCalledWith({ where: { id: dto.voyageId } });
    expect(activiteRepositoryMock.create).toHaveBeenCalledWith({ ...dto, voyage });
    expect(activiteRepositoryMock.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
    expect(result.description).toBe('Visite du musée');
  });

  it('should throw NotFoundException if voyage does not exist', async () => {
    const dto: CreateActiviteDto = {
      description: 'Musée',
      lieu: 'Visite du musée',
      voyageId: 99,
    };
    voyageRepoMock.findOne.mockResolvedValue(undefined);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });

  it('should return all activites', async () => {
    const activites = [{ id: 1 }, { id: 2 }];
    activiteRepositoryMock.find.mockResolvedValue(activites);

    const result = await service.findAll();

    expect(activiteRepositoryMock.find).toHaveBeenCalled();
    expect(result).toEqual(activites);
  });

  it('should return activite by id', async () => {
    const activite = { id: 1, nom: 'Musée' };
    activiteRepositoryMock.findOne.mockResolvedValue(activite);

    const result = await service.findOne(1);

    expect(activiteRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBe(activite);
  });

  it('should throw NotFoundException if activite not found', async () => {
    activiteRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update activite', async () => {
    const activite = { id: 1, description: 'Musée' };
    activiteRepositoryMock.findOne.mockResolvedValue(activite);
    activiteRepositoryMock.update.mockResolvedValue(undefined);
    activiteRepositoryMock.findOne.mockResolvedValue({ ...activite, description: 'Musée d\'Art' });

    const dto: UpdateActiviteDto = { description: 'Musée d\'Art' } as any;
    const result = await service.update(1, dto);

    expect(activiteRepositoryMock.update).toHaveBeenCalledWith(1, dto);
    expect(result.description).toBe('Musée d\'Art');
  });

  it('should remove activite', async () => {
    const activite = { id: 1, description: 'Musée' };
    activiteRepositoryMock.findOne.mockResolvedValue(activite);
    activiteRepositoryMock.delete.mockResolvedValue(undefined);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(activiteRepositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when removing activite not found', async () => {
    activiteRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should find activites by voyage id', async () => {
    const activites = [{ id: 1 }, { id: 2 }];
    activiteRepositoryMock.find.mockResolvedValue(activites);

    const result = await service.findByVoyageId(1);

    expect(activiteRepositoryMock.find).toHaveBeenCalledWith({
      where: { voyage: { id: 1 } },
      relations: ['voyage'],
    });
    expect(result).toEqual(activites);
  });
});