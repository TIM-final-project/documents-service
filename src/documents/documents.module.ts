import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';

@Module({
  providers: [DocumentsService, DocumentsResolver]
})
export class DocumentsModule {}
