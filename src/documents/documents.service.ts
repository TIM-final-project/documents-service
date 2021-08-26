import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity } from 'src/enums/entity.enum';
import { Repository } from 'typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentSchema } from './document.schema';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

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

  create(documentInputDTO: CreateDocumentInput): Promise<DocumentEntity> {
    return this.documentRepository.save(documentInputDTO as DocumentEntity);
  }

  async update(
    id: number,
    documentInputDTO: UpdateDocumentInput,
  ): Promise<DocumentEntity> {
    const document: DocumentEntity =
      await this.documentRepository.findOne(id);
    this.documentRepository.merge(document, documentInputDTO);
    return this.documentRepository.save(document);
  }

  findByEntity(id: number, CONTRACTOR: Entity): Promise<DocumentSchema[]> {
    throw new Error('Method not implemented.');
  }
}
