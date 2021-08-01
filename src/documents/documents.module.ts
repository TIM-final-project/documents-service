import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity])
  ],
  providers: [DocumentsService, DocumentsResolver],
  exports: [DocumentsService]
})
export class DocumentsModule {}
