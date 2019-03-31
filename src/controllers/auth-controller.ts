import { Body, Controller, Post, Response, Route, Tags } from 'tsoa';
import * as jwt from 'jsonwebtoken';

import { checkAccess } from '../data';
import { LoginSchema, Scopes, SignedInfo } from '../core';
import { Admin } from '../models';

export const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '2 days';

// TODO: move this check to some other place?
if (!jwtSecret) {
  console.error('You must set the jwt secret!');

  process.exit();
}

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {
  /**
   * Login to system. returns JWT token.
   * @returns JWT token.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Post('login')
  public async login(@Body() loginSchema: LoginSchema): Promise<any> {
    const admin = await checkAccess(new Admin(loginSchema));

    if (!admin) {
      return this.setStatus(401);
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        scope: Scopes.ADMIN
      } as SignedInfo,
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return { token, admin };
  }
}
