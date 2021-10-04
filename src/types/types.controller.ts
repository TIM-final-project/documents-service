import { Body, Controller, Get, Logger, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentTypeDto } from './type.dto';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  private readonly logger = new Logger(TypesController.name);

  constructor(private typesService: TypesService) {}

  // @Get()
  @MessagePattern('types_find_all')
  async allTypes(): Promise<DocumentTypeDto[]> {
    return this.typesService.findAll();
  }

  // @Get(':entityId')
  @MessagePattern('types_find_by_entity')
  async findByEntityType(entityType: number): Promise<DocumentTypeDto[]> {
    this.logger.debug('Finding types by entity', { entityType });
    return this.typesService.findByEntity(entityType);
  }
}
