import { Body, Controller, Post, Response, Route, Tags } from 'tsoa';
import * as jwt from 'jsonwebtoken';

import { checkUserAccess } from '../data';
import { LoginSchema, Scopes, SignedInfo } from '../core';
import { User } from '../models';

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
    const user = await checkUserAccess(new User(loginSchema));

    if (!user) {
      return this.setStatus(401);
    }

    const token = jwt.sign(
      {
        username: loginSchema.username,
        scope: Scopes.JWT_USER_AUTH
      } as SignedInfo,
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return { token, user };
  }
}
