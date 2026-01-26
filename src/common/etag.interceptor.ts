import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) return data;
        if (typeof data !== 'object') return data;

        const etag = this.generateEtag(data);
        res.setHeader('ETag', etag);

        const inmRaw = req.headers['if-none-match'];
        const inm = Array.isArray(inmRaw) ? inmRaw[0] : inmRaw;
        //console.log("Inm:", inm);
        //console.log("Etag:", etag);

        if (inm === etag) {
          res.statusCode = 304;
          return null;
        }

        return data;
      }),
    );
  }

  private generateEtag(data: any): string {
    const content = JSON.stringify(data);
    return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
  }
}
