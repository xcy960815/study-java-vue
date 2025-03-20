export enum loginEnum {
  SUCCESS = 200,
  ERROR = 500,
  InvalidToken = 401
}

export enum RoleEnum {
  User = 'user',
  System = 'system',
  Assistant = 'assistant'
}

export const enum StoreNames {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  LOGIN = 'LOGIN'
}
