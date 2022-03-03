import { States } from 'src/enums/states.enum';

export class UpdateDocumentState {
  id: number;
  state: States;
  comment: string;
  auditorUuid: string;
}
