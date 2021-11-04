export class CreateDocumentDto {
  expirationDate: Date;
  type: number;
  entityId: number;
  entityType: number;
  contractorId: number;
  photos?: [string];
}
