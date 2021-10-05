import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { documentRequestDto } from './dto/documents-request.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  findAll(query: documentRequestDto): Promise<DocumentEntity[]> {
    const where = query;
    return this.documentRepository.find({ 
      where,
      relations: ['type'] 
    });
  }

  findOne(id: number): Promise<DocumentEntity> {
    return this.documentRepository.findOne(id, { relations: ['type'] });
  }

  async create(
    documentDto: CreateDocumentDto,
    type: number,
  ): Promise<DocumentEntity> {
    this.logger.debug('DOCUMENTS SERVICE --- CREATING DOCUMENT ', {
      documentDto,
      type,
    });
    const documentType: DocumentTypeEntity =
      await this.documentTypeRepository.findOne(type);
    this.logger.debug('DOCUMENTS SERVICE --- TYPE: ', { documentType });
    const document: DocumentEntity = {
      ...documentDto,
      type: documentType,
    };
    return this.documentRepository.save(document);
  }

  async update(
    id: number,
    documentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity = await this.documentRepository.findOne(id);
    this.documentRepository.merge(document, documentDto);
    return this.documentRepository.save(document);
  }
}
