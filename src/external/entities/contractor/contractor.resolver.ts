
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DocumentSchema } from 'src/documents/document.schema';
import { DocumentsService } from 'src/documents/documents.service';
import { Entity } from 'src/enums/entity.enum';
import { ContractorSchema } from './contractor.schema';

@Resolver((of) => ContractorSchema)
export class ContractorResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @ResolveField((of) => [DocumentSchema])
  async documentByEntity(@Parent() contractor: ContractorSchema): Promise<DocumentSchema[]> {
    return await this.documentsService.findByEntity(contractor.id, Entity.CONTRACTOR);
  }
}