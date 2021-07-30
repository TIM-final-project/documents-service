import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateDocumentInput {
  @Field()
  expirationDate: Date;

  @Field()
  state: String;
}
