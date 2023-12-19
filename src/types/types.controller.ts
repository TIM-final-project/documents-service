import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeleteResult } from 'typeorm';
import { DocumentTypeDto } from './type.dto';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
  private readonly logger = new Logger(TypesController.name);

  constructor(private typesService: TypesService) {}

  @MessagePattern('types_find_all')
  async allTypes(): Promise<DocumentTypeDto[]> {
    return this.typesService.findAll();
  }

  @MessagePattern('types_find_by_entity')
  async findByEntityType(entityType: number): Promise<DocumentTypeDto[]> {
    this.logger.debug('Finding types by entity', { entityType });
    return this.typesService.findByEntity(entityType);
  }

  @MessagePattern('types_create')
  async createType(typeDTO: DocumentTypeDto): Promise<DocumentTypeDto> {
    this.logger.debug('Creating Document', typeDTO);
    return this.typesService.create(typeDTO);
  }

  @MessagePattern('types_update')
  async updateType(typeDTO: DocumentTypeDto): Promise<DocumentTypeDto> {
    this.logger.debug('Updating Document', typeDTO);
    return this.typesService.update(typeDTO);
  }

  @MessagePattern('types_delete')
  async deleteType(id: number): Promise<DeleteResult> {
    this.logger.debug('Deleting Document', { id });
    return this.typesService.delete(id);
  }
}
