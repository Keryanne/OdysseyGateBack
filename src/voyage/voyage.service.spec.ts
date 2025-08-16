import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VoyageService } from './voyage.service';
import { VoyageEntity } from './entities/voyage.entity';
import { Repository } from 'typeorm';
import { CreateVoyageDto } from './dto/create-voyage.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

type MockRepository<T = any> = {
  [P in keyof Omit<Repository<T>, 'manager'>]?: jest.Mock;
} & {
  manager: {
    findOne: jest.Mock;
  };
};

describe('VoyageService', () => {
  let service: VoyageService;
  let voyageRepositoryMock: MockRepository<VoyageEntity>;

  beforeEach(async () => {
    voyageRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
      manager: {
        findOne: jest.fn(),
      },
      find: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoyageService,
        {
          provide: getRepositoryToken(VoyageEntity),
          useValue: voyageRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<VoyageService>(VoyageService);
  });

  it('should create a new voyage with required fields', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Paris',
      dateDepart: '2025-04-10',
      dateArrivee: '2025-04-20',
      villeDepart: 'Lyon',
      nombreVoyageurs: 1
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue({
      id: 1,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      voyages: [],
    });

    voyageRepositoryMock.create.mockImplementation((data) => data);
    voyageRepositoryMock.save.mockImplementation(async (entity) => ({
      ...entity,
      id: 1,
    }));

    const result = await service.createVoyage(dto, 1);

    expect(voyageRepositoryMock.manager.findOne).toHaveBeenCalledWith(
      expect.any(Function),
      { where: { id: 1 } },
    );

    expect(voyageRepositoryMock.create).toHaveBeenCalledWith({
      destination: 'Paris',
      dateDepart: new Date('2025-04-10T00:00:00.000Z'),
      dateArrivee: new Date('2025-04-20T00:00:00.000Z'),
      nombreVoyageurs: 1,
      villeDepart: 'Lyon',
      imageUrl: undefined,
      user: {
        id: 1,
        nom: 'Doe',
        prenom: 'John',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        voyages: [],
      },
    });

    expect(voyageRepositoryMock.save).toHaveBeenCalled();
    expect(result.id).toBe(1);
    expect(result.destination).toBe('Paris');
  });

  it('should create a new voyage with optional fields', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Paris',
      dateDepart: '2025-04-10',
      dateArrivee: '2025-04-20',
      nombreVoyageurs: 2,
      villeDepart: 'Lyon',
      imageUrl: 'https://example.com/paris.jpg',
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue({
      id: 1,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      voyages: [],
    });

    voyageRepositoryMock.create.mockImplementation((data) => data);
    voyageRepositoryMock.save.mockImplementation(async (entity) => ({
      ...entity,
      id: 2,
    }));

    const result = await service.createVoyage(dto, 1);

    expect(voyageRepositoryMock.manager.findOne).toHaveBeenCalledWith(
      expect.any(Function),
      { where: { id: 1 } },
    );

    expect(voyageRepositoryMock.create).toHaveBeenCalledWith({
      destination: 'Paris',
      dateDepart: new Date('2025-04-10T00:00:00.000Z'),
      dateArrivee: new Date('2025-04-20T00:00:00.000Z'),
      nombreVoyageurs: 2,
      villeDepart: 'Lyon',
      imageUrl: 'https://example.com/paris.jpg',
      user: {
        id: 1,
        nom: 'Doe',
        prenom: 'John',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        voyages: [],
      },
    });

    expect(voyageRepositoryMock.save).toHaveBeenCalled();
    expect(result.id).toBe(2);
    expect(result.destination).toBe('Paris');
    expect(result.imageUrl).toBe('https://example.com/paris.jpg');
    expect(result.villeDepart).toBe('Lyon');
  });

  it('should throw if dateDepart or dateArrivee is invalid', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Paris',
      dateDepart: 'invalid-date',
      dateArrivee: '2025-04-20',
      nombreVoyageurs: 2,
      villeDepart: 'Lyon',
    };

    await expect(service.createVoyage(dto, 1)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if user not found', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Paris',
      dateDepart: '2025-04-10',
      dateArrivee: '2025-04-20',
      nombreVoyageurs: 2,
      villeDepart: 'Lyon',
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue(undefined);

    await expect(service.createVoyage(dto, 1)).rejects.toThrow(InternalServerErrorException);
  });

  it('should retrieve voyages for a given user id', async () => {
    const voyages: VoyageEntity[] = [
      {
        id: 1,
        destination: 'Paris',
        dateDepart: new Date('2025-04-10'),
        dateArrivee: new Date('2025-04-20'),
        nombreVoyageurs: 2,
        villeDepart: 'Lyon',
        imageUrl: undefined,
        user: {
          id: 1,
          nom: 'Doe',
          prenom: 'John',
          email: 'john.doe@example.com',
          password: 'hashedPassword',
          voyages: [],
        },
        transports: undefined,
        logements: undefined,
        activites: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        destination: 'Rome',
        dateDepart: new Date('2025-05-01'),
        dateArrivee: new Date('2025-05-10'),
        nombreVoyageurs: 2,
        villeDepart: 'Lyon',
        imageUrl: 'https://example.com/rome.jpg',
        user: {
          id: 1,
          nom: 'Doe',
          prenom: 'John',
          email: 'john.doe@example.com',
          password: 'hashedPassword',
          voyages: [],
        },
        transports: undefined,
        logements: undefined,
        activites: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    voyageRepositoryMock.find.mockResolvedValue(voyages);

    const result = await service.getVoyagesByUser(1);

    expect(voyageRepositoryMock.find).toHaveBeenCalledWith({
      where: { user: { id: 1 } },
    });
    expect(result).toEqual(voyages);
  });

  it('should return empty array if user has no voyages', async () => {
    voyageRepositoryMock.find.mockResolvedValue([]);
    const result = await service.getVoyagesByUser(99);
    expect(result).toEqual([]);
  });

  it('should delete a voyage by id', async () => {
    voyageRepositoryMock.delete.mockResolvedValue({ affected: 1 });
    await expect(service.removeVoyage(1)).resolves.toBeUndefined();
    expect(voyageRepositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it('should throw InternalServerErrorException if voyage not deleted', async () => {
    voyageRepositoryMock.delete.mockResolvedValue({ affected: 0 });
    await expect(service.removeVoyage(123)).rejects.toThrow(InternalServerErrorException);
  });

  it('should get voyage by id', async () => {
    const voyage = {
      id: 1,
      destination: 'Paris',
      user: { id: 1 },
      transports: [],
      logements: [],
      activites: [],
    };
    voyageRepositoryMock.findOne.mockResolvedValue(voyage);

    const result = await service.getVoyageById(1);

    expect(voyageRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['user', 'transports', 'logements', 'activites'],
    });
    expect(result).toBe(voyage);
  });

  it('should throw NotFoundException if voyage not found by id', async () => {
    voyageRepositoryMock.findOne.mockResolvedValue(undefined);

    await expect(service.getVoyageById(1)).rejects.toThrow(NotFoundException);
  });

  it('should throw error for unimplemented remove method', () => {
    expect(() => service.remove(1)).toThrow('Method not implemented.');
  });

  it('should create a voyage with transports, logements and activites', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Tokyo',
      dateDepart: '2025-08-01',
      dateArrivee: '2025-08-10',
      nombreVoyageurs: 3,
      villeDepart: 'Paris',
      transports: [
        {
          type: 'Avion', compagnie: 'Air France', dateDepart: new Date('2025-08-01'), dateArrivee: new Date('2025-08-01'), depart: 'CDG', arrivee: 'HND',
          voyageId: 0,
          numero: ''
        }
      ],
      logements: [
        { nom: 'Hotel Tokyo', adresse: 'Shinjuku', voyageId: 0 }
      ],
      activites: [
        { description: 'Visite du temple', lieu: 'Asakusa', voyageId: 0 }
      ]
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue({
      id: 2,
      nom: 'Jane',
      prenom: 'Doe',
      email: 'jane.doe@example.com',
      password: 'hashedPassword',
      voyages: [],
    });

    voyageRepositoryMock.create.mockImplementation((data) => data);
    voyageRepositoryMock.save.mockImplementation(async (entity) => ({
      ...entity,
      id: 3,
    }));

    const result = await service.createVoyage(dto, 2);

    expect(voyageRepositoryMock.create).toHaveBeenCalledWith({
      destination: 'Tokyo',
      dateDepart: new Date('2025-08-01'),
      dateArrivee: new Date('2025-08-10'),
      nombreVoyageurs: 3,
      villeDepart: 'Paris',
      transports: [
        expect.objectContaining({ type: 'Avion', compagnie: 'Air France' })
      ],
      logements: [
        expect.objectContaining({ nom: 'Hotel Tokyo', adresse: 'Shinjuku' })
      ],
      activites: [
        expect.objectContaining({ description: 'Visite du temple', lieu: 'Asakusa' })
      ],
      user: expect.any(Object),
    });
    expect(result.id).toBe(3);
    expect(result.destination).toBe('Tokyo');
  });

  it('should create a voyage with missing optional fields', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Berlin',
      dateDepart: '2025-09-01',
      dateArrivee: '2025-09-10',
      nombreVoyageurs: 1,
      villeDepart: 'Paris',
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue({ id: 3 });
    voyageRepositoryMock.create.mockImplementation((data) => data);
    voyageRepositoryMock.save.mockResolvedValue({ ...dto, id: 4 });

    const result = await service.createVoyage(dto, 3);
    expect(result.id).toBe(4);
    expect(result.imageUrl).toBeUndefined();
    expect(result.transports).toBeUndefined();
    expect(result.logements).toBeUndefined();
    expect(result.activites).toBeUndefined();
  });

  it('should handle dateDepart and dateArrivee as Date objects', async () => {
    const dto: CreateVoyageDto = {
      destination: 'Madrid',
      dateDepart: new Date('2025-10-01') as any,
      dateArrivee: new Date('2025-10-10') as any,
      nombreVoyageurs: 2,
      villeDepart: 'Paris',
    };

    voyageRepositoryMock.manager.findOne.mockResolvedValue({ id: 5 });
    voyageRepositoryMock.create.mockImplementation((data) => data);
    voyageRepositoryMock.save.mockResolvedValue({ ...dto, id: 6 });

    const result = await service.createVoyage(dto, 5);
    expect(result.id).toBe(6);
    expect(result.dateDepart).toEqual(new Date('2025-10-01'));
    expect(result.dateArrivee).toEqual(new Date('2025-10-10'));
  });

  it('should throw InternalServerErrorException if repository.delete throws', async () => {
    voyageRepositoryMock.delete.mockRejectedValue(new Error('DB error'));
    await expect(service.removeVoyage(1)).rejects.toThrow(InternalServerErrorException);
  });
});
