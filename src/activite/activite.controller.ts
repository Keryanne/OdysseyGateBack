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
import { ActiviteService } from './activite.service';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';
import { ActiviteEntity } from './entities/activite.entity';

@ApiTags('activite')
@Controller('activite')
export class ActiviteController {
  constructor(private readonly activiteService: ActiviteService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une activité' })
  @ApiResponse({ status: 201, type: ActiviteEntity })
  create(@Body() dto: CreateActiviteDto) {
    return this.activiteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les activités' })
  @ApiResponse({ status: 200, type: [ActiviteEntity] })
  findAll() {
    return this.activiteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une activité par ID' })
  @ApiResponse({ status: 200, type: ActiviteEntity })
  findOne(@Param('id') id: number) {
    return this.activiteService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une activité' })
  @ApiResponse({ status: 200, type: ActiviteEntity })
  update(@Param('id') id: number, @Body() dto: UpdateActiviteDto) {
    return this.activiteService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une activité' })
  @ApiResponse({ status: 200, type: ActiviteEntity })
  remove(@Param('id') id: number) {
    return this.activiteService.remove(+id);
  }
}
