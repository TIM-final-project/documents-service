import { Field, ID, ObjectType } from '@nestjs/graphql';
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
}
