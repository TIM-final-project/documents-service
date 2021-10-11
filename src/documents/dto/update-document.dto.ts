export class UpdateDocumentDto {
  id?: number;
  expirationDate: Date;
  state: number;
  photos: string[];
}
