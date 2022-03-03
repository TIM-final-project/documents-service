import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { DocumentRequestDto } from './dto/documents-request.dto';
import { DocumentationStateResponseDTO } from './dto/documentation-state-response.dto';
import { DocumentationStateRequestDTO } from './dto/documentation-state-request.dto';
import { UpdateDocumentState } from './dto/update-state.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { States } from 'src/enums/states.enum';

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

    const photos: Array<string> = [];
    const mimes: Array<string> = [];

    if (!documentDto.photos.length) {
      throw new RpcException({
        message: 'Es necesario cargar una foto asociada al documento.'
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
  async update(updateDTO: {
    id: number;
    dto: UpdateDocumentDto;
  }): Promise<DocumentDto> {
    const photos: Array<string> = [];
    const mimes: Array<string> = [];
    if (updateDTO.dto.photos?.length) {
      updateDTO.dto.photos.forEach((photo) => {
        mimes.push(photo.substring(0, photo.indexOf(',')));
        photos.push(photo.substring(photo.indexOf(',') + 1));
      });
    }

    return this.documentsService.update(
      updateDTO.id,
      updateDTO.dto,
      photos,
      mimes
    );
  }

  @MessagePattern('document_change_state')
  async changeState(
    updateDocumentState: UpdateDocumentState
  ): Promise<DocumentDto> {
    this.logger.debug('Changing document state', updateDocumentState);
    if (updateDocumentState.comment?.length) {
      return this.documentsService.updateState(
        updateDocumentState.id,
        updateDocumentState.state,
        updateDocumentState.comment,
        updateDocumentState.auditorUuid
      );
    } else {
      this.logger.error(
        'Error auditing document, comment cannot be an empty string'
      );
      throw new RpcException({
        message: `Debe escribir un comentario sobre la auditoria.`
      });
    }
  }

  @MessagePattern('documents_invalid')
  async indicator({
    contractorId,
    entityType,
    states,
    missing
  }): Promise<{ invalidEntities: number[] }> {
    const entities: number[] =
      await this.documentsService.getDocumentsEntitiesIds(
        contractorId,
        entityType,
        states,
        missing
      );

    return {
      invalidEntities: entities
    };
  }

  @MessagePattern('validate_entity_documents')
  async validateEntityDocuments(
    dto: DocumentationStateRequestDTO
  ): Promise<DocumentationStateResponseDTO> {
    this.logger.debug('Validating entity documents');
    return this.documentsService.validateEntityDocuments(
      dto.entityId,
      dto.entityType,
      dto.expand
    );
  }
}
