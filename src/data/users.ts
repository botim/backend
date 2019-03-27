import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as randomstring from 'randomstring';

import { User } from '../models';

export const checkUserAccess = async (user: User): Promise<boolean> => {
  const { username, password } = user;

  const usersRepository = getConnection().getRepository(User);
  const userAccount = await usersRepository.findOne({ username });

  /** Even if the user name not exists, check hash, to hide from the attacker if the username is not valid by comparing a response time. */
  const compereResults = await bcrypt.compare(
    password,
    !!userAccount ? userAccount.password : randomstring.generate(60)
  );

  return !!userAccount && compereResults;
};
