import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './document.entity';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity])
  ],
  providers: [DocumentsService],
  exports: [DocumentsService],
  controllers: [DocumentsController]
})
export class DocumentsModule {}
