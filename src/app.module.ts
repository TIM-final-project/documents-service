import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config';
import { DocumentsModule } from './documents/documents.module';
import { ContractorSchema } from './external/entities/contractor/contractor.schema';
import { TypesModule } from './types/types.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: TypeOrmConfigService
    }),
    GraphQLFederationModule.forRoot({
      autoSchemaFile: 'schema.gql',
      buildSchemaOptions: {
        orphanedTypes: [ContractorSchema],
      }
    }),
    DocumentsModule,
    TypesModule
  ]
})
export class AppModule {}
