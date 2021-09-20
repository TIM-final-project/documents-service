import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentTypeEntity } from 'src/types/type.entity';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>
  ) {}

  findAll(): Promise<DocumentEntity[]> {
    return this.documentRepository.find({ relations: ["type"] });
  }

  findOne(id: number): Promise<DocumentEntity> {
    return this.documentRepository.findOne(id, { relations: ["type"] });
  }

  async create(documentDto: CreateDocumentDto, type: number): Promise<DocumentEntity> {
    const documentType: DocumentTypeEntity = await this.documentTypeRepository.findOne(type);
    const document: DocumentEntity = {
      expirationDate: documentDto.expirationDate,
      state: documentDto.state,
      type: documentType
    };
    return this.documentRepository.save(document);
  }

  async update(
    id: number,
    documentDto: UpdateDocumentDto,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity =
      await this.documentRepository.findOne(id);
    this.documentRepository.merge(document, documentDto);
    return this.documentRepository.save(document);
  }

  // findByEntity(id: number, CONTRACTOR: Entity): Promise<DocumentSchema[]> {
  //   throw new Error('Method not implemented.');
  // }
}
