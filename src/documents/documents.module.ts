import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentsController } from './documents.controller';
import { TypesService } from 'src/types/types.service';
import { DocumentTypeEntity } from 'src/types/type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity, DocumentTypeEntity])
  ],
  providers: [DocumentsService, TypesService],
  exports: [DocumentsService],
  controllers: [DocumentsController]
})
export class DocumentsModule {}
