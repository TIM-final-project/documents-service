import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { DocumentRequestDto } from './dto/documents-request.dto';
import { ValidDocumentDTO } from './dto/valid-document.dto';
import { updateInterface, updateState } from './interfaces/update.interface';

@Controller('documents')
export class DocumentsController {
  private logger = new Logger(DocumentsController.name);

  constructor(private documentsService: DocumentsService) {}

  // @Get()
  @MessagePattern('documents_find_all')
  async findAll(query: DocumentRequestDto): Promise<DocumentDto[]> {
    this.logger.debug('Getting All Documents', { query });
    return this.documentsService.findAll(query);
  }

  // @Get(':id')
  @MessagePattern('documents_find_by_id')
  async findOne(id: number): Promise<DocumentDto> {
    return this.documentsService.findOne(id);
  }

  // @Post()
  @MessagePattern('documents_create')
  async create(documentDto: CreateDocumentDto): Promise<DocumentDto> {
    const { type } = documentDto;
    delete documentDto.type;

    var photos: Array<string> = [];
    var mimes: Array<string> = [];

    if (!documentDto.photos.length) {
      throw new RpcException({
        message: 'Es necesario cargar una foto asociada al documento.',
      });
    }

    documentDto.photos.forEach((photo) => {
      mimes.push(photo.substring(0, photo.indexOf(',')));
      photos.push(photo.substring(photo.indexOf(',') + 1));
    });

    return this.documentsService.create(documentDto, type, photos, mimes);
  }

  // @Put(':id')
  @MessagePattern('documents_update')
  async update({
    id,
    updateDocumentDto,
  }: updateInterface): Promise<DocumentDto> {
    var photos: Array<string> = [];
    var mimes: Array<string> = [];
    if (updateDocumentDto.photos?.length) {
      updateDocumentDto.photos.forEach((photo) => {
        mimes.push(photo.substring(0, photo.indexOf(',')));
        photos.push(photo.substring(photo.indexOf(',') + 1));
      });
    }

    return this.documentsService.update(id, updateDocumentDto, photos, mimes);
  }

  @MessagePattern('document_change_state')
  async changeState({
    id,
    state,
    comment,
    auditorUuid,
  }: updateState): Promise<DocumentDto> {
    this.logger.debug('Changing document state', {
      id,
      state,
      comment,
      auditorUuid,
    });

    if(comment?.length) {
      return this.documentsService.updateState(id, state, comment, auditorUuid);
    } else {
      this.logger.error(
        'Error auditing document, comment cannot be an empty string'
      );
      throw new RpcException({
        message: `Debe escribir un comentario sobre la auditoria.`,
      });
    }
  }

  @MessagePattern('documents_invalid')
  async indicator({
    contractorId,
    entityType,
    states,
    missing
  }): Promise<{invalidEntities: number[]}> {

    const entities: number[] = await this.documentsService.getDocumentsEntitiesIds(contractorId, entityType, states, missing);
    
    return {
      invalidEntities: entities
    }
  }

  @MessagePattern('validate_entity_documents')
  async validateEntityDocuments({entityId, entityType}): Promise<ValidDocumentDTO>{
    this.logger.debug('Validating entity documents');
    return this.documentsService.validateEntityDocuments(entityId, entityType);
  } 

}
