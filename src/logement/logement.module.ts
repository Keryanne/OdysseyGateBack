import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogementEntity } from './entities/logement.entity';
import { LogementService } from './logement.service';
import { LogementController } from './logement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogementEntity])],
  controllers: [LogementController],
  providers: [LogementService],
  exports: [LogementService],
})
export class LogementModule {}
