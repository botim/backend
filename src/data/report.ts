import { getConnection, Status } from '../core';
import { UserStatus } from '../models';

import { getUserStatusOnlyMap } from './user-statuses';

export const createNewReport = async (report: UserStatus) => {
  /** If the user already reported, ignore the request. */
  const userStatusOnlyMap = await getUserStatusOnlyMap([report.userId], report.platform);

  if (report.userId in userStatusOnlyMap) {
    return;
  }

  const userStatus = new UserStatus({ ...report, status: Status.REPORTED });

  await getConnection().manager.save(userStatus);
};
