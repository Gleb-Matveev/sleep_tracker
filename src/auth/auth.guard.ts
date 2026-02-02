import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  getSession,
} from 'supertokens-node/recipe/session';
import type { 
  VerifySessionOptions } from 'supertokens-node/recipe/session';
import { IS_PUBLIC_KEY } from './supertokens/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const session = await getSession(req, res, { sessionRequired: false });

    if (!session) {
      return res.redirect('/');
    }

    req.session = session;
    return true;
  }
}
