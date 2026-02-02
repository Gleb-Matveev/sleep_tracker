import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import SessionError from 'supertokens-node/lib/build/recipe/session/error';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class RequireAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let session;
    try {
      session = await getSession(req, res, { sessionRequired: false });
    } catch (e) {
      if (e instanceof SessionError) {
        session = undefined;
      } else {
        throw e;
      }
    }

    if (session) {
      (req as any).session = session;
      return next();
    }
    
    const accept = String(req.headers.accept ?? '');
    const secFetchDest = String(req.headers['sec-fetch-dest'] ?? '');
    const wantsHtml = accept.includes('text/html') || secFetchDest === 'document';

    if (wantsHtml) {
      const nextUrl = encodeURIComponent(req.originalUrl || req.url || '/');
      return res.redirect(302, `/`);
    }

    return res.status(401).json({ message: 'Unauthorised (no session)' });
  }
}
