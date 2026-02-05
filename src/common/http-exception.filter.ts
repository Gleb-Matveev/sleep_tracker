import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("Exception!!!!!");
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();
    let message = 'Internal server error';

    const gqlHost = GqlArgumentsHost.create(host);
    //console.log("Gql context:", !gqlHost.getContext());
    const isGraphQL = !gqlHost.getContext();
    
    if (isGraphQL) {
      //console.log("Graph");
      return {
        errors: [{
          message: exception instanceof Error ? exception.message : 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }]
      };
    }

    if (exception instanceof HttpException) {
      console.log("Http");
      status = exception.getStatus();
      message = exception.message;
    }

    //console.log("Status: ", status);
    //console.log("Message: ", message);
    //console.log("Url: ", request.url);
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
