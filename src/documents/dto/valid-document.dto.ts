import { DocumentDto } from "dist/documents/dto/document.dto"
import { DocumentTypeDto } from "src/types/type.dto"

export class ValidDocumentDTO{
    isValid: boolean;
    missingDocuments: DocumentTypeDto[];
    entityDocuments: DocumentDto[];
}