import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeEntity } from './type.entity';
import { TypesController } from './types.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentTypeEntity])
  ],
  providers: [TypesService],
  controllers: [TypesController]
})
export class TypesModule {}
