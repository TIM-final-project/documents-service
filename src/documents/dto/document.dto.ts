import { DocumentTypeDto } from "src/types/type.dto";

export class DocumentDto {
  id?: number;
  expirationDate?: Date;
  state?: number;
  type?: DocumentTypeDto;
  entityId?: number;
  entityType?: number;
  photos?: string[];
  contractorId?: number;
  comment?: string;
  auditorUuid?: string;
}
