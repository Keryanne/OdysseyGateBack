import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PixabayService } from './pixabay.service';
import { PixabayController } from './pixabay.controller';

@Module({
  imports: [HttpModule],
  controllers: [PixabayController],
  providers: [PixabayService],
})
export class PixabayModule {}
