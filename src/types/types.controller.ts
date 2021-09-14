import { Controller, Get, Param } from '@nestjs/common';
import { Entity } from 'src/enums/entity.enum';
import { DocumentTypeDto } from './type.dto';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  @Get()
  async allTypes(): Promise<DocumentTypeDto[]> {
    return this.typesService.findAll();
  }

  @Get(':entityId')
  async findByEntityId(@Param('entityId') entityId: number): Promise<DocumentTypeDto[]> {
    return this.typesService.findByEntity(entityId);
  }
}
