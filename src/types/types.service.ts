import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { DocumentTypeDto } from './type.dto';
import { DocumentTypeEntity } from './type.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>
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

  async create(typeDTO: DocumentTypeDto): Promise<DocumentTypeEntity> {
    return this.documentTypeRepository.save(typeDTO);
  }

  async update({ id, ...args }: DocumentTypeDto): Promise<DocumentTypeEntity> {
    try {
      const type = await this.documentTypeRepository.findOne(id);
      this.documentTypeRepository.merge(type, { ...args });
      return this.documentTypeRepository.save(type);
    } catch (error) {
      throw new RpcException({
        message: 'El tipo de documento que desea modificar no existe',
        status: HttpStatus.BAD_REQUEST
      });
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.documentTypeRepository.delete(id);
  }
}
