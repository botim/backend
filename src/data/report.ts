import { getConnection } from 'typeorm';

import { Status } from '../core';
import { UserStatus, ActivityLog } from '../models';
import { saveActivity } from './activity-log';

/**
 * Save a new report.
 * If the same report already exists, ignore the report.
 * If the user already reported,
 * but not in same post comment and reply.
 * mark report as 'DUPLICATE'.
 * @param report Report to create.
 */
export const createNewReport = async (report: UserStatus, reporterKey: string) => {
  let status: Status = Status.REPORTED;
  const { platform, userId, postId, commentId, replyCommentId } = report;

  const userStatusRepository = getConnection().getRepository(UserStatus);

  /** Try get the user exists report */
  const userReport = await userStatusRepository.findOne({
    where: {
      platform,
      userId
    }
  });

  /** If the user reported, try to get if exact report exist */
  if (userReport) {
    /** Note that typeORM null is equal to 'null' and not to 'undefined'. */
    const existsExactReport = await userStatusRepository.findOne({
      where: {
        platform,
        userId,
        postId,
        commentId: commentId || null,
        replyCommentId: replyCommentId || null
      }
    });

    /** Case exact report exists, ignore the report. */
    if (existsExactReport) {
      return;
    }

    /** Mark the report as 'DUPLICATE' */
    status = Status.DUPLICATE;
  }

  const userStatus = new UserStatus({ ...report, status, reporterKey });

  await userStatusRepository.save(userStatus);

  await saveActivity({
    userStatusId: userStatus.id,
    newStatus: status
  });
};
