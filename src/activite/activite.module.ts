import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiviteEntity } from './entities/activite.entity';
import { ActiviteService } from './activite.service';
import { ActiviteController } from './activite.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActiviteEntity])],
  controllers: [ActiviteController],
  providers: [ActiviteService],
  exports: [ActiviteService],
})
export class ActiviteModule {}
