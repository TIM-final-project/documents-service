export class CreateDocumentDto {
  expirationDate: Date;
  type: number;
  entityId: number;
  entityType: number;
  photos?: [string];
}
