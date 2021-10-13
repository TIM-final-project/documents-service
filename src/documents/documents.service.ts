import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { documentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { RpcException } from '@nestjs/microservices';
import { DocumentDto } from './dto/document.dto';
import { getPhoto, savePhotos } from 'src/utils/photos';
import { States } from 'src/enums/states.enum';
import { isValidStateUpdate, statesTranslationArray } from 'src/utils/documents';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  async findAll(query: documentRequestDto): Promise<DocumentDto[]> {
    const where = {
      ...query,
      active: true
    };
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

    return documentsDto;
  }

  async findOne(id: number): Promise<DocumentDto> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, { relations: ["type"] });

    const photos: Array<string> = await getPhoto(document.entityType, document.entityId, document.type.id);

    return {...document, photos };
  }

  async create(documentDto: CreateDocumentDto, type: number, photos: Array<string>): Promise<DocumentEntity> {
    const documentType: DocumentTypeEntity = await this.documentTypeRepository.findOne(type);

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
    const document: DocumentEntity = await this.documentRepository.findOne(id);
    this.documentRepository.merge(document, documentDto);

    if(!document.type){
      throw new RpcException("No se encontro el tipo de documento.");
    }

    const updatedDocument: DocumentEntity = await this.documentRepository.save(document);

    if(documentDto.photos?.length) {
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

}
