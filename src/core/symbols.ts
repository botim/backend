export enum Platform {
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM'
}

export enum Reason {
  BOT = 'BOT',
  VIOLENCE = 'VIOLENCE',
  FAKE = 'FAKE'
}

export enum Status {
  REPORTED = 'REPORTED',
  IN_PROCESS = 'IN_PROCESS',
  BOT = 'BOT',
  NOT_BOT = 'NOT_BOT',
  DUPLICATE = 'DUPLICATE'
}

export enum Scopes {
  REPORTER_AUTH = 'reporterAuth',
  JWT_USER_AUTH = 'jwtUserAuth',
  JWT_SUPER_USER_AUTH = 'jwtSuperUserAuth'
}

export interface UserStatusMap {
  [key: string]: Status;
}

export interface LoginSchema {
  username: string;
  password: string;
}

export interface SignedInfo {
  username: string;
  scope: Scopes;
}

export interface UserUpdate {
  setStatus: Status;
}
