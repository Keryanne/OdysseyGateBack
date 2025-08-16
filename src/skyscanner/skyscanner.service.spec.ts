import { SkyscannerService } from './skyscanner.service';
import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('SkyscannerService', () => {
  let service: SkyscannerService;
  let httpService: HttpService;

  beforeEach(() => {
    httpService = {
      get: jest.fn(),
    } as any;
    service = new SkyscannerService(httpService);
    process.env.SKYSCANNER_API_KEY = 'test-key';
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete process.env.SKYSCANNER_API_KEY;
  });

  it('should throw if API key is missing', async () => {
    delete process.env.SKYSCANNER_API_KEY;
    await expect(
      service.searchFlights({ from: 'CDG', to: 'JFK', date: '2025-07-12' }),
    ).rejects.toThrow(HttpException);
  });

  it('should call httpService.get with correct params and return data', async () => {
    const mockData = { flights: [] };
    (httpService.get as jest.Mock).mockReturnValue(
      of({ data: mockData }),
    );

    const result = await service.searchFlights({
      from: 'CDG',
      to: 'JFK',
      date: '2025-07-12',
    });

    expect(httpService.get).toHaveBeenCalledWith(
      'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create',
      {
        params: {
          origin: 'CDG',
          destination: 'JFK',
          date: '2025-07-12',
          apiKey: 'test-key',
        },
      },
    );
    expect(result).toBe(mockData);
  });

  it('should throw HttpException on API error', async () => {
    const error = {
      message: 'API error',
      response: { status: 404 },
    };
    (httpService.get as jest.Mock).mockReturnValue(throwError(() => error));

    await expect(
      service.searchFlights({ from: 'CDG', to: 'JFK', date: '2025-07-12' }),
    ).rejects.toThrow(HttpException);
  });
});