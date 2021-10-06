import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypeEntity } from './type.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  findAll(): Promise<DocumentTypeEntity[]> {
    return this.documentTypeRepository.find();
  }

  findByEntity(appliesTo: number): Promise<DocumentTypeEntity[]> {
    return this.documentTypeRepository.find({
      where: {
        appliesTo
      }
    });
  }
}
