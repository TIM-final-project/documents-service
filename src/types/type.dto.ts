import { Severities } from 'src/enums/severities.enum';

export class DocumentTypeDto {
  id?: number;
  name?: string;
  appliesTo?: number;
  severity: Severities;
}
