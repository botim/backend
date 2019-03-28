import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../models';

export const checkUserAccess = async (user: User): Promise<User> => {
  const { username, password } = user;

  const usersRepository = getConnection().getRepository(User);
  const userAccount = await usersRepository
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.username = :username', { username })
    .getOne();

  if (!userAccount) {
    return null;
  }

  const comparePasswords = await bcrypt.compare(password, userAccount.password);

  delete userAccount.password;

  return comparePasswords ? userAccount : null;
};
