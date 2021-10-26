import { DocumentTypeDto } from "src/types/type.dto"
import { DocumentDto } from "./document.dto";

export class ValidDocumentDTO{
    isValid: boolean;
    missingDocuments: DocumentTypeDto[];
    entityDocuments: DocumentDto[];
}