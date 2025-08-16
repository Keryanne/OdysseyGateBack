import { Test, TestingModule } from '@nestjs/testing';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';

describe('TransportController', () => {
  let controller: TransportController;
  let service: TransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [
        {
          provide: TransportService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByVoyageId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransportController>(TransportController);
    service = module.get<TransportService>(TransportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateTransportDto = ({ /* mock fields */ } as any);
      const result = { id: 1 };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);
      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all transports', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transport by id', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);
      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a transport', async () => {
      const dto: UpdateTransportDto = ({ /* mock fields */ } as any);
      const result = { id: 1 };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);
      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a transport', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByVoyage', () => {
    it('should return transports by voyage id', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'findByVoyageId').mockResolvedValue(result as any);
      expect(await controller.findByVoyage(1)).toBe(result);
      expect(service.findByVoyageId).toHaveBeenCalledWith(1);
    });
  });
});
