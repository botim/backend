import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import {  } from '../models/symbols';
import { expressAuthentication as localExpressAuthentication } from './authentication';
/**
 * Cert Authentication middelwhere API.
 * the auth token should be the value of 'session' cookie.
 * @param securityName Used as auth scope beacuse of poor scopes swaggger support in apiKey auth.
 */
export const expressAuthentication = async (request: express.Request, scopes: string[]) => {

    // If the routing security sent wrong security scope.
    if (!scopes || scopes.length < 1) {
        console.error('invalid or empty security scope');
    }

    try {

    } catch (error) {
        
    }
};
