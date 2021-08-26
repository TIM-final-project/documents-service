import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { ContractorResolver } from 'src/external/entities/contractor/contractor.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity])
  ],
  providers: [DocumentsService, DocumentsResolver, ContractorResolver],
  exports: [DocumentsService]
})
export class DocumentsModule {}
