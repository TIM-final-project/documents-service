import { States } from 'src/enums/states.enum';

export function isValidStateUpdate(prev: States, next: States): boolean {
  switch (prev) {
    case States.PENDING:
      return (
        next === States.ACCEPTED ||
        next === States.REJECTED ||
        next === States.EXPIRED
      );
    case States.EXPIRED:
      return next === States.PENDING;
    case States.ACCEPTED:
      return next === States.EXPIRED;
    case States.REJECTED:
      return next === States.PENDING;
  }
}

export const statesTranslationArray = [
  'PENDIENTE',
  'VIGENTE',
  'RECHAZADO',
  'EXPIRADO'
];
