import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ContractorSchema } from 'src/external/entities/contractor/contractor.schema';
import { DocumentTypeSchema } from 'src/types/type.schema';

@ObjectType()
export class DocumentSchema {
  @Field((type) => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  expirationDate?: Date;

  @Field({ nullable: true })
  state?: number;

  @Field(() => DocumentTypeSchema, {nullable: true})
  type?: DocumentTypeSchema;

  // @Field((type) => ContractorSchema, { nullable: true })
  // contractor?: ContractorSchema;

  @Field((type) => Number)
  entityId?: number;
}
