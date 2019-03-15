import { Not } from 'typeorm';

import { getConnection, Status } from '../core';
import { UserStatus } from '../models';

/**
 * Save a new report.
 * If the same report already exists, ignore the report.
 * If the user already reported,
 * but not in same post comment and reply.
 * mark report as 'DUPLICATE'.
 * @param report Report to create.
 */
export const createNewReport = async (report: UserStatus) => {
  let initialStatus: Status = Status.REPORTED;
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
    const existsExactReport = await userStatusRepository.findOne({
      where: { platform, userId, postId, commentId, replyCommentId }
    });

    /** Case exact report exists, ignore the report. */
    if (existsExactReport) {
      return;
    }

    /** Mark the report as 'DUPLICATE' */
    initialStatus = Status.DUPLICATE;
  }

  const userStatus = new UserStatus({ ...report, status: initialStatus });

  await userStatusRepository.save(userStatus);
};
