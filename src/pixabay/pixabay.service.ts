import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PixabayService {
  constructor(private readonly http: HttpService) {}

  async searchImages(query: string) {
  try {
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query + ' travel landscape')}&category=travel&image_type=photo&orientation=horizontal&per_page=5`;
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  } catch (error) {
    console.error('Pixabay error:', error?.response?.data || error.message);
    throw new InternalServerErrorException('Erreur lors de la recherche d\'images Pixabay');
  }
}
}
