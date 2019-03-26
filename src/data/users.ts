import { getConnection } from 'typeorm';

import { User } from '../models';

export const checkUserAccess = async (user: User): Promise<boolean> => {
  const { username, password } = user;

  const usersRepository = getConnection().getRepository(User);
  const userAccount = await usersRepository.findOne({
    where: {
      username,
      password
    }
  });

  /** If there is a least one match, it means the username+pasword is valid. */
  return !!userAccount;
};
