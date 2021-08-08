import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DocumentTypeSchema {
  @Field((type) => ID, {nullable: true})
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true})
  appliesTo?: number;
}