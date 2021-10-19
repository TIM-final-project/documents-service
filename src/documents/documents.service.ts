import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Between, getConnection, LessThanOrEqual, MoreThanOrEqual, Repository, Transaction } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { documentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { RpcException } from '@nestjs/microservices';
import { DocumentDto } from './dto/document.dto';
import { getPhoto, savePhotos, isBase64, isValidFormat } from 'src/utils/photosHandler';
import { States } from 'src/enums/states.enum';
import { isValidStateUpdate, statesTranslationArray } from 'src/utils/documents';
import { DocumentQuery } from './interfaces/document-query.interface';
import { EntityEnum } from 'src/enums/entity.enum';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  async findAll({
    entityId,
    entityType,
    before,
    after
  }: documentRequestDto): Promise<DocumentDto[]> {
    let where: DocumentQuery = {
      active: true,
    };

    this.logger.debug('All Documents', { entityId, entityType, before, after });
    
    if (!!entityId) {
      where.entityId = entityId;
    }

    if (!!entityType) {
      where.entityType = entityType;
    }

    if (!!before && !!after) {
      where.expirationDate = Between(new Date(after).toISOString(), new Date(before).toISOString());
    } else if (!!after) {
      where.expirationDate = MoreThanOrEqual(new Date(after).toISOString());
    } else if (!!before) {
      where.expirationDate = LessThanOrEqual(new Date(before).toISOString());
    }
    this.logger.debug({ where });
    const documents: DocumentEntity[] = await this.documentRepository.find({ 
      where,
      relations: ['type'] 
    });

    let documentsDto:DocumentDto[] = [];

    if(documents.length){
      this.logger.debug(documents.length + " documents where found")
      for (const document of documents) {
        let photos = await getPhoto(document.entityType, document.entityId, document.type.id);
        let documentDto: DocumentDto = {...document, photos}
        documentsDto.push(documentDto);
      }

    }

    return documents;
  }

  async findOne(id: number): Promise<DocumentDto> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, { relations: ["type"] });

    const photos: Array<string> = await getPhoto(document.entityType, document.entityId, document.type.id);

    return {...document, photos };
  }

  async create(documentDto: CreateDocumentDto, type: number, photos: Array<string>, mimes: Array<string>): Promise<DocumentEntity> {
    const documentType: DocumentTypeEntity = await this.documentTypeRepository.findOne(type);
    if(!!!documentType){
      this.logger.error(`Error creating document, document type doesn't exist: ${type} `);
      throw new RpcException({message: "No se encuentra el tipo de documento " + type, status: HttpStatus.NOT_FOUND})
    }

    if(!!!EntityEnum[documentDto.entityType]){
      this.logger.error(`Error creating document, entity type doesn't exist: ${documentDto.entityType} `);
      throw new RpcException({message: "El tipo de entidad no existe ", status: HttpStatus.BAD_REQUEST})
    }

    if(documentType.appliesTo != documentDto.entityType){
      this.logger.error(`Error creating document, this document type (${documentType.name}) isn't applicable to ${EntityEnum[documentDto.entityType]} type`);
      throw new RpcException({message: "El documento no es aplicable a la entidad ", status: HttpStatus.BAD_REQUEST})
    }

    if(photos.length && mimes.length){
      photos.forEach((photo, index) => {
        if(!isBase64(photo) || !isValidFormat(mimes[index])){
          this.logger.error(`Error creating document, photo format invalid`);
          throw new RpcException({message: "Las fotos asociadas al documento no poseen un formato válido", status: HttpStatus.BAD_REQUEST})
        }
      });
    }

    const documents: DocumentEntity[] = await this.documentRepository.find({
      where: {
        entityId: documentDto.entityId,
        entityType: documentDto.entityType,
        type: documentType,
        active: true
      }
    })

    if(documents.length){
      //change active to false
      if(documents.length > 1){
        this.logger.warn("Two documents of the same type were found.");
      }
      documents.forEach(doc => {
        doc.active = false
      });
      this.documentRepository.save(documents);
    }

    const document: DocumentEntity = {
      ...documentDto,
      type: documentType,
    };

    const documentCreated: DocumentEntity = await this.documentRepository.save(document);

    savePhotos(photos, documentDto.entityType, documentDto.entityId, documentType.id, documentCreated.created_at);
    
    return documentCreated;
  }

  async update(
    id: number,
    documentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, { relations: ["type"] });

    if(!!!document){
      throw new RpcException({message: "No se encontro el documento a modificar.", status: HttpStatus.NOT_FOUND});
    }
    
    if(!!documentDto.expirationDate){
      if(!this.isDateBeforeToday(documentDto.expirationDate)){
        throw new RpcException({message: "La fecha debe ser posterior a la fecha de hoy.", status: HttpStatus.BAD_REQUEST});
      }

      document.expirationDate = documentDto.expirationDate;
    }

    const updatedDocument: DocumentEntity = await this.documentRepository.save(document);

    if(documentDto.photos?.length) {
      this.logger.debug(JSON.stringify(document));
      savePhotos(documentDto.photos, document.entityType, document.entityId, document.type.id, updatedDocument.updated_at);
    }

    return updatedDocument;
  }

  async updateState(
    id: number, 
    state: States
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id);
    if (document) {
      if (isValidStateUpdate(document.state, state)) {
        this.documentRepository.merge(document, { state });
        return await this.documentRepository.save(document);
      } else {
        this.logger.error(`Error updating document State, invalid state update: ${document.state} to ${state}`);
        throw new RpcException({ message: `No es posible cambiar un documento del estado ${statesTranslationArray[document.state]} a ${statesTranslationArray[state]}` });
      }
    } else {
      this.logger.error('Error updating document State, no document with id: ', id);
      throw new RpcException({ message: `No exite un documento con el id: ${id}` });
    }
  }

  private isDateBeforeToday(date: Date) {
    this.logger.debug(date);
    return new Date(date) > new Date(new Date().toISOString());
  }

}
