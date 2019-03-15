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
  NOT_BOT = 'NOT_BOT'
}

export interface Bot {
  userId: string;
  description: string;
  platform: Platform;
  status: Status;
  reasons: Reason[];
  commentId?: string;
  replyCommentId?: string;
}