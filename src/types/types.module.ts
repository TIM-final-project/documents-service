import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesResolver } from './types.resolver';

@Module({
  providers: [TypesService, TypesResolver]
})
export class TypesModule {}
