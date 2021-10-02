export class CreateDocumentDto {
  expirationDate: Date;
  state: number;
  type: number;
  entityId: number;
  entityType: number;
  photos?: [string];
}
