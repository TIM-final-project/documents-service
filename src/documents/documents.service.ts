import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity } from 'src/enums/entity.enum';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
  ) {}

  findAll(): Promise<DocumentEntity[]> {
    return this.documentRepository.find();
  }

  findOne(id: number): Promise<DocumentEntity> {
    return this.documentRepository.findOne(id);
  }

  create(documentDto: CreateDocumentDto): Promise<DocumentEntity> {
    return this.documentRepository.save(documentDto as DocumentEntity);
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
