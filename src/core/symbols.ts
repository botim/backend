export interface ObjectKeyMap<T = string> {
  [key: string]: T;
}

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
  REPORTER = 'REPORTER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface UserStatusMap {
  [key: string]: Status;
}

export interface LoginSchema {
  username: string;
  password: string;
}

export interface SignedInfo {
  adminId: number;
  scope: Scopes;
}

export interface UserUpdate {
  setStatus: Status;
}
