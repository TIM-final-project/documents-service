import { States } from "src/enums/states.enum";

export interface DocumentRequestDto {
  entityId?: number,
  entityType?: number,
  before?: Date,
  after?: Date,
  state?: States,
  contractorId?: number,
}