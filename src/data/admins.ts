import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Admin } from '../models';

export const checkAccess = async (admin: Admin): Promise<Admin> => {
  const { username, password } = admin;

  const adminsRepository = getConnection().getRepository(Admin);

  const adminAccount = await adminsRepository
    .createQueryBuilder('admin')
    .addSelect('admin.password')
    .where('admin.username = :username', { username })
    .getOne();

  if (!adminAccount) {
    return null;
  }

  const comparePasswords = await bcrypt.compare(password, adminAccount.password);

  delete adminAccount.password;

  return comparePasswords ? adminAccount : null;
};
