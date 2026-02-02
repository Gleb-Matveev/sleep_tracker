import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class RequireAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const session = await getSession(req, res, { sessionRequired: false });

    if (session) {
      (req as any).session = session;
      return next();
    }

    // Разделяем браузерную навигацию и API/GraphQL
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
