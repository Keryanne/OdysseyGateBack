import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogementService } from './logement.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';
import { LogementEntity } from './entities/logement.entity';

@ApiTags('logement')
@Controller('logement')
export class LogementController {
  constructor(private readonly logementService: LogementService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un logement' })
  @ApiResponse({ status: 201, type: LogementEntity })
  create(@Body() dto: CreateLogementDto) {
    return this.logementService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les logements' })
  @ApiResponse({ status: 200, type: [LogementEntity] })
  findAll() {
    return this.logementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un logement par ID' })
  @ApiResponse({ status: 200, type: LogementEntity })
  findOne(@Param('id') id: number) {
    return this.logementService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un logement' })
  @ApiResponse({ status: 200, type: LogementEntity })
  update(@Param('id') id: number, @Body() dto: UpdateLogementDto) {
    return this.logementService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un logement' })
  @ApiResponse({ status: 200, type: LogementEntity })
  remove(@Param('id') id: number) {
    return this.logementService.remove(+id);
  }
}