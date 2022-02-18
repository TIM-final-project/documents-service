import { DocumentTypeDto } from 'src/types/type.dto';
import { DocumentDto } from './document.dto';

export class DocumentationStateResponseDTO {
  isValid: boolean;
  isExceptuable: boolean;
  missingDocuments: DocumentTypeDto[];
  invalidDocuments: DocumentDto[];
}
