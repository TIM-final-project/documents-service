import { Body, Controller, Get, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentTypeDto } from './type.dto';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}

  // @Get()
  @MessagePattern('types_find_all')
  async allTypes(): Promise<DocumentTypeDto[]> {
    return this.typesService.findAll();
  }

  // @Get(':entityId')
  @MessagePattern('types_find_by_entity')
  async findByEntityType(@Body('entityType') entityType: number): Promise<DocumentTypeDto[]> {
    return this.typesService.findByEntity(entityType);
  }
}
