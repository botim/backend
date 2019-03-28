import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../models';

export const checkUserAccess = async (user: User): Promise<boolean> => {
  const { username, password } = user;

  const usersRepository = getConnection().getRepository(User);
  const userAccount = await usersRepository.findOne({ username });

  if (userAccount) {
    return await bcrypt.compare(password, userAccount.password);
  }

  return false;
};
