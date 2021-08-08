import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentSchema {
  @Field((type) => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  expirationDate: Date;

  @Field({ nullable: true })
  state: number;
}
