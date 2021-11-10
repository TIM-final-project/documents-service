import { States } from "src/enums/states.enum";
import { FindOperator } from "typeorm";

export interface DocumentQuery {
  entityId?: number | FindOperator<number>,
  entityType?: number | FindOperator<number>,
  expirationDate?: Date | FindOperator<String>,
  active?: boolean,
  state?: States,
  contractorId?: number,
}