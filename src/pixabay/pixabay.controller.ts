import { Controller, Get, Query } from '@nestjs/common';
import { PixabayService } from './pixabay.service';

@Controller('pixabay')
export class PixabayController {
  constructor(private readonly pixabayService: PixabayService) {}

  @Get()
  async getImages(@Query('q') query: string) {
    if (!query) return { hits: [] };
    return this.pixabayService.searchImages(query);
  }
}
