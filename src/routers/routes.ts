// @ts-ignore
/* tslint:disable */
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { BotimController } from './../controllers/botim-controller';
import { expressAuthentication } from './../security/authentication';
import * as express from 'express';
const models: TsoaRoute.Models = {
  "ConfirmedBot": {
    "properties": {
      "detectionStatus": { "dataType": "enum", "enums": ["REPORTED", "IN_PROCESS", "BOT", "NOT_BOT"], "required": true },
      "botReason": { "dataType": "enum", "enums": ["BOT", "VIOLENCE", "FAKE"], "required": true },
      "platform": { "dataType": "enum", "enums": ["TWITTER", "FACEBOOK", "INSTAGRAM"], "required": true },
    },
  },
  "Bots": {
    "additionalProperties": { "ref": "ConfirmedBot" },
  },
  "Report": {
    "properties": {
      "reporterKey": { "dataType": "string", "required": true },
      "platform": { "dataType": "enum", "enums": ["TWITTER", "FACEBOOK", "INSTAGRAM"], "required": true },
      "botReason": { "dataType": "enum", "enums": ["BOT", "VIOLENCE", "FAKE"], "required": true },
      "userId": { "dataType": "string", "required": true },
      "description": { "dataType": "string", "required": true },
    },
  },
};
const validationService = new ValidationService(models);

export function RegisterRoutes(app: express.Express) {
  app.get('/bots/confirmed',
    function(request: any, response: any, next: any) {
      const args = {
        userIds: { "in": "query", "name": "userIds", "required": true, "dataType": "array", "array": { "dataType": "string" } },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        response.status(422).send();
        return;
      }

      const controller = new BotimController();


      const promise = controller.getConfirmed.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });
  app.post('/bots/suspected',
    authenticateMiddleware([{ "reporterAuth": [] }]),
    function(request: any, response: any, next: any) {
      const args = {
        report: { "in": "body", "name": "report", "required": true, "ref": "Report" },
      };

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request);
      } catch (err) {
        response.status(422).send();
        return;
      }

      const controller = new BotimController();


      const promise = controller.reportSuspected.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    });

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) => {

      const succeed = function(user: any) {
        request['user'] = user;
        next();
      }

      const fail = async function(error: any) {
        console.warn(error);
        _response.status(401).send();
      }

      const scopes: string[] = [];
      try {
        for (const scop of security) {
          scopes.push(Object.keys(scop)[0]);
        }
      } catch (error) {
      }

      expressAuthentication(request, scopes)
        .then(succeed)
        .catch(fail)
    }
  }

  function isController(object: any): object is Controller {
    return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
  }

  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        if (isController(controllerObj)) {
          const headers = controllerObj.getHeaders();
          Object.keys(headers).forEach((name: string) => {
            response.set(name, headers[name]);
          });

          statusCode = controllerObj.getStatus();
        }

        if (data || data === false) { // === false allows boolean result
          response.status(statusCode || 200).json(data);
        } else {
          response.status(statusCode || 204).end();
        }
      })
      .catch(async (error: any) => {
        console.warn(error);
        response.status(500).send();
      });
  }

  function getValidatedArgs(args: any, request: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors);
        case 'path':
          return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors);
        case 'header':
          return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors);
        case 'body':
          return validationService.ValidateParam(args[key], request.body, name, fieldErrors, name + '.');
        case 'body-prop':
          return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.');
      }
    });
    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }
}
