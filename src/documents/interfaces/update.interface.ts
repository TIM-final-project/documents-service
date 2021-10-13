import { States } from "src/enums/states.enum";
import { UpdateDocumentDto } from "../dto/update-document.dto";

export interface updateInterface {
  id: number;
  updateDocumentDto: UpdateDocumentDto;
}

export interface updateState {
  id: number,
  state: States
} 