import { Inject } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { DocumentTypeSchema } from './type.schema';
import { TypesService } from './types.service';

@Resolver(of => DocumentTypeSchema)
export class TypesResolver {
  constructor(
    @Inject(TypesService)
    private typesService: TypesService
  ) {}

  @Query((returns) => [DocumentTypeSchema])
  async allTypes(): Promise<DocumentTypeSchema[]> {
    return await this.typesService.findAll();
  }

  @Query((returns) => [DocumentTypeSchema])
  async typeByEntity(@Args('entityType') entityType: number): Promise<DocumentTypeSchema[]> {
    return await this.typesService.findByEntity(entityType);
  }
}
