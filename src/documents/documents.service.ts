import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import {
  Between,
  getConnection,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { RpcException } from '@nestjs/microservices';
import { DocumentDto } from './dto/document.dto';
import {
  getPhoto,
  savePhotos,
  isBase64,
  isValidFormat,
} from 'src/utils/photosHandler';
import { States } from 'src/enums/states.enum';
import {
  isValidStateUpdate,
  statesTranslationArray,
} from 'src/utils/documents';
import { DocumentQuery } from './interfaces/document-query.interface';
import { EntityEnum } from 'src/enums/entity.enum';
import { ValidDocumentDTO } from './dto/valid-document.dto';
import { Severities } from 'src/enums/severities.enum';

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
    after,
    state,
    contractorId,
  }: DocumentRequestDto): Promise<DocumentDto[]> {
    const where: DocumentQuery = {
      active: true,
    };

    this.logger.debug('All Documents', {
      entityId,
      entityType,
      before,
      after,
      state,
      contractorId,
    });

    if (!!state) {
      where.state = state;
    }
    if (!!entityId) {
      where.entityId = entityId;
    }
    if (!!entityType) {
      where.entityType = entityType;
    }
    if (!!contractorId) {
      where.contractorId = contractorId;
    }

    if (!!before && !!after) {
      where.expirationDate = Between(
        new Date(after).toISOString(),
        new Date(before).toISOString(),
      );
    } else if (!!after) {
      where.expirationDate = MoreThanOrEqual(new Date(after).toISOString());
    } else if (!!before) {
      where.expirationDate = LessThanOrEqual(new Date(before).toISOString());
    }
    this.logger.debug({ where });
    const documents: DocumentEntity[] = await this.documentRepository.find({
      where,
      relations: ['type'],
    });

    const documentsDto: DocumentDto[] = [];

    if (documents.length) {
      this.logger.debug(documents.length + ' documents where found');
      for (const document of documents) {
        const photos = await getPhoto(
          document.entityType,
          document.entityId,
          document.type.id,
        );
        const documentDto: DocumentDto = { ...document, photos };
        documentsDto.push(documentDto);
      }
    }

    return documentsDto;
  }

  async findOne(id: number): Promise<DocumentDto> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, {
      relations: ['type'],
    });

    const photos: Array<string> = await getPhoto(
      document.entityType,
      document.entityId,
      document.type.id,
    );

    return { ...document, photos };
  }

  async create(
    documentDto: CreateDocumentDto,
    type: number,
    photos: Array<string>,
    mimes: Array<string>,
  ): Promise<DocumentEntity> {
    const documentType: DocumentTypeEntity =
      await this.documentTypeRepository.findOne(type);
    if (!!!documentType) {
      this.logger.error(
        `Error creating document, document type doesn't exist: ${type} `,
      );
      throw new RpcException({
        message: 'No se encuentra el tipo de documento ' + type,
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (!!!EntityEnum[documentDto.entityType]) {
      this.logger.error(
        `Error creating document, entity type doesn't exist: ${documentDto.entityType} `,
      );
      throw new RpcException({
        message: 'El tipo de entidad no existe ',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (documentType.appliesTo != documentDto.entityType) {
      this.logger.error(
        `Error creating document, this document type (${
          documentType.name
        }) isn't applicable to ${EntityEnum[documentDto.entityType]} type`,
      );
      throw new RpcException({
        message: 'El documento no es aplicable a la entidad ',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (photos.length && mimes.length) {
      photos.forEach((photo, index) => {
        if (!isBase64(photo) || !isValidFormat(mimes[index])) {
          this.logger.error(`Error creating document, photo format invalid`);
          throw new RpcException({
            message:
              'Las fotos asociadas al documento no poseen un formato válido',
            status: HttpStatus.BAD_REQUEST,
          });
        }
      });
    }

    const documents: DocumentEntity[] = await this.documentRepository.find({
      where: {
        entityId: documentDto.entityId,
        entityType: documentDto.entityType,
        type: documentType,
        active: true,
      },
    });

    if (documents.length) {
      //change active to false
      if (documents.length > 1) {
        this.logger.warn('Two documents of the same type were found.');
      }
      documents.forEach((doc) => {
        doc.active = false;
      });
      this.documentRepository.save(documents);
    }

    const document: DocumentEntity = {
      ...documentDto,
      type: documentType,
    };

    const documentCreated: DocumentEntity = await this.documentRepository.save(
      document,
    );

    savePhotos(
      photos,
      mimes,
      documentDto.entityType,
      documentDto.entityId,
      documentType.id,
      documentCreated.created_at,
    );

    return documentCreated;
  }

  async update(
    id: number,
    documentDto: UpdateDocumentDto,
    photos: Array<string>,
    mimes: Array<string>,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id, {
      relations: ['type'],
    });

    if (!!!document) {
      throw new RpcException({
        message: 'No se encontro el documento a modificar.',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (!!documentDto.expirationDate) {
      if (!this.isDateBeforeToday(documentDto.expirationDate)) {
        throw new RpcException({
          message: 'La fecha debe ser posterior a la fecha de hoy.',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      document.expirationDate = documentDto.expirationDate;
    }

    const updatedDocument: DocumentEntity = await this.documentRepository.save(
      document,
    );

    if (photos.length) {
      this.logger.debug(JSON.stringify(document));
      savePhotos(
        photos,
        mimes,
        document.entityType,
        document.entityId,
        document.type.id,
        updatedDocument.updated_at,
      );
    }

    return updatedDocument;
  }

  async updateState(
    id: number,
    state: States,
    comment: string,
    auditorUuid: string,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id);
    if (document) {
      if (isValidStateUpdate(document.state, state)) {
        this.documentRepository.merge(document, {
          state,
          comment,
          auditorUuid,
        });
        return this.documentRepository.save(document);
      } else {
        this.logger.error(
          `Error updating document State, invalid state update: ${document.state} to ${state}`,
        );
        throw new RpcException({
          message: `No es posible cambiar un documento del estado ${
            statesTranslationArray[document.state]
          } a ${statesTranslationArray[state]}`,
        });
      }
    } else {
      this.logger.error(
        'Error updating document State, no document with id: ',
        id,
      );
      throw new RpcException({
        message: `No exite un documento con el id: ${id}`,
      });
    }
  }

  async getDocumentsEntitiesIds(
    contractorId: number,
    entityType: number,
    states: States[],
    missing: boolean,
  ): Promise<number[]> {
    const [missingDocuments, statesDocuments] = await Promise.all([
      this.getMissing(missing, contractorId, entityType),
      this.getByState(states, contractorId, entityType),
    ]);

    console.log(missingDocuments);
    console.log(statesDocuments);

    const entitiesIds = missingDocuments
      .map((d) => d.entityId)
      .concat(statesDocuments.map((d) => d.entityId));
    return [...new Set(entitiesIds)];
  }

  private getMissing(
    missing: boolean,
    contractorId: number,
    entityType: number,
  ): Promise<any[]> {
    if (missing) {
      const subQuery: SelectQueryBuilder<DocumentTypeEntity> =
        this.documentTypeRepository
          .createQueryBuilder('dte2')
          .select('COUNT(*)')
          .where('dte2.appliesTo = de.entityType');

      return getConnection()
        .createQueryBuilder()
        .select('de.entityId', 'entityId')
        .addSelect('COUNT(*)', 'cant')
        .from(DocumentEntity, 'de')
        .where('de.contractorId = :contractorId', { contractorId })
        .andWhere('de.entityType = :entityType', { entityType })
        .andWhere('de.active = TRUE')
        .groupBy('de.entityId')
        .addGroupBy('de.entityType')
        .having('`cant` != (' + subQuery.getQuery() + ')')
        .getRawMany();
    }
    return Promise.resolve([]);
  }

  private getByState(
    states: States[],
    contractorId: number,
    entityType: number,
  ): Promise<any[]> {
    if (states.length) {
      return getConnection()
        .createQueryBuilder()
        .select('de2.entityId', 'entityId')
        .distinct(true)
        .addSelect('de2.entityType', 'entityType')
        .from(DocumentEntity, 'de2')
        .where('de2.state in (:states)', { states })
        .andWhere('de2.contractorId = :contractorId', { contractorId })
        .andWhere('de2.entityType = :entityType', { entityType })
        .andWhere('de2.active = TRUE ')
        .getRawMany();
    }
    return Promise.resolve([]);
  }

  async validateEntityDocuments(
    entityId: number,
    entityType: number,
  ): Promise<ValidDocumentDTO> {
    const types: DocumentTypeEntity[] = await this.documentTypeRepository.find({
      where: {
        appliesTo: entityType,
      },
    });

    const typesIds = types.map((t) => t.id);

    const documents: DocumentEntity[] = await this.documentRepository.find({
      where: {
        entityId,
        entityType,
      },
      relations: ['type'],
    });

    let isValid = true;
    let isExceptuable = true;
    const missingDocuments: DocumentTypeEntity[] = [];
    typesIds.forEach((tid) => {
      if (documents.findIndex((d) => d.type.id === tid) == -1) {
        missingDocuments.push(types.find((t) => t.id == tid));
      }
    });

    if (missingDocuments.length) {
      isValid = false;
      const severeMissingDocuments = missingDocuments.filter(
        (md) => md.severity === Severities.HIGH,
      );
      if (severeMissingDocuments.length) {
        isExceptuable = false;
      }
    }

    const severeDocuments = documents.filter(
      (d) => d.type.severity === Severities.HIGH && d.state !== States.ACCEPTED,
    );

    if (severeDocuments.length) {
      isValid = false;
      isExceptuable = false;
    }

    return {
      isValid,
      isExceptuable,
      missingDocuments: missingDocuments,
      invalidDocuments: severeDocuments,
    };
  }

  private isDateBeforeToday(date: Date) {
    this.logger.debug(date);
    return new Date(date) > new Date(new Date().toISOString());
  }
}
