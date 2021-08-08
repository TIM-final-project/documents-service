import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { DocumentSchema } from './document.schema';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

@Resolver((of) => DocumentSchema)
export class DocumentsResolver {
  constructor(
    @Inject(DocumentsService) private documentService: DocumentsService,
  ) {}

  @Query((returns) => DocumentSchema)
  async document(@Args('id') id: number): Promise<DocumentSchema> {
    return await this.documentService.findOne(id);
  }

  @Query((returns) => [DocumentSchema])
  async allDocuments(): Promise<DocumentSchema[]> {
    return await this.documentService.findAll();
  }

  @Mutation((returns) => DocumentSchema)
  async createDocument(
    @Args() input: CreateDocumentInput,
  ): Promise<DocumentSchema> {
    const documentSchema: DocumentSchema = await this.documentService.create(
      input,
    );
    return documentSchema;
  }

  @Mutation((returns) => DocumentSchema)
  async updateDocument(
    @Args('id') id: number,
    @Args('input') input: UpdateDocumentInput,
  ): Promise<DocumentSchema> {
    const documentSchema: DocumentSchema = await this.documentService.update(
      id,
      input,
    );
    return documentSchema;
  }
}
