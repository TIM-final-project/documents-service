import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config';
import { DocumentsModule } from './documents/documents.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: TypeOrmConfigService
    }),
    DocumentsModule,
    TypesModule
  ]
})
export class AppModule {}
