import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user/entities/user.entity';
import { getSession } from 'supertokens-node/recipe/session';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequireAuthMiddleware implements NestMiddleware {
  constructor(
     private readonly userService: UserService
   ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let session;
    let supertoken_id;
    res.locals.isLoggedIn = false;

    const accept = String(req.headers.accept ?? '');
    const secFetchDest = String(req.headers['sec-fetch-dest'] ?? '');
    const wantsHtml = accept.includes('text/html') || secFetchDest === 'document';

    try {
      session = await getSession(req, res, { sessionRequired: false });
      if (!session) throw new UnauthorizedException('No session');

      supertoken_id = session.getUserId();
      const user = await this.userService.findBysuperTokenId(supertoken_id);
      if (!user) throw new UnauthorizedException('Authenticated but no user was found');

      res.locals.isLoggedIn = true;
      res.locals.email = user.email;
      res.locals.avatarUrl = user.avatar_url;

      req.user = {
        db_id: user.id,
        supertoken_id,
        sessionHandle: session.getHandle(),
      };
      //(req as any).session = session;
      //console.log("Middleware success");
      return next();
    } catch (e) {
      if (wantsHtml) {
        console.log("Error:", e);
        return res.redirect(302, '/');
      } else {
        return res.status(401).json({ message: e.message });
      }
    }
  }
}