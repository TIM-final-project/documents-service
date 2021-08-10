import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesResolver } from './types.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeEntity } from './type.entity';
import { SeverityEntity } from './severity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTypeEntity, SeverityEntity])
  ],
  providers: [TypesService, TypesResolver]
})
export class TypesModule {}
