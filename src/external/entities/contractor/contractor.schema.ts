
import { Directive, ObjectType, Field, ID } from '@nestjs/graphql';
import { DocumentSchema } from 'src/documents/document.schema';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class ContractorSchema {
  @Field((type) => ID)
  @Directive('@external')
  id: number;

  @Field((type) => [DocumentSchema])
  documents?: DocumentSchema[];
}
