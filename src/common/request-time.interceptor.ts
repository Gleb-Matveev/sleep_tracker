
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

export class RequestTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = performance.now();
    
    return next.handle().pipe(
      map(data => {
        const elapsed = performance.now() - start;
        console.log(`Request response time: ${elapsed}ms`);
        
        try {
          if (context.getType() === 'http') {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const response = ctx.getResponse<Response>();
            
            if (response && !response.headersSent) {
              response.setHeader('X-Elapsed-Time', `${elapsed}ms`);
            }
            
            if (!this.isApiRequest(req)) {
              return { ...data, serverResponseTime: elapsed };
            }
          } else if (context.getType<string>() === 'graphql') {
            try {
              const gqlCtx = GqlExecutionContext.create(context);
              const gqlResponse = gqlCtx.getContext()?.req?.res;
              
              if (gqlResponse && !gqlResponse.headersSent) {
                gqlResponse.setHeader('X-Elapsed-Time', `${elapsed}ms`);
              }
            } catch (graphqlError) {
              console.error('Error handling GraphQL context:', graphqlError);
            }
          }
        } catch (error) {
          console.error('Error providing reposnse time info:', error);
        }
        
        return data;
      })
    );
  }

  isApiRequest(req: any): boolean {
    const accept = String(req.headers?.accept ?? '');
    const secFetchDest = String(req.headers?.['sec-fetch-dest'] ?? '');
    const wantsHtml = accept.includes('text/html') || secFetchDest === 'document';

    if (wantsHtml) return false;

    if (accept.includes('application/json')) return true;

    return true;
  }
} 