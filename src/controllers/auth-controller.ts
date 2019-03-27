import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Response,
  Route,
  Security,
  Tags,
  Header
} from 'tsoa';
import * as jwt from 'jsonwebtoken';
import * as randomstring from 'randomstring';

import { checkUserAccess } from '../data';
import { LoginSchema, Scopes, SignedInfo } from '../core';
import { User } from '../models';

export const jwtSecret = process.env.JWT_SECRET || randomstring.generate(64);
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '2 days';

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
  public async login(@Body() loginSchema: LoginSchema): Promise<string> {
    if (await checkUserAccess(new User(loginSchema))) {
      return jwt.sign(
        {
          username: loginSchema.username,
          scope: Scopes.JWT_USER_AUTH
        } as SignedInfo,
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );
    }

    /** TEMP, the TSOA not allowed to edit response code without throwing an error. */
    return '401';
  }
}
