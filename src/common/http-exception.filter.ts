import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();
    let message = 'Internal server error';

    const gqlHost = GqlArgumentsHost.create(host);
    const isGraphQL = !!gqlHost.getContext();
    
    if (isGraphQL) {
      return {
        errors: [{
          message: exception instanceof Error ? exception.message : 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }]
      };
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response
      .status(status)
      .json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
