import { DocumentTypeDto } from 'src/types/type.dto';
import { DocumentDto } from './document.dto';

export class ValidDocumentDTO {
  isValid: boolean;
  isExceptuable: boolean;
  missingDocuments: DocumentTypeDto[];
  invalidDocuments: DocumentDto[];
}
