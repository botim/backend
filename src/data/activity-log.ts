import { getConnection } from 'typeorm';

import { ActivityLog } from '../models';

export const saveActivity = async (activity: Partial<ActivityLog>): Promise<void> => {
  const activitiesRepository = getConnection().getRepository(ActivityLog);
  await activitiesRepository.save(activity);
};
